import {
  DynamicScheme,
  MaterialDynamicColors,
  hexFromArgb,
} from "@material/material-color-utilities";
import { M3ColorTokens } from "./M3Theme";

export default function getTokensFromDynamicScheme(
  dynamicScheme: DynamicScheme
): M3ColorTokens {
  return {
    primary: hexFromArgb(MaterialDynamicColors.primary.getArgb(dynamicScheme)),
    onPrimary: hexFromArgb(
      MaterialDynamicColors.onPrimary.getArgb(dynamicScheme)
    ),
    primaryContainer: hexFromArgb(
      MaterialDynamicColors.primaryContainer.getArgb(dynamicScheme)
    ),
    onPrimaryContainer: hexFromArgb(
      MaterialDynamicColors.onPrimaryContainer.getArgb(dynamicScheme)
    ),
    inversePrimary: hexFromArgb(
      MaterialDynamicColors.inversePrimary.getArgb(dynamicScheme)
    ),

    secondary: hexFromArgb(
      MaterialDynamicColors.secondary.getArgb(dynamicScheme)
    ),
    onSecondary: hexFromArgb(
      MaterialDynamicColors.onSecondary.getArgb(dynamicScheme)
    ),
    secondaryContainer: hexFromArgb(
      MaterialDynamicColors.secondaryContainer.getArgb(dynamicScheme)
    ),
    onSecondaryContainer: hexFromArgb(
      MaterialDynamicColors.onSecondaryContainer.getArgb(dynamicScheme)
    ),

    tertiary: hexFromArgb(
      MaterialDynamicColors.tertiary.getArgb(dynamicScheme)
    ),
    onTertiary: hexFromArgb(
      MaterialDynamicColors.onTertiary.getArgb(dynamicScheme)
    ),
    tertiaryContainer: hexFromArgb(
      MaterialDynamicColors.tertiaryContainer.getArgb(dynamicScheme)
    ),
    onTertiaryContainer: hexFromArgb(
      MaterialDynamicColors.onTertiaryContainer.getArgb(dynamicScheme)
    ),

    surface: hexFromArgb(MaterialDynamicColors.surface.getArgb(dynamicScheme)),
    surfaceDim: hexFromArgb(
      MaterialDynamicColors.surfaceDim.getArgb(dynamicScheme)
    ),
    surfaceBright: hexFromArgb(
      MaterialDynamicColors.surfaceBright.getArgb(dynamicScheme)
    ),

    surfaceContainerLowest: hexFromArgb(
      MaterialDynamicColors.surfaceContainerLowest.getArgb(dynamicScheme)
    ),
    surfaceContainerLow: hexFromArgb(
      MaterialDynamicColors.surfaceContainerLow.getArgb(dynamicScheme)
    ),
    surfaceContainer: hexFromArgb(
      MaterialDynamicColors.surfaceContainer.getArgb(dynamicScheme)
    ),
    surfaceContainerHigh: hexFromArgb(
      MaterialDynamicColors.surfaceContainerHigh.getArgb(dynamicScheme)
    ),
    surfaceContainerHighest: hexFromArgb(
      MaterialDynamicColors.surfaceContainerHighest.getArgb(dynamicScheme)
    ),

    surfaceVariant: hexFromArgb(
      MaterialDynamicColors.surfaceVariant.getArgb(dynamicScheme)
    ),

    onSurface: hexFromArgb(
      MaterialDynamicColors.onSurface.getArgb(dynamicScheme)
    ),
    onSurfaceVariant: hexFromArgb(
      MaterialDynamicColors.onSurfaceVariant.getArgb(dynamicScheme)
    ),
    inverseSurface: hexFromArgb(
      MaterialDynamicColors.inverseSurface.getArgb(dynamicScheme)
    ),
    inverseOnSurface: hexFromArgb(
      MaterialDynamicColors.inverseOnSurface.getArgb(dynamicScheme)
    ),

    background: hexFromArgb(
      MaterialDynamicColors.background.getArgb(dynamicScheme)
    ),
    onBackground: hexFromArgb(
      MaterialDynamicColors.onBackground.getArgb(dynamicScheme)
    ),

    error: hexFromArgb(MaterialDynamicColors.error.getArgb(dynamicScheme)),
    onError: hexFromArgb(MaterialDynamicColors.onError.getArgb(dynamicScheme)),
    errorContainer: hexFromArgb(
      MaterialDynamicColors.errorContainer.getArgb(dynamicScheme)
    ),
    onErrorContainer: hexFromArgb(
      MaterialDynamicColors.onErrorContainer.getArgb(dynamicScheme)
    ),

    outline: hexFromArgb(MaterialDynamicColors.outline.getArgb(dynamicScheme)),
    outlineVariant: hexFromArgb(
      MaterialDynamicColors.outlineVariant.getArgb(dynamicScheme)
    ),

    shadow: hexFromArgb(MaterialDynamicColors.shadow.getArgb(dynamicScheme)),
    surfaceTint: hexFromArgb(
      MaterialDynamicColors.surfaceTint.getArgb(dynamicScheme)
    ),
    scrim: hexFromArgb(MaterialDynamicColors.scrim.getArgb(dynamicScheme)),
  };
}
