import { finalQuestion, generateWordTable, getCurrentWord, setCorrect, setWord,setWrong,words, words_init, words_reset } from "./words.js";

// HTML要素の取得
const questionElement = document.getElementById("question");
const answerInputElement = document.getElementById("answer-input");
const resultElement = document.getElementById("result");
const titleContainer = document.getElementById("title-container");
const quizContainer = document.getElementById("quiz-container");

window.startQuiz = function startQuiz(m) {
    if(m == 1){
        let flag = false;
        for(let i = 0;i < words.size;i++)
            if(words.weak_flags[i]) flag = true;
        if(!flag){
            console.log("苦手な問題ないよ！");
            return ;
        } 
    }
    titleContainer.style.display = "none";
    quizContainer.style.display = "block";
    initializeQuiz(m);
}

// クイズの初期化
function initializeQuiz(m) {
    words_reset(m);
    setWord();
    resetQuizElement();
}

function exitQuestion(){
    titleContainer.style.display = "block";
    quizContainer.style.display = "none";
}

function nextQuestion(){
    if(!setWord()){
        return ;
    }
    resetQuizElement();
}

function resetQuizElement(){
    const nextButtonElement = document.getElementById("quiz-button");
    nextButtonElement.onclick = checkAnswer;
    nextButtonElement.textContent = "回答";
    resultElement.textContent = "";
    answerInputElement.value = "";
    answerInputElement.focus();
}

// 回答のチェック
window.checkAnswer = function checkAnswer() {
    const userAnswer = answerInputElement.value.trim().toLowerCase();
    const correctAnswer = getCurrentWord();

    if (userAnswer === correctAnswer) {
        resultElement.textContent = "正解！🎉";
        setCorrect();
    } else {
        resultElement.textContent = "不正解 😔 正解は " + correctAnswer;
        setWrong();
    }

    const nextButtonElement = document.getElementById("quiz-button");
    nextButtonElement.onclick = nextQuestion;
    nextButtonElement.textContent = "次へ";

    if(finalQuestion()){
        nextButtonElement.onclick = exitQuestion;
        nextButtonElement.textContent = "タイトルへ";
    }
}

words_init();
generateWordTable("word-list");

const cookie = document.cookie;
console.log(cookie); // key=value; key=value; key=value; key=value; key=value; key=value;
console.log("OK");
