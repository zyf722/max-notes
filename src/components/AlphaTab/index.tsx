import * as alphaTab from "@coderline/alphatab";
import { useEffect, ReactElement, useRef } from "react";
import { PartialSettings } from "@site/src/types/alphatab";
import env from "./env";

export interface AlphaTabProps {
    settings?: PartialSettings;
    file?: string;
    tracks?: number[] | string;
    tex: boolean;
    children: string | ReactElement;
}

export default function AlphaTab(props: AlphaTabProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<alphaTab.AlphaTabApi | undefined>(undefined);

    useEffect(() => {
        const container = elementRef.current;
        const settings = new alphaTab.Settings();
        settings.core.fontDirectory = env.fontDirectory;
        if (props.file) {
            settings.core.file = props.file;
        }
        if (props.tex) {
            settings.core.tex = true;
        }
        if (props.tracks) {
            settings.fillFromJson({
                core: {
                    tracks: props.tracks,
                },
            });
        }
        if (props.settings) {
            settings.fillFromJson(props.settings);
        }

        apiRef.current = new alphaTab.AlphaTabApi(container, settings);

        return () => {
            if (apiRef.current) {
                apiRef.current.destroy();
            }
        };
    }, [props.file, props.tex, props.tracks, props.settings]);

    return <div ref={elementRef}>{props.children}</div>;
}
