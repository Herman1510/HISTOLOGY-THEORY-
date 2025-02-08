// Track quiz start time
const startTime = Date.now();

// Correct answers
const correctAnswers = {
    q1: "E", q2: "B", q3: "C", q4: "C", q5: "A",
    q6: "B", q7: "A", q8: "B", q9: "C", q10: "B",
    q11: "C", q12: "A", q13: "C", q14: "B", q15: "B",
    q16: "C", q17: "C", q18: "C", q19: "B", q20: "A",
    q21: "D", q22: "B", q23: "A", q24: "A", q25: "A",
    q26: "B", q27: "B", q28: "A", q29: "C", q30: "C",
    q31: "C", q32: "B", q33: "A", q34: "B", q35: "C",
    q36: "A", q37: "C", q38: "D", q39: "D", q40: "B",
    q41: "A", q42: "C", q43: "C", q44: "C", q45: "D",
    q46: "A", q47: "C", q48: "A", q49: "A", q50: "B"
};

// Handle quiz submission
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("quizForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent page refresh

        // Calculate time spent
        const endTime = Date.now();
        const timeSpent = ((endTime - startTime) / 1000).toFixed(2);

        let studentName = document.getElementById("studentName").value.trim();
        if (!studentName) {
            alert("Please enter your name.");
            return;
        }

        let answers = {};
        let score = 0;
        let totalQuestions = Object.keys(correctAnswers).length;

        // Loop through questions
        Object.keys(correctAnswers).forEach((key) => {
            let selectedOption = document.querySelector(`input[name="${key}"]:checked`);
            if (selectedOption) {
                answers[key] = selectedOption.value;
                if (selectedOption.value.toUpperCase() === correctAnswers[key].toUpperCase()) {
                    score++;
                }
            }
        });

        let percentage = ((score / totalQuestions) * 100).toFixed(2);
        let grade = percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : "F";
        let comments =
            grade === "A" ? "Excellent performance!" :
            grade === "B" ? "Good job, keep it up!" :
            grade === "C" ? "Fair effort, but there's room for improvement." :
            grade === "D" ? "You passed, but try to work harder." :
            "Needs improvement, keep studying!";

        // Display results
        let resultHTML = `
            <h2>Quiz Results</h2>
            <p><strong>Name:</strong> ${studentName}</p>
            <p><strong>Score:</strong> ${score} / ${totalQuestions} (${percentage}%)</p>
            <p><strong>Grade:</strong> ${grade}</p>
            <p><strong>Comments:</strong> ${comments}</p>
            <p><strong>Time Spent:</strong> ${timeSpent} seconds</p>
            <h3>Correct Answers</h3>
            <table border="1">
                <tr>
                    <th>Question</th>
                    <th>Your Answer</th>
                    <th>Correct Answer</th>
                </tr>`;

        Object.keys(correctAnswers).forEach((key) => {
            let userAnswer = answers[key] ? answers[key].toUpperCase() : "Not Answered";
            let correctAnswer = correctAnswers[key];
            let color = userAnswer === correctAnswer ? "green" : "red";
            resultHTML += `
                <tr>
                    <td>${key.toUpperCase()}</td>
                    <td style="color:${color}">${userAnswer}</td>
                    <td>${correctAnswer}</td>
                </tr>`;
        });

        resultHTML += `</table>
            <p style="font-size: small; font-style: italic;">Presented to you by a man from the future</p>`;

        // Display results in the page
        document.getElementById("quizResults").innerHTML = resultHTML;
        document.getElementById("quizResults").scrollIntoView({ behavior: "smooth" });
    });
});
