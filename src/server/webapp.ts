import loadConfig, { SCRIPT_PROPERTY_VERSION } from "./config";
import template from "./template";

export function doGet(event: GoogleAppsScript.Events.DoGet) {
  return HtmlService.createHtmlOutputFromFile("index.html")
    .setTitle("email-queue")
    .addMetaTag(
      "viewport",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function errorResponse(msg: string) {
  return {
    status: "error",
    message: msg,
  };
}

export function sendMail(recipient: string, japanese: boolean) {
  const scriptProperties = PropertiesService.getScriptProperties();
  if (scriptProperties.getProperty(SCRIPT_PROPERTY_VERSION) !== APP_VERSION) {
    return errorResponse(
      `version ${APP_VERSION} has been deprecated and no longer functions`
    );
  }
  const config = loadConfig(scriptProperties);

  // send the mail!
  console.log("sending mail to", recipient);
  const emailName = japanese
    ? "高校生徒会のFall Festival献血運動"
    : `HS StuCo Fall Festival Blood Drive`;
  const emailSubject = japanese
    ? "献血のお呼び出しのご案内"
    : `Your turn is coming up!`;
  const emailContent = template(EMAIL_TEMPLATE, {
    version: APP_VERSION,
    greeting: japanese ? "こんにちは！" : "Hi there!",
    msg: japanese
      ? "献血の待合室の席が空きましたので、MPRにお越しください。"
      : "Your turn for the blood drive is coming up soon. Please proceed to the MPR.",
    thanks: japanese ? "" : "Thank you!",
    recipient,
    event_name: config.eventName,
    contact_name: config.contactName,
    contact_email: config.contactEmail,
    subject: emailSubject,
  });
  try {
    MailApp.sendEmail({
      name: emailName,
      body: japanese
        ? "献血の待合室の席が空きましたので、MPRにお越しください。"
        : "Your turn for the blood drive is coming up soon. Please proceed to the MPR.",
      htmlBody: emailContent,
      replyTo: import.meta.env.CLIENT_CONTACT_EMAIL,
      subject: emailSubject,
      to: recipient,
    });
  } catch (e) {
    console.error("failed to send");
    return {
      status: "error",
      message: String(e),
    };
  }
  return {
    status: "success",
  };
}
