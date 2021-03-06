async function getImage(topic) {
  let image = await fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=${topic}`, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "ea349901b7mshedf8bfd80447b88p1fb049jsn7dc51faa3c39",
      "x-rapidapi-host": "bing-image-search1.p.rapidapi.com",
    },
  });
  myImage = await image.json();
  actualImage = myImage.value[0].thumbnailUrl;
  return actualImage;
}

const randomTopicsArray = [];
const topic = {
  easy: "General Knowledge",
  medium: "General Knowledge",
  hard: "General Knowledge",
};
// getImage("Entertainment");

async function displayQuiz(difficulty, topic) {
  let quizzesSuggestionSection = document.querySelector(".suggested-quizzes");
  let quizDiv = document.createElement("div");
  quizDiv.classList.add("suggested-quiz");
  quizzesSuggestionSection.appendChild(quizDiv);

  let quizImage = document.createElement("img");
  quizImage.src = await getImage(topic);
  // quizImage.src = "testPhoto.jpg";
  quizDiv.appendChild(quizImage);

  const quizHeader = document.createElement("h2");
  quizHeader.innerText = `${topic}: ${difficulty}`;
  quizDiv.appendChild(quizHeader);

  return quizDiv;
}
function generateRandomIdArray() {
  while (randomTopicsArray.length < 3) {
    let a = Math.floor(Math.random() * categoryArray.length);
    if (randomTopicsArray.indexOf(a) === -1) randomTopicsArray.push(categoryArray[a]);
  }
}
async function getQuizTopics(id, difficulty) {
  let responce = await fetch(`https://opentdb.com/api.php?amount=10&category=${id}`);
  let quizJSON = await responce.json();
  let quiz = quizJSON.results;
  topic[difficulty] = quiz[0].category;
  let quizName = quiz[0].category;
  if (quizName.search("Entertainment:") !== -1) {
    quizName = quizName.slice(14);
  }
  if (quizName.search("Science:") !== -1) {
    quizName = quizName.slice(8);
  }
  return quizName;
}

async function generateEasyQuiz() {
  const easyQuizName = await getQuizTopics(randomTopicsArray[0], "easy");
  const easyDiv = await displayQuiz("Easy", easyQuizName);
  easyDiv.addEventListener("click", playEasyQuiz);
}
async function generateMediumQuiz() {
  const mediumQuizName = await getQuizTopics(randomTopicsArray[1], "medium");
  const easyDiv = await displayQuiz("Medium", mediumQuizName);
  easyDiv.addEventListener("click", playMediumQuiz);
}
async function generateHardQuiz() {
  const hardQuizName = await getQuizTopics(randomTopicsArray[2], "hard");
  const easyDiv = await displayQuiz("Hard", hardQuizName);
  easyDiv.addEventListener("click", playHardQuiz);
}
function playEasyQuiz() {
  category = randomTopicsArray[0];
  difficulty = "easy";
  numOfQuestions = 10;
  gameMode = "multiple";
  fetchQuiz();
}
function playMediumQuiz() {
  category = randomTopicsArray[1];
  difficulty = "medium";
  numOfQuestions = 10;
  gameMode = "multiple";
  fetchQuiz();
}
function playHardQuiz() {
  category = randomTopicsArray[2];
  difficulty = "hard";
  numOfQuestions = 10;
  gameMode = "multiple";
  fetchQuiz();
}
function generateQuizzes() {
  generateRandomIdArray();
  generateEasyQuiz();
  generateMediumQuiz();
  generateHardQuiz();
}
