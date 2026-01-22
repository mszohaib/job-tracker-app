import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vftdsgetfxvvguczkjag.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdGRzZ2V0Znh2dmd1Y3pramFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzUyODMsImV4cCI6MjA4MDcxMTI4M30.CpCRo_t7C7c8VNtxyElcBp0e0BqRgQwM5WoCGmWnM24";
export const supabase = createClient(supabaseUrl, supabaseKey);
