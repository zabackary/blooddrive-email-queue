export function doGet(event: GoogleAppsScript.Events.DoGet) {
  return HtmlService.createHtmlOutputFromFile("index.html")
    .setTitle("photo-booth-v2-web")
    .addMetaTag(
      "viewport",
      "width=device-width, initial-scale=1, shrink-to-fit=no",
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

export function doPost(_event: GoogleAppsScript.Events.DoPost) {
  throw new Error("photo-booth-v2-web does not support HTTP POST.");
}
