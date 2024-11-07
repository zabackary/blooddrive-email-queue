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
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";

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
  const markFulfilled = (id: string) => {
    supabaseClient
      .from("queue_item")
      .update({
        fulfilled: true,
        fulfilled_at: new Date().toJSON(),
      })
      .eq("id", id)
      .single()
      .then(() => {});
  };
  const deleteItem = (id: string) => {
    supabaseClient
      .from("queue_item")
      .delete()
      .eq("id", id)
      .single()
      .then(() => {});
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

  return (
    <>
      <Box>
        <Stack gap={2} margin={2}>
          <Box textAlign={"center"} position={"sticky"} top={0}>
            <Button
              onClick={() => {
                setAddDialogOpen(true);
                setAddDialogAddress("");
              }}
            >
              Add email address to queue manually
            </Button>
          </Box>
          <Divider />
          <List>
            <TransitionGroup>
              {listState.map((item) => (
                <Collapse key={item.id}>
                  <ListItem sx={{ opacity: item.fulfilled ? 0.5 : 1 }}>
                    <ListItemAvatar>
                      <Avatar>{item.serial_num}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.email}
                      secondary={`fulfilled: ${
                        item.fulfilled ? "✅" : "❌"
                      } - called: ${item.called ? "✅" : "❌"} - japanese: ${
                        item.japanese ? "✅" : "❌"
                      }`}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        onClick={() => deleteItem(item.id)}
                        variant="text"
                      >
                        Delete
                      </Button>
                      <Button
                        disabled={item.fulfilled}
                        onClick={() => markFulfilled(item.id)}
                        variant="outlined"
                      >
                        Mark as fulfilled
                      </Button>
                      <Button
                        onClick={() => callItem(item.id)}
                        disabled={item.called || callPending}
                        variant="filled"
                      >
                        Call
                      </Button>
                    </ListItemSecondaryAction>
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
          />
          <Box>
            <Checkbox
              value={addDialogJapanese}
              onChange={(e) => setAddDialogJapanese(e.target.checked)}
            />{" "}
            Japanese
          </Box>
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
