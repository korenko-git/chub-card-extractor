import { PresetNode } from "@/types/PresetNode";

/**
 * Processes preset data from node
 * @param {PresetNode} node - Node containing preset configuration
 * @returns {string|null} JSON string of processed preset data
 */
export const processPresetData = (node: PresetNode): string | null  => {
  if (!node?.definition?.definition?.config) return null;

  const presetConfig = node.definition.definition.config;
  const presetData = {
    temperature: presetConfig.generation_settings?.temperature?.value ?? 1,
    frequency_penalty: presetConfig.generation_settings?.frequency_penalty?.value ?? 0.7,
    presence_penalty: presetConfig.generation_settings?.presence_penalty?.value ?? 0.7,
    top_p: presetConfig.generation_settings?.top_p?.value ?? 1,
    top_k: presetConfig.generation_settings?.top_k?.value ?? 0,
    top_a: presetConfig.generation_settings?.top_a?.value ?? 0,
    min_p: presetConfig.generation_settings?.min_p?.value ?? 0.05,
    repetition_penalty: presetConfig.generation_settings?.repetition_penalty?.value ?? 1.15,
    names_in_completion: presetConfig.include_names?.value ?? false,
    main_prompt: presetConfig.jailbreak_prompt?.value,
    impersonation_prompt: presetConfig.impersonate_prompt?.value,
    assistant_prefill: presetConfig.assistant_prefill?.value,
    jailbreak_prompt: presetConfig.post_history_instructions?.value
  };

  return JSON.stringify(presetData, null, 2);
}

export const normalizeNodeName = (name: string): string => {
  return name.replace(/[<>:"/\\|?*]/g, "_");
}