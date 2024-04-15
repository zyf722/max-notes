/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback } from "react";
import clsx from "clsx";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconSuccess from "@theme/Icon/Success";

import styles from "./styles.module.css";

export interface Props {
    readonly code: string;
    readonly language: string;
    readonly className?: string;
}

export default function RunButton({ code, language, className }: Props): JSX.Element {
    const openInNewTab = (url: string): void => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    const onClickUrl = useCallback(() => {
        const url = `https://livecodes.io?${queryString.stringify({
            [language]: code,
            console: "open"
        })}`;
        openInNewTab(url);
    }, [code]);

    return (
        <button
            type="button"
            aria-label="在 LiveCodes 上运行"
            title="在 LiveCodes 上运行"
            className={clsx(
                "clean-btn",
                className,
                styles.copyButton
            )}
            onClick={onClickUrl}>
            <span className={styles.copyButtonIcons} aria-hidden="true">
                <FontAwesomeIcon icon={["far", "paper-plane"]} size="1x" className={styles.copyButtonIcon} />
                <IconSuccess className={styles.copyButtonSuccessIcon} />
            </span>
        </button>
    );
}
