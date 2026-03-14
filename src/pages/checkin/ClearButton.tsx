import {removeCookie} from "typescript-cookie";
import {useState} from "react";
import {Button, Modal} from "react-bootstrap";

interface ClearButtonProps {
    setEntry: CallableFunction
    buttonText?: string
}

function ClearButton({setEntry, buttonText = 'Refresh Team Members'}: ClearButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const removeEntryCookies = () => {
        // Clear both current and legacy cookie keys used across register/edit/check-in.
        const keys = ["entry", "saved-entry"];
        const variants = [
            undefined,
            { path: "/" },
            { path: "/", domain: "localhost" },
            { path: "/edit" },
            { path: "/check-in" },
            { path: "/edit", domain: "localhost" },
            { path: "/check-in", domain: "localhost" },
        ];

        for (const key of keys) {
            for (const attrs of variants) {
                if (attrs) {
                    removeCookie(key, attrs);
                } else {
                    removeCookie(key);
                }
            }
        }
    };

    const clearCookies = () => {
        console.log('Save Cleared!');
        removeEntryCookies();
        setEntry(undefined);
    };

    return (
        <>
            <button className={'btn btn-outline-secondary btn-sm'} onClick={() => setShowConfirm(true)}>
                { buttonText }
            </button>
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Clear Saved Team?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This will clear the cached team from this device. Are you sure you want to continue?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            clearCookies();
                            setShowConfirm(false);
                        }}
                    >
                        Yes, Clear
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ClearButton;
