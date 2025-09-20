import { BaseNode, EmbeddedLorebook } from './BaseNode';

export interface CharacterNode extends BaseNode {
  projectSpace: "characters";
  related_lorebooks: number[];
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
  alternate_greetings: string[];
  embedded_lorebook: EmbeddedLorebook;
  extensions: any;
  bound_preset: any;
  is_owner: boolean;
  voice_id: any;
  voice: any;
}
