# 🚀 Agentic Multimodal AI Learning Assistant

An enterprise-style **Agentic AI Learning Platform** that enables users to upload multimodal documents, retrieve contextual knowledge using **Retrieval-Augmented Generation (RAG)**, and generate AI-powered learning resources including summaries, notes, quizzes, flashcards, documents, audio lectures, and educational videos.

The project is built with **FastAPI**, **LangGraph**, **LangChain**, **PostgreSQL + pgVector**, and supports multiple LLM providers through a unified architecture.

---

## 🌟 Key Features

### 📚 Multimodal Document Ingestion

* PDF text extraction
* Image OCR
* Audio transcription
* Video transcription
* Automatic text preprocessing
* Semantic chunking
* Embedding generation

---

### 🧠 Production RAG Pipeline

* SentenceTransformer embeddings
* PostgreSQL + pgVector vector database
* Semantic similarity search
* Top-K vector retrieval
* Context-aware answer generation
* Scalable database-backed retrieval

---

### 🤖 Agentic AI Workflow (LangGraph)

The application uses LangGraph to intelligently route user requests to specialized AI agents.

Available agents:

* Question Answering Agent
* Summary Agent
* Study Notes Agent
* Quiz Generator
* Flashcard Generator
* Intelligent Router Agent

---

### 🧩 Multi-LLM Architecture

A centralized LLM Manager enables switching providers without changing application code.

Supported providers:

* Google Gemini
* Ollama (Local LLM)
* OpenAI

---

### 📄 AI Learning Material Generation

Generate learning resources in multiple formats.

* Study Notes
* Executive Summaries
* Quiz Generation
* Flashcards
* PDF Export
* DOCX Export
* Audio Lecture (MP3)
* Educational Video (MP4)

---

## 🏗️ System Architecture

```text
                           User
                             │
                             ▼
                    FastAPI REST API
                             │
      ┌──────────────────────┼───────────────────────┐
      ▼                      ▼                       ▼
 Upload API             Agent API             Export API
      │                      │
      ▼                      ▼
PDF │ Image │ Audio │ Video Processing
      │
      ▼
 Text Extraction Pipeline
      │
      ▼
 Semantic Chunking
      │
      ▼
 SentenceTransformer Embeddings
      │
      ▼
 PostgreSQL + pgVector
      │
      ▼
 Semantic Vector Retrieval
      │
      ▼
 LangGraph Workflow
      │
      ▼
 QA │ Summary │ Notes │ Quiz │ Flashcards
      │
      ▼
 LLM Manager
      │
 ┌────┼───────────┐
 ▼    ▼           ▼
Gemini OpenAI  Ollama
      │
      ▼
 Generated Response
      │
      ▼
 PDF │ DOCX │ MP3 │ MP4
```

---

## 🛠️ Technology Stack

### Backend

* Python
* FastAPI
* REST APIs

### AI & Generative AI

* LangChain
* LangGraph
* Retrieval-Augmented Generation (RAG)
* Agentic AI
* Prompt Engineering

### Vector Search

* PostgreSQL
* pgVector
* Sentence Transformers
* Semantic Search

### LLM Providers

* Google Gemini
* Ollama
* OpenAI

### Multimodal Processing

* OCR
* Speech-to-Text
* Video-to-Text

### Document Generation

* ReportLab
* Python-Docx
* Edge-TTS
* FFmpeg

### Development Tools

* Git
* GitHub
* Docker
* Postman

---

## 📂 Project Structure

```text
Backend/
│
├── agents/
├── graph/
├── rag/
├── ingestion/
├── generators/
├── llm/
├── uploads/
├── app.py
├── database.py
├── document_store.py
└── requirements.txt
```

---

## 🚀 Core Workflow

1. User uploads a PDF, image, audio, or video.
2. The system extracts text using the appropriate ingestion pipeline.
3. Text is semantically chunked.
4. SentenceTransformer generates embeddings.
5. Chunks and embeddings are stored in PostgreSQL using pgVector.
6. User submits a question.
7. The question is embedded.
8. pgVector retrieves the Top-K most relevant chunks.
9. LangGraph routes the request to the appropriate AI agent.
10. The selected LLM generates a grounded response.
11. Users can export generated learning materials as PDF, DOCX, MP3, or MP4.

---

## 📡 API Endpoints

| Method | Endpoint  | Description                          |
| ------ | --------- | ------------------------------------ |
| POST   | `/upload` | Upload multimodal documents          |
| POST   | `/agent`  | Ask questions or generate AI content |
| POST   | `/export` | Export generated study materials     |

---

## 🚀 Current Capabilities

* Multi-format document ingestion
* OCR and Speech-to-Text
* Production-style RAG pipeline
* pgVector semantic retrieval
* LangGraph agent orchestration
* Multi-provider LLM architecture
* AI-generated summaries
* Notes generation
* Quiz generation
* Flashcard generation
* PDF export
* DOCX export
* Audio generation
* Educational video generation

---

## 🔮 Planned Improvements

* Source citations
* Conversation memory
* Hybrid search (Vector + Keyword)
* Streaming LLM responses
* Multi-document reasoning
* Retrieval performance optimization
* Production observability

---

## 👩‍💻 Author

**Sushmita D**

Generative AI • Agentic AI • RAG • LangGraph • FastAPI • Python • PostgreSQL • pgVector • LLM Applications

---

⭐ If you found this project useful, consider giving it a star.
