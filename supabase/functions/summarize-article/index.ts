import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, summary, generateAudio } = await req.json();
    
    console.log("Summarizing article:", title);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate AI summary
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a news summarizer. Create a concise, engaging audio-friendly summary of the article in 2-3 sentences. Make it conversational and easy to listen to. Start directly with the summary, no preamble." 
          },
          { 
            role: "user", 
            content: `Title: ${title}\n\nSummary: ${summary}\n\nContent: ${content || 'No additional content available.'}` 
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your account." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("Failed to generate summary");
    }

    const aiData = await aiResponse.json();
    const audioSummary = aiData.choices?.[0]?.message?.content || summary;
    
    console.log("Generated summary:", audioSummary);

    let audioBase64 = null;
    
    if (generateAudio) {
      const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
      if (!ELEVENLABS_API_KEY) {
        console.warn("ELEVENLABS_API_KEY not configured, skipping audio generation");
      } else {
        console.log("Generating audio with ElevenLabs...");
        
        // Use Aria voice (9BWtsMINqrJLrRacOk9x) - natural and friendly
        const ttsResponse = await fetch(
          "https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x",
          {
            method: "POST",
            headers: {
              "Accept": "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text: audioSummary,
              model_id: "eleven_turbo_v2_5",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!ttsResponse.ok) {
          const errorText = await ttsResponse.text();
          console.error("ElevenLabs error:", ttsResponse.status, errorText);
        } else {
          const audioBuffer = await ttsResponse.arrayBuffer();
          audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
          console.log("Audio generated successfully");
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        summary: audioSummary,
        audioBase64,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in summarize-article function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
