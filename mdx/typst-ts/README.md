# mdx/typst-ts
Uses [typst.ts](https://github.com/Myriad-Dreamin/typst.ts) to render [Typst](https://typst.app/) documents into SVGs in the following grammar:

- Block
````md
```typst
document content here
```
````

- Inline
```md
`^inline content^`
```

Code mainly based on [`rehype-typst`](https://github.com/Myriad-Dreamin/typst.ts/tree/main/projects/rehype-typst), with some modifications and a remark plugin to support custom grammar, in order to achieve compatibility with `remark-math` and `rehype-katex`.
