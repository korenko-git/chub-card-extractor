import { CardMetadata, ProjectSpaceMap } from "@/types/BaseNode";
import { makeRequest } from "./api";

export async function fetchMetadata(pathname: string): Promise<CardMetadata<keyof ProjectSpaceMap> | null> {
  const urlParts = pathname.split('/');
  const projectSpace = urlParts[1] as keyof ProjectSpaceMap;
  const username = urlParts[2];
  const cardId = urlParts[3];

  const gatewayUrl = `${projectSpace}/${username}/${cardId}?full=true&nocache=${Math.random()}`;
  const metadataResponse = await makeRequest(gatewayUrl);
  if (!metadataResponse || metadataResponse.status !== 200) {
    return null;
  }

  const metadata = (await metadataResponse.json()) as CardMetadata<typeof projectSpace>;
  if (!metadata?.node?.id) {
    console.error("No project ID found in metadata");
    return null;
  }
  return metadata;
}
