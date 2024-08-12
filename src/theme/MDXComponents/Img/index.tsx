import { CSSProperties } from "react";
import clsx from "clsx";
import type { Props } from "@theme/MDXComponents/Img";

import styles from "./styles.module.css";

const transformImgClassName = (className?: string, zoom?: boolean): string => {
    return clsx(className, styles.img, { "zoomable": zoom });
};

const strToObj = (str: string) => (new Function("return" + str))();

interface MDXImgOptions {
    inline: boolean;
    align: CSSProperties["justifyItems"];
    zoom: boolean;
    subtitle: boolean;
}

const defaultOptions: MDXImgOptions = {
    inline: false,
    align: "center",
    zoom: true,
    subtitle: true,
};

export default function MDXImg(props: Props): JSX.Element {
    // ![alt|options](url)
    // options is an optional json string with type MDXImgOptions

    // Use \| to escape the pipe character in the alt text
    // Here use regex to match the alt text and options
    const [_, alt, options] = props.alt.match(/^(.+?)(?<!\\)\|(.*)$/) ?? ["", props.alt, ""];
    const imgOptions = { ...defaultOptions, ...strToObj(options) };
    const img = (
        <img
            decoding="async"
            loading="lazy"
            {...props}
            alt={alt}
            className={transformImgClassName(props.className, !imgOptions.inline && imgOptions.zoom)}
            style={imgOptions.inline ? { display: "inline", verticalAlign: "middle", maxHeight: "2em" } : undefined}
        />
    );
    return !imgOptions.inline ? (
        <span style={{ display: "flex", flexDirection: "column", justifyItems: imgOptions.align, alignItems: imgOptions.align }}>
            {img}
            {
                imgOptions.subtitle && (
                    <span style={{ textAlign: "center", fontSize: "small", color: "#888888", marginTop: "1em" }}>
                        {alt}
                    </span>
                )
            }
        </span>
    ) : img;
}
