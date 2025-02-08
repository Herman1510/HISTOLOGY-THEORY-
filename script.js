// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBVEMqQEwLmpzCwGQdQOfuc1CLceg7TX4M",
    authDomain: "herman-e5894.firebaseapp.com",
    databaseURL: "https://herman-e5894-default-rtdb.firebaseio.com",
    projectId: "herman-e5894",
    storageBucket: "herman-e5894.appspot.com",
    messagingSenderId: "17968105226",
    appId: "1:17968105226:web:d7c2852d574327495a1cf3"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page refresh

    try {
        console.log("Form submission started...");

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
        let comment = grade === "A" ? "Excellent!" : grade === "B" ? "Good Job!" : grade === "C" ? "Fair Effort" : grade === "D" ? "Needs Improvement" : "Better luck next time!";

        // Prepare result data
        const studentAnswers = {
            name: studentName,
            score: score,
            percentage: percentage,
            grade: grade,
            comment: comment,
            timeSpent: timeSpent,
            answers: answers,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        // Debug: Save results in localStorage in case Firebase fails
        localStorage.setItem("lastQuizResult", JSON.stringify(studentAnswers));

        console.log("Attempting to save to Firebase...");

        // Use a timeout to prevent quick refresh issues
        setTimeout(() => {
            database.ref("quizResults").push(studentAnswers)
                .then(() => {
                    console.log("Quiz submitted successfully!");
                    displayResults(studentAnswers);
                })
                .catch((error) => {
                    console.error("Error saving to database:", error);
                    alert("Submission failed. Check network connection.");
                });
        }, 1000); // Delay Firebase submission by 1 second

    } catch (error) {
        console.error("Unexpected error:", error);
    }
});

// Function to display quiz results
function displayResults(data) {
    let resultHTML = `
        <h2>Quiz Results</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Score:</strong> ${data.score}/${Object.keys(correctAnswers).length} (${data.percentage}%)</p>
        <p><strong>Grade:</strong> ${data.grade}</p>
        <p><strong>Comment:</strong> ${data.comment}</p>
        <p><strong>Time Spent:</strong> ${data.timeSpent} seconds</p>
        <h3>Correct Answers</h3>
        <table border="1">
            <tr><th>Question</th><th>Correct Answer</th><th>Your Answer</th></tr>
    `;

    Object.keys(correctAnswers).forEach((key, index) => {
        resultHTML += `
            <tr>
                <td>Question ${index + 1}</td>
                <td>${correctAnswers[key]}</td>
                <td>${data.answers[key] || "Not answered"}</td>
            </tr>
        `;
    });

    resultHTML += "</table>";
    document.getElementById("result").innerHTML = resultHTML;
}
