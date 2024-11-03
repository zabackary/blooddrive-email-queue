import { ThemeOptions } from "@mui/material/styles";
import { M3ColorTokens, M3ThemeFonts, M3ThemeMode } from "./M3Theme";

export default function getThemeOptions(
  mode: M3ThemeMode,
  tokens: M3ColorTokens,
  fonts: M3ThemeFonts
): ThemeOptions {
  return {
    typography: {
      fontFamily: fonts.body,
      body1: { fontFamily: fonts.body },
      body2: { fontFamily: fonts.body },
      h1: { fontFamily: fonts.heading },
      h2: { fontFamily: fonts.heading },
      h3: { fontFamily: fonts.heading },
      h4: { fontFamily: fonts.heading },
      h5: { fontFamily: fonts.heading },
    },
    palette: {
      mode,
      primary: { main: tokens.primary, contrastText: tokens.onPrimary },
      onPrimary: { main: tokens.onPrimary, contrastText: tokens.primary },
      primaryContainer: {
        main: tokens.primaryContainer,
        contrastText: tokens.onPrimaryContainer,
      },
      onPrimaryContainer: {
        main: tokens.onPrimaryContainer,
        contrastText: tokens.primaryContainer,
      },
      inversePrimary: {
        main: tokens.inversePrimary,
        // I wasn't sure what to put here initially, but I found
        // https://api.flutter.dev/flutter/material/ColorScheme/inversePrimary.html
        contrastText: tokens.inverseSurface,
      },

      secondary: { main: tokens.secondary, contrastText: tokens.onSecondary },
      onSecondary: { main: tokens.onSecondary, contrastText: tokens.secondary },
      secondaryContainer: {
        main: tokens.secondaryContainer,
        contrastText: tokens.onSecondaryContainer,
      },
      onSecondaryContainer: {
        main: tokens.onSecondaryContainer,
        contrastText: tokens.secondaryContainer,
      },

      tertiary: { main: tokens.tertiary, contrastText: tokens.onTertiary },
      onTertiary: { main: tokens.onTertiary, contrastText: tokens.tertiary },
      tertiaryContainer: {
        main: tokens.tertiaryContainer,
        contrastText: tokens.onTertiaryContainer,
      },
      onTertiaryContainer: {
        main: tokens.onTertiaryContainer,
        contrastText: tokens.tertiaryContainer,
      },

      surface: { main: tokens.surface, contrastText: tokens.onSurface },
      surfaceDim: { main: tokens.surfaceDim, contrastText: tokens.onSurface },
      surfaceBright: {
        main: tokens.surfaceBright,
        contrastText: tokens.onSurface,
      },

      surfaceContainerLowest: {
        main: tokens.surfaceContainerLowest,
        contrastText: tokens.onSurface,
      },
      surfaceContainerLow: {
        main: tokens.surfaceContainerLow,
        contrastText: tokens.onSurface,
      },
      surfaceContainer: {
        main: tokens.surfaceContainer,
        contrastText: tokens.onSurface,
      },
      surfaceContainerHigh: {
        main: tokens.surfaceContainerHigh,
        contrastText: tokens.onSurface,
      },
      surfaceContainerHighest: {
        main: tokens.surfaceContainerHighest,
        contrastText: tokens.onSurface,
      },

      surfaceVariant: {
        main: tokens.surfaceVariant,
        contrastText: tokens.onSurfaceVariant,
      },

      onSurface: { main: tokens.onSurface, contrastText: tokens.surface },
      onSurfaceVariant: {
        main: tokens.onSurfaceVariant,
        contrastText: tokens.surfaceVariant,
      },
      inverseSurface: {
        main: tokens.inverseSurface,
        contrastText: tokens.inverseOnSurface,
      },
      inverseOnSurface: {
        main: tokens.inverseOnSurface,
        contrastText: tokens.inverseSurface,
      },

      background: {
        default: tokens.background,
        paper: tokens.surface,
      },
      onBackground: {
        default: tokens.onBackground,
        paper: tokens.onSurface,
      },

      error: { main: tokens.error, contrastText: tokens.onError },
      onError: { main: tokens.onError, contrastText: tokens.error },
      errorContainer: {
        main: tokens.errorContainer,
        contrastText: tokens.onErrorContainer,
      },
      onErrorContainer: {
        main: tokens.onErrorContainer,
        contrastText: tokens.errorContainer,
      },

      outline: { main: tokens.outline },
      outlineVariant: { main: tokens.outlineVariant },

      shadow: { main: tokens.shadow },
      surfaceTint: { main: tokens.surfaceTint },
      scrim: { main: tokens.scrim },

      common: {
        white: tokens.background,
        black: tokens.onBackground,
      },
      text: {
        primary: tokens.onSurface,
        secondary: tokens.onSecondaryContainer,
      },
      divider: tokens.outline,
    },
  } as ThemeOptions;
}
