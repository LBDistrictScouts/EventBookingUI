import {ReactElement} from "react";
import {Container} from "react-bootstrap";
import CheckpointHeader from "./CheckpointHeader.tsx";
import {Checkpoint} from "../../data/dataTypes.ts";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

interface ConfirmationProps {
    checkpoint: Checkpoint;
}

function Confirmation({checkpoint}: ConfirmationProps): ReactElement {
    return (
        <Container>
            <Row className={'justify-content-center'}>
                <Col md={9} lg={12} xl={10}>
                    <Card className={'shadow-lg o-hidden border-0 my-5'}>
                        <Card.Body className={'p-0'}>
                            <Row>
                                <Col lg={6}>
                                    <div className="p-5">
                                        <div className="text-center">
                                            <CheckpointHeader checkpoint={checkpoint} />
                                            <hr/>
                                            <h1>Check In Confirmed</h1>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="d-flex">
                                    <div className="flex-grow-1 bg-login-image fit-cover"></div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Confirmation;