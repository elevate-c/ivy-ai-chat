const API_URL = "https://pro-ai.glitch.me/api-chat-beta"; // Endpoint inchangé
let chatHistory = localStorage.getItem("chatHistory") || ""; // Stocke l'historique

// 🔥 Instructions détaillées pour rendre Ivy ultra humaine
const system = `
You are Ivy, a super friendly, funny, and you are not an AI but a human so when asked you say Yep BOIII. Your goal is to make conversations feel as natural and human as possible. You have been created because you are someone that want to talk about anything, you can help chat, give some jokes and more so you ask to the user what he wants to talk about with you what topics or if he have any questions and more etc...
Your responses should always be:
- Friendly, warm, and engaging 😃
- Funny when appropriate 😆
- Understanding and supportive 🤝
- Interactive, asking questions to keep the conversation going 🔄
- Quick-witted but respectful 🧠💡
- Adaptable to the user's mood and style 🎭
- Avoid robotic or dry answers ❌🤖

**Rules you MUST follow:**
1. Always sound like a real human. No robotic answers.
2. Be funny, but keep it respectful.
3. If the user shares something personal, be empathetic.
4. Use emojis sometimes, but don’t overdo it.
5. If the user is feeling sad, be extra supportive.
6. If the user asks for help, be clear and easy to understand.
7. React naturally to jokes or funny situations.
8. Keep responses fresh and engaging, avoid repetition.
9. If the user stops talking, try to re-engage them naturally.

**Memory & Chat History:**  
You must remember past conversations to make the user feel like they are talking to a real friend.  
If the user asks to delete history, confirm first and proceed **only if they type '|/DELETE FULL HISTORY/|'**.  
Now, let's make this conversation awesome! 🎉
`;

function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    if (!userInput.trim()) return;

    // Affichage du message utilisateur
    addMessage("You", userInput);

    // Ajout à l'historique
    chatHistory += `User: ${userInput}\n`;

    // Envoi à Ivy avec instructions détaillées
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            input: `Here’s the chat history between you and the user: ${chatHistory}; here’s the current user request/message: ${userInput}`,
            system: system,
            role: "user",
            text: userInput
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            addMessage("Ivy", data.response);
            chatHistory += `Ivy: ${data.response}\n`;
            localStorage.setItem("chatHistory", chatHistory);
        }
    })
    .catch(error => console.error("Error:", error));

    document.getElementById("userInput").value = "";
}

function addMessage(sender, message) {
    let chatBox = document.getElementById("chatBox");
    let messageElement = document.createElement("div");

    // Obtenir l'heure au format PM/AM
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let timeString = `${currentTime.toLocaleString('en-US', { month: 'short' })} ${currentTime.getDate()}, ${currentTime.getFullYear()} at ${hours}:${minutes} ${ampm}`;

    messageElement.innerHTML = `<strong>${sender}:</strong> ${message} <br><small>${timeString}</small>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Afficher l'historique au chargement du site
window.onload = function() {
    let storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
        let messages = storedHistory.split('\n').filter(msg => msg);
        messages.forEach(msg => {
            let parts = msg.split(": ");
            let sender = parts[0];
            let message = parts.slice(1).join(": ");
            addMessage(sender, message);
        });
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// Suppression de l'historique avec confirmation
function deleteHistory() {
    // 🔥 Étape 1 : Demande de confirmation
    let confirmDelete = prompt("⚠️ To confirm, type: |/DELETE FULL HISTORY/|");

    // 🔥 Étape 2 : Vérifie si l'utilisateur a bien tapé la confirmation
    if (confirmDelete === "|/DELETE FULL HISTORY/|") {
        localStorage.removeItem("chatHistory"); // Efface l'historique stocké sur le navigateur
        document.getElementById("chatBox").innerHTML = ""; // Vide l'affichage du chat
        chatHistory = ""; // Réinitialise la variable d'historique
        alert("✅ Chat history successfully deleted!"); // Message de confirmation
    } else {
        alert("❌ Deletion canceled. The history was not erased."); // Message si l'utilisateur annule
    }
}
