from ingestion.video_processor import extract_video_text

text = extract_video_text(
    "uploads/video.mkv"
)

print(text)