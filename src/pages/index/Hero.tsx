import {ReactElement} from "react";
import {Container, Image} from "react-bootstrap";

export function Hero(): ReactElement {


    return (
        <Container className={'h-100'} >



            <div className="row h-100">
                <div
                    className="col-md-10 col-xl-8 text-center d-flex d-sm-flex d-md-flex justify-content-center align-items-center mx-auto justify-content-md-start align-items-md-center justify-content-xl-center">
                    <div>
                        <h1 className="text-uppercase fw-bold mb-3">Greenway Walk 2025</h1>
                        <Image src={'/img/greenway-walk-badge-25.png'} width={'50%'}/>
                        <p className="mb-4">The best annual fundraising event for Scouting in the local area. A
                            partnership between Letchworth, Baldock &amp; Ashwell Scouts and the Letchworth Garden City
                            Heritage Foundation.</p>
                        <h2 className="text-uppercase fw-bold mb-3">18-May-2025</h2><a
                        className="btn btn-success fs-5 me-2 py-2 px-4" role="button" href="/register">Register</a>
                    </div>
                </div>
            </div>
        </Container>

    )
}