import { Stack, Typography } from "@mui/material";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { QueueItem } from "./Admin";

export default function Display({
  supabaseClient,
  instanceId,
}: {
  supabaseClient: SupabaseClient;
  instanceId: number;
}) {
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

  return (
    <Stack direction="row" height="100%">
      <Stack direction="column" flexGrow={1} justifyContent="center">
        <Typography variant="h3" textAlign="center">
          Up next
        </Typography>
        <Typography
          variant="h1"
          textAlign="center"
          fontSize="12em !important"
          fontWeight="bold"
        >
          {(listState
            .slice()
            .reverse()
            .find((item) => item.fulfilled)?.serial_num ?? 0) + 1}
        </Typography>
      </Stack>
      <Stack direction="column" flexGrow={1} justifyContent="center">
        <Typography variant="h3" textAlign="center">
          Queue length
        </Typography>
        <Typography
          variant="h1"
          textAlign="center"
          fontSize="12em !important"
          fontWeight="bold"
        >
          {listState.filter((item) => !item.fulfilled).length}
        </Typography>
      </Stack>
    </Stack>
  );
}
