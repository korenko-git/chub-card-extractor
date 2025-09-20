import { BaseNode } from "@/types/BaseNode";
import { extractAuthor, extractFullUrl } from "./path";
import { formatDate } from "./format";

export function generateReadmeFromNode(node: BaseNode): string {
  const forked = node.labels.find(label => label.title === 'Forked')

  return `
    <h1>${node.name}</h1>
    <p>${node.tagline}</p>
    <p><b>Source:</b> <a href="${extractFullUrl(node.fullPath)}">${node.fullPath}</a></p>
    ${forked ? `<p><b>Forked:</b> <a href="${extractFullUrl(forked.description)}">${forked.description}</a></p>` : ''}
    <p><b>Author:</b> ${extractAuthor(node.fullPath)}</p>
    <p><b>Project:</b> ${node.projectSpace}</p>
    <p><b>Last Updated:</b> ${formatDate(node.lastActivityAt)}</p>
    <p><b>Tags:</b> ${node.topics.join(', ')}</p>
    <p><b>Total Tokens:</b> ${node.nTokens}</p>
    <p><b>Favorites:</b> ${node.n_favorites}</p>
    <p><b>Downloads:</b> ${node.starCount}</p>
    <p><b>Description:</b> ${node.description}</p>
  `;
}