from groq import Groq
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import PyPDF2
from PIL import Image
import pytesseract as tess  # Add this import for OCR

load_dotenv()
client = Groq()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# tess.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'


def extract_text_from_pdf(pdf_file: str) -> str:
    with open(pdf_file, 'rb') as pdf:
        reader = PyPDF2.PdfReader(pdf, strict=False)
        pdf_text = []

        for page in reader.pages:
            text = page.extract_text()
            pdf_text.append(text)
        return "\n".join(pdf_text)

@app.route('/upload', methods=['POST'])
def upload_file():
    print("Received request:", request.data)  # Log the raw request data
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and (file.filename.endswith('.pdf') or file.filename.endswith(('.png', '.jpg', '.jpeg'))):
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)

        # Perform OCR
        if file_path.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(file_path)
        else:
            img = Image.open(file_path)
            extracted_text = tess.image_to_string(img)

        # Clean up the uploaded file
        os.remove(file_path)

        return jsonify({"extracted_text": extracted_text}), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400

@app.route('/extract', methods=['POST'])
def extract():
    data = request.json
    inp = data['text']

    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"""
                    Extract each and every attribute from the following text related to job descriptions or internships or webinars or any events and state it in a key-value pair format.
                    Example of output: 
                    Company - Companyname
                    
                    .
                    Here is the text: {inp}"""
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response_content = ""
    for chunk in completion:
        response_content += chunk.choices[0].delta.content or ""

    print("Response content:", response_content)
    
    try:
        # Parse the content into a dictionary
        extracted_keywords = {}
        for line in response_content.split('\n'):
            if ' - ' in line:
                key, value = line.split(' - ', 1)
                extracted_keywords[key.strip()] = value.strip()
        
        return jsonify(extracted_keywords), 200
    except Exception as e:
        print("Unexpected error:", e)
        return jsonify({"error": "An unexpected error occurred"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)