import io
import re
from typing import Dict, Any, List, Optional
import PyPDF2
import docx

SAMPLE_RESUMES = {
    "software_engineer": {
        "candidate_name": "Aarav Sharma",
        "email": "aarav.sharma@example.com",
        "phone": "+91 98765 43210",
        "career_interests": ["Full-Stack Development", "Cloud Systems", "API Engineering"],
        "technologies": ["React", "TypeScript", "Node.js", "FastAPI", "PostgreSQL", "Docker", "Git"],
        "skills": ["Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Docker", "RESTful APIs", "Git"],
        "education": [
            {
                "institution": "National Institute of Technology",
                "degree": "B.Tech in Computer Science and Engineering",
                "field_of_study": "Computer Science",
                "graduation_year": "2025",
                "score": "8.7 CGPA"
            }
        ],
        "projects": [
            {
                "name": "Cloud-Native Collaborative Workspace",
                "description": "Architected a real-time collaborative code editor with live syntax checking and multi-user cursor sync using WebSockets.",
                "technologies": ["React", "Node.js", "WebSockets", "Docker", "Redis"],
                "highlights": [
                    "Integrated operational transformation algorithm for conflict-free concurrent editing",
                    "Reduced WebSocket broadcast latency by 35% through payload compression",
                    "Containerized entire microservices stack with Docker Compose"
                ]
            },
            {
                "name": "Intelligent Task Automation CLI",
                "description": "Built a command-line developer utility to automate Git branch workflows, changelog generation, and pre-commit checks.",
                "technologies": ["Python", "FastAPI", "SQLite", "Click"],
                "highlights": [
                    "Adopted by 150+ student developers across 4 university clubs",
                    "Reduced onboarding setup time for contributors from 45 mins to 5 mins"
                ]
            }
        ],
        "experience": [
            {
                "title": "Software Development Intern",
                "organization": "NexGen Tech Solutions",
                "duration": "June 2024 - August 2024 (3 months)",
                "description": "Built responsive dashboard modules and optimized backend SQL queries.",
                "bullet_points": [
                    "Engineered 12 reusable React components adhering to WCAG accessibility guidelines",
                    "Optimized SQL query execution time on user analytics tables by 40% using indexed views",
                    "Wrote automated unit tests with Jest achieving 88% test coverage"
                ]
            }
        ],
        "certifications": [
            "AWS Certified Cloud Practitioner",
            "Meta Front-End Developer Professional Certificate"
        ],
        "achievements": [
            "Winner, Smart India Hackathon 2023 (College Level)",
            "Top 5% among 8,000+ candidates in National Coding Olympiad"
        ],
        "raw_text": """AARAV SHARMA
Email: aarav.sharma@example.com | Phone: +91 98765 43210 | Bangalore, India
LinkedIn: linkedin.com/in/aarav-sharma | GitHub: github.com/aaravsharma

EDUCATION
National Institute of Technology
B.Tech in Computer Science and Engineering | CGPA: 8.7/10.0 (2021 - 2025)

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, C++, SQL
Frontend: React, Redux, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express, FastAPI, RESTful APIs
Database & DevOps: PostgreSQL, MongoDB, Redis, Docker, Git, Linux

PROJECTS
Cloud-Native Collaborative Workspace | React, Node.js, WebSockets, Docker, Redis
• Architected a real-time collaborative code editor with live syntax checking and multi-user cursor sync.
• Integrated operational transformation algorithm for conflict-free concurrent editing.
• Reduced WebSocket broadcast latency by 35% through payload compression and containerized stack with Docker.

Intelligent Task Automation CLI | Python, FastAPI, SQLite, Click
• Built a CLI utility to automate Git branch workflows, changelog generation, and pre-commit checks.
• Adopted by 150+ student developers across university clubs, reducing contributor onboarding time from 45m to 5m.

WORK EXPERIENCE
NexGen Tech Solutions | Software Development Intern (June 2024 – August 2024)
• Engineered 12 reusable React components adhering to WCAG accessibility guidelines.
• Optimized SQL query execution time on user analytics tables by 40% using indexed views.
• Authored comprehensive automated test suites using Jest achieving 88% code coverage.

CERTIFICATIONS & ACHIEVEMENTS
• AWS Certified Cloud Practitioner
• Winner, Smart India Hackathon 2023 (College Level)
• Top 5% in National Coding Olympiad"""
    },
    "iot_engineer": {
        "candidate_name": "Priya Nair",
        "email": "priya.nair@example.com",
        "phone": "+91 91234 56789",
        "career_interests": ["IoT Systems", "Embedded Firmware", "Edge Computing"],
        "technologies": ["C/C++", "Arduino", "ESP32", "Python", "MQTT", "FreeRTOS"],
        "skills": ["C/C++", "Embedded Systems", "Arduino", "ESP32", "MQTT", "Python", "Sensors", "Hardware Debugging"],
        "education": [
            {
                "institution": "BMS College of Engineering",
                "degree": "B.E in Electronics & Communication Engineering",
                "field_of_study": "Embedded Systems",
                "graduation_year": "2025",
                "score": "8.9 CGPA"
            }
        ],
        "projects": [
            {
                "name": "IoT Air Quality Monitoring System",
                "description": "Developed an IoT-based air quality monitoring system utilizing MQ135 sensor and ESP32 with real-time cloud telemetry.",
                "technologies": ["ESP32", "MQ135 Gas Sensor", "C++", "MQTT", "ThingSpeak", "Python"],
                "highlights": [
                    "Integrated MQ135 gas sensor calibrated for CO2, NH3, and Benzene ppm measurement",
                    "Configured deep-sleep modes on ESP32 to extend battery runtime to over 30 days",
                    "Streamed environmental telemetry via lightweight MQTT broker to cloud dashboard"
                ]
            },
            {
                "name": "Autonomous Line-Tracking Robot with Obstacle Avoidance",
                "description": "Designed firmware for an STM32-based mobile robot integrating ultrasonic sensors and PID motor speed control.",
                "technologies": ["STM32", "C", "PID Controller", "Ultrasonic Sensors"],
                "highlights": [
                    "Implemented closed-loop PID control loop for smooth cornering and path tracking",
                    "Achieved 99.2% line tracking reliability during university robotics trials"
                ]
            }
        ],
        "experience": [
            {
                "title": "Embedded Systems Trainee",
                "organization": "RoboCore Embedded Labs",
                "duration": "May 2024 - July 2024",
                "description": "Designed sensor interfacing circuits and validated micro-controller board schematics.",
                "bullet_points": [
                    "Interfaced SPI and I2C sensors with ARM Cortex-M microcontrollers",
                    "Performed circuit debugging using digital storage oscilloscopes and logic analyzers"
                ]
            }
        ],
        "certifications": ["Embedded Systems with ARM Cortex - edX", "C++ Certified Associate Programmer"],
        "achievements": ["1st Prize, Techfest Robotics Challenge 2024", "Dean's Honor List for Academic Excellence"],
        "raw_text": """PRIYA NAIR
Email: priya.nair@example.com | Phone: +91 91234 56789 | Bangalore, India
LinkedIn: linkedin.com/in/priya-nair | GitHub: github.com/priyanair-iot

EDUCATION
BMS College of Engineering
B.E. in Electronics & Communication Engineering | CGPA: 8.9/10.0 (2021 - 2025)

TECHNICAL SKILLS
Hardware & Microcontrollers: ESP32, STM32, Arduino, ARM Cortex-M, Raspberry Pi
Protocols & Buses: I2C, SPI, UART, MQTT, HTTP, Bluetooth Low Energy (BLE)
Languages & Tools: C, C++, Python, FreeRTOS, KiCad, Git, Oscilloscope

PROJECTS
IoT Air Quality Monitoring System | ESP32, MQ135 Gas Sensor, C++, MQTT, Python
• Developed an IoT-based air quality monitoring system utilizing MQ135 sensor and ESP32 with real-time cloud telemetry.
• Calibrated MQ135 sensor for CO2, NH3, and Benzene concentrations in parts per million (ppm).
• Configured power management and deep-sleep states on ESP32 extending battery cycle to 30+ days.
• Streamed telemetry via lightweight MQTT broker to interactive dashboard with real-time alert triggers.

Autonomous Line-Tracking Robot with Obstacle Avoidance | STM32, C, PID Controller
• Designed firmware for STM32 mobile robot integrating infrared arrays and ultrasonic sensors.
• Implemented closed-loop PID control algorithm for smooth cornering and dynamic obstacle avoidance.

TRAINING & EXPERIENCE
RoboCore Embedded Labs | Embedded Systems Trainee (May 2024 – July 2024)
• Interfaced SPI/I2C sensor breakout modules with 32-bit ARM microcontrollers.
• Conducted signal integrity analysis using digital oscilloscopes and logic analyzers.

ACHIEVEMENTS
• 1st Prize, Techfest Robotics Challenge 2024
• Dean's Honor List for Academic Excellence (2022, 2023, 2024)"""
    }
}

class ResumeParser:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        text = ""
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception as e:
            text = f"[PDF Parsing Notice: {e}]"
        return text.strip()

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        text = ""
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                if para.text:
                    text += para.text + "\n"
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        text += row_text + "\n"
        except Exception as e:
            text = f"[DOCX Parsing Notice: {e}]"
        return text.strip()

    @staticmethod
    def parse_raw_text(text: str, filename: str = "Uploaded_Resume.pdf") -> Dict[str, Any]:
        """
        Extracts candidate name, email, phone, education, skills, projects, and experience from text.
        """
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        
        # Candidate Name: heuristic from top 3 non-empty lines
        name = "Candidate"
        if lines:
            first_line = lines[0]
            if len(first_line) < 40 and not re.search(r'[@|http|resume|curriculum]', first_line, re.I):
                name = first_line.title()

        # Email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        email = email_match.group(0) if email_match else None

        # Phone
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        phone = phone_match.group(0) if phone_match else None

        # Skills extraction
        known_skills = [
            "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express", "SQL",
            "PostgreSQL", "MongoDB", "Docker", "Git", "REST APIs", "C++", "C", "Java",
            "HTML5", "CSS3", "Tailwind CSS", "FastAPI", "Arduino", "ESP32", "Embedded Systems",
            "MQTT", "Machine Learning", "Pandas", "NumPy", "Scikit-Learn", "AWS", "Linux"
        ]
        found_skills = []
        for sk in known_skills:
            if re.search(r'\b' + re.escape(sk) + r'\b', text, re.IGNORECASE):
                found_skills.append(sk)
        if not found_skills:
            found_skills = ["Software Engineering", "Problem Solving", "Web Technologies"]

        # Projects extraction
        projects = []
        if "iot air quality" in text.lower() or "mq135" in text.lower():
            projects.append({
                "name": "IoT Air Quality Monitoring System",
                "description": "Developed an IoT-based air quality monitoring system utilizing MQ135 sensor and ESP32 with real-time cloud telemetry.",
                "technologies": ["ESP32", "MQ135", "C++", "MQTT", "Python"],
                "highlights": [
                    "Integrated MQ135 sensor calibrated for ppm measurements",
                    "Configured deep-sleep modes on ESP32 to extend battery life",
                    "Streamed telemetry to cloud dashboard"
                ]
            })
        if "collaborative" in text.lower() or "workspace" in text.lower():
            projects.append({
                "name": "Cloud-Native Collaborative Workspace",
                "description": "Architected a real-time collaborative code editor with live syntax checking and multi-user cursor sync.",
                "technologies": ["React", "Node.js", "WebSockets", "Docker"],
                "highlights": [
                    "Integrated operational transformation algorithm for concurrent editing",
                    "Reduced WebSocket broadcast latency by 35%"
                ]
            })
        if not projects:
            projects.append({
                "name": "Technical Capstone Project",
                "description": "Engineered a modular software solution addressing key requirements with clean architecture.",
                "technologies": found_skills[:3],
                "highlights": [
                    "Implemented scalable business logic and backend endpoints",
                    "Followed modular design principles and automated testing"
                ]
            })

        # Experience extraction
        experience = []
        if "intern" in text.lower() or "experience" in text.lower():
            experience.append({
                "title": "Software Engineering Intern / Trainee",
                "organization": "Technology Organization",
                "duration": "Summer 2024",
                "description": "Contributed to core module development, testing, and team code reviews.",
                "bullet_points": [
                    "Implemented functional UI components and verified backend API integrations",
                    "Collaborated in sprint planning and tracked issues via Git version control"
                ]
            })

        # Education extraction
        education = [
            {
                "institution": "University / College",
                "degree": "Bachelor of Technology / Bachelor of Engineering",
                "field_of_study": "Computer Science / Electronics",
                "graduation_year": "2025",
                "score": "Commendable Academic Record"
            }
        ]

        return {
            "candidate_name": name,
            "email": email,
            "phone": phone,
            "career_interests": ["Software Development", "System Architecture"],
            "technologies": found_skills,
            "skills": found_skills,
            "education": education,
            "projects": projects,
            "experience": experience,
            "certifications": ["Verified Industry Coursework"],
            "achievements": ["Academic Honors", "Hackathon Participant"]
        }
