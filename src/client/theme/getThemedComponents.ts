import { alpha, darken, keyframes, lighten, Theme } from "@mui/material";

export default function getThemedComponents(
  theme: Theme
): Pick<Theme, "components"> {
  return {
    components: {
      MuiCssBaseline: {
        defaultProps: {
          enableColorScheme: true,
        },
      },
      MuiSkeleton: {
        defaultProps: {
          animation: "wave",
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: theme.palette.outline.main,
            backgroundColor: theme.palette.outline.main,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: theme.spacing(1),
          },
        },
        defaultProps: {
          color: "inherit",
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            margin: "0 16px",
            minWidth: 0,
            padding: 0,
            [theme.breakpoints.up("md")]: {
              padding: 0,
              minWidth: 0,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: theme.palette.surfaceContainer.main,
            color: theme.palette.surfaceContainer.contrastText,
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            boxShadow: "none",
          },
          colorDefault: {
            background: theme.palette.surfaceContainer.main,
            color: theme.palette.surfaceContainer.contrastText,
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
          },
          colorPrimary: {
            background: theme.palette.surfaceContainer.main,
            color: theme.palette.surfaceContainer.contrastText,
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: "40px",
            textTransform: "none",
            borderColor: theme.palette.outline.main,
            color: theme.palette.onSurface.main,
            paddingX: "12px",
            "&.MuiToggleButtonGroup-grouped:not(:first-of-type)": {
              marginLeft: 0,
              borderLeft: 0,
            },
            "&::before": {
              content: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.onSecondaryContainer.main
              )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
              width: "0px",
              marginRight: "0px",
              transform: "scale(0) translate(-12px, 3px)",
              transition: theme.transitions.create([
                "width",
                "transform",
                "margin-right",
              ]),
            },
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondaryContainer.main,
              color: theme.palette.secondaryContainer.contrastText,
              "&::before": {
                width: "24px",
                marginRight: "12px",
                transform: "scale(1) translate(0px, 3px)",
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "50px",
            textTransform: "none",
          },
          outlined: {
            borderColor: theme.palette.outline.main,
          },
        },
        variants: [
          {
            props: { variant: "elevated" },
            style: {
              boxShadow: theme.shadows[1],
              background: alpha(theme.palette.primary.main, 0.05),
              color: theme.palette.primary.main,
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.15),
              },
              "&.Mui-disabled": {
                background: alpha(theme.palette.primary.main, 0.12),
                color: alpha(theme.palette.primary.main, 0.38),
              },
            },
          },
          {
            props: { variant: "filled" },
            style: {
              background: theme.palette.primary.main,
              color: theme.palette.onPrimary.main,
              "&:hover": {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.primary.main, 0.85),
              },
              "&.Mui-disabled": {
                background: alpha(theme.palette.primary.main, 0.12),
                color: alpha(theme.palette.primary.main, 0.38),
              },
            },
          },
          {
            props: { variant: "tonal" },
            style: {
              background: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
              "&:hover": {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.secondaryContainer.main, 0.8),
              },
              "&.Mui-disabled": {
                background: alpha(theme.palette.secondaryContainer.main, 0.12),
                color: alpha(theme.palette.secondaryContainer.main, 0.38),
              },
            },
          },
        ],
        defaultProps: {
          // Already shown from outline in ButtonBase.
          focusRipple: false,
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: "18px",
            textTransform: "unset",
            boxShadow: theme.shadows[3],
            minHeight: "56px",
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          },
        },
        variants: [
          {
            props: { color: "primary" },
            style: {
              background: theme.palette.primaryContainer.main,
              color: theme.palette.onPrimaryContainer.main,
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.primaryContainer.main, 0.08)
                    : darken(theme.palette.primaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { color: "secondary" },
            style: {
              background: theme.palette.secondaryContainer.main,
              color: theme.palette.onSecondaryContainer.main,
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.secondaryContainer.main, 0.08)
                    : darken(theme.palette.secondaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { color: "tertiary" },
            style: {
              background: theme.palette.tertiaryContainer.main,
              color: theme.palette.onTertiaryContainer.main,
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.tertiaryContainer.main, 0.08)
                    : darken(theme.palette.tertiaryContainer.main, 0.08),
              },
            },
          },
          {
            props: { color: "surface" },
            style: {
              background: theme.palette.surfaceContainerHigh.main,
              color: theme.palette.primary.main,
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.surfaceContainerHigh.main, 0.08)
                    : darken(theme.palette.surfaceContainerHigh.main, 0.08),
              },
            },
          },
          {
            props: { color: "surfaceLowered" },
            style: {
              background: theme.palette.surfaceContainerLow.main,
              color: theme.palette.primary.main,
              boxShadow: theme.shadows[1],
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? lighten(theme.palette.surfaceContainerLow.main, 0.08)
                    : darken(theme.palette.surfaceContainerLow.main, 0.08),
              },
            },
          },
        ],
        defaultProps: {
          // Already shown from outline in ButtonBase.
          focusRipple: false,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            // padding: "10px 8px",
          },
        },
        variants: [
          {
            props: { variant: "elevation" },
            style: {
              boxShadow: theme.shadows[1],
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              /* transition: theme.transitions.create(
                ["background-color", "box-shadow", "border-color", "color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                boxShadow: theme.shadows[2],
                background: alpha(theme.palette.primary.main, 0.08),
              }, */
            },
          },
          {
            props: { variant: "filled" },
            style: {
              backgroundColor: theme.palette.surfaceVariant.main,
              /* transition: theme.transitions.create(
                ["background-color", "box-shadow", "border-color", "color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.surfaceVariant.main, 0.8),
              }, */
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              backgroundColor: theme.palette.surface.main,
              borderColor: theme.palette.outline.main,
              /* transition: theme.transitions.create(
                ["background-color", "box-shadow", "border-color", "color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                boxShadow: theme.shadows[1],
                background: alpha(theme.palette.onSurface.main, 0.05),
              }, */
            },
          },
        ],
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 32,
          },
          icon: {
            alignItems: "center",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {},
          outlined: {
            borderColor: theme.palette.outline.main,
            background: theme.palette.surface.main,
          },
          // Mappings from images in this blog article
          // https://material.io/blog/tone-based-surface-color-m3
          elevation0: {
            background: theme.palette.surfaceContainerLowest.main,
            color: theme.palette.surfaceContainerLowest.contrastText,
          },
          elevation1: {
            background: theme.palette.surfaceContainerLow.main,
            color: theme.palette.surfaceContainerLow.contrastText,
          },
          elevation2: {
            background: theme.palette.surfaceContainer.main,
            color: theme.palette.surfaceContainer.contrastText,
          },
          elevation3: {
            background: theme.palette.surfaceContainerHigh.main,
            color: theme.palette.surfaceContainerHigh.contrastText,
          },
          elevation4: {
            background: theme.palette.surfaceContainerHigh.main,
            color: theme.palette.surfaceContainerHigh.contrastText,
          },
          ...Object.fromEntries(
            [...Array(25 - 5).keys()].map((elevation) => [
              `elevation${elevation + 5}`,
              {
                background: theme.palette.surfaceContainerHigh.main,
                color: theme.palette.surfaceContainerHigh.contrastText,
              },
            ])
          ),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          root: {
            "& .MuiListItemButton-root": {
              borderRadius: 50,
            },
          },
          paperAnchorLeft: {
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          },
          paperAnchorRight: {
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
          paperAnchorTop: {
            borderBottomRightRadius: 16,
            borderBottomLeftRadius: 16,
          },
          paperAnchorBottom: {
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
          },
          paper: {
            border: "0px",
            background: theme.palette.surfaceContainerHigh.main,
            color: theme.palette.surface.contrastText,
          },
          docked: {
            "& .MuiPaper-root": {
              background: theme.palette.surface.main,
              color: theme.palette.onSurface.main,
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: 1,
            paddingBottom: 1,
            "& .MuiListItemButton-root": {
              paddingTop: 8,
              paddingBottom: 8,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            // border radius moved to MuiDrawer since it doesn't apply to all
            // selectable lists. Used to be 50
            "&.Mui-selected": {
              color: theme.palette.onSecondaryContainer.main,
              background: theme.palette.secondaryContainer.main,
              "& > .MuiListItemText-root > .MuiListItemText-primary": {
                fontWeight: "bold",
              },
            },
            "--mui-button-base-focus-ring-offset": "0px",
            "--mui-button-base-focus-ring-radius": "4px",
            "--mui-button-base-focus-ring-outer": 0,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: "inherit",
            minWidth: 32,
            "&.Mui-selected": {
              fontWeight: "bold",
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: theme.palette.inverseSurface.main,
            color: theme.palette.inverseOnSurface.main,
          },
        },
        defaultProps: {
          enterNextDelay: 500,
          leaveDelay: 200,
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            "&:before": {
              display: "none",
            },
            "&.Mui-disabled": {
              backgroundColor: theme.palette.inverseOnSurface.main,
              color: theme.palette.inverseSurface.main,
            },
            borderRadius: "32px !important",
            marginBottom: 8,
            transition: theme.transitions.create([
              "border-radius",
              "margin",
              "box-shadow",
            ]),
            backgroundColor: theme.palette.surfaceContainerHighest.main,
            "&:hover": {
              boxShadow: theme.shadows[1],
            },
            "&.Mui-expanded": {
              borderRadius: "16px !important",
              boxShadow: theme.shadows[2],
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            borderRadius: 32,
            transition: theme.transitions.create("border-radius"),
            "&.Mui-expanded": {
              borderRadius: 16,
            },
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.inverseSurface.main,
          },
          message: {
            color: theme.palette.inverseOnSurface.main,
          },
          action: {
            color: theme.palette.inversePrimary.main,
          },
        },
      },
      MuiChip: {
        variants: [
          {
            props: { variant: "elevated" },
            style: {
              boxShadow: theme.shadows[1],
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              border: `1px solid ${theme.palette.outline.main}`,
            },
          },
          {
            props: { variant: "tonal" },
            style: {
              backgroundColor: theme.palette.secondaryContainer.main,
            },
          },
          {
            props: { color: "tertiary" },
            style: {
              backgroundColor: theme.palette.tertiaryContainer.main,
            },
          },
        ],
        styleOverrides: {
          root: {
            borderRadius: "8px",
            "--mui-button-base-focus-ring-radius": "8px",
          },
          icon: {
            marginLeft: "8px",
            height: "18px",
            width: "18px",
            color: theme.palette.primary.main,
          },
          label: {
            paddingLeft: "16px",
            paddingRight: "16px",
          },
          filled: {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: "80px",
            background: theme.palette.surfaceContainer.main,
            color: theme.palette.surfaceContainer.contrastText,
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            "--mui-button-base-focus-ring-offset": "-4px",
            paddingTop: "38px",
            paddingBottom: "42px",
            marginLeft: "8px",
            marginRight: "8px",
            overflow: "hidden",
            "& .MuiSvgIcon-root, & .MuiIcon-root": {
              height: "32px",
              width: "64px",
              borderRadius: "16px",
              marginBottom: "4px",
              color: theme.palette.onSurfaceVariant.main,
              padding: "4px",
              transition: theme.transitions.create([
                "transform",
                "background-color",
                "font-variation-settings",
              ]),
              boxShadow: `0px 0px 0px 1000px ${theme.palette.surfaceContainer.main}`,
              zIndex: 9,
            },
            "&.Mui-selected": {
              "& .MuiSvgIcon-root, & .MuiIcon-root": {
                backgroundColor: theme.palette.secondaryContainer.main,
                color: theme.palette.onSecondaryContainer.main,
              },
            },
            "&:hover": {
              "& .MuiSvgIcon-root, & .MuiIcon-root": {
                backgroundColor: alpha(
                  theme.palette.onSurfaceVariant.main,
                  0.08
                ),
              },
              "&.Mui-selected": {
                "& .MuiSvgIcon-root, & .MuiIcon-root": {
                  backgroundColor: alpha(theme.palette.onSurface.main, 0.08),
                },
              },
            },
          },
          label: {
            lineHeight: "12px",
            letterSpacing: "0.5px",
            fontSize: "12px",
            fontWeight: "500",
            color: theme.palette.onSurfaceVariant.main,
            zIndex: 9,
            "&.Mui-selected": {
              color: theme.palette.onSurface.main,
              fontSize: "12px",
            },
          },
          iconOnly: {
            "& .MuiSvgIcon-root, & .MuiIcon-root": {
              transform: "translateY(8px)",
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 52,
            height: 32,
            padding: 0,
            marginLeft: 12,
            marginRight: 8,
            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin: 8,
              transitionDuration: "100ms",
              "& .MuiSwitch-input": {
                height: 36,
                width: 60,
                marginLeft: 0,
                marginTop: -8,
              },
              "& .MuiSwitch-thumb": {
                boxSizing: "border-box",
                width: 16,
                height: 16,
                backgroundColor: theme.palette.outline.main,
                boxShadow: "none",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  left: 0,
                  top: 0,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                },
              },
              "& + .MuiSwitch-track": {
                borderRadius: 32 / 2,
                border: `2px solid ${theme.palette.outline.main}`,
                backgroundColor: theme.palette.surfaceContainerHighest.main,
                opacity: 1,
                transition: theme.transitions.create(["background-color"], {
                  duration: 500,
                }),
              },
              "&.Mui-checked": {
                transform: "translateX(20px)",
                margin: 4,
                "& + .MuiSwitch-track": {
                  backgroundColor: theme.palette.primary.main,
                  border: 0,
                  opacity: 1,
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: theme.palette.onPrimary.main,
                  width: 24,
                  height: 24,
                  "&:before": {
                    backgroundColor: theme.palette.onPrimaryContainer.main,
                    mask: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>') center no-repeat`,
                  },
                },
                "&.Mui-disabled": {
                  "& .MuiSwitch-thumb": {
                    opacity: 1,
                    backgroundColor: theme.palette.surface.main,
                    "&:before": {
                      opacity: 0.38,
                      backgroundColor: theme.palette.onSurface.main,
                    },
                  },
                  "& + .MuiSwitch-track": {
                    backgroundColor: theme.palette.onSurface.main,
                  },
                },
              },
              "&.Mui-disabled": {
                "& .MuiSwitch-thumb": {
                  opacity: 0.38,
                },
                "& + .MuiSwitch-track": {
                  opacity: 0.12,
                },
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "24px",
            paddingTop: "8px",
            paddingBottom: "16px",
            background: theme.palette.surfaceContainerHigh.main,
            boxShadow: "none",
          },
          paperFullScreen: {
            borderRadius: 0,
            background: theme.palette.surfaceContainerHigh.main,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "--mui-button-base-focus-ring-enable": 0,
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            // # Focus ring styling
            //
            // ## CSS API:
            //
            // - *`--mui-button-base-focus-ring-offset`*
            //   Controls the offset of the ring from the element, e.g. the gap.
            //   Default: 4px
            // - *`--mui-button-base-focus-ring-radius`*
            //   Controls the corner radius of the ring.
            //   Default: 8px
            // - *`--mui-button-base-focus-ring-enable`*
            //   If set to `0`, focus ring is disabled.
            //   Default: 1
            // - *`--mui-button-base-focus-ring-outer`*
            //   If set to `0`, focus ring outer is hidden.
            //   Default: 1
            "&:focus-visible::after": {
              content: '""',
              position: "absolute",
              inset: "calc(var(--mui-button-base-focus-ring-offset, 4px) * -1)",
              pointerEvents: "none",
              opacity: "var(--mui-button-base-focus-ring-enable, 1)",
              borderRadius:
                "calc(var(--mui-button-base-focus-ring-radius, 8px) + var(--mui-button-base-focus-ring-offset, 4px) / 2)",
              borderWidth: "2px",
              borderColor: theme.palette.primary.main,
              borderStyle: "solid",
              outlineOffset: "1px",
              outlineWidth:
                "calc(var(--mui-button-base-focus-ring-outer, 1) * 2px)",
              outlineColor: theme.palette.primaryContainer.main,
              outlineStyle: "solid",
              animation: `${keyframes`
              0% {
                border-width: 0px;
                outline-width: 0px;
              }
              50% {
                border-width: 4px;
              }
              100% {
                border-width: 2px;
                outline-width: calc(var(--mui-button-base-focus-ring-outer, 1) * 2px);
              }
              `} ${theme.transitions.duration.standard}ms ${
                theme.transitions.easing.easeIn
              }`,
              zIndex: 99999,
            },
            "& .MuiTouchRipple-root": {
              opacity: 0.5,
            },
            "& .MuiTouchRipple-rippleVisible": {
              animationDuration: "180ms",
            },
          },
        },
        defaultProps: {
          focusRipple: false,
        },
      },
    },
  };
}
