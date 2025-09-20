import { CharacterNode } from "./CharacterNode";
import { LorebookNode } from "./LorebookNode";
import { PresetNode } from "./PresetNode";

export type ProjectSpaceMap = {
  characters: CharacterNode;
  lorebooks: LorebookNode;
  presets: PresetNode;
};

export interface CardMetadata<T extends keyof ProjectSpaceMap> {
  errors: any;
  node: ProjectSpaceMap[T];
  nodes: Record<string, ProjectSpaceMap[T]>;
  permissions: string;
  is_favorite: boolean;
}

export interface BaseNode {
  id: number;
  name: string;
  fullPath: string;
  description: string;
  starCount: number;
  lastActivityAt: string;
  createdAt: string;
  labels: Label[];
  topics: string[];
  forksCount: number;
  rating: number;
  ratingCount: number;
  projectSpace: string;
  creatorId: any;
  nTokens: number;
  tagline: string;
  primaryFormat: string;
  related_characters: number[];
  related_lorebooks: number[];
  related_prompts: number[];
  related_extensions: number[];
  hasGallery: boolean;
  nChats: number;
  nMessages: number;
  permissions: string;
  is_public: boolean;
  is_favorite: boolean;
  nsfw_image: boolean;
  n_public_chats: number;
  n_favorites: number;
  is_unlisted: boolean;
  avatar_url: string;
  max_res_url: string;
  bound_preset: any;
  project_uuid: any;
  voice_id: any;
  verified: boolean;
  recommended: boolean;
  ratings_disabled: boolean;
  lang_id: number;
  badges: any[];
}

export interface Label {
  title: string;
  description: string;
}

export interface EmbeddedLorebook {
  name: string;
  entries: Entry[];
  extensions: any;
  scan_depth: number;
  description: string;
  token_budget: number;
  recursive_scanning: boolean;
}

export interface Entry {
  id: number;
  keys: string[];
  name: string;
  comment: string;
  content: string;
  enabled: boolean;
  constant: boolean;
  position: string;
  priority: number;
  selective: boolean;
  extensions: Extensions;
  probability: number;
  case_sensitive: boolean;
  secondary_keys: string[];
  selectiveLogic: number;
  insertion_order: number;
}

export interface Extensions {
  depth: number;
  linked?: boolean;
  weight: number;
  addMemo: boolean;
  embedded?: boolean;
  probability: number;
  displayIndex: number;
  selectiveLogic: number;
  useProbability: boolean;
  characterFilter: any;
  excludeRecursion: boolean;
}
