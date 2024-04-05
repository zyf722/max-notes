import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
    title: "Max's Notes",
    tagline: "互联网角落里的一粒尘埃",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://zyf722.github.io",

    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/max-notes/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "zyf722", // Usually your GitHub org/user name.
    projectName: "max-notes", // Usually your repo name.
    trailingSlash: false, // Remove trailing slash

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "zh-Hans",
        locales: ["zh-Hans"],
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    routeBasePath: "/",
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                    admonitions: {
                        keywords: ["details", "quote", "example", "quiz"],
                        extendDefaults: true,
                    },
                    showLastUpdateTime: true
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        navbar: {
            title: "Max's Notes",
            logo: {
                alt: "Site Logo",
                src: "img/logo.png",
            },
            items: [
                {
                    href: "https://zyf722.github.io",
                    label: "Blog",
                    position: "right"
                },
                {
                    href: "https://github.com/zyf722/max-notes",
                    position: "right",
                    className: "header-github-link",
                    "aria-label": "GitHub Repository",
                }
            ],
        },
        docs: {
            sidebar: {
                hideable: true,
            },
        },
        footer: {
            style: "dark",
            links: [],
            copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/zyf722">zyf722</a>. 由 Docusaurus 驱动构建。<br>本网站所有页面中内容按 <a href="http://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-ND 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nd.svg"></a> 许可证授权。`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,

    stylesheets: [
        {
            href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
            type: "text/css",
            integrity:
                "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
            crossorigin: "anonymous",
        },
    ],
};

export default config;
