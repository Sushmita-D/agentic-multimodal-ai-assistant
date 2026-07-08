from faster_whisper import WhisperModel

_model = None


def get_model():
    global _model

    if _model is None:
        _model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    return _model


def extract_audio_text(audio_path):
    """
    Converts speech to text using Faster Whisper.
    """

    model = get_model()

    segments, info = model.transcribe(
        audio_path,
        beam_size=5
    )

    transcript = ""

    for segment in segments:
        transcript += segment.text + " "

    return transcript.strip()