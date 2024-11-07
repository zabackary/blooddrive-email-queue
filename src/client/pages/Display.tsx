import { Box, Stack, Typography, useTheme } from "@mui/material";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { QueueItem } from "./Admin";

export default function Display({
  supabaseClient,
  instanceId,
  displayCode,
}: {
  supabaseClient: SupabaseClient;
  instanceId: number;
  displayCode?: boolean;
}) {
  const [listState, setListState] = useState<QueueItem[]>([]);
  useEffect(() => {
    supabaseClient
      .from("queue_item")
      .select("*")
      .eq("instance", instanceId)
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
  const theme = useTheme();

  return (
    <Stack direction="row" height="100%">
      <Stack
        direction="column"
        flexBasis={displayCode ? "33%" : "50%"}
        justifyContent="center"
      >
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
        <Typography variant="h3" textAlign="center">
          お呼び出し番号
        </Typography>
      </Stack>
      <Stack
        direction="column"
        flexBasis={displayCode ? "33%" : "50%"}
        justifyContent="center"
      >
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
        <Typography variant="h3" textAlign="center">
          列の人数
        </Typography>
      </Stack>
      {displayCode && (
        <Stack
          direction="column"
          flexBasis={displayCode ? "33%" : "50%"}
          justifyContent="center"
          borderLeft={`1px solid ${theme.palette.divider}`}
          padding={3}
          gap={2}
        >
          <Typography variant="h4" textAlign="center">
            Scan the QR code to join the queue
          </Typography>
          <Box
            component={"img"}
            src="https://quickchart.io/qr?size=800x800&text=https://caj.ac.jp/queue.html"
            width="100%"
            borderRadius={8}
          />
          <Typography variant="h5" textAlign="center">
            列に入るには、二次元コードをスキャンしてください。
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
