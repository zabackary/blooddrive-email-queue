import { IconButton, Snackbar, SnackbarProps, styled } from "@mui/material";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SurfaceIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.inverseOnSurface.main,
}));

interface SnackbarQueueItem {
  options: SnackbarOptions;
  message: string;
  key: number;
}

export enum SnackbarDuration {
  LONG = 10000,
  SHORT = 4000,
}

export interface SnackbarOptions {
  /**
   * Whether to immediately close the old snackbar
   * @default false
   */
  urgent: boolean;

  /**
   * The action button of the snackbar.
   *
   * @default null
   */
  action: ReactNode;

  /**
   * Whether to show the close button.
   * @default false
   */
  showCloseButton: boolean;

  /**
   * If {@link autoHide `autoHide`} is set, then when the snackbar automatically
   * closes.
   */
  autoHideDuration: number;

  /**
   * Whether the snackbar should hide on its own.
   * @default true
   */
  autoHide: boolean;

  /**
   * Props to be forwarded to the {@link Snackbar `Snackbar`}.
   * @default {}
   */
  snackbarProps: SnackbarProps;
}

export interface SnackbarContext {
  /**
   * Show a snackbar.
   *
   * @param message The message
   * @param options The options
   * @returns A function used to cancel or hide the snackbar.
   */
  showSnackbar: (
    message: string,
    options?: Partial<SnackbarOptions>
  ) => () => void;
}

const SnackbarContext = createContext<SnackbarContext | null>(null);

export default function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("Not within context of snackbar provider.");
  return context;
}

export interface SnackbarProviderProps {
  defaultSnackbarOptions?: Partial<SnackbarOptions>;
  children: ReactNode;
}

const defaultDefaultSnackbarOptions = {
  showCloseButton: true,
} satisfies Partial<SnackbarOptions>;

export function SnackbarProvider({
  children,
  defaultSnackbarOptions = defaultDefaultSnackbarOptions,
}: SnackbarProviderProps) {
  const [queue, setQueue] = useState<readonly SnackbarQueueItem[]>([]);
  const [open, setOpen] = useState(false);
  const [removedMessage, setRemovedMessage] = useState<number>();
  const [currentMessage, setCurrentMessage] = useState<SnackbarQueueItem>();
  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleExited = () => {
    setCurrentMessage(undefined);
  };
  const context: SnackbarContext = useMemo(
    () => ({
      showSnackbar(message, partialOptions = {}) {
        const key = Math.random();
        const options: SnackbarOptions = {
          action: null,
          urgent: false,
          autoHideDuration: SnackbarDuration.SHORT,
          autoHide: true,
          showCloseButton: false,
          snackbarProps: {},
          ...defaultSnackbarOptions,
          ...partialOptions,
        };
        setQueue((prev) => [...prev, { message, options, key }]);
        return () => {
          setQueue((prev) => prev.filter((item) => item.key !== key));
          setRemovedMessage(key);
        };
      },
    }),
    [defaultSnackbarOptions]
  );

  useEffect(() => {
    if (
      removedMessage &&
      currentMessage &&
      removedMessage === currentMessage.key
    ) {
      setRemovedMessage(undefined);
      handleClose();
    } else if (queue[0] && !currentMessage) {
      setCurrentMessage({ ...queue[0] });
      setQueue((prev) => prev.slice(1));
      setOpen(true);
    } else if (queue[0] && queue[0].options.urgent && currentMessage && open) {
      // Close an active snackbar when a new one is added
      setOpen(false);
    }
  }, [queue, currentMessage, open, removedMessage]);

  return (
    <>
      <Snackbar
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...currentMessage?.options.snackbarProps}
        sx={{
          ...currentMessage?.options.snackbarProps.sx,
        }}
        key={currentMessage?.key}
        open={open}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        autoHideDuration={
          currentMessage?.options.autoHide
            ? currentMessage.options.autoHideDuration
            : undefined
        }
        message={currentMessage?.message}
        action={
          <>
            {currentMessage?.options.action}
            {currentMessage?.options.showCloseButton ? (
              <SurfaceIconButton
                aria-label="close"
                sx={{ p: 0.5 }}
                onClick={handleClose}
              >
                &times;
              </SurfaceIconButton>
            ) : null}
          </>
        }
      />
      <SnackbarContext.Provider value={context}>
        {children}
      </SnackbarContext.Provider>
    </>
  );
}
