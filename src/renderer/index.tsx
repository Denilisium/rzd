import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/App';
import './index.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import './assets/Roboto/Roboto-Regular.ttf';
import '@fortawesome/fontawesome-free/css/all.css';


ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);