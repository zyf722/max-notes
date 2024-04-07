import React from "react";
import Admonition from "@theme-original/Admonition";
import Details from "@theme-original/Details";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import DefaultAdmonitionTypes from "@theme-original/Admonition/Types";

type BaseAdmonitionType = "secondary" | "info" | "success" | "danger" | "note" | "tip" | "warning" | "important" | "caution";

function AdmonitionFactory(baseType: BaseAdmonitionType, icon: IconProp, defaultTitle: string, callback?: (standardAdmonition: JSX.Element) => JSX.Element) {
    const standardAdmonitionFunc = function (props) {
        return (
            <Admonition type={baseType} title={props.title ?? defaultTitle} icon={<FontAwesomeIcon icon={icon} size="1x" />}>
                {props.children}
                {props.icon}
            </Admonition>
        );
    };
    if (callback) {
        return function (props) {
            return callback(standardAdmonitionFunc(props));
        };
    } else {
        return standardAdmonitionFunc;
    }
}

function details(props) {
    return <Details summary={props.title ?? "隐藏内容"}>{props.children}</Details>;
}

const AdmonitionTypes = {
    ...DefaultAdmonitionTypes,
    // After adding the custom types, remember to add them to the `admonitions` field in `docusaurus.config.ts`.
    "quote": AdmonitionFactory("note", "quote-left", "引用"),
    "example": AdmonitionFactory("info", "lightbulb", "示例"),
    "quiz": AdmonitionFactory("secondary", "question", "问题摘录与参考回答"),
    "details": details
};

export default AdmonitionTypes;
