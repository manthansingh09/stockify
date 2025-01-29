import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import StockDetail from './StockDetail';
import './styles.css';

function App() {
    return (
        <Router>
            <div>
                <h1>Stock Price Tracker</h1>
                <Switch>
                    <Route path="/stock/:symbol" component={StockDetail} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
