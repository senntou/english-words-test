import { generateWordTable, updateWordTable } from "./words.js";

// 既存のコードとは別に、モーダル用のJavaScriptを追加
window.openModal = function openModal() {
    updateWordTable();
    document.getElementById("modal").style.display = "grid";
}

window.closeModal = function closeModal() {
    document.getElementById("modal").style.display = "none";
}


