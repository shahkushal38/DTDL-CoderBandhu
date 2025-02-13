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
from flask_cors import CORS
import requests
from groq import Groq

from prompts.design import *
from prompts.security import *
from prompts.development import *

load_dotenv()

GEMINI_MODEL_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+GEMINI_MODEL_KEY
GITHUB_API_URL = "https://api.github.com/repos/mansidw/sample_flask_app_jenkins/contents"
HEADERS = {
    "Authorization": "Bearer "+os.getenv("GITHUB_PAT"),
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
}

app = Flask(__name__)
CORS(app)
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
    print(response)
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
        return jsonify({'message': '"Welcome! How can I assist you today mansi?"'}), 200
            
    except:
        return jsonify({'error': 'Try again!'}), 404


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
    
@app.route('/api/testing', methods=['POST'])
def testing_code():
    # Parse the input string from the request body
    input_data = request.json["user_code"]
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
    return jsonify({"test_code": completion_content})


def get_file_content(url, file_name):
    file_response = requests.get(url)
    
    if file_response.status_code != 200:
        return None, f"Failed to fetch content, status code {file_response.status_code}"

    content_type = file_response.headers.get('Content-Type', '')
    content_length = file_response.headers.get('Content-Length', 'Unknown')
    
    # Logging for diagnostics
    print(f"Fetching content for {file_name}")
    print(f"Content-Type: {content_type}")
    print(f"Content-Length: {content_length}")

    # Raw content inspection
    raw_content = file_response.content
    print(f"Raw content (first 100 bytes): {raw_content[:100]}")

    # Try decoding as text if content type indicates text
    if 'text' in content_type or 'application/json' in content_type:
        try:
            # Detect UTF-16 BOM
            if raw_content.startswith(b'\xff\xfe') or raw_content.startswith(b'\xfe\xff'):
                return raw_content.decode('utf-16'), None
            return raw_content.decode('utf-8'), None
        except UnicodeDecodeError as e:
            error_message = f"Error decoding content as UTF-8: {str(e)}"
            print(error_message)
            # Try decoding with a different encoding
            try:
                return raw_content.decode('latin1'), None
            except UnicodeDecodeError as e:
                error_message = f"Error decoding content as Latin-1: {str(e)}"
                print(error_message)
                return None, error_message
    else:
        # If content type is not text, treat as binary
        return "Binary file or non-text content", None

@app.route('/api/github_contents',methods=["GET"])
def get_github_contents():
    # Making the initial GET request to fetch the list of files
    response = requests.get(GITHUB_API_URL, headers=HEADERS)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch GitHub contents", "status_code": response.status_code})

    files = response.json()
    files_content = []

    for file in files:
        file_name = file['name']
        download_url = file['download_url']
        
        # Fetch the content of each file
        file_content, error = get_file_content(download_url, file_name)
        
        if error:
            files_content.append({"name": file_name, "content": None, "error": error})
        else:
            files_content.append({"name": file_name, "content": file_content})

    return jsonify({"output":files_content})

@app.route('/api/development-jira', methods=['POST'])
def development_jira():

    file_path = "prompts/prompt_for_dev.txt"
    with open(file_path, "r") as file:
        prompt = file.read()

    input = request.json  
    data=input.get("files")
    jira=input.get("jira")

    processed_files = []
    
    for file in data:
        name = file.get('name')
        content = file.get('content')
        
        if not name or not content:
            return jsonify({"error": f"Invalid file entry: {file}"}), 400
        
        prompt=prompt+f"\n <file> \n {name} \n \n {content} \n </file>"
    
    

    prompt=prompt + f"\n <jira> \n {jira} \n </jira>"

    print(prompt)

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

    print(text)

    return jsonify({"data":text}), 200

@app.route('/api/design-jira', methods=["POST"])
def design_jira():
    user_input = request.json

    jira_text = user_input["jira"]
    file_text = user_input["files"]
    diagram_type = "flowchart"

    diagram_name = mermaid_prompts[diagram_type]["name"]
    diagram_code = mermaid_prompts[diagram_type]["code"]


    MODEL_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+MODEL_KEY
     
    headers = {"Content-Type": "application/json"}

    
    prompt = "You are a architecture expert in a team. Your team works by assigning jira. You have been assigned a jira with some given requirements. Along with it you also can see and access all the files that are currently a part of the project on github. These files are also available to you as a context. Your job is to generate the Mermaid JS flowchart diagram that would fulfill the requirements of the jira, and would fit in the context of the repository code. The jiras control the functionality of your project and hence it is very important for them to solve the use case. Understand the context from the files of github and derive the structure accordingly. Generate mermaid js \'" + diagram_name + " code.' .Example of mermaid js " + diagram_name + " is \'" + diagram_code + "\'"

    for file in file_text:
        name = file.get('name')
        content = file.get('content')
        
        if not name or not content:
            return jsonify({"error": f"Invalid file entry: {file}"}), 400
        
        prompt=prompt+f"\n <file> \n {name} \n \n {content} \n </file>"
    
    

    prompt=prompt + f"\n <jira> \n {jira_text} \n </jira>"

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
    
    return jsonify({"data":text}), 200

if __name__ == '__main__':
    user_collection = db_conn()
    # insert_data()
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    app.run(debug=True)