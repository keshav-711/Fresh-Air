document.addEventListener('DOMContentLoaded', () => {
    //Select Elements
    const openBtn=document.getElementById('openCalc');
    const closeBtn=document.getElementById('closeCalc');
    const modal=document.getElementById('modalOverlay');
    const calcBtn=document.getElementById('calcBtn');

    //Open Modal Logic
    openBtn.onclick=()=>{
        modal.style.display='flex';
    };

    //Close Modal (X Button)
    closeBtn.onclick=()=>{
        modal.style.display='none';
    };

    //Close Modal
    window.onclick=(event)=>{
        if (event.target===modal) {
            modal.style.display='none';
        }
    };

    //HVAC ROI Calculation Logic 
    calcBtn.onclick=()=>{
        const bill=parseFloat(document.getElementById('monthlyBill').value);
        const age=parseFloat(document.getElementById('unitAge').value);
        const years=parseInt(document.getElementById('years').value);
        const resultArea=document.getElementById('resultArea');
        const display=document.getElementById('savingsDisplay');

        if (bill>0 && age>0) {
            let efficiencyImprovement=(age*0.025); 
            if (efficiencyImprovement>0.45) { 
                efficiencyImprovement=0.45; 
            }
            const totalSavings=(bill*12*years)*efficiencyImprovement;
            display.innerHTML= `
                <p style="margin: 0; color: #666;">Total Potential Savings:</p>
                <h3 style="color: #28a745; font-size: 24px; margin: 10px 0;">
                    Rs. ${totalSavings.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </h3>
                <p style="font-size: 13px; color: #444;">
                    Based on a <strong>${(efficiencyImprovement * 100).toFixed(0)}%</strong> efficiency boost.
                </p>
            `;
            resultArea.style.display='block';
        } else {
            alert("Please enter valid numbers for your bill and unit age.");
        }
    };
});

//Get support button
const modal = document.getElementById('quoteModal');
const overlay = document.getElementById('overlay');
const form = document.getElementById('quoteForm');
const quoteBtn = document.getElementById('quoteBtn');
const closeBtn = document.getElementById('closeBtn');

if(modal && overlay && form && quoteBtn && closeBtn){

    quoteBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const customerData = {
            name: document.getElementById('nameInput').value,
            phone: document.getElementById('phoneInput').value,
            service: document.getElementById('serviceInput').value,
            timestamp: new Date().toISOString()
        };

        let existingLeads = JSON.parse(localStorage.getItem('freshAirLeads')) || [];

        existingLeads.push(customerData);

        localStorage.setItem('freshAirLeads', JSON.stringify(existingLeads));

        alert("Our team will connect within 24 hours");

        modal.classList.add('hidden');
        overlay.classList.add('hidden');

        form.reset();
    });

}

window.addEventListener("DOMContentLoaded", () => {

    const chatToggle = document.getElementById("chatToggle");
    const chatPanel = document.getElementById("chatPanel");
    const closeChat = document.getElementById("closeChat");

    if (!chatToggle || !chatPanel || !closeChat) return;

    chatToggle.addEventListener("click", () => {
        chatPanel.classList.add("active");
    });

    closeChat.addEventListener("click", () => {
        chatPanel.classList.remove("active");
    });

});

const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendMessage");

loadMessages();

function getTime(){

    const now = new Date();

    return now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function saveMessages(){
    localStorage.setItem("chatData", chatBody.innerHTML);
}

function loadMessages(){

    const saved = localStorage.getItem("chatData");

    if(saved){
        chatBody.innerHTML = saved;
    }
}

function addMessage(message, sender){

    const wrapper = document.createElement("div");

    wrapper.classList.add("message-wrapper");

    if(sender === "user"){
        wrapper.classList.add("user-wrapper");
    }

    else{
        wrapper.classList.add("bot-wrapper");
    }

    const messageDiv = document.createElement("div");

    if(sender === "user"){
        messageDiv.classList.add("user-message");
        messageDiv.innerHTML = ` ${message}`;
    }

    else{
        messageDiv.classList.add("bot-message");
        messageDiv.innerHTML = ` ${message}`;
    }

    const time = document.createElement("span");

    time.classList.add("message-time");

    time.innerText = getTime();

    wrapper.appendChild(messageDiv);
    wrapper.appendChild(time);

    chatBody.appendChild(wrapper);

    chatBody.scrollTop = chatBody.scrollHeight;

    saveMessages();
}

function showTyping(){

    const typing = document.createElement("div");

    typing.classList.add("typing");

    typing.id = "typing";

    typing.innerHTML = `<span>•••</span>`;

    chatBody.appendChild(typing);

    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping(){

    const typing = document.getElementById("typing");

    if(typing){
        typing.remove();
    }
}

function handleMessage(customText = null){

    const text = customText || chatInput.value.trim();

    if(text === "") return;

    addMessage(text, "user");

    sendMessage(text);

    chatInput.value = "";
}

sendBtn.addEventListener("click", () => {
    handleMessage();
});

chatInput.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){
        handleMessage();
    }

});

const quickButtons = document.querySelectorAll(".quick-options button");

quickButtons.forEach((button) => {

    button.addEventListener("click", () => {

        handleMessage(button.innerText);

    });

});

setTimeout(() => {

    chatPanel.classList.add("active");

}, 3000);

async function sendMessage(userText) {

    showTyping();

    const response = await fetch("/predict", {
        method: "POST",
        body: JSON.stringify({
            message: userText
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    removeTyping();

    addMessage(data.answer, "bot");
}