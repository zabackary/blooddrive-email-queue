interface M3Tone {
  0: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  95: string;
  99: string;
  100: string;
}
export interface M3ThemeTones {
  primary: M3Tone;
  secondary: M3Tone;
  tertiary: M3Tone;
  neutral: M3Tone;
  neutralVariant: M3Tone;
  error: M3Tone;
}

export interface M3ThemeFonts {
  heading: string;
  body: string;
}

export interface M3ColorTokens {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  inversePrimary: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  surface: string;
  surfaceDim: string;
  surfaceBright: string;

  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;

  surfaceVariant: string;

  onSurface: string;
  onSurfaceVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;

  background: string;
  onBackground: string;

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  outline: string;
  outlineVariant: string;

  shadow: string;
  surfaceTint: string;
  scrim: string;
}

export type M3ThemeMode = "dark" | "light";

export interface M3ThemeScheme {
  light: M3ColorTokens;
  dark: M3ColorTokens;
  tones?: M3ThemeTones;
}

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    primary: PaletteColor;
    onPrimary: PaletteColor;
    primaryContainer: PaletteColor;
    onPrimaryContainer: PaletteColor;
    inversePrimary: PaletteColor;

    secondary: PaletteColor;
    onSecondary: PaletteColor;
    secondaryContainer: PaletteColor;
    onSecondaryContainer: PaletteColor;

    tertiary: PaletteColor;
    onTertiary: PaletteColor;
    tertiaryContainer: PaletteColor;
    onTertiaryContainer: PaletteColor;

    surface: PaletteColor;
    surfaceDim: PaletteColor;
    surfaceBright: PaletteColor;

    surfaceContainerLowest: PaletteColor;
    surfaceContainerLow: PaletteColor;
    surfaceContainer: PaletteColor;
    surfaceContainerHigh: PaletteColor;
    surfaceContainerHighest: PaletteColor;

    surfaceVariant: PaletteColor;

    onSurface: PaletteColor;
    onSurfaceVariant: PaletteColor;
    inverseSurface: PaletteColor;
    inverseOnSurface: PaletteColor;

    background: TypeBackground;
    onBackground: TypeBackground;

    error: PaletteColor;
    onError: PaletteColor;
    errorContainer: PaletteColor;
    onErrorContainer: PaletteColor;

    outline: PaletteColor;
    outlineVariant: PaletteColor;

    shadow: PaletteColor;
    surfaceTint: PaletteColor;
    scrim: PaletteColor;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    elevated: true;
    filled: true;
    tonal: true;
  }
  interface ButtonPropsColorOverrides {
    tertiary: true;
    surface: true;
  }
}

declare module "@mui/material/ButtonGroup" {
  interface ButtonGroupPropsVariantOverrides {
    elevated: true;
    filled: true;
    tonal: true;
  }
  interface ButtonGroupColorOverrides {
    tertiary: true;
    surface: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    filled: true;
  }
}

declare module "@mui/material/Fab" {
  interface FabPropsVariantOverrides {
    circular: false;
    standard: true;
  }
  interface FabPropsColorOverrides {
    primary: true;
    secondary: true;
    tertiary: true;
    surface: true;
    surfaceLowered: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    outlined: true;
    elevated: true;
    tonal: true;
  }
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}
