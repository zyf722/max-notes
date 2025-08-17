import * as alphaTab from "@coderline/alphatab";
import staticConfig from "@site/docusaurus.config.static";

export default {
    setAlphaTabDefaults(settings: alphaTab.Settings) {
        settings.core.fontDirectory = `${staticConfig.baseUrl}font/`;
        settings.player.soundFont = `${staticConfig.baseUrl}soundfont/sonivox.sf3`;
        settings.player.scrollMode = alphaTab.ScrollMode.Off;
        settings.player.playerMode = alphaTab.PlayerMode.Disabled;

        if (typeof window !== "undefined") {
            const params = new URL(window.location.href).searchParams;
            settings.fillFromJson({
                core: {
                    logLevel: (params.get("loglevel") ??
                        "info") as keyof typeof alphaTab.LogLevel,
                },
            });
        }
    },
};
