import staticConfig from "@site/docusaurus.config.static";

export default {
    fontDirectory: `${staticConfig.baseUrl}font/`,
    soundFontDirectory: `${staticConfig.baseUrl}soundfont/`,
} as const;
