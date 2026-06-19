# 🚀 Agentic Multimodal AI Assistant

An **Agentic AI-powered document understanding platform** built using **FastAPI, LangGraph, RAG, PostgreSQL, and Google Gemini**. The application enables users to upload documents, ask context-aware questions, generate summaries, and create quizzes using Retrieval-Augmented Generation (RAG).

> ⚠️ **Current Status:** MVP (Version 1.0)
> Future updates will include multi-document support, conversation memory, audio/video processing, and DevOps deployment.

---

# ✨ Features

### 📄 Intelligent PDF Processing

* Upload PDF documents
* Automatic text extraction
* Semantic text chunking
* Overlapping chunk generation
* Embedding generation using Sentence Transformers

### 🧠 Retrieval-Augmented Generation (RAG)

* Semantic similarity search
* Context-aware document retrieval
* Gemini-powered response generation

### 🤖 Agentic AI Workflow

* Question Answering Agent
* Document Summary Agent
* Quiz Generation Agent
* LangGraph-based routing

### 🗄️ Database

* PostgreSQL integration
* Document chunk storage
* Embedding storage

---

# 🏗️ Architecture

```text
                User

                  │

                  ▼

            Upload PDF

                  │

                  ▼

         PDF Text Extraction

                  │

                  ▼

      Semantic Chunking + Overlap

                  │

                  ▼

     Sentence Transformer Embeddings

                  │

                  ▼

             PostgreSQL

                  │

                  ▼

            LangGraph Router

      ┌──────────┼───────────┐

      ▼          ▼           ▼

     QA      Summary      Quiz

                  │

                  ▼

             Gemini LLM

                  │

                  ▼

               Response
```

---

# 🛠️ Tech Stack

## Backend

* Python
* FastAPI

## AI & LLM

* Google Gemini
* LangChain
* LangGraph
* Sentence Transformers

## Database

* PostgreSQL

## RAG

* Semantic Chunking
* Embedding Generation
* Context Retrieval

## Tools

* Git
* GitHub
* Postman

---

# 📂 Project Structure

```text
Agentic-Multimodal-AI-Assistant/

│── Backend/
│
├── agents/
│   ├── qa_agent.py
│   ├── summary_agent.py
│   └── quiz_agent.py
│
├── graph/
│   ├── router.py
│   └── workflow.py
│
├── ingestion/
│   └── pdf_processor.py
│
├── llm/
│   ├── gemini.py
│   └── prompts.py
│
├── rag/
│   ├── chunker.py
│   ├── embedder.py
│   ├── retriever.py
│   └── vector_store.py
│
├── uploads/
├── generated/
│
├── app.py
├── database.py
├── document_store.py
└── requirements.txt
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Sushmita-D/agentic-multimodal-ai-assistant.git
cd agentic-multimodal-ai-assistant
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

## Create Environment File

Create a `.env` file inside the `Backend` folder.

```env
GEMINI_API_KEY=YOUR_API_KEY
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

| Method | Endpoint  | Description                                   |
| ------ | --------- | --------------------------------------------- |
| POST   | `/upload` | Upload a PDF document                         |
| POST   | `/agent`  | Ask questions, summarize, or generate quizzes |

---

# 🚧 Roadmap

## ✅ Version 1.0

* PDF Upload
* RAG Pipeline
* PostgreSQL Storage
* LangGraph Router
* Question Answering
* Summary Generation
* Quiz Generation

## 🔄 Version 2.0

* Multi-document support
* Conversation memory
* Flashcard generation
* Notes generation

## 🔄 Version 3.0

* Audio upload
* Video upload
* Whisper integration
* OCR support

## 🔄 Version 4.0

* Voice responses
* AI-generated educational videos
* Docker
* CI/CD
* AWS Deployment
* Redis
* pgVector

---

# 🎯 Future Goals

* Agent collaboration
* Multi-user authentication
* Chat history
* Production deployment
* Monitoring & Logging
* DevOps pipeline
* Cloud-native architecture

---

# 👩‍💻 Author

**Sushmita D**

AI • GenAI • Backend • FastAPI • LangGraph • RAG • PostgreSQL • Python

---

⭐ If you found this project interesting, consider giving it a star.
