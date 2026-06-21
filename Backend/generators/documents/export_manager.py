from generators.documents.pdf_generator import generate_pdf
from generators.documents.docx_generator import generate_docx
from generators.documents.audio_generator import generate_audio


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

        raise ValueError(
            f"Unsupported format: {format}"
        )


export_manager = ExportManager()