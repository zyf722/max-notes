import React from "react";
import Heading from "@theme/Heading";

type QuizProp = {
    children: React.ReactNode;
    question: string;
};

export default function Quiz({ children, question }: QuizProp): JSX.Element {
    return (
        <React.Fragment>
            <Heading as="h3">{question}</Heading>
            <div style={{ display: "flex" }}>
                <div style={{ fontWeight: "bold" }}>答：</div>
                <div>{children}</div>
            </div>
        </React.Fragment>
    );
}
