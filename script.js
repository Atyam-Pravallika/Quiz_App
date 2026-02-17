let quizData = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const highScoreEl = document.getElementById("highScore");

fetch("db.json")
    .then(res => res.json())
    .then(data => {
        quizData = shuffle(data);
        loadQuestion();
    });

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 10;
    timerEl.innerText = timeLeft;
    startTimer();

    const q = quizData[currentQuestion];
    questionEl.innerText = q.question;
    optionsEl.innerHTML = "";
    resultEl.innerText = "";

    q.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index, btn);
        optionsEl.appendChild(btn);
    });

    progressBar.style.width =
        ((currentQuestion) / quizData.length) * 100 + "%";
}

function checkAnswer(selected, btn) {

    const correctIndex = quizData[currentQuestion].correct;
    const buttons = optionsEl.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selected === correctIndex) {
        score++;
        btn.classList.add("correct");
        resultEl.innerText = "Correct!";
    } else {
        btn.classList.add("wrong");
        resultEl.innerText = "Wrong!";

      
        buttons[correctIndex].classList.add("correct");
    }

    clearInterval(timer);
}


function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    clearInterval(timer);

    const highScore = localStorage.getItem("highScore") || 0;
    if (score > highScore) {
        localStorage.setItem("highScore", score);
    }

    questionEl.innerText = "Your Score: " + score + "/" + quizData.length;
    optionsEl.innerHTML = "";
    resultEl.innerText = "";
    progressBar.style.width = "100%";

    nextBtn.style.display = "none";
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

nextBtn.addEventListener("click", nextQuestion);

document.getElementById("toggleMode").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
