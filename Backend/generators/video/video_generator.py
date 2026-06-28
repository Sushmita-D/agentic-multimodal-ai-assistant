import os
import ffmpeg


# Backend folder
BASE_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".."
    )
)

OUTPUT_FOLDER = os.path.join(
    BASE_DIR,
    "generators",
    "outputs"
)

ASSETS_FOLDER = os.path.join(
    BASE_DIR,
    "generators",
    "video",
    "assets"
)


def generate_video(title: str):

    audio_path = os.path.join(
        OUTPUT_FOLDER,
        "Study_Notes.mp3"
    )

    image_path = os.path.join(
        ASSETS_FOLDER,
        "background.jpg"
    )

    video_path = os.path.join(
        OUTPUT_FOLDER,
        "Study_Video.mp4"
    )

    print("=" * 60)
    print("VIDEO GENERATOR")
    print("=" * 60)
    print("BASE DIR :", BASE_DIR)
    print("OUTPUT   :", OUTPUT_FOLDER)
    print("ASSETS   :", ASSETS_FOLDER)
    print("IMAGE    :", image_path)
    print("AUDIO    :", audio_path)
    print("VIDEO    :", video_path)

    print("Image Exists :", os.path.exists(image_path))
    print("Audio Exists :", os.path.exists(audio_path))
    print("Assets Exists:", os.path.exists(ASSETS_FOLDER))

    if os.path.exists(ASSETS_FOLDER):
        print("Files in assets:")
        print(os.listdir(ASSETS_FOLDER))

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Background image not found:\n{image_path}"
        )

    if not os.path.exists(audio_path):
        raise FileNotFoundError(
            f"Audio file not found:\n{audio_path}"
        )

    image = ffmpeg.input(
        image_path,
        loop=1,
        framerate=1
    )

    audio = ffmpeg.input(
        audio_path
    )

    try:

        (
            ffmpeg
            .output(
                image,
                audio,
                video_path,
                vcodec="libx264",
                acodec="aac",
                pix_fmt="yuv420p",
                shortest=None
            )
            .overwrite_output()
            .run()
        )

    except ffmpeg.Error as e:

        print("FFMPEG ERROR")

        if e.stderr:
            print(e.stderr.decode())

        raise

    print("Video Created Successfully")

    return video_path