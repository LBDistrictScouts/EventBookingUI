import {Checkpoint} from "../../data/dataTypes.ts";
import {ReactElement} from "react";


interface CheckpointProps {
    checkpoint: Checkpoint|undefined;
}

function CheckpointHeader({checkpoint}:  CheckpointProps): ReactElement {
    return (
        <>
            <h4 className="text-dark">Checkpoint</h4>
            <p className="fs-1 text-dark">{checkpoint?.checkpoint_name}</p>
        </>
    )
}

export default CheckpointHeader;