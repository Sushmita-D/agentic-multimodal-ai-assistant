# 🚀 Agentic Multi-Model AI Learning Assistant

An **Agentic AI-powered multimodal learning platform** built using **FastAPI, LangChain, LangGraph, PostgreSQL, and multiple LLM providers**. The platform enables users to upload documents in multiple formats, interact with them using Retrieval-Augmented Generation (RAG), and generate AI-powered learning resources including summaries, notes, quizzes, flashcards, PDFs, Word documents, audio lectures, and educational videos.

> ⚠️ **Current Status:** Version 2.0 (Active Development)
> Upcoming updates include conversation memory, multi-document reasoning, provider failover, cloud deployment, and production-ready observability.

---

# ✨ Features

### 📂 Multimodal Document Processing

* PDF document processing
* Image OCR
* Audio speech-to-text
* Video speech-to-text
* Automatic text extraction
* Semantic chunking
* Embedding generation

---

### 🧠 Retrieval-Augmented Generation (RAG)

* Semantic similarity search
* Context-aware document retrieval
* Embedding-based semantic search
* AI-powered contextual response generation

---

### 🤖 Agentic AI Workflow

Built using **LangGraph** with intelligent workflow routing.

* Question Answering Agent
* Summary Agent
* Study Notes Agent
* Quiz Generation Agent
* Flashcard Generation Agent
* Intelligent Router Agent

---

### 🧩 Multi-LLM Architecture

Supports multiple LLM providers through a centralized **LLM Manager**.

* Google Gemini
* OpenAI
* Ollama (Local LLM)

Provider selection is configuration-driven without changing application code.

---

### 📄 Learning Material Generation

Generate educational resources in multiple formats.

* PDF Notes
* DOCX Notes
* PowerPoint Presentations
* Audio Lectures (MP3)
* Animated Educational Videos (MP4)

---

### 🗄️ Database

* PostgreSQL integration
* Document metadata storage
* Chunk storage
* Embedding storage

---

# 🏗️ Architecture

```text
                    User

                      │

                      ▼

      PDF │ Image │ Audio │ Video Upload

                      │

                      ▼

          Text Extraction Pipeline

                      │

                      ▼

      Semantic Chunking + Embeddings

                      │

                      ▼

                PostgreSQL

                      │

                      ▼

              LangGraph Router

      ┌────────┬────────┬────────┬────────┐

      ▼        ▼        ▼        ▼

      QA    Summary   Notes    Quiz

                      │

                  Flashcards

                      │

                      ▼

                 LLM Manager

         ┌────────┬─────────┬─────────┐

         ▼        ▼         ▼

      Gemini   OpenAI    Ollama

                      │

                      ▼

               Export Manager

        ┌──────┬──────┬──────┬────────┐

        ▼      ▼      ▼      ▼

      PDF   DOCX    MP3    MP4
```

---

# 🛠️ Tech Stack

## Backend

* Python
* FastAPI

## AI & GenAI

* LangChain
* LangGraph
* Retrieval-Augmented Generation (RAG)
* Agentic AI
* Prompt Engineering

## LLM Providers

* Google Gemini
* OpenAI
* Ollama

## Database

* PostgreSQL

## AI Components

* Sentence Transformers
* Semantic Search
* OCR
* Speech-to-Text

## Output Generation

* ReportLab
* Python-Docx
* Edge TTS
* FFmpeg

## Tools

* Docker
* Git
* GitHub
* Postman

---

# 📂 Project Structure

```text
Agentic-MultiModel-AI-Learning-Assistant/

│── Backend/
│
├── agents/
│   ├── qa_agent.py
│   ├── summary_agent.py
│   ├── notes_agent.py
│   ├── quiz_agent.py
│   ├── flashcard_agent.py
│   ├── audio_agent.py
│   └── video_agent.py
│
├── generators/
│   └── documents/
│       ├── pdf_generator.py
│       ├── docx_generator.py
│       ├── audio_generator.py
│       ├── ppt_generator.py
│       ├── video_generator.py
│       ├── export_manager.py
│       ├── outputs/
│       └── templates/
│
├── graph/
│   ├── router.py
│   └── workflow.py
│
├── ingestion/
│   ├── pdf_processor.py
│   ├── image_processor.py
│   ├── audio_processor.py
│   └── video_processor.py
│
├── llm/
│   ├── providers/
│   │   ├── gemini.py
│   │   ├── openai.py
│   │   └── ollama.py
│   ├── manager.py
│   ├── config.py
│   └── base.py
│
├── rag/
│   ├── chunker.py
│   ├── embedder.py
│   ├── retriever.py
│   └── vector_store.py
│
├── uploads/
├── app.py
├── database.py
├── document_store.py
└── requirements.txt
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/agentic-multimodel-ai-learning-assistant.git
cd agentic-multimodel-ai-learning-assistant
```

## Create Virtual Environment

```bash
python -m venv venv
```

Activate

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r Backend/requirements.txt
```

## Configure Environment

Create a `.env` file inside the `Backend` folder.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=rag_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

DEFAULT_PROVIDER=gemini
ENVIRONMENT=development
```

## Run

```bash
cd Backend
uvicorn app:app --reload
```

Open

```
http://127.0.0.1:8000/docs
```

---

# 📌 API Endpoints

| Method | Endpoint      | Description                                                     |
| ------ | ------------- | --------------------------------------------------------------- |
| POST   | `/upload`     | Upload PDF, Image, Audio or Video                               |
| POST   | `/agent`      | Ask questions, summarize, generate notes, quizzes or flashcards |
| POST   | `/export/pdf` | Export AI-generated notes as PDF                                |

---

# 🚧 Roadmap

## ✅ Version 1.0

* PDF Processing
* RAG Pipeline
* PostgreSQL Integration
* LangGraph Workflow
* Question Answering
* Summary Generation

## ✅ Version 2.0

* Multi-LLM Support
* Notes Generation
* Quiz Generation
* Flashcards
* PDF Export

## 🔄 Version 3.0

* DOCX Export
* PowerPoint Generation
* Audio Lecture Generation
* Animated Video Generation
* Conversation Memory

## 🔄 Version 4.0

* Multi-document RAG
* LLM Failover
* Redis Caching
* Docker Compose
* Kubernetes
* AWS/GCP Deployment
* Monitoring & Logging

---

# 🎯 Future Goals

* Multi-Agent Collaboration
* Authentication & Authorization
* Chat History
* Production Deployment
* LLM Observability
* Streaming Responses
* MCP Integration
* Cloud-Native AI Architecture

---

# 👩‍💻 Author

**Sushmita D**

**Generative AI | Agentic AI | RAG | LangGraph | FastAPI | Python | PostgreSQL | LLM Applications**

---

⭐ If you found this project useful, consider giving it a star.
