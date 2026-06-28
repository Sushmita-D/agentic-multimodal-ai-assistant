from llm.manager import llm_manager
import json


def generate_storyboard(teaching_script):

    question = """
You are an educational storyboard creator.

Convert the teaching script into a JSON storyboard.

Each scene must contain:

- scene_number
- title
- narration
- bullet_points
- visual_description
- duration_in_seconds

Rules:

- Keep each narration short.
- Split long explanations into multiple scenes.
- Visual descriptions should explain what should appear on screen.
- Return ONLY valid JSON.

Example:

[
  {
    "scene_number":1,
    "title":"Introduction",
    "narration":"Welcome to today's lesson...",
    "bullet_points":[
      "Point 1",
      "Point 2"
    ],
    "visual_description":"Animated title with Python logo",
    "duration_in_seconds":15
  }
]
"""

    response = llm_manager.generate(
        teaching_script,
        question
    )

    try:
        return json.loads(response)
    except json.JSONDecodeError:
        print(response)
        raise ValueError("Invalid storyboard JSON received from LLM")