const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI('AIzaSyAZvUYYXI1cnv4VAcu8WKXjAxGNJ5WgjYM');

app.post('/ask', async (req, res) => {
    const question = req.body.question;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        
        const prompt = `Dựa trên câu hỏi và các đáp án sau, hãy xác định câu trả lời đúng:
        
        ${question}
        
        Trả lời bằng cách chỉ đưa ra chữ cái đại diện cho đáp án đúng (A, B, C, hoặc D).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const correctAnswer = response.text().trim().toUpperCase();

        // Xử lý và định dạng lại câu hỏi
        const lines = question.split('\n');
        const formattedQuestion = lines.map((line, index) => {
            if (index === 0) return line; 
            if (line.startsWith(correctAnswer)) {
                return `<u>${line}</u>`; 
            }
            return line;
        }).join('<br>');

        res.json({ formattedQuestion });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});