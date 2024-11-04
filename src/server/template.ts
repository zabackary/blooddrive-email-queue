export default function template(
  template: string,
  substitutions: Record<string, string>,
) {
  for (const [key, value] of Object.entries(substitutions)) {
    const escapedKey = key.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
    const regexp = new RegExp(`{{\\s*${escapedKey}\\s*}}`, "ig");
    template = template.replace(regexp, value);
  }
  return template;
}
