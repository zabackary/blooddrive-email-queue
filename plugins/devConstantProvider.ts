/* eslint-disable import/no-extraneous-dependencies */
import { PluginOption } from "vite";

// Extracted so backend can use too
export function injectHTMLConstants(
  source: string,
  key: string,
  object: Record<string, any>
) {
  // Attempt to inject after closing </title> tag
  let result = source.replace(
    "</title>",
    `</title>
<script type="module">
window[${JSON.stringify(key)}] = ${JSON.stringify(object)};
</script>
`
  );
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const element = object[key];
      result = result.replaceAll(`{{!CONFIG-${key}!}}`, element);
    }
  }
  return result;
}

/**
 * Injects some constants on `window`.
 */
export default function devConstantProvider(
  key: string,
  object: any
): PluginOption {
  return {
    name: "dev-constant-provider",
    transformIndexHtml(source) {
      return injectHTMLConstants(source, key, object);
    },
    enforce: "post",
    apply: "serve",
  };
}
