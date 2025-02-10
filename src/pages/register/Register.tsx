import { ReactElement } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RegistrationForm from "./RegistrationForm.tsx";

function Register(): ReactElement {

    return (
        <Card border={'0'} className={'shadow-lg o-hidden my-5'}>
            <Card.Body>
                <Row>
                    <Col lg={5} d={'none'} className={'col-lg-5 d-none d-lg-flex'}>
                        <div className="flex-grow-1 bg-register-image"></div>
                    </Col>
                    <Col lg={7}>
                        <div className="p-5">
                            <div className="text-center">
                                <h4 className="text-dark mb-4">Register for Greenway Walk</h4>
                            </div>
                            <RegistrationForm />
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )

}


export default Register;