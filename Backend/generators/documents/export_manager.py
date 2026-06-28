from generators.documents.pdf_generator import generate_pdf
from generators.documents.docx_generator import generate_docx
from generators.documents.audio_generator import generate_audio
from generators.video.video_generator import generate_video

class ExportManager:

    async def export(
        self,
        format: str,
        title: str,
        content: str
    ):

        if format == "pdf":
            return generate_pdf(
                title,
                content
            )

        elif format == "docx":
            return generate_docx(
                title,
                content
            )

        elif format == "audio":
            return await generate_audio(
                title,
                content
            )
        elif format == "video":

            await generate_audio(
            title,
            content
            )

            return generate_video(
                title
            )    

        raise ValueError(
            f"Unsupported format: {format}"
        )


export_manager = ExportManager()