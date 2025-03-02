import {ReactElement} from 'react'
import {Hero} from './pages/index/Hero'
import {Timings} from './pages/index/Timings'
import {Checkpoints} from './pages/index/Checkpoints'
import {Questions} from './pages/index/Questions'
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App(): ReactElement {

  return (
      <>
          <Hero />
          <Container className={'py-4 py-xl-5'} >
              <Row>
                  <Col className={'col-md-8 col-xl-6 mx-auto p-4'}>
                      <Timings />
                      <hr className="my-5"/>
                      <Checkpoints />
                      <hr className="my-5"/>
                      <Questions />
                  </Col>
              </Row>

          </Container>
      </>
  )
}

export default App
