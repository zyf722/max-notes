/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconSuccess from "@theme/Icon/Success";
import { getPlaygroundUrl } from "livecodes";

import styles from "./styles.module.css";

export interface Props {
    readonly code: string;
    readonly language: string;
    readonly className?: string;
    readonly metastring: string;
}

export default function RunButton({
    code,
    language,
    className,
    metastring = "",
}: Props): JSX.Element {
    const openInNewTab = (url: string): void => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    const onClickUrl = useCallback(() => {
        const codeType = metastring.includes("markup")
            ? "markup"
            : metastring.includes("style ")
                ? "style"
                : "script";
        const url = getPlaygroundUrl({
            loading: "eager",
            params: {
                console: "open",
            },
            config: {
                [codeType]: {
                    language,
                    content: code,
                },
                activeEditor: codeType,
            },
        });
        openInNewTab(url);
    }, [code]);

    return (
        <button
            type="button"
            aria-label="在 LiveCodes 上运行"
            title="在 LiveCodes 上运行"
            className={clsx("clean-btn", className, styles.copyButton)}
            onClick={onClickUrl}
        >
            <span className={styles.copyButtonIcons} aria-hidden="true">
                <FontAwesomeIcon
                    icon={["far", "paper-plane"]}
                    size="1x"
                    className={styles.copyButtonIcon}
                />
                <IconSuccess className={styles.copyButtonSuccessIcon} />
            </span>
        </button>
    );
}
