document.addEventListener("DOMContentLoaded", () => {
    let sendBtn = document.getElementById("send-btn");
    let voiceBtn = document.getElementById("voice-btn");
    let chatInput = document.getElementById("chat-input");
    let chatBox = document.getElementById("chat-box");
    let themeBtn = document.querySelector(".theme-btn");

    let isDarkMode = true;

    // Theme Toggle
    themeBtn.addEventListener("click", function () {
        if (isDarkMode) {
            document.body.style.background = "#ffffff";  // White background
            document.body.style.color = "#000000";  // Black text
            document.querySelector(".sidebar").style.background = "#f0f0f0";
            document.querySelector(".chat-container").style.background = "#e6e6e6";
            document.querySelector(".chat-input").style.background = "#d9d9d9";

            // Update button text
            themeBtn.textContent = "Dark Mode";
            isDarkMode = false;
        } else {
            document.body.style.background = "#0d0d0d";  // Dark background
            document.body.style.color = "#ffffff";  // White text
            document.querySelector(".sidebar").style.background = "#1e1e1e";
            document.querySelector(".chat-container").style.background = "#121212";
            document.querySelector(".chat-input").style.background = "#292929";

            // Update button text
            themeBtn.textContent = "Light Mode";
            isDarkMode = true;
        }
    });

    // Check if elements exist before adding event listeners
    if (!sendBtn || !voiceBtn || !chatInput || !chatBox) {
        console.error("One or more elements not found! Check your HTML.");
        return;
    }

    sendBtn.addEventListener("click", sendMessage);
    voiceBtn.addEventListener("click", startVoiceRecognition);
    chatInput.addEventListener("keydown", event => {
        if (event.key === "Enter") sendMessage();
    });

    function sendMessage() {
        let messageText = chatInput.value.trim();
        if (messageText === "") return;

        let userMessage = createMessageElement(messageText, "user-message", "right");
        chatBox.appendChild(userMessage);

        let typingMessage = createTypingAnimation();
        chatBox.appendChild(typingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: messageText })
        })
        .then(response => response.json())
        .then(data => {
            chatBox.removeChild(typingMessage);
            chatBox.appendChild(createMessageElement(data.response, "bot-message", "left"));
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            console.error("Fetch error:", error);
            chatBox.removeChild(typingMessage);
            chatBox.appendChild(createMessageElement("Oops! Something went wrong.", "bot-message", "left"));
        });

        chatInput.value = "";
    }

    function createMessageElement(text, className, alignment) {
        let messageElement = document.createElement("div");
        messageElement.classList.add("message", className, alignment);
        messageElement.innerHTML = text;
        return messageElement;
    }

    function createTypingAnimation() {
        let typingElement = document.createElement("div");
        typingElement.classList.add("typing-animation", "bot-message", "left");
        typingElement.innerHTML = '<span></span><span></span><span></span>';
        return typingElement;
    }

    function startVoiceRecognition() {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.onstart = () => voiceBtn.style.background = "red";
        recognition.onresult = event => chatInput.value = event.results[0][0].transcript;
        recognition.onend = () => voiceBtn.style.background = "cyan";
        recognition.start();
    }
});
