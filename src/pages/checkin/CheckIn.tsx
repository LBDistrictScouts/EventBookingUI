import {ReactElement, useEffect, useState} from "react";
import LookupForm from "./LookupForm.tsx";
import CheckInForm from "./CheckInForm.tsx";
import {BookableEvent, Checkpoint, PersistedEntry} from "../../data/dataTypes.ts"
import Confirmation from "./Confirmation.tsx";
import {getBookableEvent, getSavedEntry, getSavedEvent} from "../../data/backend.ts";
import {Alert} from "react-bootstrap";
import {useParams} from "react-router";
import {getCheckpoint} from "../../data/transform.ts";
import './checkin.scss'
import LoadingScreen from "../../LoadingScreen.tsx";


function CheckIn(): ReactElement {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|undefined>();
    const [invalid, setInvalid] = useState<string>('');

    const { checkpoint_id } = useParams<{ checkpoint_id: string }>();
    const [checkpoint, setCheckpoint] = useState<Checkpoint>()
    const [event, setEvent] = useState<BookableEvent|undefined>(getSavedEvent());
    const [entry, setEntry] = useState<PersistedEntry|undefined>(getSavedEntry());
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        Promise
            .all([getBookableEvent()])
            .then(([bkEvent]) => {
                setEvent(bkEvent)

                if (checkpoint_id) {
                    const foundCheckpoint = getCheckpoint(checkpoint_id, bkEvent);

                    if (foundCheckpoint) {
                        setCheckpoint(foundCheckpoint);
                    } else {
                        setError('Checkpoint not found');
                    }
                }
            })
            .finally(() => setLoading(false));


    }, [checkpoint_id]);

    useEffect(() => {

    }, [checkpoint_id, checkpoint, entry]);

    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    if (complete && checkpoint) {
        return (
            <Confirmation checkpoint={checkpoint}/>
        )
    }

    if (entry && event && checkpoint) {
        return <CheckInForm
            entry={entry}
            setComplete={setComplete}
            setLoading={setLoading}
            checkpoint={checkpoint}
            setEntry={setEntry}
            setError={setError}
        />
    }


    if (checkpoint && event) {
        return <LookupForm
            setLoading={setLoading}
            setEntry={setEntry}
            checkpoint={checkpoint}
            invalid={invalid}
            setInvalid={setInvalid}
        />
    }

    return (
        <>
            <Alert variant={'danger'}>{error}</Alert>
        </>
    )
}

export default CheckIn;
