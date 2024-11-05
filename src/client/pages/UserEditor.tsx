import {
  Box,
  Button,
  ButtonBase,
  Card,
  CircularProgress,
  Collapse,
  Fade,
  Slide,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { setLanguage, t } from "../translations";

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
    editingQueue: [
      {
        id: "c4bf6d0f-a81f-4fb1-bdcd-a41d5c123ab9",
        created_at: "2024-11-04 06:30:57.667543+00",
        raw_urls: [
          "https://drive.google.com/uc?id=1cbgpAlxihgS3ZO5bOkV-nhJuwkeSU07k",
          "https://drive.google.com/uc?id=1ORtNI027eH8tkKyhRUX7KzX08KK7i8b5",
          "https://drive.google.com/uc?id=1HlqyYsaJVA70TKkiYi6xBm29Uk6pw76-",
          "https://drive.google.com/uc?id=1Sr-f4l3_MqtJ5J80v3PrCBJ8pQXCcWuF",
        ],
        instance: "259908fa-7e43-4cad-a047-ef1c5971a139",
      },
    ],
    currentEdit: undefined,
    config: undefined,
  }));
  const [page, setPage] = useState<AppPage>("pick-from-queue");
  const [editTakeStep, setEditTakeStep] = useState(0);
  const [templateId, setTemplateId] = useState("");
  const [step3Emails, setStep3Emails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
  const theme = useTheme();
  const [loadedImages, setLoadedImages] = useState(0);
  const incrementLoad = () => {
    console.log("load");
    setLoadedImages((old) => old + 1);
  };
  useEffect(() => {
    if (appState.config && loadedImages >= appState.config!.templates.length) {
      setLoading(false);
      setLoadedImages(0);
    }
  }, [loadedImages]);
  const startEdit = (lang: string, take: TakeModel) => {
    setLanguage(lang as any);
    setLoadedImages(0);
    setPage("edit-take");
    setEditTakeStep(0);
    setTemplateId("");
    setStep3Emails([]);
    setLoading(true);
    setAppState((appState) => ({
      ...appState,
      currentEdit: take,
    }));
  };

  return !appState.config ? (
    "Loading..."
  ) : page === "pick-from-queue" ? (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      height={"100%"}
      gap={2}
    >
      <Typography variant="h3">Let's start editing.</Typography>
      <Stack direction="row">
        {appState.editingQueue.map((take, i) => (
          <Card variant="filled" key={take.id}>
            <Stack direction={"row"}>
              <Box
                component={"img"}
                src={`${
                  import.meta.env.CLIENT_SUPABASE_URL
                }/functions/v1/drive-proxy?q=${take.raw_urls[0]}`}
                sx={{ objectFit: "cover", width: 300, height: 200 }}
              />
              <Stack padding={1} width={260}>
                <Stack flexGrow={1} justifyContent={"center"} padding={1}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Your photos.
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{ opacity: 0.7 }}
                  >
                    あなたの写真。
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    {new Date(take.created_at).toLocaleDateString()}{" "}
                    {new Date(take.created_at).toLocaleTimeString()}
                  </Typography>
                </Stack>
                <Stack direction={"row"} alignItems="flex-end">
                  <Button
                    onClick={() => {
                      startEdit("en-US", take);
                    }}
                  >
                    Start editing
                  </Button>
                  <Button
                    onClick={() => {
                      startEdit("ja", take);
                    }}
                  >
                    スタート
                  </Button>
                </Stack>
              </Stack>
            </Stack>
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
        sx={{
          width: "100%",
          padding: 4,
          zIndex: 999,
          backgroundColor: theme.palette.background.default,
        }}
        alternativeLabel
      >
        <Step>
          <StepLabel>{t("templateChooseLabel")}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t("mailPrintLabel")}</StepLabel>
        </Step>
      </Stepper>
      <TransitionGroup
        style={{ flexGrow: 1, position: "relative", width: "100%" }}
      >
        <Slide key={editTakeStep} direction="down" timeout={500}>
          <Box
            sx={{
              flexGrow: 1,
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
            }}
          >
            {
              {
                0: (
                  <Stack sx={{ height: "100%", flexGrow: 1 }}>
                    <Typography gutterBottom variant="h4" textAlign={"center"}>
                      {t("templateChoose")}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems={"center"}
                      justifyContent={"center"}
                      flexGrow={1}
                    >
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
                            onLoad={() => {
                              incrementLoad();
                            }}
                            onError={() => {
                              incrementLoad();
                            }}
                          />
                        </ButtonBase>
                      ))}
                    </Stack>
                  </Stack>
                ),
                1: (
                  <Stack
                    sx={{ height: "100%", flexGrow: 1 }}
                    alignItems={"center"}
                  >
                    <Typography gutterBottom variant="h4" textAlign={"center"}>
                      {t("mailPrint")}
                    </Typography>
                    <Box sx={{ maxWidth: 540, flexGrow: 1 }}>
                      <Typography textAlign={"center"} gutterBottom>
                        {t("freeDownloads")}
                      </Typography>
                      <TransitionGroup
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {step3Emails.map((email, i) => (
                          <Collapse in key={i}>
                            <TextField
                              variant="outlined"
                              label={`Email ${i + 1}`}
                              value={email}
                              placeholder="example@example.com"
                              sx={{ marginBottom: 1, width: "100%" }}
                              onChange={(e) => {
                                setStep3Emails((old) =>
                                  Object.assign([], {
                                    ...old,
                                    [i]: e.target.value,
                                  })
                                );
                              }}
                              key={i}
                            />
                          </Collapse>
                        ))}
                      </TransitionGroup>
                      <Stack
                        direction={"row"}
                        sx={{ justifyContent: "center", marginTop: 2, gap: 1 }}
                      >
                        <Button
                          variant="tonal"
                          onClick={() => {
                            setStep3Emails((old) => [...old, ""]);
                          }}
                          disabled={step3Emails.length >= 8}
                        >
                          {t("addEmail")}
                        </Button>
                        <Collapse
                          orientation="horizontal"
                          in={step3Emails.length > 0}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setStep3Emails((old) => old.slice(0, -1));
                            }}
                          >
                            <Box component={"span"} sx={{ textWrap: "nowrap" }}>
                              {t("removeEmail")}
                            </Box>
                          </Button>
                        </Collapse>
                      </Stack>
                    </Box>
                    <Box sx={{ textAlign: "center", padding: 4 }}>
                      <Button
                        variant="filled"
                        sx={{
                          paddingX: 4,
                          paddingY: 2,
                          fontSize: 32,
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                        onClick={() => {
                          setLoading(true);
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
                              const handleSuccess = async ({
                                fileId,
                              }: {
                                fileId: string;
                              }) => {
                                const { error } = await supabaseClient
                                  .from("take")
                                  .update({
                                    template: templateId,
                                    processed_url: `https://drive.google.com/uc?id=${fileId}`,
                                  })
                                  .eq("id", appState.currentEdit!.id)
                                  .single();
                                const currentEditId = appState.currentEdit!.id;
                                await supabaseClient.functions.invoke(
                                  "add-print-queue",
                                  {
                                    body: JSON.stringify({
                                      takeId: appState.currentEdit!.id,
                                    }),
                                  }
                                );
                                setLoading(false);
                                setPage("pick-from-queue");
                                setAppState((appState) => {
                                  return {
                                    ...appState,
                                    currentEdit: undefined,
                                    editingQueue: appState.editingQueue.filter(
                                      (item) => item.id !== currentEditId
                                    ),
                                  };
                                });
                              };
                              handleSuccess({ fileId: "" });
                              /*
                              google.script.run
                                .withSuccessHandler(handleSuccess)
                                .withFailureHandler((err) => {
                                  alert(`something went wrong\n${err}`);
                                }).upload!({
                                recipients: step3Emails,
                                image: rendered,
                                imageMime: res.headers.get("Content-Type"),
                              });
                              */
                            };
                          })();
                        }}
                      >
                        <TransitionGroup
                          style={{
                            display: "grid",
                            gridTemplateAreas: '"a"',
                          }}
                        >
                          <Collapse
                            sx={{ gridArea: "a" }}
                            key={(step3Emails.length > 0).toString()}
                            timeout={1000}
                            orientation="horizontal"
                          >
                            <Box sx={{ whiteSpace: "nowrap" }}>
                              {step3Emails.length > 0
                                ? t("printEmailAction")
                                : t("printAction")}
                            </Box>
                          </Collapse>
                        </TransitionGroup>
                      </Button>
                    </Box>
                  </Stack>
                ),
              }[editTakeStep]
            }
          </Box>
        </Slide>
      </TransitionGroup>
      <Fade in={loading}>
        <Stack
          sx={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="h3">{t("loading")}</Typography>
          <CircularProgress size={52} />
        </Stack>
      </Fade>
    </Stack>
  );
}
