import { headers } from "next/headers";

import { buildExampleUrl } from "../utils/url/example-url";

const HomePage = async () => {
  const headersList = await headers();

  const referer = headersList.get("referer") ?? "http://localhost:3000";
  const refUrl = new URL(referer);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Open-CDN</h1>
      <div className="flex flex-col items-center justify-center gap-10 border-t px-4 pt-4">
        <strong className="text-xl font-bold">Example routes</strong>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col gap-2 text-sm">
            <strong>Direct Query</strong>
            <code className="bg-foreground/20 inline w-full max-w-sm overflow-x-scroll rounded-md p-2 text-sm text-nowrap md:max-w-lg">
              {buildExampleUrl(refUrl, "direct-query")}
            </code>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <strong>Indirect Query</strong>
            <code className="bg-foreground/20 inline w-full max-w-sm overflow-x-scroll rounded-md p-2 text-sm text-nowrap md:max-w-lg">
              {buildExampleUrl(refUrl, "indirect")}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
