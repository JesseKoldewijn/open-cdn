import { buildExampleUrl } from "../utils/url/example-url";

const HomePage = async () => {
  const refUrl = new URL("https://jereko.dev");

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Open-CDN</h1>
      <div className="flex flex-col items-center justify-center gap-10 px-4 pt-4">
        <strong className="text-xl font-bold">Example usage</strong>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col gap-2 text-sm">
            <strong>Direct Query</strong>
            <code className="bg-foreground/20 w-screen max-w-[90svw] overflow-x-scroll rounded-md p-2 text-sm text-nowrap md:max-w-lg">
              {`<img src='${buildExampleUrl(refUrl, "direct-query")}' />`}
            </code>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <strong>Indirect Query</strong>
            <code className="bg-foreground/20 w-screen max-w-[90svw] overflow-x-scroll rounded-md p-2 text-sm text-nowrap md:max-w-lg">
              {`<img src='${buildExampleUrl(refUrl, "indirect")}' />`}
            </code>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-10 px-4 pt-4">
        <strong className="text-xl font-bold">Example routes</strong>
        <div className="flex w-full flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col gap-2 text-sm">
            <strong>Direct Query</strong>
            <code className="bg-foreground/20 w-screen max-w-[90svw] overflow-x-scroll rounded-md p-2 text-sm md:max-w-lg">
              {buildExampleUrl(refUrl, "direct-query", {
                showQueryKeys: true,
              })}
            </code>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <strong>Indirect Query</strong>
            <code className="bg-foreground/20 w-screen max-w-[90svw] overflow-x-scroll rounded-md p-2 text-sm md:max-w-lg">
              {buildExampleUrl(refUrl, "indirect", {
                showQueryKeys: true,
              })}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
