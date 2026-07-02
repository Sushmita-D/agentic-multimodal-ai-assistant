from conversation_store import (
    save_message,
    load_history
)

save_message(
    11,
    "user",
    "What is Bubble Sort?"
)

save_message(
    11,
    "assistant",
    "Bubble Sort is a sorting algorithm."
)

print(load_history(11))