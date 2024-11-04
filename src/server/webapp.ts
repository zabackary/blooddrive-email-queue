import loadConfig, { SCRIPT_PROPERTY_VERSION } from "./config";
import template from "./template";

export function doGet(event: GoogleAppsScript.Events.DoGet) {
  return HtmlService.createHtmlOutputFromFile("index.html")
    .setTitle("photo-booth-v2-web")
    .addMetaTag(
      "viewport",
      "width=device-width, initial-scale=1, shrink-to-fit=no",
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

const EMAIL_REGEX =
  /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+)@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;

function errorResponse(msg: string) {
  return {
    status: "error",
    message: msg,
  };
}

/**
 * formats a date to "yyyy-mm-dd hhmmss"
 * @param date the date to format
 * @returns a string, formatted
 */
function formatDate(date: Date) {
  return (
    String(date.getFullYear()).padStart(4, "0") +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    " " +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0")
  );
}

const SUPPORTED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpeg",
  "image/pjpeg": "jpeg",
  "image/gif": "gif",
  "image/x-ms-bmp": "bmp",
  "image/x-bitmap": "bmp",
  "image/x-win-bitmap": "bmp",
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/webp": "webp",
};

const MAX_EMAILS = 8;

export function upload(payload: any) {
  const scriptProperties = PropertiesService.getScriptProperties();
  if (scriptProperties.getProperty(SCRIPT_PROPERTY_VERSION) !== APP_VERSION) {
    return errorResponse(
      `version ${APP_VERSION} has been deprecated and no longer functions`,
    );
  }
  const config = loadConfig(scriptProperties);

  // payload type validation
  if (!Object.hasOwn(payload, "recipients")) {
    return errorResponse("payload is missing recipients field");
  }
  if (!Array.isArray(payload.recipients)) {
    return errorResponse("recipients field is not an array");
  }
  if ([...payload.recipients].some((x) => typeof x !== "string")) {
    return errorResponse("recipients field contains non-string values");
  }
  let recipients: string[] = [...payload.recipients].map((recipient: any) =>
    String(recipient)
  );
  if (recipients.length > MAX_EMAILS) {
    return errorResponse("too many recipients");
  }
  if (!Object.hasOwn(payload, "image")) {
    return errorResponse("payload is missing image field");
  }
  if (typeof payload.image !== "string") {
    return errorResponse("image field is not a string");
  }
  if (!Object.hasOwn(payload, "imageMime")) {
    return errorResponse("payload is missing imageMime field");
  }
  if (typeof payload.imageMime !== "string") {
    return errorResponse("imageMime field is not a string");
  }
  if (!Object.hasOwn(SUPPORTED_IMAGE_TYPES, payload.imageMime)) {
    return errorResponse(`${payload.imageMime} is not a supported mime type`);
  }
  let image: GoogleAppsScript.Base.Blob;
  const processedDate = new Date();
  const baseFilename = formatDate(processedDate);
  const filenameExtension = SUPPORTED_IMAGE_TYPES[payload.imageMime as string];
  const filename = `${baseFilename}.${filenameExtension}`;
  const metadataFilename = `${baseFilename}-metadata.txt`;
  try {
    const parsed = Utilities.base64Decode(payload.image);
    image = Utilities.newBlob(parsed)
      .setContentType(payload.imageMime)
      .setName(filename);
  } catch (e) {
    return errorResponse(`failed to decode image from data uri: ${String(e)}`);
  }

  // upload the photos to Google Drive
  const folderId = config.uploadFolder;
  let fileId: string | null = null;
  if (folderId) {
    console.log("uploading photo to folder");
    console.log("file name is", filename);

    try {
      const folder = DriveApp.getFolderById(folderId);
      const file = folder.createFile(image);
      fileId = file.getId();
      folder.createFile(metadataFilename, recipients.join("\n"), "text/plain");
    } catch (e) {
      console.error("failed to open drive folder or upload files; skipping", e);
    }
  } else {
    console.warn("can't read folder ID so didn't upload photo to folder");
  }

  // Validate the email addresses to make sure they belong to the configured domain white/blacklists
  const failedEmails: [string, any][] = [];
  recipients = recipients.filter((recipient) => {
    const matches = EMAIL_REGEX.exec(recipient);
    if (!matches) {
      failedEmails.push([recipient, "not an email"]);
      return false;
    }
    const domain = matches[2];
    for (const whitelistedDomain of config.domainWhitelist) {
      if (domain === whitelistedDomain || whitelistedDomain === "*") {
        return true;
      }
    }
    for (const blacklistedDomain of config.domainBlacklist) {
      if (domain === blacklistedDomain || blacklistedDomain === "*") {
        failedEmails.push([recipient, "email domain blacklisted"]);
        return false;
      }
    }
    return true;
  });

  // validate ability to send mail
  const quota = MailApp.getRemainingDailyQuota();
  console.info("remaining mail quota is", quota);
  if (quota < recipients.length) {
    return errorResponse("remaining mail send quota is insufficient");
  }

  // send the mail!
  image.setName(`photo_strip.${filenameExtension}`); // switch the name of the image to be more user-friendly
  console.log("sending mail to recipients", recipients);
  for (const recipient of recipients) {
    const emailName = `${import.meta.env.CLIENT_EVENT_NAME} Photo Booth`;
    const emailSubject =
      `Your recent photos at the ${import.meta.env.CLIENT_EVENT_NAME} (${
        processedDate.getMonth() + 1
      }/${processedDate.getDate()} ${processedDate.getHours()}:${processedDate.getMinutes()})`;
    const emailContent = template(EMAIL_TEMPLATE, {
      version: APP_VERSION,
      recipient,
      event_name: config.eventName,
      contact_name: config.contactName,
      contact_email: config.contactEmail,
      date: processedDate.toLocaleDateString("en-US"),
      subject: emailSubject,
      privacy_note: config.privacyNote,
      time: processedDate.toLocaleString("en-US"),
    });
    try {
      MailApp.sendEmail({
        name: emailName,
        body:
          "Download your recent photos. Your photos are attached. To view this email in its entirety, please update your email client and make sure it supports HTML emails.",
        htmlBody: emailContent,
        attachments: [image],
        inlineImages: {
          preview: image,
        },
        replyTo: import.meta.env.VITE_CONTACT_EMAIL,
        subject: emailSubject,
        to: recipient,
      });
    } catch (e) {
      console.error("failed to send to", recipient, e);
      failedEmails.push([recipient, e]);
    }
  }
  if (failedEmails.length > 0) {
    return {
      status: "partial",
      failedAddresses: failedEmails.map((email) => email[0]),
      fileId,
    };
  }
  return {
    status: "success",
    fileId,
  };
}
