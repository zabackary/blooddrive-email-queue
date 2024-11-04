import { Box, Button, Stack } from "@mui/material";
import { SupabaseClient } from "@supabase/supabase-js";

export default function Admin({
  supabaseClient,
  instanceId,
}: {
  supabaseClient: SupabaseClient;
  instanceId: string;
}) {
  const onUnlock = async () => {
    await supabaseClient.functions.invoke("unlock-instance", {
      body: JSON.stringify({ instanceId }),
    });
    alert("Unlocked!");
  };

  return (
    <Box>
      <Stack>
        <Button onClick={onUnlock}>Unlock booth</Button>
      </Stack>
    </Box>
  );
}
