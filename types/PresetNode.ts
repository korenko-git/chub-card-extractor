import { BaseNode } from './BaseNode';

export interface PresetNode extends BaseNode {
  projectSpace: "presets";
  definition: Definition;
}

export interface Definition {
  name: string;
  full_path: string;
  definition: DefinitionConfig;
  creator_name: string;
  is_owner: boolean;
  is_active: boolean;
  project_id: number;
  description: string;
  extensions_full: any;
  extensions: any[];
}

export interface DefinitionConfig {
  config: Config;
}

export interface Config {
  nai_phrase_rep_pen: ConfigOption<string>;
  tts_model: ConfigOption<string>;
  pitch: ConfigOption<number>;
  auto_tts: ConfigOption<boolean>;
  stability: ConfigOption<number>;
  use_speaker_boost: ConfigOption<boolean>;
  immersive_mode: ConfigOption<boolean>;
  nfreq_penalty: ConfigOption<number>;
  api: ConfigOption<string>;
  input_sequence: ConfigOption<string>;
  stop_sequence: ConfigOption<string>;
  include_names: ConfigOption<boolean>;
  generation_settings: GenerationSettings;
  text_streaming: ConfigOption<boolean>;
  use_lorebooks: ConfigOption<boolean>;
  assistant_prefill: ConfigOption<string>;
  prompt_note: {
  depth: ConfigOption<number>;
  note: ConfigOption<string>;
};
  nai_prefix: ConfigOption<string>;
  tts_api: ConfigOption<string>;
  tts_voice: ConfigOption<string>;
  rate: ConfigOption<number>;
  narrate_quotes: ConfigOption<boolean>;
  similarity_boost: ConfigOption<number>;
  use_pygmalion_format: ConfigOption<boolean>;
  nrep_penalty: ConfigOption<number>;
  post_history_instructions: ConfigOption<string>;
  impersonate_prompt: ConfigOption<string>;
  output_sequence: ConfigOption<string>;
  wrap_sequences: ConfigOption<boolean>;
  chat_separator: ConfigOption<string>;
  model: ConfigOption<string>;
  jailbreak_prompt: ConfigOption<string>;
  use_version_two: ConfigOption<boolean>;
  auto_summarization: ConfigOption<boolean>;
  nai_preamble: ConfigOption<string>;
}

export interface ConfigOption<T> {
  value: T;
  inherited_from: any;
}

export interface GenerationSettings {
  frequency_penalty: ConfigOption<number>;
  top_k: ConfigOption<number>;
  legacy_streaming: ConfigOption<boolean>;
  max_new_token: ConfigOption<number>;
  scan_depth: ConfigOption<number>;
  recursive_scanning: ConfigOption<boolean>;
  temperature: ConfigOption<number>;
  repetition_penalty: ConfigOption<number>;
  top_p: ConfigOption<number>;
  top_a: ConfigOption<number>;
  trim_sentences: ConfigOption<boolean>;
  stopping_strings: ConfigOption<string[]>;
  context_length: ConfigOption<number>;
  token_budget: ConfigOption<number>;
  match_whole_words: ConfigOption<boolean>;
  presence_penalty: ConfigOption<number>;
  min_length: ConfigOption<number>;
  min_p: ConfigOption<number>;
  guidance_scale: ConfigOption<number>;
  negative_prompt: ConfigOption<string>;
  temperature_last: ConfigOption<boolean>;
  grammar_string: ConfigOption<string>;
}
