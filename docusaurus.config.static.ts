import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

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
                    position: "right",
                },
                {
                    href: "https://github.com/zyf722/max-notes",
                    position: "right",
                    className: "header-github-link",
                    "aria-label": "GitHub Repository",
                },
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
            copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/zyf722">zyf722</a>. 由 <a href="https://docusaurus.io/">Docusaurus</a> 驱动构建。<br>本网站所有页面中内容按 <a href="http://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-ND 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nd.svg"></a> 许可证授权。`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ["json"],
        },
        algolia: {
            // The application ID provided by Algolia
            appId: "DKL0IDMS5I",

            // Public API key: it is safe to commit it
            apiKey: "dfe33e65dfa9b65d4b133df9888be1ef",

            indexName: "zyf722io",

            // Optional: see doc section below
            contextualSearch: true,

            // // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
            // externalUrlRegex: "external\\.com|domain\\.com",

            // // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
            // replaceSearchResultPathname: {
            //     from: "/docs/", // or as RegExp: /\/docs\//
            //     to: "/",
            // },

            // // Optional: Algolia search parameters
            // searchParameters: {},

            // Optional: path for search page that enabled by default (`false` to disable it)
            searchPagePath: "search",

            //... other Algolia params
        },

        mermaid: {
            theme: {
                light: "neutral",
                dark: "neutral",
            },
        },

        zoom: {
            selector: ".markdown img.zoomable",
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

    themes: ["@docusaurus/theme-mermaid"],
    markdown: {
        mermaid: true,
    },
};

export default config;
