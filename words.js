export const words = {
    size: 1,
    list:[
        { word: "far", meaning: "遠い" },
        { word: "from", meaning: "～から" },
        { word: "soon", meaning: "すぐに" },
        { word: "dish", meaning: "料理・皿"},
        { word: "reservation", meaning: "予約"},

        { word: "other", meaning: "他の"},
        { word: "these", meaning: "これらの"},
        { word: "various", meaning: "様々な"},
        { word: "thing", meaning: "もの・こと"},
        { word: "live", meaning: "生きる・住む"},
        // 他の単語も追加
    ],
    solved_flags:[],
    weak_flags:[]
}

let quizMode = 0;

let currentQuestionIndex = -1;

export function words_reset(m){
    quizMode = m;
    currentQuestionIndex = -1;
}
export function words_init(){
    words.size = words.list.length;
    for(let i = 0;i < words.size;i++){
        words.solved_flags[i] = false;
        words.weak_flags[i] = false;
    }
}
export function setWord(){
    const questionElement = document.getElementById("question");
    currentQuestionIndex += 1;
    if(currentQuestionIndex == words.size) return false;
    if(quizMode == 1){
        while(!words.weak_flags[currentQuestionIndex]) currentQuestionIndex += 1;
    }
    questionElement.textContent = 
    `「${words.list[currentQuestionIndex].meaning} (${words.list[currentQuestionIndex].word.charAt(0)})」`;

    // HTML内の要素を取得
    const quizTitleElement = document.getElementById("quiz-title");

    // テキストを変更
    if (quizTitleElement) {
        quizTitleElement.textContent = "Q." + (currentQuestionIndex + 1);
    }
    return true;
}
export function setCorrect(){
    words.solved_flags[currentQuestionIndex] = true;
}
export function setWrong(){
    words.weak_flags[currentQuestionIndex] = true;
}
export function getCurrentWord(){   
    return words.list[currentQuestionIndex].word;
}
export function finalQuestion(){
    if(quizMode == 1){
        let idx = currentQuestionIndex;
        idx += 1;
        while(idx < words.size && !words.weak_flags[idx]) idx += 1;
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
        meaningCell.textContent = word.meaning;
    
        // solved_flags の情報を表示する（ここではテキストとして表示）
        solvedCell.textContent = words.solved_flags[i] ? 'OK' : '  ';
    
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
        if(words.solved_flags[i])    check = 'OK';
        else if(words.weak_flags[i]) check = 'NG'
        solvedCell.textContent = check;
    }
}
  
