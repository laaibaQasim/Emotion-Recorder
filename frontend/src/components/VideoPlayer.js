import React, { useState, useEffect } from 'react';

const VideoPlayer = ({ selectedEmotion, showCamera, recording }) => {
  const [mediaUrl, setMediaUrl] = useState(null);

  useEffect(() => {
    const fetchMediaUrl = async () => {
      try {
        if (showCamera) {
          // Open camera using WebRTC
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.play();

          // Append the video element to the DOM
          document.getElementById('video-container').appendChild(videoElement);

          return;
        }

        if (!selectedEmotion) {
          // Set a default emoji GIF when no emotion is selected
          setMediaUrl('http://localhost:5000/emoji/play');
          return;
        }

        const response = await fetch(`http://localhost:5000/emotions/${selectedEmotion}/play`);

        if (!response.ok) {
          throw new Error(`Error fetching media URL: ${response.status} - ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
      } catch (error) {
        console.error(error.message);
      }
    };

    // Fetch media URL when selectedEmotion, showCamera, or recording changes
    fetchMediaUrl();
  }, [selectedEmotion, showCamera, recording]); // Ensure useEffect runs when selectedEmotion, showCamera, or recording changes

  // Reset media URL when component unmounts
  useEffect(() => {
    return () => {
      setMediaUrl(null);
    };
  }, []); // Empty dependency array means it only runs on mount and unmount

  return (
    <div id="video-container">
      {mediaUrl ? (
        showCamera ? (
          <video width="640" height="360" key={mediaUrl} controls>
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : selectedEmotion ? (
          <video width="640" height="360" key={mediaUrl} controls>
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={mediaUrl} alt="Default Emoji" style={{ marginTop: 70 }} />
        )
      ) : (
        // Do not show "Loading media..." when the camera is displayed
        !showCamera && <p>Loading media...</p>
      )}
    </div>
  );  
};

export default VideoPlayer;
