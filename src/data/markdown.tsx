import ReactMarkdown from "react-markdown";
import {ReactElement} from "react";

export const MarkdownRenderer = ({markdownText}: {markdownText: string}): ReactElement => {
    return <ReactMarkdown>{markdownText}</ReactMarkdown>;
};