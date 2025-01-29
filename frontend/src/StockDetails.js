import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function StockDetail() {
    const { symbol } = useParams();
    const [stockData, setStockData] = useState([]);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get(`/api/stock/${symbol}`);
                setStockData(response.data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, [symbol]);

    return (
        <div>
            <h2>Stock Details for {symbol}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.time}</td>
                            <td>{data.open}</td>
                            <td>{data.high}</td>
                            <td>{data.low}</td>
                            <td>{data.close}</td>
                            <td>{data.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockDetail;