import {
  Box,
  Button,
  ButtonBase,
  Card,
  CircularProgress,
  Collapse,
  Fade,
  IconButton,
  Menu,
  MenuItem,
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
import { useEffect, useRef, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { setLanguage, t } from "../translations";

function last20Mins() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - 20);
  return d;
}

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
  const [showMenu, setShowMenu] = useState(false);
  const [menuData, setMenuData] = useState<TakeModel[]>([]);
  const menuRef = useRef<any>(null);

  return !appState.config ? (
    "Loading..."
  ) : page === "pick-from-queue" ? (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      height={"100%"}
      gap={2}
    >
      <Typography
        variant="h3"
        sx={
          appState.editingQueue.length === 0
            ? {
                position: "fixed",
                background: "#0008",
                backdropFilter: "blur(12px)",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: 9999,
                paddingY: 2,
                paddingX: 4,
              }
            : {}
        }
      >
        {appState.editingQueue.length === 0
          ? "There's nothing to edit right now."
          : "Let's start editing."}
      </Typography>
      <Box
        sx={
          appState.editingQueue.length === 0
            ? {
                position: "fixed",
                background: "#0003",
                backdropFilter: "blur(12px)",
                top: 120,
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: 4,
                paddingY: 2,
                paddingX: 4,
              }
            : {}
        }
      >
        <Typography variant="h2">HS StuCo Photo Booth</Typography>
      </Box>
      <IconButton
        sx={{
          position: "fixed",
          zIndex: 99999999,
          top: 8,
          left: 8,
          backgroundColor: "#0007",
          backdropFilter: "blur(8px)",
          width: 48,
          height: 48,
        }}
        onClick={() => {
          setShowMenu(true);
          supabaseClient
            .from("take")
            .select("*")
            .eq("instance", config.id)
            .gt("created_at", last20Mins().toISOString())
            .then(({ error, data }) => {
              if (error) throw error;
              setMenuData(data);
            });
        }}
        ref={menuRef}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
        </svg>
      </IconButton>
      <Menu
        open={showMenu}
        anchorEl={menuRef.current}
        onClose={() => setShowMenu(false)}
      >
        <Typography>Load from API</Typography>
        {menuData.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              startEdit("en-US", item);
            }}
          >
            {item.created_at}
          </MenuItem>
        ))}
      </Menu>
      <Stack direction="row" width="100%">
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
          <Box
            component="iframe"
            src="https://www.youtube.com/embed/3GN819C9ov8?autoplay=1&cc_load_policy=1&loop=1&rel=0&fs=0&disablekb=1&controls=0&color=white"
            allow="autoplay"
            sx={{ width: "100%", aspectRatio: "16 / 9", border: "none" }}
          />
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
