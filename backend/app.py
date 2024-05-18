import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_pymongo import pymongo
from groq import Groq
import requests

load_dotenv()

GEMINI_MODEL_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+GEMINI_MODEL_KEY

app = Flask(__name__)

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
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": modified_content,
            }
        ],
        model="llama3-70b-8192",
    )
    
     
    # headers = {"Content-Type": "application/json"}
    

    # data = {
    #     "contents": [
    #         {
    #             "parts": [
    #                 {
    #                     "text": modified_content
    #                 }
    #             ]
    #         }
    #     ],
    #     "safety_settings": [
    #         {
    #             "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    #             "threshold": "BLOCK_NONE"
    #         }
    #     ]
    # }
    
    # response = requests.post(GEMINI_MODEL_URL, headers=headers, json=data)
    # response = response.json()
    # text = response["candidates"][0]["content"]["parts"][0]["text"]

    # cursor = user_collection.find()
    # # Iterate over the cursor to access the documents
    # for document in cursor:
    #     print(document)
    return jsonify({"input":modified_content,"output":chat_completion.choices[0].message.content})
    # return jsonify({"input":modified_content,"output":text})
    

if __name__ == '__main__':
    user_collection = db_conn() 
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    app.run(debug=True)