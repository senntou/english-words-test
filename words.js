export const words = {
    size: 1,
    max_size:100,
    list:[
        // { word: "far", meaning: "遠い" },
        // { word: "from", meaning: "～から" },
        // { word: "soon", meaning: "すぐに" },
        // { word: "dish", meaning: "料理・皿"},
        // { word: "reservation", meaning: "予約"},

        // { word: "other", meaning: "他の"},
        // { word: "these", meaning: "これらの"},
        // { word: "various", meaning: "様々な"},
        // { word: "thing", meaning: "もの・こと"},
        // { word: "live", meaning: "生きる・住む"},
        // // 他の単語も追加
    ],
    solved_flags:[],
}

let quizMode = 0;
let currentQuestionIndex = -1;

function getQuestion(idx){
    return `「${words.list[idx].word}」`;
}

// ブラウザのクッキーにboolean型の配列を保存する関数
window.setCookie = function setCookie() {
    const expires = new Date();
    const days = 30;
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `english-words-test=${JSON.stringify(words.solved_flags)};expires=${expires.toUTCString()};path=/`;
}

// ブラウザのクッキーからboolean型の配列を読み取る関数
window.getCookie = function getCookie() {
    const cookieName = `english-words-test=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            const cookieValue = cookie.substring(cookieName.length, cookie.length);
            return JSON.parse(cookieValue);
        }
    }

    return null;
}

export function words_reset(m){
    quizMode = m;
    currentQuestionIndex = -1;
}
export async function words_init(){
    words.size = words.list.length;
    words.solved_flags = getCookie();
    if(words.solved_flags === null || words.solved_flags.size < words.max_size){
        words.solved_flags = [];
        for(let i = 0;i < words.size;i++){
            words.solved_flags[i] = 0;
        }
    }
    
    await getCSV();

    generateWordTable("word-list");
    
}


async function getCSV(){
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "words.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行
	
    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    return new Promise( (resolve) => {
        req.onload = function(){
            convert(req.responseText); // 渡されるのは読み込んだCSVデータ
            resolve();
        }
    });
}
function convert(str){
    let lines = str.split("\n");
    for(let i = 0;i < lines.length;i++){
        let ln = lines[i];
        let s = ln.split(",");
        let obj = {
            word : s[0],
            pt : s[1],
            pp : s[2],
        }

        words.list.push(obj);
    }
    words.size = words.list.length;
}
export function setWord(){
    const questionElement = document.getElementById("question");
    currentQuestionIndex += 1;
    if(currentQuestionIndex == words.size) return false;
    if(quizMode == 1){
        while(!(words.solved_flags[currentQuestionIndex] === 2)) currentQuestionIndex += 1;
    }
    questionElement.textContent = getQuestion(currentQuestionIndex);

    // HTML内の要素を取得
    const quizTitleElement = document.getElementById("quiz-title");

    // テキストを変更
    if (quizTitleElement) {
        quizTitleElement.textContent = "Q." + (currentQuestionIndex + 1);
    }
    return true;
}
export function setCorrect(){
    words.solved_flags[currentQuestionIndex] = 1;
    setCookie();
}
export function setWrong(){
    words.solved_flags[currentQuestionIndex] = 2;
    setCookie();
}
export function getCurrentWord(){   
    return words.list[currentQuestionIndex].word;
}
export function getCurrentPT(){
    return words.list[currentQuestionIndex].pt;
}
export function getCurrentPP(){
    return words.list[currentQuestionIndex].pp;
}
export function finalQuestion(){
    if(quizMode == 1){
        let idx = currentQuestionIndex;
        idx += 1;
        while(idx < words.size && !(words.solved_flags[idx] === 3)) idx += 1;
        if(idx == words.size) return true;
        return false;
    }
    return currentQuestionIndex == words.size - 1;
}

export function generateWordTable(containerId) {
    const wordListContainer = document.getElementById(containerId);
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
  
    // ヘッダー行を作成
    const headerRow = document.createElement('tr');
    const wordHeader = document.createElement('th');
    const meaningHeader = document.createElement('th');
    const solvedHeader = document.createElement('th');
  
    wordHeader.textContent = '単語';
    meaningHeader.textContent = '意味';
    solvedHeader.textContent = ''; // 新しいヘッダー
  
    headerRow.appendChild(wordHeader);
    headerRow.appendChild(meaningHeader);
    headerRow.appendChild(solvedHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    for(let i = 0;i < words.size;i++){

        const word = words.list[i];
        const row = document.createElement('tr');
        const wordCell = document.createElement('td');
        const meaningCell = document.createElement('td');
        const solvedCell = document.createElement('td');
        solvedCell.id = "solved-cell-" + i;
    
        wordCell.textContent = word.word;
        meaningCell.textContent = word.pp;
    
        row.appendChild(wordCell);
        row.appendChild(meaningCell);
        row.appendChild(solvedCell);
        tbody.appendChild(row);
    }
  
    table.appendChild(tbody);
    wordListContainer.appendChild(table);
}

export function updateWordTable(){
    for(let i = 0;i < words.size;i++){
        const solvedCell = document.getElementById("solved-cell-" + i);
        let check = '　';
        if(words.solved_flags[i] === 1)    check = 'OK';
        else if(words.solved_flags[i] === 2) check = 'NG'
        solvedCell.textContent = check;
    }
}
  
