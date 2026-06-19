from pypdf import PdfReader

def extract_text(pdf_path):

    reader = PdfReader(pdf_path)

    print("Pages:", len(reader.pages))

    text = ""

    for i, page in enumerate(reader.pages):

        page_text = page.extract_text()

        print(f"Page {i+1} text:")
        print(repr(page_text))

        if page_text:
            text += page_text + "\n"

    print("Final Length:", len(text))

    return text