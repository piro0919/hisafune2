import { createClient } from "microcms-js-sdk";

function getClient(): ReturnType<typeof createClient> {
  if (
    typeof process.env.MICRO_CMS_API_KEY !== "string" ||
    typeof process.env.MICRO_CMS_SERVICE_DOMAIN !== "string"
  ) {
    throw Error;
  }

  const client = createClient({
    apiKey: process.env.MICRO_CMS_API_KEY,
    serviceDomain: process.env.MICRO_CMS_SERVICE_DOMAIN,
  });

  return client;
}

export default getClient;
