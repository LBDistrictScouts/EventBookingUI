import {ReactElement} from "react";

export function Timings(): ReactElement {


    return (
        <div className="d-flex align-items-center align-items-md-start align-items-xl-center">
            <div
                className="bs-icon-xl bs-icon-circle bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center me-4 d-inline-block bs-icon xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em"
                     fill="currentColor">
                    <path
                        d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path>
                </svg>
            </div>
            <div>
                <h3>Timings</h3>
                <p className="lead">Check In: <strong>08:00 - 09:00</strong></p>
                <p>All participants must check in within an hour of 08:00.</p>
                <p className="lead">Complete before: <strong>16:00</strong></p>
                <p>We will send people around the course to pick up any stragglers.</p>
            </div>
        </div>
    )
}