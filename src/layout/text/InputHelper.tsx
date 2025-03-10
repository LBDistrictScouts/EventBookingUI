import {ReactElement} from "react";


function InputHelper({ text }: {text: string}): ReactElement {
    return (
        <div className="text-center mt-2">
            <small className="form-text fw-light text-center"><strong>{text}</strong></small>
        </div>
    )
}

export default InputHelper;