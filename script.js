const card = document.getElementById("card");
const continueBtn = document.getElementById("continueBtn");
const backBtn = document.getElementById("backBtn");
const verifyBtn = document.getElementById("verifyBtn");
const codeInput = document.getElementById("codeInput");
const botButtons = document.getElementById("botButtons");
const botContinueBtn = document.getElementById("botContinueBtn");

let currentUser = null;

// 3D tilt
card.addEventListener("mousemove", (e)=>{
    const rect=card.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const y=e.clientY-rect.top;
    const centerX=rect.width/2;
    const centerY=rect.height/2;
    const rotateX=((y-centerY)/centerY)*8;
    const rotateY=((x-centerX)/centerX)*8;
    card.style.transform=`rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
});
card.addEventListener("mouseleave",()=>{card.style.transform=`rotateX(0deg) rotateY(0deg)`;});

// Переход к вводу кода
continueBtn.addEventListener("click", () => {
    card.classList.remove("active-bot");
    card.classList.add("active-code");
});

// Назад к главному меню из ввода кода
backBtn.addEventListener("click", () => {
    card.classList.remove("active-code", "active-bot");
});

// Проверка кода и переход к меню ботов
verifyBtn.addEventListener("click", () => {
    const code = codeInput.value.trim().toUpperCase();
    fetch("vrs.json")
        .then(response => response.json())
        .then(data => {
            if (data[code]) {
                currentUser = data[code];
                showBotMenu(currentUser);
            } else {
                alert("❌ Неверный верификационный код");
            }
        })
        .catch(err => console.error("Ошибка загрузки vrs.json:", err));
});

function showBotMenu(user) {
    botButtons.innerHTML = "";

    if (user.access_siroga === "yes") {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerText = "Сирога";
        botButtons.appendChild(btn);
    }
    if (user.access_celestial_bot === "yes") {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerText = "Celestial Bot";
        botButtons.appendChild(btn);
    }

    // Обеспечиваем корректный переход
    card.classList.remove("active-code");
    card.classList.add("active-bot");
}

// При возврате с меню ботов (если добавим кнопку "Назад" позже)
