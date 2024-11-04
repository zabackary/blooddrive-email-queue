import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import UserEditor from "./pages/UserEditor";
import { M3ThemeProvider, M3TokensProvider } from "./theme";

type PageName = "home" | "user-editor" | "admin";

export interface AppConfig {
  id: string;
  created_at: string;
  name: string;
  paid_information: string;
  paid_information_alt: string;
  contact_name: string;
  contact_email: string;
  paid_is_unlocked: boolean | null;
  templates: {
    id: string;
    name: string;
  }[];
}

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [supabaseClient] = useState(() =>
    createClient(
      import.meta.env.CLIENT_SUPABASE_URL ?? "",
      import.meta.env.CLIENT_SUPABASE_ANON_KEY ?? ""
    )
  );
  useEffect(() => {
    (async () => {
      const config = (
        await supabaseClient.functions.invoke("instance-data", {
          body: {
            id: import.meta.env.CLIENT_INSTANCE_ID ?? "",
          },
        })
      ).data;
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
              onUser={() => setPage("user-editor")}
            />
          ) : page === "admin" ? (
            <Admin supabaseClient={supabaseClient} instanceId={config.id} />
          ) : (
            <UserEditor supabaseClient={supabaseClient} config={config} />
          )
        ) : (
          "Loading..."
        )}
      </M3ThemeProvider>
    </M3TokensProvider>
  );
}
