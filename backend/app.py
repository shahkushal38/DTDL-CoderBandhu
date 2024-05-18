import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_pymongo import pymongo
from flask_cors import CORS
import requests
from groq import Groq

from prompts.design import *

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

@app.route('/api/testing', methods=['POST'])
def testing_code():
    # Parse the input string from the request body
    input_data = request.data.decode('utf-8')
    if not input_data:
        return jsonify({"error": "Invalid input"}), 400
    # Define the message structure


    #read prompt
    with open('prompts/testing.txt', 'r') as file:
        prompt = file.read()

    client = Groq(api_key="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")

    chat_completion = client.chat.completions.create(

        messages=[
            
            {
                "role": "system",
                "content":f''' {prompt}
                              


                                '''
            },
            # Set a user message for the assistant to respond to.
            {
                "role": "user",
                "content": f'''
                        {input_data}
                ''',
            }
        ],

        # The language model which will generate the completion.
        model="llama3-8b-8192",

        #
        # Optional parameters
        #

        # Controls randomness: lowering results in less random completions.
        # As the temperature approaches zero, the model will become deterministic
        # and repetitive.
        temperature=0.5,

        # The maximum number of tokens to generate. Requests can use up to
        # 32,768 tokens shared between prompt and completion.
        max_tokens=1024,

        # Controls diversity via nucleus sampling: 0.5 means half of all
        # likelihood-weighted options are considered.
        top_p=1,

        # A stop sequence is a predefined or user-specified text string that
        # signals an AI to stop generating content, ensuring its responses
        # remain focused and concise. Examples include punctuation marks and
        # markers like "[end]".
        stop=None,

        # If set, partial message deltas will be sent.
        stream=False,
    )

    completion_content = chat_completion.choices[0].message.content

    # Return the response
    return jsonify({"Test_code": completion_content})


if __name__ == '__main__':
    user_collection = db_conn()
    app.run(debug=True)