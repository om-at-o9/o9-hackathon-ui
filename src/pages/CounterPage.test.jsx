import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides extra matchers like .toBeInTheDocument()
import CounterPage from './CounterPage';

// The describe block groups together related tests for a specific component.
describe('CounterPage', () => {

  // Test case 1: Check if the component renders with the correct initial state.
  test('renders all counters with initial values', () => {
    // Arrange: Render the component to the virtual DOM.
    render(<CounterPage />);

    // Act & Assert: Find elements by their text content and check if they are present.
    // We expect the initial values to be 0, 1, and 0.
  expect(screen.getByText('Add by 1')).toBeInTheDocument();
  expect(screen.getByText('Multiply by 2')).toBeInTheDocument();
  expect(screen.getByText('Subtract by 1')).toBeInTheDocument();
  // Check initial values for each counter
  expect(screen.getAllByText('0').length).toBe(2); // addCount and subCount
  expect(screen.getByText('1')).toBeInTheDocument(); // mulCount
  });

  // Test case 2: Check if the addition counter works correctly.
  test('increments the add counter when its div is clicked', () => {
    // Arrange
    render(<CounterPage />);

    // Act: Find the "Add" div by its text and simulate a click event.
  const addCounterDiv = screen.getByText('Add by 1').parentElement;
  const addCountValue = addCounterDiv.querySelector('div:nth-child(2)');
  fireEvent.click(addCounterDiv);
  expect(addCountValue).toHaveTextContent('1');
  fireEvent.click(addCounterDiv);
  expect(addCountValue).toHaveTextContent('2');
  });

  // Test case 3: Check if the multiplication counter works correctly.
  test('multiplies the mul counter when its div is clicked', () => {
    // Arrange
    render(<CounterPage />);

    // Act
  const mulCounterDiv = screen.getByText('Multiply by 2').parentElement;
  const mulCountValue = mulCounterDiv.querySelector('div:nth-child(2)');
  fireEvent.click(mulCounterDiv);
  expect(mulCountValue).toHaveTextContent('2');
  fireEvent.click(mulCounterDiv);
  expect(mulCountValue).toHaveTextContent('4');
  });

  // Test case 4: Check if the subtraction counter works correctly.
  test('decrements the sub counter when its div is clicked', () => {
    // Arrange
    render(<CounterPage />);

    // Act
  const subCounterDiv = screen.getByText('Subtract by 1').parentElement;
  const subCountValue = subCounterDiv.querySelector('div:nth-child(2)');
  fireEvent.click(subCounterDiv);
  expect(subCountValue).toHaveTextContent('-1');
  fireEvent.click(subCounterDiv);
  expect(subCountValue).toHaveTextContent('-2');
  });
});
