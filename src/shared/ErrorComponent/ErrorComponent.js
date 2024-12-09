import React from 'react';

const ErrorComponent = ({ message }) => (
    <div className="container">
        <div className="box_1">
            <div className="error-component">
                <h2>Error</h2>
                <p>{message}</p>
            </div>
        </div>
    </div>
);

export default ErrorComponent;