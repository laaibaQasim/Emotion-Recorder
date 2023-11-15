// RecordedVideoModal.js
import React from 'react';
import Modal from 'react-modal';

const RecordedVideoModal = ({ videoUrl, onClose }) => {
  return (
    <Modal
      isOpen={!!videoUrl}
      onRequestClose={onClose}
      contentLabel="Recorded Video Modal"
    >
      <div>
        <video controls width="640" height="360">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default RecordedVideoModal;
