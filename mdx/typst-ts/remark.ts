import type { Plugin, Transformer } from "unified";
import type { Nodes } from "mdast";
import { visit } from "unist-util-visit";

interface RemarkTypstOptions {
    isInline: (value: string) => boolean;
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

const defaultOptions: RemarkTypstOptions = {
    isInline: (value) => value.startsWith("^") && value.endsWith("^"),
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

const plugin: Plugin<[Readonly<RemarkTypstOptions>?]> = (
    options?: RemarkTypstOptions
): Transformer => {
    const settings = options || defaultOptions;
    const transformer = (ast: Nodes) => {
        visit(ast, (node) => {
            if (node.type == "inlineCode" && settings.isInline(node.value)) {
                node.value = node.value.slice(1, -1);
                node.data ||= {};
                node.data.hProperties = {
                    className: [settings.shared.className.typstInline],
                };
            }
        });
    };
    return transformer;
};

export default plugin;
