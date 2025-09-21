import { BaseNode, ProjectSpaceMap } from "@/types/BaseNode";
import { makeRequest } from "./api";
import { normalizeNodeName, processPresetData } from "@/utils/preset";
import { fetchWithCorsHandling } from "@/utils/cors";

export interface CardFile {
  name: string;
  content: string | null;
  image: { name: string; content: Blob } | null;
}

export async function fetchCardFile(node: ProjectSpaceMap[keyof ProjectSpaceMap]): Promise<CardFile> {
  let fileName = '';
  switch(node.projectSpace) {
    case 'characters':
      fileName = 'card.json';
      break;
    case 'lorebooks':
      fileName = 'raw/sillytavern_raw.json';
      break;
    case 'presets':
      const preset = processPresetData(node);
      if (preset) {
        return { name: normalizeNodeName(node?.name || 'preset'), content: preset, image: null };
      }
      break;
  }

  const jsonContent = await fetchJsonFileContent(node.id, fileName);
  const image = await fetchImageFileContent(node);
  return { name: fileName.replace("raw/", ""), content: jsonContent, image };
}

async function fetchJsonFileContent(projectId: number, fileName: string, branch = 'main'): Promise<string | null> {
  const apiUrl = `v4/projects/${projectId}/repository/files/${encodeURI(fileName).replaceAll("/", "%252F")}/raw?ref=${branch}&response_type=blob`;
  const response = await makeRequest(apiUrl);
  if (!response || response.status !== 200) return null;
  return await response.text();
}

async function fetchImageFileContent(node: BaseNode): Promise<{name: string, content: Blob} | null> {
  const imageUrl = node.max_res_url.trim();
  try {
    const imageResponse = await fetchWithCorsHandling(imageUrl);
    if (imageResponse && imageResponse.status === 200) {
      const imageBlob = await imageResponse.blob();
      const imageExt = /\.(png|jpg|jpeg|webp)$/i.exec(imageUrl)?.[1] || 'png';
      return { name: `${normalizeNodeName(node.name)}_image.${imageExt}`, content: imageBlob };
    }
  } catch (err) {
    console.error("Error fetching card image:", err);
  }
  return null;
}
