import os

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph

OUTPUT_FOLDER = "generators/outputs"

os.makedirs(
    OUTPUT_FOLDER,
    exist_ok=True
)


def generate_pdf(
    title: str,
    content: str
):

    file_path = os.path.join(
        OUTPUT_FOLDER,
        "Study_Notes.pdf"
    )

    styles = getSampleStyleSheet()

    document = SimpleDocTemplate(
        file_path
    )

    story = []

    story.append(
        Paragraph(
            title,
            styles["Heading1"]
        )
    )

    story.append(
        Paragraph(
            content.replace("\n", "<br/>"),
            styles["BodyText"]
        )
    )

    document.build(story)

    return file_path