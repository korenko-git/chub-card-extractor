import JSZip from "jszip";
import { CardFile } from "./cardFile";
import { CardMetadata, ProjectSpaceMap } from "@/types/BaseNode";
import { extractName } from "@/utils/path";
import { generateReadmeFromNode } from "@/utils/readme";

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
    zip.file(main.image.name, main.image.content);
  }

  const nodesFolder = zip.folder("nodes");
  nodes.forEach(node => {
    if (node) {
      nodesFolder?.file(node.name, node.content || '');
      if (node.image) nodesFolder?.file(node.image.name, node.image.content);
    }
  });

  const name = extractName(metadata.node.fullPath) || "archive";
  const blob = await zip.generateAsync({type: "blob"});
  //const blobUrl = URL.createObjectURL(blob);

  browser.runtime.sendMessage({
    action: 'downloadFile',
    blob: blob,
    filename: `${name}.zip`
  });

  console.log("Card extraction complete, download initiated");
}
