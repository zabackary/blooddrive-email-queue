export const SCRIPT_PROPERTY_VERSION = "version";
const SCRIPT_PROPERTY_UPLOAD_FOLDER = "upload_folder";
const SCRIPT_PROPERTY_EVENT_NAME = "event_name";
const SCRIPT_PROPERTY_CONTACT_NAME = "contact_name";
const SCRIPT_PROPERTY_CONTACT_EMAIL = "contact_email";
const SCRIPT_PROPERTY_PRIVACY_NOTE = "privacy_note";
const SCRIPT_PROPERTY_DOMAIN_WHITELIST = "domain_whitelist";
const SCRIPT_PROPERTY_DOMAIN_BLACKLIST = "domain_blacklist";

export default function loadConfig(
  properties: GoogleAppsScript.Properties.Properties = PropertiesService
    .getScriptProperties(),
) {
  return {
    uploadFolder: properties.getProperty(SCRIPT_PROPERTY_UPLOAD_FOLDER) ??
      String(import.meta.env.VITE_UPLOAD_FOLDER),
    eventName: properties.getProperty(SCRIPT_PROPERTY_EVENT_NAME) ??
      String(import.meta.env.VITE_EVENT_NAME),
    contactName: properties.getProperty(SCRIPT_PROPERTY_CONTACT_NAME) ??
      String(import.meta.env.VITE_CONTACT_NAME),
    contactEmail: properties.getProperty(SCRIPT_PROPERTY_CONTACT_EMAIL) ??
      String(import.meta.env.VITE_CONTACT_EMAIL),
    privacyNote: properties.getProperty(SCRIPT_PROPERTY_PRIVACY_NOTE) ??
      String(import.meta.env.VITE_PRIVACY_NOTE),
    domainWhitelist: JSON.parse(
      properties.getProperty(SCRIPT_PROPERTY_DOMAIN_WHITELIST) ??
        String(import.meta.env.VITE_DOMAIN_WHITELIST),
    ),
    domainBlacklist: JSON.parse(
      properties.getProperty(SCRIPT_PROPERTY_DOMAIN_BLACKLIST) ??
        String(import.meta.env.VITE_DOMAIN_BLACKLIST),
    ),
  };
}
