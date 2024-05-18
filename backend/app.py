import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_pymongo import pymongo

load_dotenv()

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
    cursor = user_collection.find()
    # Iterate over the cursor to access the documents
    for document in cursor:
        print(document)
    return jsonify({"userinput":modified_content})

if __name__ == '__main__':
    user_collection = db_conn()
    app.run(debug=True)