import staticConfig from "./docusaurus.config.static";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkLiveCodes from "remark-livecodes";
import remarkEmbedder from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import remarkTypstTs from "./mdx/typst-ts/remark";
import rehypeTypstTs from "./mdx/typst-ts/rehype";
import { AlphaTabWebPackPlugin } from "@coderline/alphatab/webpack";
import type { Config as RemarkEmbedderConfig } from "@remark-embedder/transformer-oembed";
import { ProxyAgent, setGlobalDispatcher } from "undici";

const dispatcher = new ProxyAgent("http://127.0.0.1:3081");
setGlobalDispatcher(dispatcher);

const oembedConfig: RemarkEmbedderConfig = ({ url, provider }) => {
    // See https://oembed.com/providers.json
    if (provider.provider_name === "YouTube") {
        return {
            params: { maxheight: 500 },
        };
    }
};

const config: Config = {
    ...staticConfig,
    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    routeBasePath: "/",
                    remarkPlugins: [
                        remarkMath,
                        remarkTypstTs,
                        [
                            remarkLiveCodes,
                            {
                                config: { appLanguage: "zh-CN" },
                                height: "500px",
                            },
                        ],
                        [
                            remarkEmbedder,
                            {
                                transformers: [
                                    [oembedTransformer, oembedConfig],
                                ],
                            },
                        ],
                    ],
                    rehypePlugins: [rehypeKatex, rehypeTypstTs],
                    admonitions: {
                        keywords: [
                            "details",
                            "quote",
                            "example",
                            "quiz",
                            "ref",
                        ],
                        extendDefaults: true,
                    },
                    showLastUpdateTime: true,
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    plugins: [
        "docusaurus-plugin-image-zoom",
        () => ({
            name: "docusaurus-alphatab",
            injectHtmlTags() {
                return {};
            },
            configureWebpack(config) {
                return {
                    plugins: [
                        new AlphaTabWebPackPlugin({
                            assetOutputDir: config.output.path,
                        }),
                    ],
                    resolve: {
                        fallback: {
                            fs: false,
                            buffer: false,
                            path: false,
                            os: false,
                            util: false,
                            assert: false,
                            stream: false,
                            crypto: false,
                            constants: false,
                            child_process: false,
                            module: false,
                        },
                    },
                };
            },
        }),
    ],
};

export default config;
