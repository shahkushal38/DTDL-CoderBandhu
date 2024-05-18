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

documents = [
    {
        "meeting_id": "2023-05-01T10:00:00Z",
        "agenda": "Discuss project milestones",
        "transcript": """Let's get started with our discussion on project milestones. We're all aware of the critical milestones we need to hit to ensure the project's success. First up is the initial project planning phase."

                        "Right. We need to finalize the project scope, objectives, and deliverables. How's everyone doing with their sections of the project plan?"

                        "I'm almost done with mine, just need to add a few more details. I should have it ready by the end of the day."

                        "Great. Let's make sure we wrap up the planning phase by the end of this week. Now, let's move on to the next milestone: the design phase."

                        "The design phase is crucial. We need to create detailed technical specifications and mockups. Have we set a timeline for completing this?"

                        "Yes, we aim to finish the design phase within the next three weeks. It's essential that we stick to this timeline to avoid delays in development."

                        "Agreed. We should also schedule a couple of review sessions to ensure we're on the right track with the design."

                        "Good idea. I'll set up those sessions. Moving on, let's talk about the development phase. This will require close collaboration between our teams."

                        "Definitely. Communication will be key. We should have regular check-ins to discuss progress and any blockers."

                        "How about weekly sync-up meetings during the development phase? That way, we can address any issues promptly."

                        "Sounds good. We can start those meetings once the design phase is complete. Now, let's discuss the testing phase. We need a comprehensive testing plan."

                        "We'll perform unit testing, integration testing, and user acceptance testing. It might also be beneficial to involve end-users in the testing phase to get their feedback."

                        "I agree. Getting feedback from end-users early on can help us identify and fix issues before the launch."

                        "Alright, and that brings us to the final milestone: the project launch. We need to ensure everything is ready for a smooth launch."

                        "We should conduct final checks and reviews just before the launch. Also, we need to plan for post-launch support in case any issues arise."

                        "Let's outline a support plan. It would help if we had a dedicated team ready to handle any post-launch problems."

                        "Absolutely. We'll put together a plan for that. So, to summarize, we need to complete the project plan by the end of this week, finish the design phase in three weeks, and set up weekly sync-up meetings during the development phase."

                        "And don't forget the testing phase. We'll involve end-users and prepare a support plan for post-launch."

                        "Great. Let's make sure we stick to our timelines and keep the communication lines open. Our next meeting will be next Monday to review our progress."

                        "Thanks, everyone. Let's get to work and meet these milestones!""",
    },
    {
        "meeting_id": "2023-05-02T11:00:00Z",
        "agenda": "Review code quality",
        "transcript": """
Alright, let's get started with our code quality review meeting. We've all had a chance to look at the latest code changes. Let's start by discussing the overall code structure."

"From what I've seen, the code structure is mostly consistent, but there are a few areas where we could improve readability and maintainability. Specifically, we should consider refactoring some of the longer methods into smaller, more manageable pieces."

"I noticed that too. Breaking down those methods would definitely make the code easier to understand and test. We should also ensure that each method has a single responsibility."

"Good point. I also think we need to improve our naming conventions. Some variable and method names are not very descriptive, which makes the code harder to follow."

"Agreed. Consistent and descriptive naming conventions are crucial for maintaining code quality. Let's establish some guidelines and make sure everyone is on the same page."

"Speaking of guidelines, how are we doing with our coding standards? I found a few instances where the code doesn't adhere to our established standards, particularly with indentation and spacing."

"Yes, I noticed that too. We need to enforce our coding standards more strictly. Using a linter could help catch these issues early on."

"Definitely. Implementing a linter as part of our CI/CD pipeline would automate this process and ensure that code quality is maintained across the board."

"That's a great idea. Another thing I wanted to bring up is the use of comments. There are places where comments are either missing or not very helpful. We should aim to write clear and meaningful comments where necessary."

"True. Comments should explain the why, not the what. The code itself should be clear enough to understand what it's doing, while comments should provide context or reasoning."

"Exactly. On the topic of clarity, I've also noticed some duplicate code. We should look into refactoring those parts to reduce redundancy and improve maintainability."

"Reducing duplicate code is essential. We should identify common functionality and create utility functions or classes to handle those tasks."

"Great. Now, let's talk about testing. I see we have unit tests in place, but our coverage could be better. We need to ensure that all critical paths are thoroughly tested."

"Yes, increasing our test coverage is important. We should aim for at least 80% coverage, focusing on core functionalities and edge cases."

"I agree. Also, our tests should be reliable and fast. Flaky tests can be frustrating and slow down our development process."

"Absolutely. We should review our existing tests and remove or fix any that are unreliable. Additionally, we can optimize our test suite to improve performance."

"Sounds good. Finally, let's discuss our code review process. How can we improve our reviews to catch issues earlier and provide more constructive feedback?"

"I think we should establish a checklist for code reviews, covering key aspects like readability, adherence to standards, and test coverage. This will help us provide consistent and thorough reviews."

"That's a great suggestion. We should also encourage more pair programming sessions, which can help catch issues early and improve knowledge sharing within the team."

"Agreed. Pair programming can be very effective. Alright, to summarize: we'll refactor long methods, improve naming conventions, enforce coding standards with a linter, write better comments, reduce duplicate code, increase test coverage, and enhance our code review process."

"Perfect. Let's set a timeline for these actions and check in on our progress in our next meeting."

"Sounds good. Thanks, everyone. Let's get to work on improving our code quality!""",
    },
    {
        "meeting_id": "2023-05-03T12:00:00Z",
        "agenda": "Plan next sprint",
        "transcript": """

"Okay, everyone, let's start planning our next sprint. First, let's review the backlog and prioritize the tasks that need to be completed."

"Sure. We have several high-priority items that need attention. For instance, the new user authentication feature is critical. It should be at the top of our list."

"Agreed. We also need to address the performance issues reported in the last sprint. Those should be high on our priority list as well."

"Absolutely. Let's make sure we allocate enough time for the performance improvements. How about the new reporting module? It's a significant task, but it's crucial for our next release."

"Yes, the reporting module is essential. We should break it down into smaller, manageable tasks and assign them accordingly."

"Good idea. Let's break it down into front-end and back-end tasks. The front-end team can handle the user interface, while the back-end team focuses on the data processing and integration."

"Sounds like a plan. We also need to consider the feedback from the last sprint's retrospective. There were a few suggestions about improving our testing procedures."

"Right. We should incorporate automated testing for new features. This will help us catch issues early and ensure the quality of our code."

"Agreed. Let's add a task for setting up the automated tests for the new features. What about our ongoing tasks? Do we have any carryover from the last sprint?"

"Yes, there are a few tasks that we didn't complete. The API documentation update is one of them. We should include that in this sprint as well."

"Let's make sure we review and update our estimates for these carryover tasks. We need to be realistic about what we can achieve in this sprint."

"Definitely. Now, let's talk about team capacity. Does anyone have upcoming vacations or other commitments that we need to account for?"

"I'll be out for two days next week. I'll make sure to update my availability in our tracking tool."

"Thanks for letting us know. We'll adjust the workload accordingly. Anyone else?"

"No other planned absences from my side."

"Great. Let's move on to task assignments. Who would like to take on the user authentication feature?"

"I can take that. I've already started looking into the requirements, and I have a good understanding of what's needed."

"Perfect. How about the performance improvements?"

"I'll handle those. I'll work closely with the QA team to ensure we address all reported issues."

"Excellent. And for the reporting module, let's divide the tasks as we discussed. Front-end team, who can take the lead?"

"I can take the lead on the front-end tasks. I'll coordinate with the back-end team to ensure everything integrates smoothly."

"Great. Back-end team?"

"I'll take the lead on the back-end tasks. We'll need to schedule regular check-ins to sync our progress."

"Sounds good. Let's also remember to include buffer time for any unforeseen issues. We want to make sure we can deliver everything we've planned."

"Agreed. It's important to stay flexible. Anything else we need to cover for this sprint?"

"Just a reminder to update our sprint board with all tasks and their current status. It's crucial for keeping track of our progress."

"Good point. Let's make sure the sprint board is up to date. If there are no other questions or concerns, I think we're ready to finalize our sprint plan."

"Looks like we're all set. Thanks, everyone. Let's aim for a productive sprint!"

"Thanks. Let's do this!"

""",
    },
    {
        "meeting_id": "2023-05-04T13:00:00Z",
        "agenda": "Team retrospective",
        "transcript": """
"Alright, everyone, let's get started with our team retrospective. First, let's talk about what went well during the last sprint. Who wants to start?"

"I can start. I think our communication has really improved. The daily stand-ups have been very effective in keeping everyone in the loop."

"Yes, I agree. The daily stand-ups helped us identify and resolve blockers quickly. It was good to see issues being addressed immediately."

"Another thing that went well was the collaboration between the front-end and back-end teams on the reporting module. The integration was smooth, and we managed to finish it on time."

"I second that. The joint code review sessions we had were really helpful. They not only improved the quality of the code but also helped us learn from each other."

"Great points. Now, let's move on to what didn't go so well. What were the main challenges we faced?"

"I think we underestimated the complexity of the user authentication feature. It took more time than we initially thought, which pushed back some other tasks."

"Yes, that was a tough one. We should have broken it down into smaller tasks and estimated more accurately. It would have helped us manage our time better."

"I also noticed that our test coverage for the new features wasn't as thorough as it should have been. We encountered several bugs during the final testing phase."

"Good observation. We need to prioritize writing comprehensive tests alongside developing new features. It will save us time in the long run."

"Agreed. Another challenge was that a few team members were out on vacation, which impacted our capacity. We should have accounted for that in our sprint planning."

"Yes, we need to improve how we account for team availability and capacity in our planning sessions."

"Alright, now let's talk about what we can do differently moving forward. Any suggestions?"

"One idea is to implement a mid-sprint review. This way, we can reassess our progress and make adjustments if needed, rather than waiting until the end of the sprint."

"That's a great idea. It would help us stay on track and address any issues sooner."

"Another suggestion is to improve our estimation process. We could use planning poker or another estimation technique to get more accurate estimates."

"I like that. It would involve the whole team and provide a more realistic picture of the work required."

"We should also make sure that automated tests are part of our definition of done for each task. This will help us maintain high code quality and catch bugs early."

"Good point. And regarding team availability, we should have a shared calendar where everyone updates their planned absences. It will help us plan better."

"Agreed. It's crucial to have visibility into everyone's availability. Anything else we need to discuss?"

"Just a reminder to document these action items and follow up on them in our next sprint planning meeting. We need to make sure we're implementing these improvements."

"Definitely. Let's document the action items: implement mid-sprint reviews, improve estimation techniques, include automated tests in the definition of done, and create a shared availability calendar."

"Got it. I'll make sure these are noted down and shared with everyone. If there's nothing else, I think we're good to wrap up."

"Thanks, everyone. Let's take these learnings into our next sprint and keep improving."

"Thanks. Looking forward to a better sprint!"

""",
    },
    {
        "meeting_id": "2023-05-05T14:00:00Z",
        "agenda": "Discuss new features",
        "transcript": """
"Okay, everyone, let's start our meeting to discuss new features. We've received quite a few suggestions from our users and stakeholders. Let's go through them one by one and decide which ones to prioritize."

"Sure. The first feature on the list is the advanced search functionality. Users have been asking for more robust search capabilities, including filters by date, category, and tags."

"That sounds like a valuable addition. It could really improve user experience by making it easier for users to find what they're looking for quickly."

"Agreed. We should consider how this will impact our current search infrastructure. It might require some significant changes to our back-end as well as the front-end."

"Right. We'll need to break this down into smaller tasks and estimate the effort required. Let's put this high on our priority list but ensure we scope it properly."

"Next up, there's a request for a user dashboard that provides an overview of their activities, recent interactions, and personalized recommendations."

"This could really enhance user engagement by providing a customized experience. We'll need to design a user-friendly interface and ensure it's optimized for performance."

"Definitely. We should involve the UX/UI team early in the process to come up with wireframes and prototypes. Also, we need to think about the data we'll display and how we'll fetch and store it."

"Good point. We'll need to ensure we handle user data securely and comply with privacy regulations. Let's make a note to consult with our data privacy officer."

"Okay. Another feature suggestion is for real-time notifications. Users want to receive alerts for updates, messages, and other important activities as they happen."

"This is a great feature for keeping users engaged. However, it could be technically challenging. We need to decide on the best technology stack to implement real-time updates efficiently."

"We could look into using WebSockets or push notifications. We'll need to do some research and possibly run a few experiments to determine the best approach."

"Let's add this to our list but keep it flexible. We'll need to assess our current infrastructure's capability to support real-time features."

"Moving on, there's a suggestion for integrating with third-party services like Google Calendar and Slack to improve workflow and productivity."

"This could add a lot of value, especially for users who rely on these tools for their daily tasks. We'll need to explore the APIs of these services and see how we can seamlessly integrate them."

"Yes, and we should prioritize the most requested integrations first. Let's start with Google Calendar and Slack and then consider adding more based on user feedback."

"Agreed. Lastly, there's a request for dark mode. Many users prefer a darker interface, especially when using the app in low-light environments."

"Dark mode is relatively straightforward to implement, but we need to ensure it's done right. We should provide a toggle for users to switch between light and dark modes easily."

"Yes, and we'll need to test it thoroughly to ensure that all elements of the UI are appropriately styled and that readability is maintained."

"Alright, we have a good list of new features to work on. Let's prioritize them as follows: advanced search functionality, user dashboard, real-time notifications, third-party service integrations, and dark mode."

"Sounds good. We'll break these down into tasks, estimate the effort, and start with the design and research phases where necessary."

"Let's also make sure we communicate these new features to our users and stakeholders, so they know we're working on their suggestions."

"Absolutely. I'll prepare a summary of today's discussion and share it with the team and stakeholders. If there are no other points, I think we're ready to wrap up."

"Thanks, everyone. Let's get to work on these exciting new features!"

"Thanks. Looking forward to seeing these features come to life!"


""",
    },
]

def insert_data():
    x = user_collection.insert_many(documents)
    print(x.inserted_ids)

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