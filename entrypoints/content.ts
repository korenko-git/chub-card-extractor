import { fetchMetadata } from "@/core/metadata";
import { fetchCardFile } from "@/core/cardFile";
import { createAndDownloadZip } from "@/core/zip";
import { delay } from "@/utils/format";

export default defineContentScript({
  registration: "runtime",
  matches: [],

  async main() {
    const metadata = await fetchMetadata(window.location.pathname);
    if (!metadata) return;

    // main
    let main = await fetchCardFile(metadata.node);
    if (!main.content) return;

    // nodes
    let nodes = await Promise.all(
      Object.values(metadata.nodes).map(async (node) => {
        let file = await fetchCardFile(node);
        if (!file.content) {
          console.log("Error - ", node.id);
          return null;
        }
        await delay(100);
        return file;
      })
    );
    nodes = nodes.filter((n) => n !== null);

    // create and download zip
    createAndDownloadZip(metadata, main, nodes);

    return "Extraction complete";
  },
});
