import {ReactElement, useEffect, useState} from 'react'
import {Hero} from './pages/index/Hero'
import {Timings} from './pages/index/Timings'
import {Checkpoints} from './pages/index/Checkpoints'
import {Questions} from './pages/index/Questions'
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {BookableEvent} from "./data/dataTypes";
import {getBookableEvent} from "./data/backend";
import LoadingScreen from "./LoadingScreen.tsx";

function App(): ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [evtData, setEvtData] = useState<BookableEvent>()

    useEffect(() => {
        Promise
            .all([getBookableEvent()])
            .then(([bkEvent]) => {
                setEvtData(bkEvent)
            })
            .finally(() => setLoading(false))
    }, []);

    if (loading || !evtData) {
        return (
            <LoadingScreen />
        )
    }

  return (
      <>
          <Hero bookableEvent={evtData} />
          <Container className={'py-4 py-xl-5'} >
              <Row>
                  <Col className={'col-md-8 col-xl-6 mx-auto p-4'}>
                      <Timings />
                      <hr className="my-5"/>
                      <Checkpoints bookableEvent={evtData} />
                      <hr className="my-5"/>
                      <Questions bookableEvent={evtData} />
                  </Col>
              </Row>

          </Container>
      </>
  )
}

export default App
