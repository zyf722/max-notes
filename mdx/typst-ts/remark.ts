import type { Plugin, Transformer } from "unified";
import type { Nodes } from "mdast";
import { visit } from "unist-util-visit";
import mdxTypstTs from "./model";

interface RemarkTypstOptions {}

const plugin: Plugin<[RemarkTypstOptions?]> = (
    options?: RemarkTypstOptions
): Transformer => {
    const transformer = (ast: Nodes) => {
        visit(ast, (node) => {
            if (
                node.type == "inlineCode" &&
                node.value.startsWith("^") &&
                node.value.endsWith("^")
            ) {
                node.value = node.value.slice(1, -1);
                node.data ||= {};
                node.data.hProperties = {
                    className: [mdxTypstTs.className.typstInline],
                };
            }
        });
    };
    return transformer;
};

export default plugin;
