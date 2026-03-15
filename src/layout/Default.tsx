import { Container } from "react-bootstrap";
import { ReactNode, ReactElement } from "react";


export default function DefaultLayout({ children }: { children: ReactNode }): ReactElement {
    return (
        <div className="lbd-page-shell">
            <Container fluid className="px-3 px-lg-4">
                {children}
            </Container>
        </div>
    )
}
