from pypdf import PdfReader


def extract_text(pdf_path):
    """
    Extract text page-by-page.

    Returns:
    [
        {
            "page": 1,
            "text": "..."
        },
        {
            "page": 2,
            "text": "..."
        }
    ]
    """

    reader = PdfReader(pdf_path)

    print("Pages:", len(reader.pages))

    pages = []

    for i, page in enumerate(reader.pages):

        page_text = page.extract_text()

        print(f"Page {i + 1}")
        print(repr(page_text))

        if page_text:

            pages.append(
                {
                    "page": i + 1,
                    "text": page_text
                }
            )

    print("Total Pages Extracted:", len(pages))

    return pages