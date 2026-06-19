from ingestion.audio_processor import extract_audio_text

text = extract_audio_text("uploads/mp.ogg")

print(text)