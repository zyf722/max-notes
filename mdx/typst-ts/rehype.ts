import type { Plugin, Transformer } from "unified";
import type { Nodes, ElementContent, Element, Root } from "hast";
import { toText } from "hast-util-to-text";
import { SKIP, visitParents } from "unist-util-visit-parents";
import { fromHtml } from "hast-util-from-html";
import { VFile } from "vfile";
import {
    NodeCompiler,
    CompileArgs,
} from "@myriaddreamin/typst-ts-node-compiler";

interface RehypeTypstOptions {
    compileArgs?: CompileArgs;
    errorColor: string;
    shared: {
        lang: string;
        className: {
            typstInline: string;
        };
        meta: {
            remark: string;
            rehype: string;
        };
    };
}

const defaultOptions: RehypeTypstOptions = {
    compileArgs: undefined,
    errorColor: "#cc0000",
    shared: {
        lang: "typst",
        className: {
            typstInline: "typst-inline",
        },
        meta: {
            remark: "remark-typst-ts",
            rehype: "rehype-typst-ts",
        },
    },
};

interface DisplayModeOptions {
    autoSetPage: boolean;
}

interface RenderResult {
    svg: string;
    baselinePosition: number | undefined;
}

const plugin: Plugin<[Readonly<RehypeTypstOptions>?]> = (
    options?: RehypeTypstOptions
): Transformer => {
    const settings = options || defaultOptions;

    const compiler = NodeCompiler.create(settings.compileArgs);

    const renderToSVGString = (
        code: string,
        displayMode: boolean,
        displayModeOptions: DisplayModeOptions
    ): RenderResult => {
        const inlineTypstTemplate = `
#set page(height: auto, width: auto, margin: 0pt)

#let s = state("t", (:))

#let pin(t) = context {
  let width = measure(line(length: here().position().y)).width
  s.update(it => it.insert(t, width) + it)
}

#show math.equation: it => {
  box(it, inset: (top: 0.5em, bottom: 0.5em))
}

$pin("l1")${code}$

#context [
  #metadata(s.final().at("l1")) <label>
]
`;

        const autoSetPageCode =
            "#set page(height: auto, width: auto, margin: 0pt);\n";
        const displayTypstTemplate = `${
            displayModeOptions.autoSetPage ? autoSetPageCode : ""
        }${code}`;

        const mainFileContent = displayMode
            ? displayTypstTemplate
            : inlineTypstTemplate;
        const docRes = compiler.compile({ mainFileContent });
        if (!docRes.result) {
            const diags = compiler.fetchDiagnostics(docRes.takeDiagnostics());
            console.error(diags);
            throw new Error(JSON.stringify(diags, null, 2));
        }
        const doc = docRes.result;

        const svg = compiler.svg(doc);
        const res: RenderResult = {
            svg,
            baselinePosition: undefined,
        };
        if (!displayMode) {
            const query = compiler.query(doc, { selector: "<label>" });
            // parse baselinePosition from query ignore last 2 chars
            res.baselinePosition = parseFloat(query[0].value.slice(0, -2));
        }

        compiler.evictCache(10);
        return res;
    };

    const transformer = async (ast: Nodes, file: VFile) => {
        const matches = [];
        visitParents(ast, "element", (element, parents) => {
            matches.push({ element, parents });
        });
        const visitor = async (
            element: Element,
            parents: (Root | Element)[]
        ) => {
            const classes = Array.isArray(element.properties.className)
                ? element.properties.className
                : [];

            // This class can be generated from markdown with ` ```typst `.
            const languageTypst = classes.includes(
                `language-${settings.shared.lang}`
            );
            // This class is for text math (inline, ` `^math^` `).
            const inlineTypst = classes.includes(
                settings.shared.className.typstInline
            );

            // Any class is fine.
            if (!languageTypst && !inlineTypst) {
                return;
            }

            let displayMode = false;
            const displayModeOptions: DisplayModeOptions = {
                autoSetPage: true,
            };
            let parent = parents[parents.length - 1];
            let scope = element;

            // If this was generated with ` ```typst `, replace the `<pre>` and use
            // display.
            if (
                element.tagName === "code" &&
                languageTypst &&
                parent &&
                parent.type === "element" &&
                parent.tagName === "pre"
            ) {
                scope = parent;
                parent = parents[parents.length - 2];
                displayMode = true;

                const metastring = element.properties.metastring as string;
                if (metastring) {
                    const meta = metastring.split(" ");
                    for (const option of meta) {
                        if (option in displayModeOptions) {
                            displayModeOptions[option] = true;
                        } else if (option === `no-${option}`) {
                            displayModeOptions[option.slice(3)] = false;
                        }
                    }
                }
            }

            /* c8 ignore next -- verbose to test. */
            if (!parent) return;

            const value = toText(scope, { whitespace: "pre" });

            const index = parent.children.indexOf(scope);

            try {
                const result = await renderToSVGString(
                    value,
                    displayMode,
                    displayModeOptions
                );
                const root = fromHtml(result.svg, {
                    fragment: true,
                });
                const svg = root.children[0] as Element;
                const defaultEm = 11;
                const height = parseFloat(
                    svg.properties["dataHeight"] as string
                );
                const width = parseFloat(svg.properties["dataWidth"] as string);
                const shift = height - result.baselinePosition;
                const shiftEm = shift / defaultEm;
                svg.properties.style = `vertical-align: -${shiftEm}em; max-width: 100%; max-height: 100%`;
                svg.properties.height = `${height / defaultEm}em`;
                svg.properties.width = `${width / defaultEm}em`;
                if (!svg.properties.classNames) svg.properties.classNames = [];
                if (displayMode) {
                    svg.properties.style += "; display: block; margin: 0 auto;";
                } else {
                    (svg.properties.classNames as string[]).push(
                        "typst-inline"
                    );
                }
                const children: ElementContent[] =
                    root.children as ElementContent[];
                parent.children.splice(index, 1, ...children);
            } catch (error) {
                const cause: Error = error;
                file.message("Could not render math with typst", {
                    ancestors: [...parents, element],
                    cause,
                    place: element.position,
                    source: settings.shared.meta.rehype,
                });

                console.log(cause.message);

                parent.children.splice(index, 1, {
                    type: "element",
                    tagName: "details",
                    properties: {
                        className: "alert--warning",
                    },
                    children: [
                        {
                            type: "element",
                            tagName: "summary",
                            properties: {},
                            children: [
                                {
                                    type: "element",
                                    tagName: "span",
                                    properties: {
                                        className: ["math-error"],
                                        style: `color: ${
                                            settings.errorColor || "#cc0000"
                                        }; font-weight: bold;`,
                                    },
                                    children: [
                                        { type: "text", value: "Typst Error" },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "element",
                            tagName: "code",
                            properties: {
                                className: ["language-json"],
                            },
                            children: [{ type: "text", value: cause.message }],
                        },
                    ],
                });
            }

            return SKIP;
        };
        const promises = matches.map(
            async ({
                element,
                parents,
            }: {
                element: Element;
                parents: (Root | Element)[];
            }) => {
                await visitor(element, parents);
            }
        );
        await Promise.all(promises);
    };

    return transformer;
};

export default plugin;
