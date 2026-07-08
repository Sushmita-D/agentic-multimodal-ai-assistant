<div align="center">

# 🚀 Agentic Multimodal AI Learning Assistant

### Enterprise-Grade Agentic AI Platform for Intelligent Document Understanding & Learning

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)]()
[![LangChain](https://img.shields.io/badge/LangChain-Latest-green)]()
[![LangGraph](https://img.shields.io/badge/LangGraph-Agentic%20Workflow-blue)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)]()
[![pgVector](https://img.shields.io/badge/pgVector-Vector%20Database-purple)]()
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)]()
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-success)]()

</div>

---

# 📖 Overview

**Agentic Multimodal AI Learning Assistant** is an enterprise-inspired AI platform that enables users to upload **PDFs, Images, Audio, and Video** and interact with their content through intelligent conversations powered by **Retrieval-Augmented Generation (RAG)** and **Agentic AI workflows**.

Unlike traditional document chatbots, the platform integrates **LangGraph**, **FastAPI**, **PostgreSQL + pgVector**, and **multiple LLM providers** to orchestrate specialized AI agents capable of generating contextual answers, summaries, notes, quizzes, flashcards, and exportable learning resources.

The project follows a modular architecture similar to enterprise AI systems, emphasizing scalability, maintainability, and production-ready backend design.

---

# 🎯 Problem Statement

Students, educators, and professionals frequently work with large volumes of documents such as research papers, lecture notes, technical manuals, and multimedia learning resources.

Traditional AI assistants often face several limitations:

- Lack of multimodal document understanding
- Poor contextual retrieval
- Limited conversation memory
- Inaccurate responses due to missing document context
- No automated generation of study materials
- Inability to process audio and video content

These challenges reduce the effectiveness of AI-assisted learning and document understanding.

---

# 💡 Solution

The Agentic Multimodal AI Learning Assistant addresses these challenges through an enterprise-style AI architecture that combines:

- Retrieval-Augmented Generation (RAG)
- LangGraph Agent Orchestration
- Semantic Vector Search
- PostgreSQL + pgVector
- Multimodal Document Processing
- Multi-Provider LLM Support
- AI-powered Learning Material Generation

The platform transforms uploaded documents into searchable knowledge bases and enables intelligent interactions using contextual retrieval and specialized AI agents.

---

# ✨ Key Features

## 📂 Multimodal Document Processing

Supports multiple document formats:

- 📄 PDF Documents
- 🖼 Images
- 🎤 Audio Files
- 🎥 Video Files

Automatically performs:

- PDF Text Extraction
- OCR-based Image Text Extraction
- Speech-to-Text Transcription
- Video Audio Extraction
- Text Cleaning
- Semantic Chunking
- Embedding Generation

---

## 🧠 Retrieval-Augmented Generation (RAG)

Production-style RAG pipeline featuring:

- Semantic Chunking
- SentenceTransformer Embeddings
- PostgreSQL Vector Storage
- pgVector Similarity Search
- Context Retrieval
- Grounded Response Generation
- Retrieval-Based Question Answering

---

## 🤖 Agentic AI Workflow

The application utilizes **LangGraph** to dynamically route user requests to specialized AI agents.

Available AI Agents:

- 💬 Question Answering Agent
- 📝 Summary Agent
- 📒 Notes Generator
- ❓ Quiz Generator
- 🗂 Flashcard Generator

The Router Agent automatically determines which specialized agent should handle each request based on user intent.

---

## 🔀 Multi-LLM Provider Support

The platform abstracts LLM providers through a centralized provider manager.

Supported Models:

- Google Gemini
- Ollama (Local LLM)
- OpenAI

This architecture enables switching providers without modifying application logic.

---

## 📚 AI Learning Material Generation

Generate educational resources directly from uploaded documents:

- Executive Summaries
- Structured Study Notes
- Multiple Choice Quizzes
- Flashcards
- PDF Export
- DOCX Export
- Audio Lecture Generation
- Educational Video Generation

---

# 🏆 Project Highlights

- Enterprise-inspired Backend Architecture
- Agentic AI using LangGraph
- Retrieval-Augmented Generation (RAG)
- Semantic Vector Search using pgVector
- FastAPI REST APIs
- Conversation History
- Multi-LLM Architecture
- Modular AI Agents
- Multimodal Document Processing
- Dockerized Backend
- Production-oriented Project Structure

  # 🏗️ Enterprise System Architecture

```text
                                    ┌─────────────────────────────┐
                                    │           User              │
                                    └──────────────┬──────────────┘
                                                   │
                                                   ▼
                                ┌──────────────────────────────┐
                                │   React + TypeScript (Vite)  │
                                │        Frontend UI           │
                                └──────────────┬───────────────┘
                                               │
                                       REST API (HTTP)
                                               │
                                               ▼
                           ┌────────────────────────────────────┐
                           │        FastAPI Backend             │
                           └──────────────┬─────────────────────┘
                                          │
             ┌────────────────────────────┼────────────────────────────┐
             ▼                            ▼                            ▼
      Upload API                    Agent API                  Export API
             │                            │                            │
             └──────────────┬─────────────┴──────────────┬─────────────┘
                            ▼                            ▼
                  Multimodal Processing          LangGraph Workflow
                            │                            │
       ┌─────────────┬─────────────┬─────────────┬─────────────┐
       ▼             ▼             ▼             ▼
     PDF          Images         Audio         Video
       │             │             │             │
       └─────────────┴─────────────┴─────────────┘
                            │
                            ▼
              OCR / Speech-to-Text / PDF Parsing
                            │
                            ▼
                  Semantic Text Chunking
                            │
                            ▼
              SentenceTransformer Embeddings
                            │
                            ▼
               PostgreSQL + pgVector Database
                            │
                            ▼
                  Semantic Vector Retrieval
                            │
                            ▼
                  LangGraph Router Agent
                            │
        ┌───────────┬───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼
       QA       Summary       Notes       Quiz
                                            │
                                            ▼
                                      Flashcards
                                            │
                                            ▼
                                   LLM Provider Manager
                      ┌────────────────┼────────────────┐
                      ▼                ▼                ▼
                  Gemini API       Ollama         OpenAI API
                                            │
                                            ▼
                                   Generated Response
                                            │
                                            ▼
                          Chat │ PDF │ DOCX │ Audio │ Video
```

---

# 🔄 End-to-End Workflow

The application follows a Retrieval-Augmented Generation (RAG) workflow combined with LangGraph agent orchestration.

```text
User Uploads Document
          │
          ▼
PDF / Image / Audio / Video
          │
          ▼
Text Extraction
(PDF Parser / OCR / Whisper)
          │
          ▼
Semantic Chunking
          │
          ▼
Embedding Generation
          │
          ▼
PostgreSQL + pgVector
          │
          ▼
Semantic Similarity Search
          │
          ▼
Relevant Context Retrieval
          │
          ▼
LangGraph Router
          │
          ▼
QA │ Summary │ Notes │ Quiz │ Flashcards
          │
          ▼
Gemini / Ollama / OpenAI
          │
          ▼
Generated AI Response
          │
          ▼
Frontend Display & Export
```

---

# 🧠 Retrieval-Augmented Generation (RAG) Pipeline

The project implements a modular RAG architecture consisting of:

### 1. Document Ingestion

- PDF Parsing
- Image OCR
- Audio Transcription
- Video Transcription

↓

### 2. Text Preprocessing

- Cleaning
- Normalization
- Semantic Chunking

↓

### 3. Embedding Generation

Using Sentence Transformers to convert document chunks into dense vector embeddings.

↓

### 4. Vector Storage

Embeddings are stored inside PostgreSQL using **pgVector**.

↓

### 5. Semantic Retrieval

Relevant document chunks are retrieved using vector similarity search.

↓

### 6. Context Injection

Retrieved context is injected into prompts before sending requests to the LLM.

↓

### 7. Grounded Response Generation

LLMs generate accurate responses using retrieved document context instead of relying solely on model knowledge.

---

# 🤖 LangGraph Agent Workflow

The project uses LangGraph to orchestrate specialized AI agents.

```text
                  User Prompt
                       │
                       ▼
                Router Agent
                       │
        ┌──────────────┼───────────────┐
        ▼              ▼               ▼
      QA Agent     Summary Agent    Notes Agent
        │
        ├──────────────┐
        ▼              ▼
 Quiz Agent     Flashcard Agent
        │
        ▼
 LLM Provider Manager
        │
        ▼
 Generated Response
```

Each agent performs a dedicated task, allowing the system to remain modular and scalable.

---

# ⚙️ Technology Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React | User Interface |
| TypeScript | Type Safety |
| Vite | Build Tool |
| CSS | Styling |
| Axios | API Communication |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Python | Programming Language |
| FastAPI | REST APIs |
| Uvicorn | ASGI Server |

---

## AI & Agentic AI

| Technology | Purpose |
|------------|---------|
| LangChain | LLM Integration |
| LangGraph | Agent Workflow |
| Prompt Engineering | Response Optimization |
| Retrieval-Augmented Generation | Context-Aware AI |

---

## Vector Search

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Database |
| pgVector | Vector Storage |
| Sentence Transformers | Embeddings |
| Semantic Search | Context Retrieval |

---

## LLM Providers

- Google Gemini
- Ollama
- OpenAI

---

## Multimodal Processing

- OCR
- Whisper Speech-to-Text
- PDF Processing
- Image Processing
- Audio Processing
- Video Processing

---

## Export Utilities

- ReportLab
- Python-Docx

---

## DevOps

- Docker
- Git
- GitHub

---

# 📂 Project Structure

```text
Agentic-Multimodal-AI-Learning-Assistant
│
├── Backend
│   ├── agents
│   ├── generators
│   ├── graph
│   ├── ingestion
│   ├── llm
│   ├── rag
│   ├── uploads
│   ├── app.py
│   ├── database.py
│   ├── document_store.py
│   ├── conversation_store.py
│   ├── document_service.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── components
│   ├── services
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```
# 🚀 Getting Started

## Prerequisites

Before running the project, ensure you have the following installed:

- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- pgVector Extension
- Docker (Optional)
- Git

---

# 📥 Clone the Repository

```bash
git clone https://github.com/your-username/agentic-multimodal-ai-learning-assistant.git

cd agentic-multimodal-ai-learning-assistant
```

---

# ⚙️ Backend Setup

Navigate to the backend directory.

```bash
cd Backend
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate it.

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run the FastAPI server.

```bash
uvicorn app:app --reload
```

Backend will be available at:

```
http://localhost:8000
```

---

# 💻 Frontend Setup

Navigate to the frontend directory.

```bash
cd frontend
```

Install packages.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

# 🔐 Environment Variables

Create a `.env` file inside the Backend folder.

Example:

```env
GOOGLE_API_KEY=your_gemini_api_key

OPENAI_API_KEY=your_openai_api_key

DEFAULT_PROVIDER=gemini

DATABASE_HOST=localhost

DATABASE_PORT=5432

DATABASE_NAME=agentic_ai

DATABASE_USER=postgres

DATABASE_PASSWORD=password
```

---

# 🐳 Docker Deployment

Build the containers.

```bash
docker-compose build
```

Start all services.

```bash
docker-compose up
```

Run in detached mode.

```bash
docker-compose up -d
```

Stop containers.

```bash
docker-compose down
```

---

# 📡 REST API Endpoints

## Upload Document

```http
POST /upload
```

Uploads PDF, Image, Audio, or Video files.

---

## AI Agent

```http
POST /agent
```

Handles:

- Question Answering
- Document Summary
- Study Notes
- Quiz Generation
- Flashcards

---

## Export Learning Materials

```http
POST /export
```

Supported formats:

- PDF
- DOCX

---

## Get Uploaded Documents

```http
GET /documents
```

Returns all uploaded documents.

---

## Get Conversation History

```http
GET /history/{document_id}
```

Returns previous conversations for a document.

---

# 📸 Application Screenshots

The following screenshots demonstrate the application's workflow.

- Landing Page
- Document Upload
- AI Chat Interface
- Question Answering
- Document Summary
- Study Notes
- Quiz Generation
- Flashcards
- Document History
- Export Options

> Screenshots can be found in the `/docs/screenshots` directory.

---

# 🔒 Security Features

- Environment-based configuration
- Modular LLM provider abstraction
- Input validation
- REST API validation
- Secure database storage
- Dockerized deployment
- Separation of business logic
- Modular project architecture

---

# 📈 Future Enhancements

- JWT Authentication
- Multi-user Support
- Role-Based Access Control (RBAC)
- Conversation Memory Optimization
- Hybrid Search (Vector + Keyword)
- Streaming LLM Responses
- AI Teacher Mode
- Voice-Based Learning Assistant
- AI Presentation Generator
- Educational Video Generation
- AWS Deployment
- Kubernetes
- CI/CD Pipeline
- MCP Integration
- LLM Observability & Monitoring

---

# 🎯 Project Highlights

- Enterprise-style AI architecture
- Multimodal document understanding
- Production-inspired Retrieval-Augmented Generation (RAG)
- LangGraph agent orchestration
- PostgreSQL + pgVector semantic retrieval
- Multiple LLM provider support
- Context-aware AI conversations
- AI-generated learning resources
- Modular backend architecture
- RESTful API design
- Dockerized deployment
- Scalable and maintainable codebase

---

# 👩‍💻 Author

**Sushmita D**

Aspiring AI & Full Stack Engineer

**Technical Interests**

- Generative AI
- Agentic AI
- Retrieval-Augmented Generation (RAG)
- LangGraph
- LangChain
- FastAPI
- Python
- PostgreSQL
- Vector Databases
- LLM Applications
- Backend Engineering

---

# 📄 License
Copyright © 2026 Sushmita D.

All Rights Reserved.

This project is shared for portfolio and demonstration purposes only.
Unauthorized copying, modification, or redistribution is prohibited without prior permission.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Contributions, suggestions, and feedback are always welcome.
