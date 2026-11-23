DROP POLICY "Anyone can view active items" ON public.items;
DROP POLICY "Owners can view their own items" ON public.items;

CREATE POLICY "Anyone can view active items"
  ON public.items FOR SELECT TO anon
  USING (status = 'active');

CREATE POLICY "Signed-in users view active items and their own"
  ON public.items FOR SELECT TO authenticated
  USING (status = 'active' OR (select auth.uid()) = user_id);