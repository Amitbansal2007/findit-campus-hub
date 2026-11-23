CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  item_name text NOT NULL CHECK (char_length(btrim(item_name)) BETWEEN 2 AND 120),
  category text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 50),
  item_type text NOT NULL CHECK (item_type IN ('lost', 'found')),
  description text NOT NULL CHECK (char_length(btrim(description)) BETWEEN 10 AND 2000),
  campus_location text NOT NULL CHECK (char_length(campus_location) BETWEEN 1 AND 120),
  item_date date NOT NULL,
  image_url text CHECK (image_url IS NULL OR char_length(image_url) <= 1000),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'returned')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX items_status_created_idx ON public.items (status, created_at DESC);
CREATE INDEX items_user_id_idx ON public.items (user_id);

GRANT SELECT ON public.items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.items TO authenticated;
GRANT ALL ON public.items TO service_role;

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active items"
  ON public.items FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Owners can view their own items"
  ON public.items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own items"
  ON public.items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their own items"
  ON public.items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete their own items"
  ON public.items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage rules for the item-photos bucket: owners manage files inside a folder named after their user id.
CREATE POLICY "Users can upload item photos to their own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view their own item photo files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own item photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own item photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);