import { BaseNode, EmbeddedLorebook } from './BaseNode';

export interface LorebookNode extends BaseNode {
  projectSpace: "lorebooks";
  definition: Definition;
}

export interface Definition {
  id: number;
  is_public: boolean;
  full_path: string;
  avatar: string;
  project_name: string;
  nsfw_image: boolean;
  name: string;
  description: string;
  example_dialogs: string;
  first_message: string;
  personality: string;
  scenario: string;
  system_prompt: string;
  post_history_instructions: string;
  tavern_personality: string;
  alternate_greetings: any[];
  embedded_lorebook: EmbeddedLorebook;
  extensions: any;
  bound_preset: any;
  is_owner: boolean;
  voice_id: any;
  voice: any;
}


export interface Nodes {
  [key: string]: LorebookNodeItem;
}

export interface LorebookNodeItem extends BaseNode {
  definition: Definition;
}
