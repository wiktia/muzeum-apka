
const questions = [
    {
        question: "Kim był August Emil Fieldorf 'Nil'?",
        answers: [
            { text: "Liderem I Brygady Legionów", correct: false },
            { text: "Generałem Armii Krajowej", correct: true },
            { text: "Komunistycznym działaczem", correct: false },
            { text: "Prezydentem Polski", correct: false }
        ]
    },
    {
        question: "W jakiej organizacji działał August Fieldorf 'Nil'?",
        answers: [
            { text: "Armia Krajowa", correct: true },
            { text: "Polska Partia Robotnicza", correct: false },
            { text: "Związek Walki Zbrojnej", correct: false },
            { text: "NSZ", correct: false }
        ]
    },
    {
        question: "W którym roku August Fieldorf 'Nil' został aresztowany przez NKWD?",
        answers: [
            { text: "1947", correct: true },
            { text: "1944", correct: false },
            { text: "1950", correct: false },
            { text: "1939", correct: false }
        ]
    },
    {
        question: "Kiedy August Fieldorf 'Nil' został stracony?",
        answers: [
            { text: "1953", correct: true },
            { text: "1945", correct: false },
            { text: "1950", correct: false },
            { text: "1960", correct: false }
        ]
    },
    {
        question: "Jakie stanowisko pełnił August Fieldorf 'Nil' w Armii Krajowej?",
        answers: [
            { text: "Komendant Główny", correct: false },
            { text: "Wicekomendant Główny", correct: true },
            { text: "Dowódca I Brygady", correct: false },
            { text: "Szef Sztabu", correct: false }
        ]
    },
    {
        question: "Jaką formację dowodził Fieldorf 'Nil' w 1943 roku?",
        answers: [
            { text: "I Brygada Legionów", correct: false },
            { text: "Zgrupowanie 'Krybar'", correct: true },
            { text: "Oddział Wydzielony Wojska Polskiego", correct: false },
            { text: "Batalion 'Zośka'", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let quizEnded = false;

// Dopasowanie do istniejącego HTML
const questionElement = document.querySelector('.question');
const answerButtons = document.querySelector('.answers-container');
const nextButton = document.createElement('button');
nextButton.className = 'answer-btn';
nextButton.style.marginTop = '20px';
nextButton.textContent = 'Dalej';
nextButton.style.display = 'none';
answerButtons.parentElement.appendChild(nextButton);

const feedbackImage = document.getElementById('feedback-image') || { src: '' };
const playerAvatar = document.getElementById('player-avatar');
const playerNameElement = document.getElementById('player-name');
const playerScoreElement = document.getElementById('player-score');

let userName = localStorage.getItem('userName') || 'Gracz';
let rawAvatar = localStorage.getItem('selectedAvatar') || '1';
let userAvatar = `static/obrazki/${rawAvatar}`;
playerAvatar.src = userAvatar;
let userPoints = 0;

playerAvatar.src = userAvatar;
playerNameElement.textContent = userName;
playerScoreElement.textContent = `Wynik: ${userPoints}`;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  quizEnded = false;
  nextButton.innerHTML = 'Dalej';
  nextButton.style.display = 'none';
  shuffleArray(questions);
  showQuestion();
}

function showQuestion() {
  resetState();
  feedbackImage.src = userAvatar;

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

  const answers = [...currentQuestion.answers];
  shuffleArray(answers);

  answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('answer-btn');
    if (answer.correct) {
      button.dataset.correct = 'true';
    }
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });

  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = progressPercent + '%';
}

function resetState() {
  nextButton.style.display = 'none';
  [...answerButtons.querySelectorAll('.answer-btn')].forEach(btn => btn.remove());
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === 'true';

  if (isCorrect) {
    selectedBtn.classList.add('correct');
    score++;
    feedbackImage.src = userAvatar.replace('.png', '-like.png');
  } else {
    selectedBtn.classList.add('incorrect');
    feedbackImage.src = userAvatar;
  }

  [...answerButtons.querySelectorAll('.answer-btn')].forEach(button => {
    if (button.dataset.correct === 'true') {
      button.classList.add('correct');
    }
    button.disabled = true;
  });

  nextButton.style.display = 'block';
}

function showScore() {
  resetState();
  questionElement.innerHTML = `Zdobyłeś ${score} na ${questions.length} punktów!`;
  nextButton.innerHTML = 'Zagraj ponownie';
  nextButton.style.display = 'block';
  quizEnded = true;
  progressBar.style.width = '100%';
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }

  feedbackImage.src = userAvatar;
}

nextButton.addEventListener('click', () => {
  if (quizEnded) {
    startQuiz();
  } else {
    handleNextButton();
  }
});

startQuiz();
