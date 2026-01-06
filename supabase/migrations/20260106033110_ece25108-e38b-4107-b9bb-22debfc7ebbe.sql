-- Create reading_history table to track what users have read
CREATE TABLE public.reading_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  article_title TEXT NOT NULL,
  article_source TEXT,
  article_category TEXT,
  article_image_url TEXT,
  read_time_minutes INTEGER DEFAULT 0,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own reading history
CREATE POLICY "Users can view their own reading history"
ON public.reading_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own reading history
CREATE POLICY "Users can insert their own reading history"
ON public.reading_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reading history
CREATE POLICY "Users can delete their own reading history"
ON public.reading_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_reading_history_user_id ON public.reading_history(user_id);
CREATE INDEX idx_reading_history_read_at ON public.reading_history(read_at DESC);