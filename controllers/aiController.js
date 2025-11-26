import Resume from "../Models/Resume.js";
import ai from "../configs/ai.js";

// =============================
// Enhance Professional Summary
// =============================
export const enchanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing Required fields" });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert in resume writing. Enhance the professional summary in 1-2 sentences. Only return pure text."
                },
                { role: "user", content: userContent }
            ]
        });

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


// =============================
// Enhance Job Description
// =============================
export const enchanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing Required fields" });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert in resume writing. Enhance the job description in 1-2 sentences. Only return pure text."
                },
                { role: "user", content: userContent }
            ]
        });

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


// =============================
// Upload Resume
// =============================
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const systemPrompt = "You are an advanced AI resume parser. Extract resume data and return ONLY clean JSON.";

        const userPrompt = `
        Extract structured data from the following resume text:

        ${resumeText}

        Return ONLY JSON in this structure:

        {
            "professional_summary": "",
            "skills": [],
            "personal_info": {
                "image": "",
                "full_name": "",
                "profession": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "website": ""
            },
            "experience": [
                {
                    "company": "",
                    "position": "",
                    "start_date": "",
                    "end_date": "",
                    "description": "",
                    "is_current": false
                }
            ],
            "project": [
                { "name": "", "type": "", "description": "" }
            ],
            "education": [
                {
                    "institution": "",
                    "degree": "",
                    "field": "",
                    "graduation_date": "",
                    "gpa": "",
                    "is_current": false
                }
            ]
        }
        `;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        const extractedData = response.choices[0].message.content;

        let parsedData;
        try {
            parsedData = JSON.parse(extractedData);
        } catch (err) {
            return res.status(500).json({
                message: "AI returned invalid JSON",
                raw: extractedData
            });
        }

        const newResume = await Resume.create({
            userId,
            title,
            ...parsedData
        });

        return res.status(200).json({ resumeId: newResume._id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
