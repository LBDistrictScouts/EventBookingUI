import { Container } from "react-bootstrap";
import { ReactNode, ReactElement } from "react";


export default function DefaultLayout({ children }: { children: ReactNode }): ReactElement {
    return (
        <Container>
            {children}
        </Container>
    )
}
