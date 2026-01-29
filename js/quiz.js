const questions = [
    {
        q: "Which frequency range is generally used for Terrestrial Microwave communication?",
        options: {
            a: "300 kHz – 3 MHz",
            b: "3 GHz – 30 GHz",
            c: "30 MHz – 300 MHz",
            d: "300 GHz – 400 THz"
        },
        correct: "b",
        feedback: "Correct! Terrestrial microwave systems operate mainly in the 3 GHz to 30 GHz range."
    },
    {
        q: "Why is line-of-sight (LoS) required in microwave communication?",
        options: {
            a: "Microwaves travel slower in air",
            b: "Microwaves cannot diffract effectively around large obstacles",
            c: "Microwaves only travel in straight cables",
            d: "Microwaves are absorbed by copper"
        },
        correct: "b",
        feedback: "Correct! Microwaves do not bend much around obstacles, so a clear path is required."
    },
    {
        q: "Which of the following is a major disadvantage of microwave communication?",
        options: {
            a: "Very low data rate",
            b: "High installation cost of cables",
            c: "Susceptibility to weather conditions like rain and fog",
            d: "Cannot transmit digital signals"
        },
        correct: "c",
        feedback: "Correct! Rain and atmospheric conditions can attenuate microwave signals."
    },
    {
        q: "Which device is used to focus microwave signals into a narrow beam?",
        options: {
            a: "Dipole antenna",
            b: "Parabolic dish antenna",
            c: "Loop antenna",
            d: "Yagi antenna"
        },
        correct: "b",
        feedback: "Correct! Parabolic dish antennas are used to highly focus microwave beams."
    },
    {
        q: "Which frequency range corresponds to Infrared (IR) waves?",
        options: {
            a: "3 kHz – 3 MHz",
            b: "3 MHz – 3 GHz",
            c: "300 GHz – 400 THz",
            d: "3 GHz – 30 GHz"
        },
        correct: "c",
        feedback: "Correct! Infrared lies roughly between 300 GHz and 400 THz."
    },
    {
        q: "Why is infrared communication mainly used for short-range indoor applications?",
        options: {
            a: "It has very low speed",
            b: "It cannot penetrate walls and is affected by sunlight",
            c: "It requires very large antennas",
            d: "It works only in vacuum"
        },
        correct: "b",
        feedback: "Correct! IR cannot pass through walls and sunlight causes interference."
    },
    {
        q: "Which of the following is a common application of infrared communication?",
        options: {
            a: "FM radio broadcasting",
            b: "TV remote control",
            c: "Satellite communication",
            d: "GPS navigation"
        },
        correct: "b",
        feedback: "Correct! TV remotes commonly use infrared communication."
    },
    {
        q: "Which property of infrared waves makes them suitable for secure communication within a room?",
        options: {
            a: "High penetration power",
            b: "Ability to travel through concrete",
            c: "Inability to penetrate opaque walls",
            d: "Very low frequency"
        },
        correct: "c",
        feedback: "Correct! IR cannot penetrate walls, so signals stay confined to one room."
    },
    {
        q: "In microwave communication, increasing the height of antennas mainly helps to:",
        options: {
            a: "Increase the signal frequency",
            b: "Reduce the effect of noise inside cables",
            c: "Extend the line-of-sight distance",
            d: "Reduce power consumption"
        },
        correct: "c",
        feedback: "Correct! Taller towers increase the visible horizon and transmission range."
    },
    {
        q: "Which of the following statements is TRUE about microwave communication?",
        options: {
            a: "It does not support high data rates",
            b: "It requires physical cables between stations",
            c: "It can carry high-capacity digital data over long distances using repeaters",
            d: "It works only for underwater communication"
        },
        correct: "c",
        feedback: "Correct! Microwave links can carry high-speed digital data using repeater stations."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function initQuiz() {
    renderQuestion();
}

function renderQuestion() {
    const quizContent = document.getElementById('quizContent');
    const qData = questions[currentQuestion];

    const progress = (currentQuestion / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    answered = false;

    quizContent.innerHTML = `
        <div class="card workbench-card active">
            <div class="hud-label" style="margin-bottom: 1rem;">Question ${currentQuestion + 1} of ${questions.length}</div>
            <h2 style="color: var(--primary-cyan);">${qData.q}</h2>
            <div class="options">
                ${Object.entries(qData.options).map(([key, val]) => `
                    <button class="option-btn" data-key="${key}" onclick="handleAnswer('${key}')">
                        <strong>${key.toUpperCase()}:</strong> ${val}
                    </button>
                `).join('')}
            </div>
            <div id="feedbackBox" style="margin-top:1.5rem; font-weight:600;"></div>
        </div>
    `;
}

window.handleAnswer = function (selected) {
    if (answered) return;
    answered = true;

    const qData = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    const feedbackBox = document.getElementById("feedbackBox");

    buttons.forEach(btn => {
        const key = btn.getAttribute("data-key");
        btn.classList.add("disabled");

        if (key === qData.correct) {
            btn.classList.add("correct");
        }

        if (key === selected && selected !== qData.correct) {
            btn.classList.add("wrong");
        }
    });

    if (selected === qData.correct) {
        score++;
        feedbackBox.style.color = "#22c55e";
        feedbackBox.innerText = "✔ " + qData.feedback;
    } else {
        feedbackBox.style.color = "#f472b6";
        feedbackBox.innerText = "✖ " + qData.feedback;
    }

    // Wait so user can read explanation
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            renderQuestion();
        } else {
            showResults();
        }
    }, 1800);
}

function showResults() {
    document.getElementById('progressFill').style.width = `100%`;

    const quizContent = document.getElementById('quizContent');
    const resultArea = document.getElementById('resultArea');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackText = document.getElementById('feedbackText');

    quizContent.style.display = 'none';
    resultArea.style.display = 'block';

    const percentage = Math.round((score / questions.length) * 100);

    feedbackTitle.innerText = percentage >= 70 ? "MISSION SUCCESS" : "MISSION FAILED";
    feedbackTitle.style.color = percentage >= 70 ? "#22c55e" : "#ef4444";
    feedbackTitle.style.borderColor = percentage >= 70 ? "#22c55e" : "#ef4444";

    feedbackText.innerHTML = `
        <div class="score-display">
            <div class="score-circle">${percentage}%</div>
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                You answered ${score} out of ${questions.length} questions correctly.
            </p>
            <p class="scen-text">
                ${percentage >= 70 ?
                    "Excellent work, Engineer! You have mastered the core concepts of microwave and infrared systems." :
                    "Review the Theory and Engineering Lab sections to strengthen your understanding."
                }
            </p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initQuiz);
