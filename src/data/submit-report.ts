import { supabase } from "@/integrations/supabase/client";
import { buildDescription, type ReportInput } from "./report";

const BUCKET = "item-photos";

/** Saves a report as the signed-in user, uploading the photo into their own folder first. Returns the new item id. */
export async function submitReport(input: ReportInput, photo: File | null): Promise<string> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData.user;
  if (userError || !user) throw new Error("Please log in to submit a report.");

  let imageUrl: string | null = null;
  let uploadedPath: string | null = null;
  if (photo) {
    const ext = (photo.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, photo, { contentType: photo.type, upsert: false });
    if (uploadError) {
      console.error("[report] photo upload failed", uploadError.message);
      throw new Error("Your photo couldn't be uploaded. Try a smaller image, or submit without a photo.");
    }
    uploadedPath = path;
    imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase
    .from("items")
    .insert({
      user_id: user.id,
      item_name: input.title.trim(),
      category: input.category,
      item_type: input.type,
      description: buildDescription(input),
      campus_location: input.location,
      item_date: input.date,
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[report] save failed", error?.message);
    if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
    throw new Error("We couldn't save your report. Please check your connection and try again.");
  }
  return data.id;
}
