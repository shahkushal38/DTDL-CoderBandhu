import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_pymongo import pymongo
from flask_cors import CORS
import requests

from prompts.design import *
from prompts.security import *
from prompts.development import *

load_dotenv()

app = Flask(__name__)
CORS(app)

def db_conn():
    client = pymongo.MongoClient(os.getenv("MONGODB_URI"))
    db = client.get_database('codebandhu')
    user_collection = pymongo.collection.Collection(db, 'zoom_transcripts')
    return user_collection

@app.route('/', methods=['GET'])
def welcome():
    return "i'm fine!"


@app.route('/api/lakshya-bot',methods=["POST"])
def lakshay_bot():
    user_input = request.json["user_input"]
    with open('prompts/lakshay.txt', 'r') as file:
        content = file.read()
    modified_content = content.format(
        user_input=user_input
    )
    cursor = user_collection.find()
    # Iterate over the cursor to access the documents
    for document in cursor:
        print(document)
    return jsonify({"userinput":modified_content})

@app.route('/api/design', methods=["POST"])
def design_mermaid():
    user_input = request.json["user_input"]

    user_prompt = user_input["prompt"]
    diagram_type = user_input["diagram_type"]

    diagram_name = mermaid_prompts[diagram_type]["name"]
    diagram_code = mermaid_prompts[diagram_type]["code"]


    MODEL_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+MODEL_KEY
     
    headers = {"Content-Type": "application/json"}
    
    prompt = "Generate mermaid js \'" + diagram_name + " code\' for \'" + user_prompt + "\' . Example of mermaid js " + diagram_name + " is \'" + diagram_code + "\'"

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "safety_settings": [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
    }
    
    response = requests.post(MODEL_URL, headers=headers, json=data)
    response = response.json()
    text = response["candidates"][0]["content"]["parts"][0]["text"]
    
    return {"data": text}, 200

@app.route('/api/security', methods=["POST"])
def security_checks():
    user_input = request.json["user_input"]

    user_code = user_input["user_code"]

    MODEL_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+MODEL_KEY
     
    headers = {"Content-Type": "application/json"}
    
    prompt = security_prompts + user_code

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "safety_settings": [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
    }
    
    response = requests.post(MODEL_URL, headers=headers, json=data)
    response = response.json()
    text = response["candidates"][0]["content"]["parts"][0]["text"]
    
    return {"data": text}, 200

@app.route('/api/develop', methods=["POST"])
def development_code():
    user_input = request.json["user_input"]

    user_prompt = user_input["user_prompt"]
    user_code = user_input["user_code"]
    type = user_input["type"]

    MODEL_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+MODEL_KEY
     
    headers = {"Content-Type": "application/json"}
    prompt = ""
    if type == "rename": 
        prompt = "generate new code with proper language specific indentition for \'" + user_prompt + " \' for code: \'" + user_code + "\'." +  develop_prompts[type]
    elif type == "generate_from_comment":
        prompt = "generate code from the below comment with proper language specific indentition for \' "+ user_prompt + "\'" + develop_prompts[type]
    elif type == "question_answer":
        prompt = "Give answer to the question based on given code. question: \'" + user_prompt + "\'. code: \'" + user_code + "\'. " + develop_prompts[type] 

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "safety_settings": [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
    }
    
    response = requests.post(MODEL_URL, headers=headers, json=data)
    response = response.json()
    text = response["candidates"][0]["content"]["parts"][0]["text"]
    
    return {"data": text}, 200

if __name__ == '__main__':
    user_collection = db_conn()
    app.run(debug=True)