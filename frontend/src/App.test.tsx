import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders smartoshi headline", () => {
  render(<App />);
  expect(screen.getByText(/Smartoshi Mini Exchange/i)).toBeInTheDocument();
  expect(screen.getByText(/Backend API Explorer/i)).toBeInTheDocument();
});
