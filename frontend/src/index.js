import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux'
import store from './store'
import './bootstrap.min.css'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
Sentry.init({
  dsn: "https://73d5e556e5014b45a2e8f1e0ec21c54a@o1406867.ingest.sentry.io/6744206",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
  // <App />
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
