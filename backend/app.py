from groq import Groq
import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from dotenv import load_dotenv

load_dotenv()
client = Groq()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})



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