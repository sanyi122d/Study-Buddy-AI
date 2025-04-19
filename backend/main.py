from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from backend.ai_utils import extract_text_from_pdf, summarize_text, generate_quiz_questions, answer_user_question

uploaded_text_storage = ""

app = FastAPI()

# Connecting with my front-end
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Home page connecting to index.html
@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("frontend/index.html", "r") as f:
        return f.read()


# File upload route
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    global uploaded_text_storage
    contents = await file.read()
    extracted_text = extract_text_from_pdf(contents)
    uploaded_text_storage = extracted_text
    return {"text": extracted_text}

# Summarize text route
@app.get("/summarize/")
async def summarize():
    global uploaded_text_storage
    summary = summarize_text(uploaded_text_storage)
    return {"summary": summary}

# Quiz generation route
@app.get("/generate-quiz/")
async def quiz():
    global uploaded_text_storage
    questions = generate_quiz_questions(uploaded_text_storage)
    return {"questions": questions}

# Question and Answers route
@app.post("/ask/")
async def ask_question(data: dict):
    global uploaded_text_storage
    question = data.get("question")
    answer = answer_user_question(uploaded_text_storage, question)
    return {"answer": answer}

