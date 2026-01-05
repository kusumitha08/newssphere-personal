-- Drop and recreate the handle_new_user function with proper JSON array handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  interests_array text[];
BEGIN
  -- Safely convert JSON array to PostgreSQL text array
  IF new.raw_user_meta_data ? 'interests' AND new.raw_user_meta_data->>'interests' IS NOT NULL THEN
    SELECT array_agg(elem)
    INTO interests_array
    FROM jsonb_array_elements_text(new.raw_user_meta_data->'interests') AS elem;
  ELSE
    interests_array := ARRAY[]::text[];
  END IF;

  INSERT INTO public.profiles (id, email, interests)
  VALUES (new.id, new.email, COALESCE(interests_array, ARRAY[]::text[]));
  
  RETURN new;
END;
$$;