import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Slide,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { setLanguage } from "../translations";

interface TakeModel {
  id: string;
  created_at: string;
  raw_urls: string[];
  instance: string;
}

interface AppConfig {
  id: string;
  created_at: string;
  name: string;
  paid_information: string;
  paid_information_alt: string;
  contact_name: string;
  contact_email: string;
  paid_is_unlocked: boolean | null;
  templates: {
    id: string;
    name: string;
  }[];
}

interface AppState {
  editingQueue: TakeModel[];
  currentEdit?: TakeModel;
  config?: AppConfig;
}

type AppPage = "pick-from-queue" | "edit-take";

export default function UserEditor({
  supabaseClient,
  config,
}: {
  supabaseClient: SupabaseClient;
  config: AppConfig;
}) {
  const [appState, setAppState] = useState<AppState>(() => ({
    editingQueue: [],
    currentEdit: undefined,
    config: undefined,
  }));
  const [page, setPage] = useState<AppPage>("pick-from-queue");
  const [editTakeStep, setEditTakeStep] = useState(0);
  const [templateId, setTemplateId] = useState("");
  const [step3Emails, setStep3Emails] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const config = (
        await supabaseClient.functions.invoke("instance-data", {
          body: {
            id: import.meta.env.CLIENT_INSTANCE_ID ?? "",
          },
        })
      ).data;
      setAppState((appState) => ({
        ...appState,
        config,
      }));
    })();
    supabaseClient
      .channel("take", {
        config: {
          private: false,
        },
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "take" },
        (payload) => {
          console.log(payload);
          setAppState((appState) => {
            if (payload.new.instance !== appState.config?.id) appState;
            return {
              ...appState,
              editingQueue: [
                ...appState.editingQueue,
                payload.new as TakeModel,
              ],
            };
          });
        }
      )
      .subscribe();
  }, [supabaseClient]);

  return !appState.config ? (
    "Loading..."
  ) : page === "pick-from-queue" ? (
    <Stack alignItems={"center"} justifyContent={"center"} height={"100%"}>
      <Typography variant="h3">Let's start editing.</Typography>
      <Stack direction="row">
        {appState.editingQueue.map((take, i) => (
          <Card sx={{ maxWidth: 345 }} key={take.id}>
            <CardMedia
              sx={{ height: 140 }}
              image={`${
                import.meta.env.CLIENT_SUPABASE_URL
              }/functions/v1/drive-proxy?q=${take.raw_urls[0]}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {take.created_at}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={() => {
                  setLanguage("en-US");
                  setPage("edit-take");
                  setEditTakeStep(0);
                  setTemplateId("");
                  setStep3Emails([]);
                  setAppState((appState) => ({
                    ...appState,
                    currentEdit: take,
                  }));
                }}
              >
                Start editing
              </Button>
              <Button
                onClick={() => {
                  setLanguage("ja");
                  setPage("edit-take");
                  setEditTakeStep(0);
                  setTemplateId("");
                  setStep3Emails([]);
                  setAppState((appState) => ({
                    ...appState,
                    currentEdit: take,
                  }));
                }}
              >
                スタート
              </Button>
            </CardActions>
          </Card>
        ))}
        {appState.editingQueue.length === 0 ? (
          <Typography variant="h5">Nothing to edit right now.</Typography>
        ) : null}
      </Stack>
    </Stack>
  ) : (
    <Stack alignItems={"center"} justifyContent={"center"} height={"100%"}>
      <Stepper
        activeStep={editTakeStep}
        sx={{ width: "100%", margin: 4 }}
        alternativeLabel
      >
        <Step>
          <StepLabel>Choose a template</StepLabel>
        </Step>
        <Step>
          <StepLabel>Edit your photo</StepLabel>
        </Step>
        <Step>
          <StepLabel>Email and print</StepLabel>
        </Step>
      </Stepper>
      <TransitionGroup style={{ flexGrow: 1 }}>
        <Slide>
          <Box sx={{ flexGrow: 1, height: "100%" }}>
            {
              {
                0: (
                  <Stack sx={{ height: "100%", flexGrow: 1 }}>
                    <Typography gutterBottom variant="h4" textAlign={"center"}>
                      Pick a frame
                    </Typography>
                    <Stack direction="row">
                      {config.templates.map((template) => (
                        <ButtonBase
                          key={template.id}
                          onClick={() => {
                            setEditTakeStep(1);
                            setTemplateId(template.id);
                          }}
                        >
                          <Box
                            component="img"
                            src={`${
                              import.meta.env.CLIENT_SUPABASE_URL
                            }/functions/v1/render-take?takeId=${
                              appState.currentEdit!.id
                            }&templateId=${template.id}`}
                            sx={{
                              maxHeight: 500,
                              maxWidth: 500,
                            }}
                            draggable={false}
                          />
                        </ButtonBase>
                      ))}
                    </Stack>
                  </Stack>
                ),
                1: (
                  <Stack sx={{ height: "100%", flexGrow: 1 }}>
                    <Typography gutterBottom variant="h4" textAlign={"center"}>
                      Change filters or add stickers
                    </Typography>
                    <Typography>I might put something here later</Typography>
                    <Button
                      onClick={() => {
                        setEditTakeStep(2);
                      }}
                    >
                      Move on
                    </Button>
                  </Stack>
                ),
                2: (
                  <Stack sx={{ height: "100%", flexGrow: 1 }}>
                    <Typography gutterBottom variant="h4" textAlign={"center"}>
                      Digital downloads and printing
                    </Typography>
                    <Box sx={{ maxWidth: 540, flexGrow: 1 }}>
                      <Typography textAlign={"center"} gutterBottom>
                        Digital downloads are offered for free. If you'd like to
                        download a digital copy of your photos, please add your
                        email.
                      </Typography>
                      <Stack gap={2}>
                        {step3Emails.map((email, i) => (
                          <TextField
                            variant="outlined"
                            label={`Email ${i + 1}`}
                            value={email}
                            placeholder="example@example.com"
                            onChange={(e) => {
                              // TODO: enforce 8 email limit
                              setStep3Emails((old) =>
                                Object.assign([], {
                                  ...old,
                                  [i]: e.target.value,
                                })
                              );
                            }}
                            key={i}
                          />
                        ))}
                      </Stack>
                      <Button
                        variant="tonal"
                        sx={{ marginX: "auto", display: "block", marginTop: 2 }}
                        onClick={() => {
                          setStep3Emails((old) => [...old, ""]);
                        }}
                      >
                        Add email
                      </Button>
                    </Box>
                    <Box sx={{ textAlign: "center", padding: 4 }}>
                      <Button
                        variant="filled"
                        sx={{
                          paddingX: 4,
                          paddingY: 2,
                          fontSize: 32,
                          borderRadius: 8,
                        }}
                        onClick={() => {
                          (async () => {
                            const res = await fetch(
                              `${
                                import.meta.env.CLIENT_SUPABASE_URL
                              }/functions/v1/render-take?takeId=${
                                appState.currentEdit!.id
                              }&templateId=${templateId}`
                            );
                            const renderedBlob = await res.blob();
                            const reader = new FileReader();
                            reader.readAsDataURL(renderedBlob);
                            reader.onloadend = function () {
                              let rendered = reader.result?.toString();
                              rendered = rendered?.replace(
                                "data:image/png;base64,",
                                ""
                              );
                              google.script.run
                                .withSuccessHandler(async ({ fileId }) => {
                                  const { error } = await supabaseClient
                                    .from("take")
                                    .update({
                                      template: templateId,
                                      processed_url: `https://drive.google.com/uc?q=${fileId}`,
                                    })
                                    .eq("id", appState.currentEdit!.id)
                                    .single();
                                  await supabaseClient.functions.invoke(
                                    "add-print-queue",
                                    {
                                      body: JSON.stringify({
                                        takeId: appState.currentEdit!.id,
                                      }),
                                    }
                                  );
                                  setAppState((appState) => {
                                    return {
                                      ...appState,
                                      currentEdit: undefined,
                                      editingQueue:
                                        appState.editingQueue.filter(
                                          (item) =>
                                            item.id !== appState.currentEdit!.id
                                        ),
                                    };
                                  });
                                })
                                .withFailureHandler((err) => {
                                  alert(`something went wrong\n${err}`);
                                }).upload!({
                                recipients: step3Emails,
                                image: rendered,
                                imageMime: res.headers.get("Content-Type"),
                              });
                            };
                          })();
                        }}
                      >
                        {step3Emails.length > 0 ? "Print and email" : "Print"}
                      </Button>
                    </Box>
                  </Stack>
                ),
              }[editTakeStep]
            }
          </Box>
        </Slide>
      </TransitionGroup>
    </Stack>
  );
}
