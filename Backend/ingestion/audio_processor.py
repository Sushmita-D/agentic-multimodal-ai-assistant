from faster_whisper import WhisperModel

# Load model only once when the application starts
model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)


def extract_audio_text(audio_path):
    """
    Converts speech to text using Faster Whisper.
    """

    segments, info = model.transcribe(
        audio_path,
        beam_size=5
    )

    transcript = ""

    for segment in segments:
        transcript += segment.text + " "

    return transcript.strip()