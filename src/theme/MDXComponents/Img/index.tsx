import React from "react";
import clsx from "clsx";
import type { Props } from "@theme/MDXComponents/Img";

import styles from "./styles.module.css";

function transformImgClassName(className?: string): string {
    return clsx(className, styles.img);
}

export default function MDXImg(props: Props): JSX.Element {
    const img = (
        <img
            decoding="async"
            loading="lazy"
            {...props}
            className={transformImgClassName(props.className)}
        />
    );
    return (
        !props.alt ? img : (
            <span style={{ display: "flex", flexDirection: "column" }}>
                {img}
                <span style={{ textAlign: "center", fontSize: "small", color: "#888888", marginTop: "1em" }}>
                    {props.alt}
                </span>
            </span>
        )
    );
}
