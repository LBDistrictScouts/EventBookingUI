import * as React from 'react';
import { render } from '@testing-library/react';
import Button from 'react-bootstrap/Button';

describe('Button Component', () => {
    test('renders the button with provided text', () => {
        render(<Button>Click Me</Button>);

        const buttonElement = screen.getByText(/click me/i);
        expect(buttonElement).toBeDefined();
    });

    test('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);

        const buttonElement = screen.getByText(/click me/i);
        fireEvent.click(buttonElement);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});