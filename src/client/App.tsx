import { ThemeProvider } from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import {
  createM3Theme,
  theme as m3Theme,
  Variant,
} from "mui-material-expressive";
import { useEffect, useMemo, useState } from "react";
import Admin from "./pages/Admin";
import Display from "./pages/Display";
import Home from "./pages/Home";
import { SnackbarProvider } from "./useSnackbar";

type PageName = "home" | "display" | "display-code" | "admin";

export interface AppConfig {
  id: number;
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
  useEffect(() => {
    navigator.wakeLock
      .request("screen")
      .then((sentinel) => {
        console.log("wake lock on", sentinel);
      })
      .catch((e) => {
        console.error("wake lock failed", e);
      });
  }, []);
  const [page, setPage] = useState<PageName>("home");

  const theme = useMemo(
    () =>
      createM3Theme(
        {
          baseColorHex: "#000088",
          themeMode: m3Theme.ThemeMode.LIGHT,
          variant: Variant.CONTENT,
        },
        {
          body: [
            "Montserrat",
            "Roboto",
            "Arial",
            '"Noto Color Emoji"',
            "sans-serif",
          ].join(","),
          heading: [
            "Montserrat",
            "Roboto",
            "Arial",
            '"Noto Color Emoji"',
            "sans-serif",
          ].join(","),
        }
      ),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        defaultSnackbarOptions={{
          snackbarProps: {
            anchorOrigin: {
              horizontal: "center",
              vertical: "bottom",
            },
          },
        }}
      >
        {config ? (
          page === "home" ? (
            <Home
              onAdmin={() => setPage("admin")}
              onUser={() => setPage("display")}
              onUserCode={() => setPage("display-code")}
            />
          ) : page === "admin" ? (
            <Admin supabaseClient={supabaseClient} instanceId={config.id} />
          ) : page === "display-code" ? (
            <Display
              supabaseClient={supabaseClient}
              instanceId={config.id}
              displayCode
            />
          ) : (
            <Display supabaseClient={supabaseClient} instanceId={config.id} />
          )
        ) : (
          "Loading..."
        )}
      </SnackbarProvider>
    </ThemeProvider>
  );
}
