import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // If no root element is found, we assume the application is running in "Vanilla JS Rescue Mode"
  // (index.html handles the rendering) and we exit gracefully without throwing an error.
  console.log("React mount skipped: #root element not found (Running in Vanilla JS mode).");
}