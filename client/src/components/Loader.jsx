// components/Loader.jsx
import React from 'react';
import './Loader.css';

export default function Loader({ message = "Preparing your experience..." }) {
    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader-spinner">
                    <div className="loader-ring"></div>
                    <div className="loader-ring"></div>
                    <div className="loader-ring"></div>
                    <div className="loader-center">
                        <div className="loader-key">
                            <div className="key-head"></div>
                            <div className="key-shaft"></div>
                            <div className="key-teeth">
                                <div className="tooth"></div>
                                <div className="tooth"></div>
                                <div className="tooth"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="loader-message">{message}</p>
            </div>
        </div>
    );
}