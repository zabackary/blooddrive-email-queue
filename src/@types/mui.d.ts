export {};

import type {
  PaletteColor,
  PaletteColorOptions,
  TypeBackground,
} from "@mui/material";

declare module "@mui/material/styles" {
  interface M3Palette {
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
  interface M3PaletteOptions
    extends Record<keyof M3Palette, PaletteColorOptions> {
    mode: string;
  }
  interface Palette extends M3Palette {}
  interface PaletteOptions extends M3PaletteOptions {}
}

declare module "@mui/material/AccordionSummary" {}

declare module "@mui/material/Alert" {}

declare module "@mui/material/Accordion" {}

declare module "@mui/material/BottomNavigation" {}

declare module "@mui/material/BottomNavigationAction" {}

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
  interface ButtonPropsSizeOverrides {
    extraSmall: true;
    small: true;
    medium: true;
    large: true;
    extraLarge: true;
  }
}

declare module "@mui/material/ButtonBase" {}

declare module "@mui/material/ButtonGroup" {
  interface ButtonGroupPropsVariantOverrides {
    elevated: true;
    filled: true;
    tonal: true;
    connected: true;
  }
  interface ButtonGroupColorOverrides {
    tertiary: true;
    surface: true;
  }
  interface ButtonGroupPropsSizeOverrides {
    extraSmall: true;
    small: true;
    medium: true;
    large: true;
    extraLarge: true;
  }
}

declare module "@mui/material/Card" {}

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

declare module "@mui/material/CssBaseline" {}

declare module "@mui/material/Dialog" {}

declare module "@mui/material/Divider" {}

declare module "@mui/material/Drawer" {}

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

declare module "@mui/material/IconButton" {}

declare module "@mui/material/ListItem" {}

declare module "@mui/material/ListItemButton" {}

declare module "@mui/material/ListItemIcon" {}

declare module "@mui/material/MenuItem" {}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    filled: true;
  }
}

declare module "@mui/material/Skeleton" {}

declare module "@mui/material/SnackbarContent" {}

declare module "@mui/material/Switch" {}

declare module "@mui/material/Tab" {}

declare module "@mui/material/Tabs" {}

declare module "@mui/material/ToggleButton" {}

declare module "@mui/material/Tooltip" {}

declare module "@mui/material/Accordion" {}
