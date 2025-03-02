import {ReactElement, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RegistrationForm from "./RegistrationForm.tsx";
import {SavedEntry} from "../../data/dataTypes.ts";
import {isJsonObject, setValidCookie} from "../../data/utilities.ts";
import {getCookie} from "typescript-cookie";

function Register(): ReactElement {
    const getSavedEntry = (): undefined|SavedEntry => {
        let cookieEntry: string|undefined = getCookie('saved-entry');

        if (typeof cookieEntry === 'string') {
            cookieEntry = JSON.parse(cookieEntry);
        }

        if (isJsonObject<SavedEntry>(cookieEntry)) {
            return cookieEntry;
        }

        return
    }

    const [savedEntry, setSavedEntry] = useState<SavedEntry|undefined>(getSavedEntry());

    useEffect(() => {
        if (isJsonObject<SavedEntry>(savedEntry)) {
            setValidCookie('saved-entry', savedEntry)
        }
    }, [savedEntry])

    if (savedEntry) {
        return (
            <Card className="shadow-lg o-hidden border-0 p-0 my-5">
                <Card.Body className="p-0">
                    <Row>
                        <Col lg={5} className={'d-none d-lg-flex'} >
                            <div className="flex-grow-1 bg-confirmation-image"></div>
                        </Col>
                        <div className="col-lg-7">
                            <div className="lg-p5 p-4">
                                <div className="card bg-success bg-opacity-25">
                                    <div className="card-body">
                                        <h4 className="card-title">Registration Confirmed</h4>
                                        <h6 className="text-muted card-subtitle my-3">Walking Group Name: <strong>"{savedEntry.entry_name}"</strong></h6>
                                        <h6 className="text-muted card-subtitle my-3">Contact Email: <strong>"{savedEntry.entry_email}"</strong></h6>
                                        <h6 className="text-muted card-subtitle my-3">Contact Mobile: <strong>"{savedEntry.entry_mobile}"</strong></h6>
                                        <div className="card my-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <p className="fs-1">24-293</p>
                                                        <p>Booking Reference</p>
                                                    </div>
                                                    <div className="col">
                                                        <p className="fs-1">{savedEntry.security_code}</p>
                                                        <p>Security Code</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="card-text">You will receive an email confirming the above
                                            information. You will need the booking reference and security code to
                                            register on the day of the walk.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Card.Body>
            </Card>
        )
    }


    return (
        <Card border={'0'} className={'shadow-lg p-0 o-hidden my-5'}>
            <Card.Body className={'p-0'}>
                <Row>
                    <Col lg={5} d={'none'} className={'col-lg-5 d-none d-lg-flex'}>
                        <div className="flex-grow-1 bg-register-image"></div>
                    </Col>
                    <Col lg={7}>
                        <div className="p-5">
                            <div className="text-center">
                                <h4 className="text-dark mb-4">Register for Greenway Walk</h4>
                            </div>
                            <RegistrationForm setSavedEntry={setSavedEntry}/>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )

}


export default Register;