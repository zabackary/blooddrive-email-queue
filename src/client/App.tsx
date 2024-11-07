import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Admin from "./pages/Admin";
import UserEditor from "./pages/Display";
import Home from "./pages/Home";
import { M3ThemeProvider, M3TokensProvider } from "./theme";

type PageName = "home" | "display" | "admin";

export interface AppConfig {
  name: string;
  id: number;
  description: string;
}

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [supabaseClient] = useState(() => {
    const client = createClient(
      import.meta.env.CLIENT_SUPABASE_URL ?? "",
      import.meta.env.CLIENT_SUPABASE_ANON_KEY ?? ""
    );
    client.auth.signInWithPassword({
      email: "zcheng27@caj.ac.jp",
      password: "responsible", // hardcoding, great
    });
    return client;
  });
  useEffect(() => {
    (async () => {
      const { data: config, error } = await supabaseClient
        .from("instance")
        .select("*")
        .eq("id", import.meta.env.CLIENT_INSTANCE_ID ?? "")
        .single();
      if (error) throw error;
      setConfig(config);
    })();
  }, [supabaseClient]);
  const [page, setPage] = useState<PageName>("home");

  return (
    <M3TokensProvider>
      <M3ThemeProvider>
        {config ? (
          page === "home" ? (
            <Home
              onAdmin={() => setPage("admin")}
              onUser={() => setPage("display")}
            />
          ) : page === "admin" ? (
            <Admin supabaseClient={supabaseClient} instanceId={config.id} />
          ) : (
            <UserEditor supabaseClient={supabaseClient} />
          )
        ) : (
          "Loading..."
        )}
      </M3ThemeProvider>
    </M3TokensProvider>
  );
}
