import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import useSnackbar from "../useSnackbar";

export interface QueueItem {
  email: string;
  fulfilled: boolean;
  called: boolean;
  instance: number;
  serial_num: number;
  id: string;
  japanese: boolean;
}

export default function Admin({
  supabaseClient,
  instanceId,
}: {
  supabaseClient: SupabaseClient;
  instanceId: number;
}) {
  const [addDialogAddress, setAddDialogAddress] = useState("");
  const [addDialogJapanese, setAddDialogJapanese] = useState(false);
  const [addDialogLoading, setAddDialogLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [callPending, setCallPending] = useState(false);
  const onAddConfirm = async () => {
    setAddDialogLoading(true);
    const { data, error } = await supabaseClient.functions.invoke("add-queue", {
      body: JSON.stringify({
        email: addDialogAddress,
        instanceId,
        japanese: addDialogJapanese,
      }),
    });
    if (error) {
      alert("Failed to add address.");
    }
    snackbar.showSnackbar(`Added to the queue: #${data.serial_num}`, {
      snackbarProps: {
        TransitionComponent: Slide,
        anchorOrigin: {
          horizontal: "center",
          vertical: "bottom",
        },
      },
    });
    setAddDialogLoading(false);
    setAddDialogOpen(false);
  };
  const [listState, setListState] = useState<QueueItem[]>([]);
  useEffect(() => {
    supabaseClient
      .from("queue_item")
      .select("*")
      .eq("instance", instanceId)
      .order("serial_num")
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }
        setListState(data);
      });
    supabaseClient
      .channel("queue_item")
      .on(
        //@ts-ignore
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "queue_item",
        },
        (event: any) => {
          setListState((old) => [...old, event.new]);
        }
      )
      .on(
        //@ts-ignore
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "queue_item",
        },
        (event: any) => {
          console.log(event);
          setListState((old) => {
            const ne = JSON.parse(JSON.stringify(old));
            ne[ne.findIndex((item: any) => item.id === event.new.id)] =
              event.new;
            return ne;
          });
        }
      )
      .on(
        //@ts-ignore
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "queue_item",
        },
        (event: any) => {
          console.log(event);

          setListState((state) =>
            state.filter((item) => item.id !== event.old.id)
          );
        }
      )
      .subscribe();
  }, []);
  const snackbar = useSnackbar();
  const markFulfilled = (id: string) => {
    supabaseClient
      .from("queue_item")
      .update({
        fulfilled: true,
        fulfilled_at: new Date().toJSON(),
      })
      .eq("id", id)
      .single()
      .then(() => {
        snackbar.showSnackbar("Queue item marked as fulfilled.");
      });
  };
  const deleteItem = (id: string) => {
    supabaseClient
      .from("queue_item")
      .delete()
      .eq("id", id)
      .single()
      .then(() => {
        snackbar.showSnackbar("Queue item deleted. This cannot be undone.");
      });
  };
  const callItem = (id: string) => {
    const realItem = listState.find((state) => state.id === id)!;
    setCallPending(true);
    google.script.run
      .withSuccessHandler(() => {
        supabaseClient
          .from("queue_item")
          .update({
            called: true,
          })
          .eq("id", id)
          .single()
          .then(() => {
            setCallPending(false);
          });
      })
      .withFailureHandler(() => {
        alert("failed to call person");
        setCallPending(false);
      }).sendMail!(realItem.email, realItem.japanese);
  };
  const textFieldInputRef = useRef<HTMLInputElement | null>(null);
  const theme = useTheme();

  return (
    <>
      <Box padding={2} display="flex" justifyContent="center">
        <Stack gap={2} maxWidth={960} width="100%">
          <Box
            textAlign={"center"}
            position={"sticky"}
            top={0}
            padding={2}
            borderBottom={`1px solid ${theme.palette.divider}`}
            zIndex={9}
            bgcolor={`${theme.palette.background.default}80`}
          >
            <Box mb={1}>
              <Button
                onClick={() => {
                  setAddDialogOpen(true);
                  setAddDialogJapanese(false);
                  setAddDialogAddress("");
                  setTimeout(() => textFieldInputRef.current?.focus());
                }}
                variant="filled"
              >
                Add address manually
              </Button>{" "}
              <Button
                onClick={() => {
                  setAddDialogOpen(true);
                  setAddDialogJapanese(true);
                  setAddDialogAddress("");
                  setTimeout(() => textFieldInputRef.current?.focus());
                }}
                variant="tonal"
              >
                Add address manually (Japanese)
              </Button>
            </Box>
            <Box>
              Up next:{" "}
              {(listState
                .slice()
                .reverse()
                .find((item) => item.fulfilled)?.serial_num ?? 0) + 1}{" "}
              &middot; Queue length:{" "}
              {listState.filter((item) => !item.fulfilled).length}
            </Box>
          </Box>
          <List>
            <TransitionGroup>
              {listState.map((item) => (
                <Collapse key={item.id}>
                  <ListItem
                    sx={{ opacity: item.fulfilled ? 0.5 : 1, flexWrap: "wrap" }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: item.fulfilled
                            ? theme.palette.surfaceContainerHighest.main
                            : item.called
                            ? theme.palette.warning.main
                            : theme.palette.primary.main,
                          color: item.fulfilled
                            ? theme.palette.surfaceContainerHighest.contrastText
                            : item.called
                            ? theme.palette.warning.contrastText
                            : theme.palette.primary.contrastText,
                        }}
                      >
                        {item.serial_num}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.email}
                      secondary={`fulfilled: ${
                        item.fulfilled ? "✅" : "❌"
                      } - called: ${item.called ? "✅" : "❌"} - japanese: ${
                        item.japanese ? "✅" : "❌"
                      }`}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={() => deleteItem(item.id)}
                        variant="text"
                        color="error"
                      >
                        Delete
                      </Button>{" "}
                      <Button
                        disabled={item.fulfilled}
                        onClick={() => markFulfilled(item.id)}
                        variant="outlined"
                      >
                        Mark as fulfilled
                      </Button>{" "}
                      <Button
                        onClick={() => callItem(item.id)}
                        disabled={item.called || callPending}
                        variant="filled"
                      >
                        Call
                      </Button>
                    </Stack>
                  </ListItem>
                </Collapse>
              ))}
            </TransitionGroup>
          </List>
        </Stack>
      </Box>
      <Dialog
        open={addDialogOpen}
        onClose={() => !addDialogLoading && setAddDialogOpen(false)}
      >
        <DialogTitle>Add address</DialogTitle>
        <DialogContent>
          <TextField
            label="New email"
            placeholder="example@example.com"
            disabled={addDialogLoading}
            value={addDialogAddress}
            onChange={(e) => setAddDialogAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAddConfirm();
            }}
            sx={{ width: "100%" }}
            margin="normal"
            inputRef={textFieldInputRef}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={addDialogJapanese}
                onChange={(e) => setAddDialogJapanese(e.target.checked)}
              />
            }
            label="Localize emails in Japanese"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => !addDialogLoading && setAddDialogOpen(false)}
            disabled={addDialogLoading}
          >
            Cancel
          </Button>
          <Button
            variant="tonal"
            onClick={() => !addDialogLoading && onAddConfirm()}
            disabled={addDialogLoading}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
