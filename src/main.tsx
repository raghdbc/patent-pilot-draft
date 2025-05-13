/**
 * Application Entry Point
 * 
 * This file serves as the main entry point for the React application.
 * It initializes the React root and renders the main App component.
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the root element and create a React root
const rootElement = document.getElementById("root");

// Ensure the root element exists
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Create and render the React application
createRoot(rootElement).render(<App />);
