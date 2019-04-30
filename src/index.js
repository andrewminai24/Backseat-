import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

fetch('localhost:4000/vehicleinfo')
    .then(function(response) {
        console.log(response.json());
    })
    .then(function(myJson) {
        console.log(JSON.stringify(myJson));
    });
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
