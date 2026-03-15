import {ReactElement, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RegistrationForm from "./RegistrationForm.tsx";
import RegistrationConfirmation from "./RegistrationConfirmation.tsx";
import {PersistedEntry} from "../../data/dataTypes.ts";
import {isJsonObject} from "../../data/utilities.ts";
import {getSavedEntry, isSavedEntry, persistEntry} from "../../data/backend.ts";

function Register(): ReactElement {
    const [savedEntry, setSavedEntry] = useState<PersistedEntry|undefined>(getSavedEntry());

    useEffect(() => {
        if (isJsonObject<PersistedEntry>(savedEntry)) {
            persistEntry(savedEntry);
        }
    }, [savedEntry])

    if (isSavedEntry(savedEntry)) {
        return <RegistrationConfirmation entry={savedEntry} />
    }


    return (
        <Card border={'0'} className={'shadow-lg p-0 o-hidden my-5'}>
            <Card.Body className={'p-0'}>
                <Row>
                    <Col lg={5} d={'none'} className={'col-lg-5 d-none d-lg-flex'}>
                        <div className="flex-grow-1 bg-register-image"></div>
                    </Col>
                    <Col lg={7}>
                        <div className="p-3 p-lg-5">
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
