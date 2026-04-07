import {ReactElement, useState} from "react";
import {MarkdownRenderer} from '../../data/markdown'
import {BookableEvent, Question} from "../../data/dataTypes";
import {Accordion, Badge} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function Questions({bookableEvent}: {bookableEvent: BookableEvent}): ReactElement {
    const firstQuestionId = bookableEvent.questions[0]?.id;
    const [activeKey, setActiveKey] = useState<string | null>(firstQuestionId ?? null);

    const handleSelect = (eventKey: string | string[] | null | undefined) => {
        if (Array.isArray(eventKey)) {
            setActiveKey(eventKey[0] ?? null);
            return;
        }

        setActiveKey(eventKey ?? null);
    };

    return (
        <Row className="qa-section g-4 align-items-start">
            <Col xs={12} lg={4}>
                <aside className="qa-panel">
                    <div className="qa-panel__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                            <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path>
                        </svg>
                    </div>
                    <Badge bg="light" text="dark" className="qa-panel__eyebrow">Q&A</Badge>
                    <h4 className="qa-panel__title">Questions people usually ask before they book.</h4>
                    <p className="qa-panel__copy">
                        Tap through the essentials for the route, timings and what to expect on the day.
                    </p>
                    <div className="qa-panel__count">
                        <span className="qa-panel__count-number">{bookableEvent.questions.length}</span>
                        <span className="qa-panel__count-label">quick answers</span>
                    </div>
                </aside>
            </Col>
            <Col xs={12} lg={8}>
                <Accordion
                    activeKey={activeKey ?? undefined}
                    onSelect={handleSelect}
                    role={"tablist"}
                    id={'question-accordion'}
                    className="qa-accordion"
                >
                {bookableEvent.questions.map((question: Question, index: number) => {
                    const questionNumber = `${index + 1}`.padStart(2, '0');

                    return (
                        <Accordion.Item eventKey={question.id} key={question.id} className="qa-accordion__item">
                            <Accordion.Header>
                                <span className="qa-accordion__number">{questionNumber}</span>
                                <span className="qa-accordion__prompt">
                                    <span className="qa-accordion__label">Question</span>
                                    <span className="qa-accordion__question">
                                        <MarkdownRenderer markdownText={question.question_text} />
                                    </span>
                                </span>
                            </Accordion.Header>
                                <Accordion.Body>
                                    <div className="qa-accordion__answer">
                                        <span className="qa-accordion__label qa-accordion__label--answer">Answer</span>
                                        <MarkdownRenderer markdownText={question.answer_text} />
                                    </div>
                                </Accordion.Body>
                        </Accordion.Item>
                    )
                })}
                </Accordion>
            </Col>
        </Row>
    )
}
