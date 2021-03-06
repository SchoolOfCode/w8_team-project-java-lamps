// API's URL for test
// https://opentdb.com/api.php?amount=10&category=20&difficulty=medium&type=multiple

// DOM variables
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionNumber = document.getElementById("question-number");
const score = document.getElementById("score");
const nexQuestionButton = document.querySelector("next-question-button");

// Game variables
let currentQuestion = {};
let acceptingAnswers = false;
let gameScore = 0;
let questionCounter = 0;
let availableQuestions = [];

const pointForCorrectAnswer = 1;
const maximumNumberOfQuestions = 10; // To change with the number of questions selected

let questions = [];

let urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.toString());

let quizUrl = urlParams.toString();
console.log(`https://opentdb.com/api.php?${quizUrl}`);

// Fetch request to the API
fetch(
    `https://opentdb.com/api.php?${quizUrl}`
    )
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((loadedQuestions) => {
        console.log(loadedQuestions);
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };
            
            const answerChoices = [...loadedQuestion.incorrect_answers]; //[...] is a spread operator, copies the array as it is
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            // add the correct answer in a random place in the array
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
                );
                // iterate through the choices you have in answerChoices, put them as answer 1-4
                answerChoices.forEach((choice, index) => {
                    // get them dynamically by getting their choice index and assign it a choice
                    formattedQuestion['choice' + (index + 1)] = choice;
                });
                
                return formattedQuestion;
            });
            console.log(questions);
            startGame();
        })
        .catch((err) => {
            console.error(err);
        });
        
        startGame = () => {
            questionCounter = 0;
            gameScore = 0;
            availableQuestions = [...questions];
            getNewQuestion();
        };
        
        // Retrieves a question from the questions array
        getNewQuestion = () => {
            if (availableQuestions.length === 0 || questionCounter >= maximumNumberOfQuestions) {
                // go to endPage if you've reached the end of the quiz
                sessionStorage.setItem("gameScore", gameScore);
                window.location.href = '../Question/endPage.html';
            }
            // Updates question Number on screen view
            questionCounter++;
            questionNumber.innerText = `${questionCounter}/${maximumNumberOfQuestions}`;
            
            const questionIndex = Math.floor(Math.random() * availableQuestions.length);
            currentQuestion = availableQuestions[questionIndex];
            question.innerText = currentQuestion.question.replace(
                /&#039|&rsquo;|&quot;|&#39;|;/g,
                "");
            
            choices.forEach((choice) => {
                const number = choice.dataset['number'];
                let formattedChoice = currentQuestion['choice' + number]
                choice.innerText = formattedChoice.replace(
                /&#039|&rsquo;|&quot;|&#39;|;/g,
                "");
            });
            
            availableQuestions.splice(questionIndex, 1);
            acceptingAnswers = true;
        };
        
        choices.forEach((choice) => {
            choice.addEventListener('click', (element) => {
                if (!acceptingAnswers) return;
                
                acceptingAnswers = false;
                const selectedChoice = element.target;
                const selectedAnswer = selectedChoice.dataset['number'];
                // Checks if the answer chosen is the correct answer
                const classToApply =
                selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
                // if it is add ! point to the score
                if (classToApply === 'correct') {
                    incrementScore(pointForCorrectAnswer);
                }
                // Highlight the correct answer in green or the wrong answer in red
                selectedChoice.classList.add(classToApply);
                // Wait 1 second before displaying new question
                setTimeout(() => {
                    selectedChoice.classList.remove(classToApply);
                    getNewQuestion();
                }, 1000);
            });
        });
        
        incrementScore = (num) => {
            gameScore += num;
            score.innerText = gameScore;
        };
