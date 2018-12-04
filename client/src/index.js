/* @flow */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { appStore } from '@/reducers/store';
import { App } from '@/components/App';
import "@/css/bootstrap.css"
import "@/css/custom.css"


const root = document.getElementById('app');
if (root !== null) {
    render(
        <Provider store={appStore}>
            <App />
        </Provider>,
        root
    )
}