import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const noopResult = { data: null, error: { message: "Supabase not configured" } };

function createChainableStub(): any {
  const handler: ProxyHandler<object> = {
    get(_, prop) {
      if (prop === "then") return undefined;
      return (..._args: any[]) => {
        console.warn(`Supabase not configured — missing env vars.`);
        return new Proxy(Promise.resolve(noopResult), handler);
      };
    },
  };
  return new Proxy({} as any, handler);
}

export const supabase: SupabaseClient = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : createChainableStub();
