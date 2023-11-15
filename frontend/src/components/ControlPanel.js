import React from 'react';

const TimerDisplay = ({ timerValue }) => {
  return (
    <div style={{ marginLeft: 'auto', marginRight: '10px', fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', borderRadius: '4px', display: 'inline-block' }}>
      Timer: {timerValue} seconds
    </div>
  );
};

const ControlPanel = ({ onShowCamera, onStartRecording, timerValue }) => {
  return (
    <div class = "cp-body">
      <>
        <button
          type="button"
          className="cp-btn"
          onClick={onShowCamera}
          style={{ marginRight: '10px' }}>
          Show Camera
        </button>
        <button
          type="button"
          className="cp-btn alert"
          onClick={onStartRecording}
          style={{ marginRight: '10px' }}>
          Start Recording
        </button>
      </>
    </div>
  );
};

export default ControlPanel;
