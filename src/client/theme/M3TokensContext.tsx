import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { M3ColorTokens, M3ThemeMode } from "./M3Theme";
import generateTokens, {
  generateTokensFromSourceColor,
} from "./tokensGenerator";

const LOCAL_STORAGE_KEY = "mui-m3-saved-state";
interface ContextState {
  tokens: M3ColorTokens;
  options: M3TokensGenerationOptions;
}
const DEFAULT_THEME_SOURCE_COLOR = "#efa0ff";
const DEFAULT_THEME_MODE: M3ThemeMode = "dark";
const DEFAULT_CONTEXT_STATE: ContextState = {
  tokens: generateTokensFromSourceColor(
    DEFAULT_THEME_SOURCE_COLOR,
    DEFAULT_THEME_MODE
  ),
  options: {
    type: "color",
    baseColorHex: DEFAULT_THEME_SOURCE_COLOR,
    themeMode: DEFAULT_THEME_MODE,
  },
};

interface BaseM3TokensGenerationOptions {
  themeMode: M3ThemeMode;
  type: "color" | "image";
}

interface ColorM3TokensGenerationOptions extends BaseM3TokensGenerationOptions {
  type: "color";
  baseColorHex: string;
}

interface ImageM3TokensGenerationOptions extends BaseM3TokensGenerationOptions {
  type: "image";
  source?: HTMLImageElement;
}

export type M3TokensGenerationOptions =
  | ColorM3TokensGenerationOptions
  | ImageM3TokensGenerationOptions;

export interface M3TokensContextType {
  colorTokens: M3ColorTokens;
  generationOptions: M3TokensGenerationOptions;
  generate: (options: M3TokensGenerationOptions) => Promise<void>;
  reset: () => void;
}

export const M3TokensContext = createContext<M3TokensContextType>({
  get colorTokens(): M3ColorTokens {
    throw new Error("A provider for TokensContext is not in context.");
  },
  get generationOptions(): M3TokensGenerationOptions {
    throw new Error("A provider for TokensContext is not in context.");
  },
  generate() {
    throw new Error("A provider for TokensContext is not in context.");
  },
  reset() {
    throw new Error("A provider for TokensContext is not in context.");
  },
});

function fetchSavedState() {
  const keyContents = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (keyContents) {
    const localStorageTokens = JSON.parse(
      keyContents
      // If the user tampers with LocalStorage, it's their fault if anything
      // goes wrong. So I casted (cast?).
    ) as ContextState;
    return localStorageTokens;
  }
  return null;
}

interface M3TokensProviderProps {
  children: ReactNode;
}

export default function M3TokensProvider({ children }: M3TokensProviderProps) {
  const [state, setState] = useState<ContextState>(DEFAULT_CONTEXT_STATE);

  useEffect(() => {
    const savedState = fetchSavedState();
    if (savedState) setState(savedState);
  }, []);

  const tokensValue = useMemo<M3TokensContextType>(
    () => ({
      colorTokens: state.tokens,
      generationOptions: state.options,
      async generate(options) {
        if (options.type === "image" && options.source === undefined)
          throw new Error("Source must be defined for init of m3 theme");
        const newState = {
          options,
          tokens: await generateTokens(
            // I checked above already and don't want to rewrite the structure.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (options.type === "color" ? options.baseColorHex : options.source)!,
            options.themeMode
          ),
        };
        setState(newState);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      },
      reset() {
        setState(DEFAULT_CONTEXT_STATE);
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(DEFAULT_CONTEXT_STATE)
        );
      },
    }),
    [state]
  );

  return (
    <M3TokensContext.Provider value={tokensValue}>
      {children}
    </M3TokensContext.Provider>
  );
}
