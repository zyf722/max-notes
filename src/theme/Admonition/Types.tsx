import React from "react";
import Admonition from "@theme-original/Admonition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import DefaultAdmonitionTypes from "@theme-original/Admonition/Types";

type BaseAdmonitionType = "secondary" | "info" | "success" | "danger" | "note" | "tip" | "warning" | "important" | "caution";

function AdmonitionFactory(baseType: BaseAdmonitionType, icon: IconProp) {
    return function (props) {
        return (
            <Admonition type={baseType} title={props.title} icon={<FontAwesomeIcon icon={icon} size="1x" />}>
                {props.children}
                {props.icon}
            </Admonition>
        );
    };
}

const AdmonitionTypes = {
    ...DefaultAdmonitionTypes,
    "quote": AdmonitionFactory("note", "quote-left"),
};

export default AdmonitionTypes;
