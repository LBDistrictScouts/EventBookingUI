import { ReactElement, useState } from "react";
import { Container, Image, Card, Row, Col, Spinner } from "react-bootstrap";

function LoadingScreen(): ReactElement {
    const [imgError, setImgError] = useState(false);

    return (
        <Container>
            <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Col md="auto">
                    <Card className="p-4 text-center shadow">
                        {!imgError ? (
                            <Image
                                src="/img/scouts-loading-memebership-scouts.gif"
                                alt="Loading animation"
                                fluid
                                className="mb-3"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <Spinner animation="border" role="status" className="mb-3">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        )}
                        <h4>Loading...</h4>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoadingScreen;