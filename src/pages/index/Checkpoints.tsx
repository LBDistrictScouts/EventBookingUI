import {ReactElement} from "react";
import {BookableEvent, Checkpoint} from "../../data/dataTypes.ts";

export function Checkpoints({bookableEvent}: {bookableEvent: BookableEvent}): ReactElement {


    return (
        <div className="d-flex align-items-center align-items-md-start align-items-xl-center">
            <div
                className="bs-icon-xl bs-icon-circle bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center me-4 d-inline-block bs-icon xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-64 0 512 512" width="1em" height="1em"
                     fill="currentColor">
                    <path
                        d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>
                </svg>
            </div>
            <div>
                <h4>Checkpoints</h4>
                <ol start={0}>
                    {
                        bookableEvent.checkpoints.map((ckpt: Checkpoint) => {
                            return <li key={ckpt.checkpoint_sequence}>{ckpt.checkpoint_name}</li>
                        })
                    }
                </ol>
            </div>
        </div>
    )
}