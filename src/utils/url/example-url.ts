export const buildExampleUrl = (
  refUrl: URL,
  variant: "direct-query" | "indirect",
  { showQueryKeys } = { showQueryKeys: false },
) => {
  const baseUrl = `${refUrl.protocol}//${refUrl.host}`;
  const path =
    variant === "direct-query"
      ? "direct-query"
      : "[protocol]/[hostname]/[tld]/[...filePath]";
  const query = variant === "direct-query" ? "?dq-url=[some-image-url]" : "";

  if (showQueryKeys) return `${baseUrl}/${path}${query}`;

  const refExampleUrl = new URL(
    "https://jereko.dev/favicons/android-chrome-192x192.png",
  );

  const filledPath = path
    .replace("[protocol]", refExampleUrl.protocol.replace(":", ""))
    .replace("[hostname]", refExampleUrl.hostname.split(".").at(0)!)
    .replace("[tld]", refExampleUrl.hostname.split(".").slice(-1)[0])
    .replace("[...filePath]", refExampleUrl.pathname.replace(/^\//, ""));

  const filledQuery = query
    .replace("[some-image-url]", refExampleUrl.href)
    .replace("[...filePath]", refUrl.pathname.replace(/^\//, ""));

  return `${baseUrl}/${filledPath}${filledQuery}`;
};
