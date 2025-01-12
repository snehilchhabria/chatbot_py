import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import App.jsx to render it
import './index.css'; // Global styles, if you want to apply them

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // This will render App inside the <div id="root"></div> in public/index.html
);
