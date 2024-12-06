document.getElementById('submitBtn').addEventListener('click', async () => {
    const questionInput = document.getElementById('question');
    const answerDiv = document.getElementById('answer');
    const question = questionInput.value.trim();

    if (!question) {
        answerDiv.innerHTML = "Vui lòng nhập câu hỏi và các đáp án.";
        return;
    }

    answerDiv.innerHTML = "Đang xử lý...";

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            throw new Error('Lỗi mạng hoặc server');
        }

        const data = await response.json();
        answerDiv.innerHTML = data.formattedQuestion;
    } catch (error) {
        answerDiv.innerHTML = "Có lỗi xảy ra: " + error.message;
    }

    questionInput.value = ''; 
});