import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const PROPERTY_IMAGES_BUCKET = "property-images";
const PUBLIC_STORAGE_PATH_SEGMENT = `/storage/v1/object/public/${PROPERTY_IMAGES_BUCKET}/`;
const DELETE_CHUNK_SIZE = 100;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const toStoragePath = (publicUrl: string) => {
  const decodedUrl = decodeURIComponent(publicUrl);
  const pathIndex = decodedUrl.indexOf(PUBLIC_STORAGE_PATH_SEGMENT);

  if (pathIndex === -1) {
    return null;
  }

  return decodedUrl.slice(pathIndex + PUBLIC_STORAGE_PATH_SEGMENT.length);
};

const chunk = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: "Supabase environment variables are not configured." });
  }

  const authorization = request.headers.get("Authorization");
  if (!authorization) {
    return json(401, { error: "Missing authorization header." });
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return json(401, { error: "Unauthorized" });
  }

  const { data: properties, error: propertiesError } = await adminClient
    .from("properties")
    .select("id")
    .eq("user_id", user.id);

  if (propertiesError) {
    console.error("delete-account: failed to load properties", propertiesError);
    return json(500, { error: "Failed to load account data." });
  }

  const propertyIds = properties?.map((property) => property.id) ?? [];
  let storagePaths: string[] = [];

  if (propertyIds.length > 0) {
    const { data: propertyImages, error: propertyImagesError } = await adminClient
      .from("property_images")
      .select("image_url")
      .in("property_id", propertyIds);

    if (propertyImagesError) {
      console.error("delete-account: failed to load property images", propertyImagesError);
      return json(500, { error: "Failed to load account media." });
    }

    storagePaths = Array.from(
      new Set(
        (propertyImages ?? [])
          .map((item) => toStoragePath(item.image_url))
          .filter((value): value is string => Boolean(value)),
      ),
    );
  }

  const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id, false);

  if (deleteUserError) {
    console.error("delete-account: failed to delete auth user", deleteUserError);
    return json(500, { error: "Failed to delete account." });
  }

  const { error: favoritesError } = await adminClient.from("favorites").delete().eq("user_id", user.id);
  if (favoritesError && favoritesError.code !== "42P01") {
    console.error("delete-account: failed to clean favorites", favoritesError);
  }

  for (const storageChunk of chunk(storagePaths, DELETE_CHUNK_SIZE)) {
    const { error: removeStorageError } = await adminClient.storage.from(PROPERTY_IMAGES_BUCKET).remove(storageChunk);

    if (removeStorageError) {
      console.error("delete-account: failed to remove storage objects", removeStorageError);
    }
  }

  return json(200, { success: true });
});
