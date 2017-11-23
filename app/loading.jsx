import React, {Component} from 'react';
import {render} from 'react-dom';

require("./css/app-loading.scss");
const AppLoading = () => (
                <div>Loading</div>
            );

render(<AppLoading/>, document.getElementById('app-loading'));