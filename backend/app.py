import os
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from flask import Flask, request, send_from_directory, Response, jsonify

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

api = Api(
    app,
    version="1.0",
    title="Emotion Recorder API",
    description="API for emotion recording",
)

# Define a data structure for emotions
emotion_model = api.model(
    "Emotion",
    {
        "name": fields.String(required=True, description="Emotion name"),
    },
)

# Emotions list (simplified)
emotions = ["Happy", "Sad", "Angry", "Excited", "Neutral", "Disguise", "Fear"]

# Directory for storing recordings
recording_directory = "recordings"

# Ensure the recording directory exists
os.makedirs(recording_directory, exist_ok=True)

# Define the directory where the default emoji GIF is stored
emoji_directory = os.path.join(os.getcwd(), "recordings")

# Define the default emoji GIF filename
default_emoji_filename = "emojis.gif"


@api.route("/emotions")
class EmotionList(Resource):
    @api.marshal_list_with(emotion_model)
    def get(self):
        """List all emotions"""
        return [{"name": emotion} for emotion in emotions]


@api.route("/emotions/<string:name>/play")
class EmotionPlay(Resource):
    def get(self, name):
        """Play a video for the selected emotion"""
        # Assuming your video files are stored in the 'recordings' directory
        video_file_path = os.path.join(recording_directory, f"{name}.mp4")

        if os.path.isfile(video_file_path):
            return send_from_directory(
                recording_directory, f"{name}.mp4", as_attachment=True
            )


# API endpoint to get the default emoji GIF
@app.route("/emoji/play")
def play_default_emoji():
    return send_from_directory(
        emoji_directory, default_emoji_filename, as_attachment=True
    )


timer_value = 6


# API endpoint to get the timer value
@api.route("/timer")
class Timer(Resource):
    def get(self):
        return {"timer": timer_value}


@app.route("/recordedVideo")
def get_recorded_video():
    try:
        # Assuming your recorded video file is named 'recorded_video.mp4'
        video_path = os.path.join(recording_directory, "recorded_video.mp4")

        # Return the recorded video file
        return send_from_directory(
            recording_directory, "recorded_video.mp4", as_attachment=True
        )
    except FileNotFoundError:
        # Return a 404 response if the file is not found
        return {"message": "Recorded video not found"}, 404


# code for saving video in folders
recorded_videos_directory = "recorded_videos"


@api.route("/save-video")
class SaveVideo(Resource):
    @api.expect(emotion_model)
    def post(self):
        """Save recorded video based on selected emotion"""
        data = request.form  # Access form data

        if "name" not in data:
            return {"error": "Emotion name not provided"}, 400

        emotion_name = data["name"]

        # Check if the provided emotion is valid
        if emotion_name not in emotions:
            return {"error": "Invalid emotion"}, 400

        # Save the recorded video with a unique filename based on emotion and counter
        counter = get_next_counter(
            emotion_name
        )  # Implement the logic to get the next counter
        filename_webm = f"{counter}_{emotion_name}.webm"

        file_path_webm = os.path.join(recorded_videos_directory, filename_webm)

        try:
            video_data = request.files["video"]
            video_data.save(file_path_webm)
        except Exception as e:
            print(f"Error saving file: {e}")

        return {"message": "Video saved successfully", "filename": filename_webm}


# Function to get the next counter value
def get_next_counter(emotion):
    global counter, recorded_emotions
    if emotion in recorded_emotions and len(recorded_emotions) != len(emotions):
        return counter
    if len(recorded_emotions) != len(emotions):
        recorded_emotions.append(emotion)
    else:
        counter += 1
        recorded_emotions = []

    return counter


if __name__ == "__main__":
    counter = 0
    recorded_emotions = []
    app.run(debug=True, port=5000)
