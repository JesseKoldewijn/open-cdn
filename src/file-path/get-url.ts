export const getFileUrl = ({
  proto,
  domain,
  tld,
  filepath,
}: {
  proto: string;
  domain: string;
  tld: string;
  filepath: string;
}) => {
  try {
    return {
      url: new URL(`${proto}://${domain}.${tld}/${filepath}`),
      error: null,
    };
  } catch (error) {
    console.error("Error creating URL:", error);
    return {
      url: null,
      error: "Invalid URL",
    };
  }
};
