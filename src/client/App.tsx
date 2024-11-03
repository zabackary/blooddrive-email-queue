import { Button } from "@mui/material";
import { M3ThemeProvider, M3TokensProvider } from "./theme";

export default function App() {
  return (
    <M3TokensProvider>
      <M3ThemeProvider>
        <Button>Test</Button>
      </M3ThemeProvider>
    </M3TokensProvider>
  );
}
