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
    pass