import { NextResponse } from "next/server";

import { returnImageResponseFromContext } from "../../../image/image-response-logic";
import { supportedFileTypesRegexPattern } from "../../../image/supported-file-types";
import { DateTimeConverter } from "../../../utils/date-time/converts";

export const GET = async (req: Request) => {
  const url = req.url;
  const pathname = new URL(url).pathname;

  let params = pathname.split("/").slice(1);
  const isDirectQuery = params[0] === "direct-query";

  if (isDirectQuery) {
    const searchParams = new URL(req.url).searchParams;
    const remoteUrl = searchParams.get("dq-url");
    if (!remoteUrl) {
      return NextResponse.json({
        error: "Invalid URL parameters",
        details: {
          remoteUrl,
        },
      });
    }
    const url = new URL(remoteUrl);
    const proto = url.protocol.replace(":", "");
    const domain = url.hostname.split(".").slice(0, -1).join(".");
    const tld = url.hostname.split(".").at(-1);
    const filepath = url.pathname;
    const fileType = filepath.match(new RegExp(supportedFileTypesRegexPattern));

    if (!proto || !domain || !tld || !filepath || !fileType) {
      return NextResponse.json({
        error: "Invalid URL parameters",
        details: {
          proto,
          domain,
          tld,
          filepath,
          fileType,
        },
      });
    }

    params[0] = proto;
    params[1] = domain;
    params[2] = tld;
    params[3] = filepath;
  }

  const proto = params[0];
  const domain = params[1];
  const tld = params[2];
  // filepath is any after tld
  const filepath = params.slice(3).join("/");
  const fileType = filepath.match(new RegExp(supportedFileTypesRegexPattern));

  if (!proto || !domain || !tld || !filepath || !fileType) {
    return NextResponse.json({
      error: "Invalid URL parameters",
      details: {
        proto,
        domain,
        tld,
        filepath,
        fileType,
      },
    });
  }

  const response = await returnImageResponseFromContext(
    {
      req: {
        param: () => ({
          proto,
          domain,
          tld,
          filepath,
        }),
        query: () => {
          const searchParams = new URL(req.url).searchParams;
          const params: Record<string, string> = {};
          for (const [key, value] of searchParams.entries()) {
            params[key] = value;
          }
          return params;
        },
      },
      json: (data: any) => {
        return NextResponse.json(data);
      },
    } as any,
    {
      isDirectQuery,
    },
  );

  response.headers.set(
    "Cache-Control",
    `public, max-age=${DateTimeConverter.convertToMilliseconds(
      "days",
      7,
    )}, immutable`,
  );
  response.headers.set("Vary", "Accept-Encoding");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "*");
  response.headers.set("Access-Control-Allow-Headers", "*");

  return response;
};
