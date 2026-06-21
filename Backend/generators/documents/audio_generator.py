import asyncio
import os

import edge_tts

OUTPUT_FOLDER = "generators/outputs"

os.makedirs(
    OUTPUT_FOLDER,
    exist_ok=True
)


async def generate_audio(
    title: str,
    content: str
):

    file_path = os.path.join(
        OUTPUT_FOLDER,
        "Study_Notes.mp3"
    )

    communicate = edge_tts.Communicate(
        text=content,
        voice="en-US-AriaNeural"
    )

    await communicate.save(
        file_path
    )

    return file_path