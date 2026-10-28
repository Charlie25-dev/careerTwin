from typing import Dict, Any, List
import re
from .base import BaseAIService

# Multilingual localization templates and system prompts
LANGUAGE_META = {
    "en": {"name": "English", "native": "English", "locale": "en-US"},
    "hi": {"name": "Hindi", "native": "हिन्दी", "locale": "hi-IN"},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "locale": "kn-IN"},
    "te": {"name": "Telugu", "native": "తెలుగు", "locale": "te-IN"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "locale": "ta-IN"},
}

LOCALIZED_PHRASES = {
    "greeting": {
        "en": "Hello! Welcome to your interview session. I have reviewed your resume and I'm excited to learn more about your experience.",
        "hi": "नमस्ते! आपके इंटरव्यू सत्र में आपका स्वागत है। मैंने आपका बायोडाटा (रेज़्यूमे) देखा है और आपके अनुभवों के बारे में जानने के लिए उत्सुक हूँ।",
        "kn": "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಸಂದರ್ಶನಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮ್ಮ ರೆಸ್ಯೂಮ್ ಅನ್ನು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ ಮತ್ತು ನಿಮ್ಮ ಅನುಭವದ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿದುಕೊಳ್ಳಲು ಉತ್ಸುಕನಾಗಿದ್ದೇನೆ.",
        "te": "నమస్కారం! మీ ఇంటర్వ్యూ సెషన్‌కు స్వాగతం. నేను మీ రెజ్యూమ్‌ను సమీక్షించాను మరియు మీ అనుభవాల గురించి మరింత తెలుసుకోవడానికి ఆసక్తిగా ఉన్నాను.",
        "ta": "வணக்கம்! உங்கள் நேர்காணல் அமர்வுக்கு வரவேற்கிறேன். உங்கள் பயோடேட்டாவை நான் மதிப்பாய்வு செய்துள்ளேன், உங்கள் அனுபவங்களைப் பற்றி மேலும் அறிய ஆர்வமாக உள்ளேன்.",
    },
    "tell_me_about_yourself": {
        "en": "Could you walk me through your background, your main academic projects, and what drives your passion in software engineering?",
        "hi": "क्या आप अपनी पृष्ठभूमि, अपनी मुख्य शैक्षणिक परियोजनाओं (Projects), और सॉफ्टवेयर इंजीनियरिंग में अपनी रुचि के बारे में संक्षेप में बता सकते हैं?",
        "kn": "ನಿಮ್ಮ ಹಿನ್ನೆಲೆ, ನಿಮ್ಮ ಮುಖ್ಯ ಶೈಕ್ಷಣಿಕ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು ಮತ್ತು ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ನಿಮ್ಮ ಆಸಕ್ತಿಯ ಬಗ್ಗೆ ನಮಗೆ ವಿವರಿಸಬಹುದೇ?",
        "te": "మీ నేపథ్యం, మీ ముఖ్యమైన విద್ಯಾ ప్రాజెక్ట్‌లు మరియు టెక్నాలజీపై మీ ఆసక్తి గురించి మాకు క్లుప్తంగా వివరించగలరా?",
        "ta": "உங்கள் பின்னணி, உங்கள் முக்கியமான கல்வித் திட்டங்கள் (Projects) மற்றும் மென்பொருள் துறையில் உங்கள் ஆர்வம் பற்றி விளக்க முடியுமா?",
    },
    "project_intro": {
        "en": "In your resume, you highlighted '{project}'. Could you explain the core architecture of this project and what problem it solves?",
        "hi": "आपके बायोडाटा में '{project}' का उल्लेख है। क्या आप इस प्रोजेक्ट की मुख्य आर्किटेक्चर और यह क्या समस्या हल करता है, समझा सकते हैं?",
        "kn": "ನಿಮ್ಮ ರೆಸ್ಯೂಮ್‌ನಲ್ಲಿ '{project}' ಉಲ್ಲೇಖಿಸಲಾಗಿದೆ. ಈ ಪ್ರಾಜೆಕ್ಟ್‌ನ ಮೂಲ ವಿನ್ಯಾಸ (architecture) ಮತ್ತು ಇದು ಯಾವ ಸಮಸ್ಯೆಯನ್ನು ಪರಿಹರಿಸುತ್ತದೆ ಎಂದು ವಿವರಿಸಬಹುದೇ?",
        "te": "మీ రెజ్యూమ్‌లో '{project}' ప్రాజెక్ట్ పేర్కొనబడింది. ఈ ప్రాజెక్ట్ యొక్క ప్రధాన రూపకల్పన (architecture) మరియు ఇది పరిష్కరించే సమస్యను వివరించగలరా?",
        "ta": "உங்கள் ரெஸ்யூமில் '{project}' திட்டத்தைக் குறிப்பிட்டுள்ளீர்கள். இதன் கட்டமைப்பு (architecture) மற்றும் இது தீர்க்கும் சிக்கல் பற்றி விளக்க முடியுமா?",
    },
    "followup_deep": {
        "en": "That is a solid explanation regarding {keyword}. Can you go deeper into how you handled edge cases, scalability, or performance tradeoffs during that implementation?",
        "hi": "यह {keyword} के बारे में बहुत अच्छा विवरण है। क्या आप विस्तार से बता सकते हैं कि आपने इस कार्यान्वयन के दौरान संभावित चुनौतियों, स्केलेबिलिटी और परफॉर्मेंस को कैसे प्रबंधित किया?",
        "kn": "{keyword} ಕುರಿತು ವಿವರಣೆ ಉತ್ತಮವಾಗಿದೆ. ನೀವು ಅಭಿವೃದ್ಧಿಪಡಿಸುವಾಗ ಕಾರ್ಯಕ್ಷಮತೆ (performance) ಮತ್ತು ದೋಷಗಳನ್ನು (edge cases) ಹೇಗೆ ನಿಭಾಯಿಸಿದಿರಿ ಎಂದು ವಿಸ್ತಾರವಾಗಿ ಹೇಳಬಹುದೇ?",
        "te": "{keyword} గురించి వివరణ బాగుంది. మీరు అభివృద్ధి చేసేటప్పుడు పనితీరు (performance) మరియు సవాళ్లను ఎలా ఎదుర్కొన్నారో మరింత లోతుగా చెప్పగలరా?",
        "ta": "{keyword} பற்றிய விளக்கம் அருமை. இதைச் செயல்படுத்தும் போது செயல்திறன் (performance) மற்றும் சிக்கல்களை எவ்வாறு கையாண்டீர்கள் என்பதை இன்னும் ஆழமாக விவರಿಸ முடியுமா?",
    },
    "followup_clarify": {
        "en": "Thanks for sharing. To help me understand better, could you clarify your specific individual contribution and why you decided to use that specific approach?",
        "hi": "साझा करने के लिए धन्यवाद। बेहतर ढंग से समझने के लिए, क्या आप स्पष्ट कर सकते हैं कि इसमें आपका व्यक्तिगत योगदान क्या था और आपने इसी दृष्टिकोण को क्यों चुना?",
        "kn": "ಧನ್ಯವಾದಗಳು. ಇನ್ನಷ್ಟು ಸ್ಪಷ್ಟವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು, ಇದರಲ್ಲಿ ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಪಾತ್ರವೇನು ಮತ್ತು ನೀವು ಈ ವಿಧಾನವನ್ನೇ ಏಕೆ ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ ಎಂದು ತಿಳಿಸುವಿರಾ?",
        "te": "ధన్యవాదాలు. మరింత స్పష్టంగా అర్థం చేసుకోవడానికి, ఇందులో మీ వ్యక్తిగత పాత్ర ఏమిటి మరియు మీరు ఈ విధానాన్ని ఎందుకు ఎంచుకున్నారో వివరించగలరా?",
        "ta": "பகிர்ந்தமைக்கு நன்றி. மேலும் தெளிவாகப் புரிந்துகொள்ள, இதில் உங்கள் தனிப்பட்ட பங்களிப்பு என்ன மற்றும் இந்த அணுகுமுறையை ஏன் தேர்ந்தெடுத்தீர்கள் என்பதை தெளிவுபடுத்த முடியுமா?",
    },
    "technical_question": {
        "en": "Looking at your skills in {skill}, how would you approach debugging an asynchronous failure or optimizing an API endpoint when latency spikes?",
        "hi": "{skill} में आपके कौशल को देखते हुए, यदि किसी API का लेटेंसी अचानक बढ़ जाए या कोई एसिंक्रोनस (Asynchronous) समस्या आए, तो आप उसे कैसे डिबग करेंगे?",
        "kn": "{skill} ತಂತ್ರಜ್ಞಾನದಲ್ಲಿನ ನಿಮ್ಮ ಕೌಶಲ್ಯವನ್ನು ಗಮನಿಸಿದರೆ, ಒಂದು API ನಿಧಾನವಾದಾಗ ಅಥವಾ ದೋಷ ಬಂದಾಗ ಅದನ್ನು ಹೇಗೆ ಸರಿಪಡಿಸುತ್ತೀರಿ?",
        "te": "{skill} పై మీ నైపుణ్యాలను పరిశీలిస్తే, ఏదైనా API లో జాప్యం లేదా సమస్య వచ్చినప్పుడు దాన్ని ఎలా డిబగ్ చేస్తారు?",
        "ta": "{skill} திறனைக் கருத்தில் கொண்டு, ஒரு API-யில் தாமதம் அல்லது சிக்கல் ஏற்படும் போது அதை எவ்வாறு சரிசெய்வீர்கள்?",
    },
    "behavioral_question": {
        "en": "Can you share an instance during college or an internship where you encountered a conflicting technical requirement or a looming deadline, and how you resolved it?",
        "hi": "क्या आप कॉलेज या इंटर्नशिप के दौरान का ऐसा अनुभव बता सकते हैं जब आपको तकनीकी मतभेद या किसी कठिन डेडलाइन का सामना करना पड़ा हो, और आपने उसे कैसे हल किया?",
        "kn": "ನಿಮ್ಮ ಕಾಲೇಜು ಅಥವಾ ಇಂಟರ್ನ್‌ಶಿಪ್‌ನಲ್ಲಿ ಕಷ್ಟಕರವಾದ ಡೆಡ್‌ಲೈನ್ ಅಥವಾ ತಾಂತ್ರಿಕ ಸವಾಲು ಎದುರಾದಾಗ ನೀವು ಅದನ್ನು ಹೇಗೆ ಯಶಸ್ವಿಯಾಗಿ ಪರಿಹರಿಸಿದಿರಿ ಎಂದು ತಿಳಿಸಿ.",
        "te": "మీ కాలేజీ లేదా ఇంటర్న్‌షిప్‌లో కఠినమైన డెడ్‌లైన్ లేదా సాంకేతిక సవాలు ఎదురైనప్పుడు మీరు దాన్ని ఎలా పరిష్కరించారో ఒక ఉదాహరణ చెప్పగలరా?",
        "ta": "உங்கள் கல்லூரி அல்லது பயிற்சியின் போது ஒரு கடினமான காலக்கெடு அல்லது தொழில்நுட்ப சவாலை நீங்கள் எவ்வாறு வெற்றிகரமாக சமாளித்தீர்கள் என்று கூற முடியுமா?",
    },
    "completion_msg": {
        "en": "Thank you for completing this interview session! I have recorded your responses and generated an in-depth performance evaluation report.",
        "hi": "इस इंटरव्यू सत्र को पूरा करने के लिए धन्यवाद! मैंने आपके सभी उत्तरों का विश्लेषण कर एक विस्तृत प्रदर्शन मूल्यांकन रिपोर्ट तैयार की है।",
        "kn": "ಈ ಸಂದರ್ಶನವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ವಿವರವಾದ ಪ್ರದರ್ಶನ ವರದಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.",
        "te": "ఈ ఇంటర్వ్యూను పూర్తి చేసినందుకు ధన్యవాదాలు! మీ సమాధానాలను విశ్లేషించి సమగ్ర పనితీరు నివేదికను రూపొందించడం జరిగింది.",
        "ta": "இந்த நேர்காணலை வெற்றிகரமாக முடித்தமைக்கு நன்றி! உங்கள் பதில்களை பகுப்பாய்வு செய்து விரிவான செயல்திறன் அறிக்கை தயாரிக்கப்பட்டுள்ளது.",
    }
}

class DemoAIService(BaseAIService):
    """
    Intelligent, context-driven AI engine for resume parsing, adaptive interview flows,
    and multilingual generation without relying on external network dependencies.
    """

    def analyze_resume(self, raw_text: str, target_role: str = "Software Engineer Intern") -> Dict[str, Any]:
        text_lower = raw_text.lower()

        # Extract detected skills from text
        all_candidate_skills = [
            "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express",
            "SQL", "PostgreSQL", "MongoDB", "Docker", "Git", "REST APIs",
            "C++", "Java", "HTML5", "CSS3", "Tailwind CSS", "FastAPI",
            "Machine Learning", "Scikit-Learn", "Pandas", "NumPy", "TensorFlow",
            "IoT", "Arduino", "Embedded Systems", "AWS", "Linux"
        ]
        
        detected_skills = [s for s in all_candidate_skills if re.search(r'\b' + re.escape(s.lower()) + r'\b', text_lower)]
        if not detected_skills:
            detected_skills = ["Python", "JavaScript", "React", "Git", "REST APIs"]

        # Missing / Recommended skills based on role
        if "data" in target_role.lower() or "ml" in target_role.lower():
            recommended_skills = ["Data Modeling", "MLOps", "Model Evaluation Metrics", "PyTorch", "Tableau/PowerBI"]
        elif "iot" in target_role.lower() or "embedded" in target_role.lower():
            recommended_skills = ["RTOS", "MQTT Protocol", "Circuit Simulation", "I2C/SPI Protocols", "Firmware Testing"]
        else:
            recommended_skills = ["Unit & Integration Testing (Jest/Pytest)", "CI/CD Pipelines (GitHub Actions)", "Docker Containerization", "System Design Basics", "Cloud Deployment (AWS/GCP)"]

        # Check for projects mentioned
        project_names = []
        if "air quality" in text_lower or "mq135" in text_lower:
            project_names.append("IoT Air Quality Monitoring System")
        if "e-commerce" in text_lower or "shop" in text_lower:
            project_names.append("Full-Stack E-Commerce Platform")
        if "churn" in text_lower or "prediction" in text_lower:
            project_names.append("Customer Churn Prediction Engine")
        if "portfolio" in text_lower or "tracker" in text_lower:
            project_names.append("Interactive Web Dashboard")
        if not project_names:
            project_names.append("Full-Stack Web Application")

        # Calculate a realistic ATS score based on measurable resume indicators
        score = 68.0
        if len(detected_skills) >= 6:
            score += 10.0
        if "education" in text_lower or "university" in text_lower or "bachelor" in text_lower:
            score += 6.0
        if "experience" in text_lower or "intern" in text_lower:
            score += 8.0
        if "github" in text_lower or "linkedin" in text_lower:
            score += 4.0
        if any(metric in text_lower for metric in ["%", "improved", "reduced", "scaled", "ms", "users"]):
            score += 4.0
        score = min(score, 92.0)

        # Formulate strengths
        strengths = [
            f"Strong technical skill base identified with foundational proficiency in {', '.join(detected_skills[:4])}.",
            f"Highlighted practical project work ({project_names[0] if project_names else 'academic capstone'}) demonstrating hands-on building capability.",
            "Clear chronological formatting with well-defined section delineations.",
            "Good alignment of technical competencies with entry-level and internship expectations."
        ]

        # Formulate areas for improvement (using respectful, realistic ATS improvement wording)
        improvement_areas = [
            "Quantify project achievements with business or technical metrics (e.g., latency reduction %, active users, accuracy score).",
            f"Incorporate modern deployment and testing practices such as {recommended_skills[0]} to stand out.",
            "Ensure bullet points start with strong action verbs (e.g., 'Engineered', 'Optimized', 'Architected').",
            "Add a concise 2-line Professional Summary at the top tailored directly to your target role."
        ]

        ats_observations = [
            "Potential ATS improvement areas: Ensure standard heading titles like 'Technical Skills', 'Experience', and 'Education' for optimal parser indexing.",
            "Avoid multi-column tables or nested text frames that occasionally scramble text during parsing in older ATS tools.",
            "Include keywords naturally throughout project bullet points rather than dumping all terms in a single skill block.",
            "Ensure file naming follows professional standards (e.g., 'FirstName_LastName_Resume.pdf')."
        ]

        actionable_recommendations = [
            "Revise project bullet points using the Google 'XYZ Formula': Accomplished [X] as measured by [Y], by doing [Z].",
            f"Upskill in high-demand industry tooling: Practice setting up {recommended_skills[1]}.",
            "Include your live GitHub repository links and hosted demo URLs for your top projects.",
            "Refine formatting to maintain a clean 1-page length suitable for student & entry-level applicants."
        ]

        return {
            "overview": f"Your resume demonstrates solid foundational preparedness for a {target_role} position. The profile exhibits commendable hands-on implementation across {len(detected_skills)} identified technical competencies, with key opportunities to enhance quantified impact and industry testing practices.",
            "ats_score": round(score, 1),
            "strengths": strengths,
            "improvement_areas": improvement_areas,
            "skills_identified": detected_skills,
            "recommended_skills": recommended_skills,
            "project_analysis": [
                {
                    "title": p,
                    "assessment": "Demonstrates practical full-cycle problem solving and technological integration.",
                    "recommendation": "Mention system bottlenecks encountered and specific data structures or protocols utilized."
                } for p in project_names
            ],
            "experience_analysis": [
                {
                    "status": "Academic & Project Focused",
                    "observation": "Good showcase of applied engineering coursework and collaborative projects.",
                    "suggestion": "Emphasize team leadership, peer code reviews, and agile sprint contributions if applicable."
                }
            ],
            "structure_analysis": {
                "length": "Appropriate 1-page target for entry-level candidates",
                "readability": "High",
                "contact_info_present": True,
                "sections_detected": ["Education", "Skills", "Projects", "Achievements"]
            },
            "ats_observations": ats_observations,
            "actionable_recommendations": actionable_recommendations
        }

    def generate_first_question(
        self,
        resume_data: Dict[str, Any],
        interview_type: str,
        language: str,
        difficulty: str
    ) -> Dict[str, Any]:
        lang = language if language in LOCALIZED_PHRASES["greeting"] else "en"
        greeting = LOCALIZED_PHRASES["greeting"][lang]
        
        projects = resume_data.get("projects", [])
        skills = resume_data.get("skills", [])
        top_project = projects[0]["name"] if projects and isinstance(projects[0], dict) else None
        
        if interview_type == "Project-based" and top_project:
            q_template = LOCALIZED_PHRASES["project_intro"][lang]
            question = f"{greeting}\n\n" + q_template.replace("{project}", top_project)
            topic = "Project Architecture"
        elif interview_type == "Technical" and skills:
            first_skill = skills[0] if isinstance(skills, list) else "Software Engineering"
            q_template = LOCALIZED_PHRASES["technical_question"][lang]
            question = f"{greeting}\n\n" + q_template.replace("{skill}", str(first_skill))
            topic = f"Technical Competency ({first_skill})"
        elif interview_type == "Behavioral":
            question = f"{greeting}\n\n" + LOCALIZED_PHRASES["behavioral_question"][lang]
            topic = "Behavioral & Problem Solving"
        else:
            # Resume-based or General HR
            question = f"{greeting}\n\n" + LOCALIZED_PHRASES["tell_me_about_yourself"][lang]
            topic = "Candidate Introduction & Background"

        return {
            "question": question,
            "question_number": 1,
            "total_questions": 5,
            "topic": topic,
            "difficulty": difficulty,
            "language": lang,
            "avatar_state": "Speaking",
            "is_completed": False
        }

    def evaluate_answer_and_followup(
        self,
        resume_data: Dict[str, Any],
        previous_question: str,
        candidate_answer: str,
        history: List[Dict[str, Any]],
        interview_type: str,
        language: str,
        difficulty: str,
        question_count: int,
        max_questions: int = 5
    ) -> Dict[str, Any]:
        lang = language if language in LOCALIZED_PHRASES["greeting"] else "en"
        answer_clean = candidate_answer.strip()
        word_count = len(answer_clean.split())
        
        # Analyze answer depth, keywords, and responsiveness
        # Check specific keywords mentioned in answer (e.g., sensor, react, database, mq135, api, async)
        keywords_detected = [
            w for w in ["mq135", "sensor", "arduino", "esp32", "react", "fastapi", "python",
                        "database", "sql", "api", "latency", "async", "docker", "state", "cache"]
            if w in answer_clean.lower()
        ]

        # Scoring heuristics
        if word_count < 10:
            score = 5.0
            relevance = 5.5
            clarity = 5.0
            technical_depth = 4.5
            feedback = "Answer was very brief. Consider providing more context, technical reasoning, and concrete examples."
            is_strong = False
            adapted_difficulty = "Easy" if difficulty == "Adaptive" else difficulty
        elif word_count < 30:
            score = 7.0
            relevance = 7.5
            clarity = 7.0
            technical_depth = 6.5
            feedback = "Good concise explanation. Expanding on technical tradeoffs or architecture would make it even stronger."
            is_strong = True
            adapted_difficulty = "Medium" if difficulty == "Adaptive" else difficulty
        else:
            score = 8.8
            relevance = 9.0
            clarity = 8.5
            technical_depth = 8.5
            feedback = "Comprehensive and structured response showing genuine project ownership and clear articulation."
            is_strong = True
            adapted_difficulty = "Hard" if difficulty == "Adaptive" else difficulty

        # If question_count reached max, complete the interview
        if question_count >= max_questions:
            completion_text = LOCALIZED_PHRASES["completion_msg"][lang]
            return {
                "evaluation": {
                    "score": round(score, 1),
                    "relevance": round(relevance, 1),
                    "clarity": round(clarity, 1),
                    "technical_depth": round(technical_depth, 1),
                    "feedback_snippet": feedback,
                    "follow_up_reasoning": "Interview sequence concluded with full rubric evaluation."
                },
                "next_question": completion_text,
                "question_number": question_count,
                "total_questions": max_questions,
                "topic": "Interview Concluded",
                "difficulty": adapted_difficulty,
                "language": lang,
                "is_completed": True,
                "avatar_state": "Speaking"
            }

        # Dynamic follow-up generation based on candidate answer
        projects = resume_data.get("projects", [])
        top_project = projects[0]["name"] if projects and isinstance(projects[0], dict) else "your project"
        skills = resume_data.get("skills", ["software engineering"])
        next_skill = skills[min(question_count, len(skills) - 1)] if isinstance(skills, list) else "system design"

        # Adaptive logic:
        # Case 1: Candidate mentioned a concrete technical component (e.g. MQ135 sensor / React / API)
        if keywords_detected:
            key_kw = keywords_detected[0].upper()
            if is_strong:
                followup_template = LOCALIZED_PHRASES["followup_deep"][lang]
                next_q = followup_template.replace("{keyword}", key_kw)
                topic = f"In-depth Technical: {key_kw}"
                reasoning = f"Candidate specifically highlighted {key_kw}. Deep-diving into reliability, performance tradeoffs, and architectural justification."
            else:
                followup_template = LOCALIZED_PHRASES["followup_clarify"][lang]
                next_q = followup_template
                topic = f"Clarification: {key_kw}"
                reasoning = f"Probing deeper into candidate's individual design choice with {key_kw}."
        elif question_count == 1 and top_project:
            # Transition to main project
            proj_template = LOCALIZED_PHRASES["project_intro"][lang]
            next_q = proj_template.replace("{project}", str(top_project))
            topic = f"Project Deep Dive: {top_project}"
            reasoning = "Transitioning from introduction to candidate's flagship project extracted from resume."
        elif question_count == 2:
            # Technical core question
            tech_template = LOCALIZED_PHRASES["technical_question"][lang]
            next_q = tech_template.replace("{skill}", str(next_skill))
            topic = f"Technical Assessment: {next_skill}"
            reasoning = f"Assessing applied understanding in core listed skill: {next_skill}."
        elif question_count == 3:
            # Behavioral question
            next_q = LOCALIZED_PHRASES["behavioral_question"][lang]
            topic = "Behavioral & Conflict Management"
            reasoning = "Assessing workplace communication, resilience, and collaborative problem-solving."
        else:
            if is_strong:
                followup_template = LOCALIZED_PHRASES["followup_deep"][lang]
                next_q = followup_template.replace("{keyword}", "system architecture")
                topic = "Advanced System Tradeoffs"
                reasoning = "Scaling question complexity to evaluate higher-order reasoning."
            else:
                next_q = LOCALIZED_PHRASES["followup_clarify"][lang]
                topic = "Technical Reflection"
                reasoning = "Encouraging structured elaboration on technical choices."

        return {
            "evaluation": {
                "score": round(score, 1),
                "relevance": round(relevance, 1),
                "clarity": round(clarity, 1),
                "technical_depth": round(technical_depth, 1),
                "feedback_snippet": feedback,
                "follow_up_reasoning": reasoning,
                "adapted_difficulty": adapted_difficulty
            },
            "next_question": next_q,
            "question_number": question_count + 1,
            "total_questions": max_questions,
            "topic": topic,
            "difficulty": adapted_difficulty,
            "language": lang,
            "is_completed": False,
            "avatar_state": "Speaking"
        }

    def generate_interview_feedback(
        self,
        resume_data: Dict[str, Any],
        session_info: Dict[str, Any],
        messages: List[Dict[str, Any]],
        language: str
    ) -> Dict[str, Any]:
        lang = language if language in LANGUAGE_META else "en"
        meta = LANGUAGE_META[lang]

        # Calculate scores from candidate messages
        candidate_evals = [m.get("evaluation") for m in messages if m.get("role") == "candidate" and m.get("evaluation")]
        
        if candidate_evals:
            avg_score = sum(e.get("score", 7.0) for e in candidate_evals) / len(candidate_evals) * 10
            avg_relevance = sum(e.get("relevance", 7.5) for e in candidate_evals) / len(candidate_evals) * 10
            avg_tech = sum(e.get("technical_depth", 7.0) for e in candidate_evals) / len(candidate_evals) * 10
            avg_clarity = sum(e.get("clarity", 7.0) for e in candidate_evals) / len(candidate_evals) * 10
        else:
            avg_score = 78.0
            avg_relevance = 80.0
            avg_tech = 75.0
            avg_clarity = 78.0

        # Confidence indicator (purely estimated from speech flow, vocabulary volume, and answer pacing - no medical/psych claims)
        confidence_val = round((avg_clarity * 0.5) + (avg_relevance * 0.5), 1)

        # Build model answer pairs
        pairs = []
        interviewer_msgs = [m for m in messages if m.get("role") == "interviewer"]
        candidate_msgs = [m for m in messages if m.get("role") == "candidate"]

        for idx, c_msg in enumerate(candidate_msgs[:3]):
            corresponding_q = interviewer_msgs[idx]["content"] if idx < len(interviewer_msgs) else "Technical Question"
            c_text = c_msg.get("content", "")
            
            if lang == "hi":
                model_ans = f"इस प्रश्न के लिए एक आदर्श उत्तर होगा: पहले समस्या का संदर्भ स्पष्ट करें (जैसे सिस्टम का उद्देश्य), फिर अपने द्वारा उपयोग की गई तकनीक या प्रोटोकॉल का कारण बताएं, और अंत में परिणाम (जैसे 25% कम लेटेंसी या विश्वसनीय डेटा एकत्रीकरण) साझा करें।"
                tip = "STAR तकनीक (स्थिति, कार्य, क्रिया, परिणाम) का उपयोग करें और उत्तर में तकनीकी शब्दों के औचित्य पर बल दें।"
            elif lang == "kn":
                model_ans = f"ಉತ್ತಮ ಮಾದರಿ ಉತ್ತರ: ಮೊದಲಿಗೆ ಯೋಜನೆಯ ಉದ್ದೇಶವನ್ನು ವಿವರಿಸಿ, ನಂತರ ನಿರ್ದಿಷ್ಟ ತಂತ್ರಜ್ಞಾನವನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಕಾರಣಗಳನ್ನು ತಿಳಿಸಿ, ಮತ್ತು ಅಂತಿಮವಾಗಿ ಸಾಧಿಸಿದ ಫಲಿತಾಂಶವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ."
                tip = "STAR ವಿಧಾನವನ್ನು ಅನುಸರಿಸಿ, ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ವೈಯಕ್ತಿಕ ಕೊಡುಗೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಒತ್ತಿಹೇಳಿ."
            elif lang == "te":
                model_ans = f"సరైన సమాధాన నమూనా: మొదట ప్రాజెక్ట్ లక్ష్యాన్ని వివరించండి, ఆపై సాంకేతిక ఎంపికలకు గల కారణాలను తెలపండి, చివరగా మీరు సాధించిన ఫలితాన్ని కొలమానాలతో పంచుకోండి."
                tip = "STAR పద్ధతిని ఉపయోగించి మీ స్వంత సహకారాన్ని స్పష్టంగా వివరించండి."
            elif lang == "ta":
                model_ans = f"சிறந்த மாதிரி பதில்: முதலில் திட்டத்தின் நோக்கத்தை விவரியுங்கள், பின்னர் தொழில்நுட்பத் தேர்வுகளுக்கான காரணங்களைக் கூறுங்கள், இறுதியாக அளவிடக்கூடிய முடிவுகளைப் பகிர்ந்து கொள்ளுங்கள்."
                tip = "STAR உத்தியைப் பயன்படுத்தி உங்கள் தனிப்பட்ட பங்களிப்பை தெளிவாக விளக்குங்கள்."
            else:
                model_ans = f"A structured high-impact answer: Begin with the high-level objective, articulate your architectural decisions with specific metrics (e.g. why a specific sensor/framework was chosen), and quantify the outcome (e.g. improved response time by 30%)."
                tip = "Apply the STAR method (Situation, Task, Action, Result) with tangible engineering tradeoffs."

            pairs.append({
                "question": corresponding_q,
                "candidate_answer": c_text or "(No spoken answer recorded)",
                "improved_model_answer": model_ans,
                "key_improvement_tips": tip
            })

        # Observations and recommendations
        if lang == "hi":
            observations = "उम्मीदवार ने आत्मविश्वास से उत्तर दिए और अपने प्रोजेक्ट्स के प्रति अच्छी समझ प्रदर्शित की। बातचीत में विषय की प्रासंगिकता बनी रही।"
            strong_areas = ["प्रोजेक्ट का स्पष्ट ज्ञान", "सकारात्मक दृष्टिकोण", "मूलभूत तकनीकी अवधारणाओं की समझ"]
            weak_areas = ["कुछ उत्तरों में तकनीकी विवरण संक्षेप में थे", "प्रदर्शन और स्केलेबिलिटी पर अधिक गहराई आवश्यक है"]
            improvements = ["तकनीकी निर्णयों के पीछे के तर्कों को विस्तार से साझा करें", "मात्रात्मक परिणामों (Metrics) का अधिक उपयोग करें"]
            topics_to_study = ["सिस्टम डिज़ाइन के मूल सिद्धांत", "डेटाबेस इंडेक्सिंग और ऑप्टिमाइज़ेशन", "API एरर हैंडलिंग"]
        elif lang == "kn":
            observations = "ಅಭ್ಯರ್ಥಿಯು ಉತ್ತಮ ತಾಂತ್ರಿಕ ಜ್ಞಾನ ಮತ್ತು ಸಂವಹನ ಕೌಶಲ್ಯವನ್ನು ಪ್ರದರ್ಶಿಸಿದ್ದಾರೆ. ಸಂದರ್ಶನದ ಹರಿವು ಸಕಾರಾತ್ಮಕವಾಗಿತ್ತು."
            strong_areas = ["ಪ್ರಾಜೆಕ್ಟ್‌ನ ಮೂಲ ಪರಿಕಲ್ಪನೆಗಳ ಸ್ಪಷ್ಟತೆ", "ಉತ್ತಮ ಸಂವಹನ", "ಪ್ರಶ್ನೆಗಳನ್ನು ಗ್ರಹಿಸುವ ಸಾಮರ್ಥ್ಯ"]
            weak_areas = ["ಕೆಲವು ಉತ್ತರಗಳಲ್ಲಿ ವಿವರಣೆ ಕಡಿಮೆಯಿತ್ತು", "ತಾಂತ್ರಿಕ ಸವಾಲುಗಳನ್ನು ಎದುರಿಸಿದ ವಿಧಾನವನ್ನು ಇನ್ನಷ್ಟು ವಿವರಿಸಬಹುದು"]
            improvements = ["ಉತ್ತರಗಳಲ್ಲಿ ಹೆಚ್ಚಿನ ತಾಂತ್ರಿಕ ಪದಗಳು ಮತ್ತು ಉದಾಹರಣೆಗಳನ್ನು ಬಳಸಿ", "ಫಲಿತಾಂಶಗಳನ್ನು ಅಂಕಿಅಂಶಗಳೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ"]
            topics_to_study = ["ಸಿಸ್ಟಮ್ ಡಿಸೈನ್ ಪರಿಕಲ್ಪನೆಗಳು", "ಡೇಟಾಬೇಸ್ ಕಾರ್ಯಕ್ಷಮತೆ", "ಮೈಕ್ರೋಸರ್ವಿಸಸ್ ಬೇಸಿಕ್ಸ್"]
        elif lang == "te":
            observations = "అభ్యర్థి మంచి సాంకేతిక పరిజ్ఞానం మరియు స్పష్టమైన సంభాషణను ప్రదర్శించారు. ఇంటర్వ్యూ మొత్తం ఆకట్టుకునేలా సాగింది."
            strong_areas = ["ప్రాజెక్ట్ నేపథ్యంపై పట్టు", "స్పష్టమైన ఆలోచనా సరళి", "సమస్య పరిష్కార నైపుణ్యం"]
            weak_areas = ["కొన్ని సమాధానాలలో లోతైన సాంకేతిక వివరణ అవసరం", "స్కేలబిలిటీ అంశాలపై మరింత శ్రద్ధ పెట్టాలి"]
            improvements = ["సాంకేతిక ఎంపికలకు గల కారణాలను మరింత వివరించండి", "అనుభవాలను పంచుకునేటప్పుడు కొలమానాలను జోడించండి"]
            topics_to_study = ["సిస్టమ్ ఆర్కిటెక్చర్ ఫండమెంటల్స్", "డేటాబేస్ ట్యూనింగ్", "API సెక్యూరిಟಿ"]
        elif lang == "ta":
            observations = "விண்ணப்பதாரர் நல்ல தொழில்நுட்பப் புரிதலையும் நேர்மறையான தகவல் தொடர்பு அணுகுமுறையையும் வெளிப்படுத்தினார்."
            strong_areas = ["திட்டங்களின் அடிப்படைக் கட்டமைப்பு புரிதல்", "நேர்த்தியான விளக்கம்", "நம்பிக்கையான அணுகுமுறை"]
            weak_areas = ["சில பதில்களில் ஆழமான தொழில்நுட்ப விவாதங்கள் தேவைப்பட்டன", "அளவிடக்கூடிய முடிவுகளை இன்னும் விரிவாகக் கூறலாம்"]
            improvements = ["தொழில்நுட்ப சவால்களை சமாளித்த முறையை இன்னும் விரிவாக விவரிக்கவும்", "STAR முறையைப் பயன்படுத்தி பதில்களை வடிவமைக்கவும்"]
            topics_to_study = ["கணினி கட்டமைப்பு அடிப்படைகள்", "தரவுத்தள உகப்பாக்கம்", "REST API வடிவமைப்பு"]
        else:
            observations = f"The candidate demonstrated solid conceptual clarity and genuine engagement with their resume portfolio. Technical answers reflected sound fundamentals with good conversational poise in {meta['name']}."
            strong_areas = [
                "Clear articulation of academic and capstone project objectives.",
                "Responsive to direct prompts and adaptive follow-up inquiries.",
                "Good technical vocabulary and foundational systems knowledge."
            ]
            weak_areas = [
                "Could provide deeper architectural rationale for why specific technologies/sensors were picked.",
                "Answers occasionally lacked concrete quantitative outcome metrics (e.g., latency, throughput, error rates)."
            ]
            improvements = [
                "Adopt the STAR format (Situation, Task, Action, Result) consistently for all behavioral and project responses.",
                "Proactively articulate engineering tradeoffs (e.g., Why MongoDB vs PostgreSQL? Why polling vs websockets?).",
                "Practice framing challenges overcome during implementation as growth opportunities."
            ]
            topics_to_study = [
                "System Architecture & Scalability Patterns (Caching, Indexing, Queues)",
                "Error Handling & Resiliency in Distributed Systems",
                "Asynchronous Programming & Concurrency Models"
            ]

        return {
            "overall_score": round(avg_score, 1),
            "answer_relevance": round(avg_relevance, 1),
            "technical_understanding": round(avg_tech, 1),
            "communication_clarity": round(avg_clarity, 1),
            "confidence_indicator": confidence_val,
            "language_used": lang,
            "language_label": f"{meta['name']} ({meta['native']})",
            "overall_observations": observations,
            "strong_areas": strong_areas,
            "weak_areas": weak_areas,
            "recommended_improvements": improvements,
            "suggested_topics_to_study": topics_to_study,
            "example_improved_answers": pairs
        }
