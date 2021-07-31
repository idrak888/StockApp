import React from 'react';

const OverlayModule = props => {

    const dismissModule = () => {
        document.querySelector(".OverlayModule").style.display = "none";
    }

    return (
        <div className="OverlayModule">
            <div className="background"></div>
            <div className="module">
                <h3>This program is currently on its BETA version and can is limited to only 1 call per minute</h3>
                <h3>This program is not optimised for mobile browsers</h3>
                <button onClick={dismissModule} className="btn">Dismiss</button>
            </div>
        </div>
    );
};

export default OverlayModule;