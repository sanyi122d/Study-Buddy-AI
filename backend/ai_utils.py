from PyPDF2 import PdfReader
from groq import Client
import os

# Inserted my API Key from Groq
client = Client(api_key="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")

def extract_text_from_pdf(file_bytes):
    from io import BytesIO
    reader = PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

# This function is summarizing the given file 
def summarize_text(text):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Summarize the *core findings and main conclusions* of the following study material in clear bullet points, ensuring each point is a complete idea. Keep the summary under 300 tokens, and structure the response clearly with bullet points:\n\n{text}"}
            ],
            max_tokens=300
        )
        
        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error: {str(e)}"
# Generating Quiz based on the file given 
def generate_quiz_questions(text):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Create 5 multiple-choice questions based on the following study material:\n\n{text}"}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

# Answering Questions based on the given file
def answer_user_question(context, question):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Generate a an important points of the asked questions following material:\n\n{context}\n\nQuestion: {question}\n\nProvide only important detailed answer:"}
            ],
            max_tokens=300
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"
