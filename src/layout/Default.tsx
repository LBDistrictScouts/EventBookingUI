import { Container } from "react-bootstrap";
import { ReactNode, ReactElement } from "react";
import { useLocation } from "react-router";


export default function DefaultLayout({ children }: { children: ReactNode }): ReactElement {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <div className="lbd-page-shell">
            <Container
                fluid={isHomePage}
                className={isHomePage ? "px-3 px-lg-4" : "px-3"}
            >
                {children}
            </Container>
        </div>
    )
}
