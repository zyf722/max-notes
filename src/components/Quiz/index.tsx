import { ReactNode, Fragment } from "react";
import Heading from "@theme/Heading";

type QuizProp = {
    children: ReactNode;
    question: string;
};

export default function Quiz({ children, question }: QuizProp): JSX.Element {
    return (
        <Fragment>
            <Heading as="h3">{question}</Heading>
            <div style={{ display: "flex" }}>
                <div style={{ fontWeight: "bold" }}>答：</div>
                <div style={{ width: "100%" }}>{children}</div>
            </div>
        </Fragment>
    );
}
