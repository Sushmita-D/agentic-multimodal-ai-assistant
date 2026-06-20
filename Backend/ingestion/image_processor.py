import easyocr

# Load once
reader = easyocr.Reader(["en"])


def extract_image_text(image_path):
    """
    Extract text from an image using EasyOCR.
    """

    result = reader.readtext(image_path)

    text = ""

    for detection in result:
        text += detection[1] + " "

    return text.strip()