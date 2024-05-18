import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_pymongo import pymongo
from flask_cors import CORS
from groq import Groq
import requests
from requests.auth import HTTPBasicAuth
import json
from datetime import datetime
import glob
import speech_recognition as sr
from pydub import AudioSegment
from bson import json_util

load_dotenv()

GEMINI_MODEL_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+GEMINI_MODEL_KEY

app = Flask(__name__)
CORS(app)

# def insert_data():
#     x = user_collection.insert_many(documents)
#     print(x.inserted_ids)

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

@app.route('/api/fetch-issues',methods=["GET"])
def fetch_jira_issues():
    url='https://dwivedimav.atlassian.net/rest/api/2/search?jql=assignee="Mansi Dwivedi"'
    auth = HTTPBasicAuth(os.getenv("JIRA_USERNAME"), os.getenv("JIRA_ACCESSKEY"))
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    response = requests.request(
        "GET",
        url,
        headers=headers,
        auth=auth
    )
    issues = []
    for i in response.json()["issues"]:
        # break
        issues.append({"id":i["key"],"project_name":i["fields"]["project"]["name"],"summary":i["fields"]["summary"],"time":i["fields"]["updated"],"assigner":i["fields"]["reporter"]["displayName"],"description":i["fields"]["description"]})
    return jsonify({"issues":issues,"all":response.json()["issues"]})

@app.route('/api/meetings', methods=['GET'])
def get_meetings():
    meetings = list(user_collection.find({}))
    return jsonify({'meetings': json.loads(json_util.dumps(meetings))})


@app.route('/api/add_meeting', methods=['POST'])
def add_meeting():
    meeting_id = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    agenda = "Sprint Concluding Meeting"
    transcript = ""

    # Insert the new entry into the database
    meeting = {
        "meeting_id": meeting_id,
        "agenda": agenda,
        "transcript": transcript
    }
    result = user_collection.insert_one(meeting)

    # Return a success message
    if result.inserted_id:
        return jsonify({'message': 'Meeting added successfully'}), 201
    else:
        return jsonify({'error': 'Failed to add meeting'}), 500


@app.route('/api/send_message', methods=['POST'])
def chat():
    # Get meeting ID and question from the request
    meeting_id = request.json.get('meeting_id')
    question = request.json.get('question')

    # Retrieve the transcript for the specified meeting ID from the database
    meeting = user_collection.find_one({'meeting_id': meeting_id})
    if not meeting:
        return jsonify({'error': 'Meeting not found'}), 404

    transcript = meeting.get('transcript', '')

    with open('prompts/chat.txt', 'r') as file:
        content = file.read()


    prompt=f"{content} \n <transcript> {transcript} </transcript> \n <question> {question} </question>"
    

    MODEL_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+MODEL_KEY
     
    headers = {"Content-Type": "application/json"}

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



def get_latest_folder(path):
    # Get list of all directories in the specified path
    directories = [d for d in glob.glob(os.path.join(path, '*')) if os.path.isdir(d)]
    
    # If there are no directories, return None or raise an exception
    if not directories:
        return None
    
    # Get the latest directory based on modification time
    latest_folder = max(directories, key=os.path.getmtime)
    latest_folder = os.path.abspath(latest_folder)
    
    return latest_folder

def get_m4a_file(folder_path):
    # Define the pattern to match .m4a files
    pattern = os.path.join(folder_path, '*.m4a')
    
    # Use glob to get all files matching the pattern
    m4a_file = glob.glob(pattern)
    
    return m4a_file

# Define route for processing audio and updating meeting entry
@app.route('/api/get_chat', methods=['POST'])
def open_chat():
    try:
        path = "D:\Mansi\hacks\dtdl\Zoom"   # Replace path with the path of the Zoom folder
        latest_folder = get_latest_folder(path)
        print(latest_folder)
        
        # Get the M4A file in the latest folder
        m4a_file = get_m4a_file(latest_folder)
        print(m4a_file)
        
        if m4a_file:
            # Convert M4A to WAV
            recording = AudioSegment.from_file(m4a_file[0], format="m4a") 
            recording.export("out.wav", format="wav") 
            
            # Convert speech to text
            r = sr.Recognizer()
            audio_file = sr.AudioFile('out.wav') 
            with audio_file as source:
                audio = r.record(source)
            
            transcript = r.recognize_google(audio)
            
            # Get the last added meeting entry from the database
            last_meeting = user_collection.find_one(sort=[('_id', -1)])
            
            # Update the transcript field of the last meeting entry
            user_collection.update_one({'_id': last_meeting['_id']}, {'$set': {'transcript': transcript}})
        return jsonify({'message': '"Welcome! How can I assist you today?"'}), 200
            
    except:
        return jsonify({'error': 'Try again!'}), 404


if __name__ == '__main__':
    user_collection = db_conn()
    # insert_data()
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    app.run(debug=True)