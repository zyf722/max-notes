import process from "process";
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
import type { RuleSetRule } from "webpack";

if (!process.env.CI) {
    const dispatcher = new ProxyAgent("http://127.0.0.1:3081");
    setGlobalDispatcher(dispatcher);
}

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
        "docusaurus-plugin-sass",
        "docusaurus-plugin-image-zoom",
        () => ({
            name: "docusaurus-alphatab",
            injectHtmlTags() {
                return {};
            },
            configureWebpack(config, isServer, options) {
                const matchRule = (r: RuleSetRule) => {
                    if (typeof r === "object") {
                        if (r.test instanceof RegExp) {
                            return !!r.test.exec("custom.sass");
                        } else if (typeof r.test === "undefined") {
                            return true;
                        } else {
                            // unsupported
                            return false;
                        }
                    } else {
                        return false;
                    }
                };

                let sassRule = config.module!.rules!.find(matchRule);

                if (typeof sassRule !== "object") {
                    throw new Error("Could not find SASS rule");
                }

                if (sassRule!.oneOf) {
                    sassRule = sassRule!.oneOf.find(matchRule);
                }

                if (typeof sassRule !== "object") {
                    throw new Error("Could not find inner SASS rule");
                }

                if (!Array.isArray(sassRule!.use)) {
                    throw new Error("Need SASS rule with use[]");
                }

                const sassLoaderIndex = sassRule!.use.findIndex(
                    (l) =>
                        typeof l === "object" &&
                        l!.loader?.includes("sass-loader")
                );
                if (sassLoaderIndex === -1) {
                    throw new Error("Could not find sass-loader in rule");
                }

                // ensure source-map before resolve-url-loader
                const sassLoader = sassRule!.use[
                    sassLoaderIndex
                ] as RuleSetRule;
                sassLoader.options = {
                    ...((sassLoader.options as object | undefined) ?? {}),
                    sourceMap: true, // force sourcemaps
                };

                // insert resolve-url-loader before SASS loader to fix relative URLs
                sassRule!.use.splice(sassLoaderIndex, 0, {
                    loader: "resolve-url-loader",
                });

                return {
                    plugins: [
                        // Copy the Font and SoundFont Files to the output
                        new AlphaTabWebPackPlugin({
                            assetOutputDir: config.output!.path,
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
