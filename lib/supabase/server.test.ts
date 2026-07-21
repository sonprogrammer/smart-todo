import { ApiError } from "@/lib/errors";
import { createSupabaseServerClient } from "./server";

describe("supabase server client boundary", () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  });

  it("fails with a configuration error when Supabase env vars are missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(() => createSupabaseServerClient()).toThrow(ApiError);
    expect(() => createSupabaseServerClient()).toThrow("Supabase server environment variables are required.");
  });
});
