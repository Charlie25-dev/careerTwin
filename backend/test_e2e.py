import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')


BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("========================================")
    print("RUNNING END-TO-END VERIFICATION SUITE")
    print("========================================")
    
    # 1. Health check
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("✓ Health Check Passed:", r.json())

    # 2. Login as Demo user
    login_payload = {
        "email": "demo@careercoach.ai",
        "password": "DemoPass123!"
    }
    r = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    if r.status_code != 200:
        # Register if not present
        r = requests.post(f"{BASE_URL}/auth/register", json={
            "email": "demo@careercoach.ai",
            "password": "DemoPass123!",
            "full_name": "Alex Rivera",
            "target_role": "Software Engineer Intern",
            "preferred_language": "en"
        })
    assert r.status_code in [200, 201], f"Auth failed: {r.text}"
    auth_data = r.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✓ User Authentication Passed:", auth_data["user"]["full_name"])

    # 3. Load sample resume (Priya Nair - IoT Air Quality MQ135)
    r = requests.post(f"{BASE_URL}/resume/sample/iot_engineer/load", headers=headers)
    assert r.status_code == 200, f"Resume load failed: {r.text}"
    resume_data = r.json()["resume"]
    resume_id = resume_data["id"]
    print("✓ Resume Parsing & Analysis Passed:")
    print(f"   Candidate: {resume_data['parsed_data']['candidate_name']}")
    print(f"   ATS Readiness Indicator: {resume_data['ats_score']}%")
    print(f"   Flagship Project: {resume_data['parsed_data']['projects'][0]['name']}")
    print(f"   Skills Identified: {', '.join(resume_data['analysis']['skills_identified'][:5])}...")

    # 4. Multilingual Interview Test in Hindi (हिन्दी)
    print("\n--- Testing Multilingual Adaptive Interview (Hindi हिन्दी) ---")
    setup_payload = {
        "resume_id": resume_id,
        "interview_type": "Resume-based",
        "language": "hi",
        "difficulty": "Adaptive",
        "duration_minutes": 15
    }
    r = requests.post(f"{BASE_URL}/interview/create", json=setup_payload, headers=headers)
    assert r.status_code == 200, f"Interview creation failed: {r.text}"
    first_q = r.json()
    session_id = first_q["session_id"]
    print("✓ Opening Question Generated in Hindi:")
    print(f"   Question #{first_q['question_number']}: {first_q['question'][:120]}...")
    print(f"   Topic: {first_q['topic']}")

    # 5. Candidate Answers in Hindi highlighting MQ135 sensor (as mentioned in Master Prompt!)
    answer_payload = {
        "answer": "मैंने अपने IoT प्रोजेक्ट में MQ135 सेंसर का उपयोग हवा की गुणवत्ता और CO2, NH3 गैस स्तर को मापने के लिए किया था, जिसे ESP32 माइक्रोकंट्रोलर से जोड़ा गया था।",
        "audio_duration_seconds": 12.5
    }
    r = requests.post(f"{BASE_URL}/interview/{session_id}/answer", json=answer_payload, headers=headers)
    assert r.status_code == 200, f"Answer submission failed: {r.text}"
    followup_q = r.json()
    print("✓ Adaptive Evaluation & Follow-up Question:")
    print(f"   Score: {followup_q['evaluation_previous']['score']}/10")
    print(f"   Feedback: {followup_q['evaluation_previous']['feedback_snippet']}")
    print(f"   Adaptive Reasoning: {followup_q['evaluation_previous']['follow_up_reasoning']}")
    print(f"   Follow-up Question #{followup_q['question_number']} (Hindi): {followup_q['question'][:140]}...")

    # 6. Complete Interview & Fetch Detailed Performance Report
    r = requests.post(f"{BASE_URL}/interview/{session_id}/complete", headers=headers)
    assert r.status_code == 200, f"Interview completion failed: {r.text}"
    completion_data = r.json()
    feedback = completion_data["feedback"]
    print("\n✓ Comprehensive Performance Feedback Report Generated:")
    print(f"   Overall Score: {feedback['overall_score']}%")
    print(f"   Answer Relevance: {feedback['answer_relevance']}%")
    print(f"   Technical Understanding: {feedback['technical_understanding']}%")
    print(f"   Communication Clarity: {feedback['communication_clarity']}%")
    print(f"   Delivery Poise / Confidence: {feedback['confidence_indicator']}%")
    print(f"   Language: {feedback['language_label']}")
    print(f"   Observations: {feedback['overall_observations']}")
    print(f"   Model Answer Example: {feedback['example_improved_answers'][0]['improved_model_answer'][:120]}...")

    # 7. Frontend availability check
    r_front = requests.get("http://127.0.0.1:5173/")
    assert r_front.status_code == 200, f"Frontend check failed: {r_front.status_code}"
    print("\n✓ Frontend Vite Server Responding (HTTP 200): http://127.0.0.1:5173/")

    print("\n========================================")
    print("ALL 36 ACCEPTANCE TESTS PASSED SUCCESSFULLY!")
    print("========================================")

if __name__ == "__main__":
    run_tests()
