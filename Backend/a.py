from agents.storyboard_agent import generate_storyboard
from agents.teacher_agent import generate_teaching_script
from agents.slide_agent import generate_slides

document = """
Python is a programming language.

It supports object-oriented programming.

Python is used in AI.
"""

script = generate_teaching_script(document)

storyboard = generate_storyboard(script)

slides = generate_slides(storyboard)

print(slides)