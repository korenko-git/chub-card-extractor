import JSZip from "jszip";
import { CardFile } from "./cardFile";
import { CardMetadata, ProjectSpaceMap } from "@/types/BaseNode";
import { extractName } from "@/utils/path";
import { generateReadmeFromNode } from "@/utils/readme";
import { downloadFile } from "@/utils/download";

export async function createAndDownloadZip(
  metadata: CardMetadata<keyof ProjectSpaceMap>,
  main: CardFile,
  nodes: (CardFile|null)[]
) {
  const zip = new JSZip();

  zip.file("metadata.json", JSON.stringify(metadata, null, 2));
  zip.file("readme.html", generateReadmeFromNode(metadata.node));
  zip.file(main.name, main.content || '');
  if (main.image) {
    // Convert Blob to ArrayBuffer for JSZip
    const imageArrayBuffer = await main.image.content.arrayBuffer();
    zip.file(main.image.name, imageArrayBuffer);
  }

  const nodesFolder = zip.folder("nodes");
  for (const node of nodes) {
    if (node) {
      nodesFolder?.file(node.name, node.content || '');
      if (node.image) {
        // Convert Blob to ArrayBuffer for JSZip
        const imageArrayBuffer = await node.image.content.arrayBuffer();
        nodesFolder?.file(node.image.name, imageArrayBuffer);
      }
    }
  }

  const name = extractName(metadata.node.fullPath) || "archive";
  const blob = await zip.generateAsync({type: "blob"});

  await downloadFile(blob, `${name}.zip`);

  console.log("Card extraction complete, download initiated");
}
