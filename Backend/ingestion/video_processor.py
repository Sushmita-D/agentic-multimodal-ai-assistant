import os
import subprocess

from ingestion.audio_processor import extract_audio_text


def extract_video_text(video_path):
    """
    Extracts audio from a video using FFmpeg
    and converts it to text using Faster Whisper.
    """

    audio_path = "uploads/temp_audio.wav"

    command = [
        "ffmpeg",
        "-y",
        "-i",
        video_path,
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "1",
        audio_path
    ]

    subprocess.run(
        command,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    transcript = extract_audio_text(audio_path)

    if os.path.exists(audio_path):
        os.remove(audio_path)

    return transcript