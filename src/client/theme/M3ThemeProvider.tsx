import React, { useContext, useMemo } from "react";

import { CssBaseline, responsiveFontSizes } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { M3TokensContext } from "./M3TokensContext";
import getThemeOptions from "./getThemeOptions";
import getThemedComponents from "./getThemedComponents";

export interface M3ThemeProps {
  children: React.ReactNode;
}

export default function M3ThemeProvider({ children }: M3ThemeProps) {
  const { generationOptions, colorTokens } = useContext(M3TokensContext);

  const m3Theme = useMemo(() => {
    // Create the theme using tokens and typography from the Material theme
    let newM3Theme = createTheme(
      getThemeOptions(generationOptions.themeMode, colorTokens, {
        body: [
          '"Roboto Flex"',
          "Roboto",
          "Arial",
          '"Noto Color Emoji"',
          "sans-serif",
        ].join(","),
        heading: [
          '"Roboto Flex"',
          "Roboto",
          "Arial",
          '"Noto Color Emoji"',
          "sans-serif",
        ].join(","),
      })
    );
    newM3Theme = deepmerge(newM3Theme, getThemedComponents(newM3Theme));
    newM3Theme = responsiveFontSizes(newM3Theme);

    // Set the document meta-color, if it exists
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", colorTokens.surface);

    return newM3Theme;
  }, [colorTokens, generationOptions.themeMode]);

  return (
    <ThemeProvider theme={m3Theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
