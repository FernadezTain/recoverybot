const card = document.getElementById("card");
const continueBtn = document.getElementById("continueBtn");
const backBtn = document.getElementById("backBtn");
const verifyBtn = document.getElementById("verifyBtn");
const codeInput = document.getElementById("codeInput");
const botButtons = document.getElementById("botButtons");
const botContinueBtn = document.getElementById("botContinueBtn");
const botBackBtn = document.getElementById("botBackBtn");
const errorBanner = document.getElementById("error-banner");
const errorMessage = document.getElementById("error-message");
const errorCloseBtn = document.querySelector("#error-banner .close-btn");
const notificationContainer = document.getElementById("notification-container");

let currentUser = null;
let errorTimeout = null;
let activeNotification = null;
let notificationHideTimeout = null;

// ======================
// 3D tilt эффект блока
// ======================
card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
});
card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

// ======================
// Навигация между меню
// ======================
continueBtn.addEventListener("click", () => {
    card.classList.remove("active-main", "active-bot");
    card.classList.add("active-code");
});

backBtn.addEventListener("click", () => {
    card.classList.remove("active-code", "active-bot");
    card.classList.add("active-main");
});

botBackBtn.addEventListener("click", () => {
    card.classList.remove("active-bot");
    card.classList.add("active-code");
    resetBotSelection();
});

// ======================
// Проверка кода и вход
// ======================
verifyBtn.addEventListener("click", () => {
    const code = codeInput.value.trim().toUpperCase();

    fetch("vrs.json")
        .then(res => res.json())
        .then(data => {
            if (data[code]) {
                currentUser = data[code];
                showNotification("Выполнен вход в систему", `Пользователь: ${currentUser.name}`);

                // Сразу подготавливаем меню ботов
                showBotMenu(currentUser);
                
                // Потом убираем active-code и добавляем active-bot
                setTimeout(() => {
                    card.classList.remove("active-code");
                    card.classList.add("active-bot");
                }, 50);
            } else {
                showError("Неверный верификационный код");
            }
        })
        .catch(err => console.error("Ошибка загрузки vrs.json:", err));
});

// ======================
// Баннер ошибки
// ======================
function showError(message) {
    if (errorBanner.classList.contains("show")) {
        errorBanner.classList.remove("show");
        clearTimeout(errorTimeout);
        setTimeout(() => {
            errorMessage.innerText = message;
            errorBanner.classList.add("show");
            errorTimeout = setTimeout(hideError, 3000);
        }, 50);
    } else {
        errorMessage.innerText = message;
        errorBanner.classList.add("show");
        errorTimeout = setTimeout(hideError, 3000);
    }
}

function hideError() {
    errorBanner.classList.remove("show");
    clearTimeout(errorTimeout);
}

errorCloseBtn.addEventListener("click", hideError);

// ======================
// Меню выбора бота
// ======================
function resetBotSelection() {
    const allBotBtns = botButtons.querySelectorAll(".btn");
    allBotBtns.forEach(btn => btn.classList.remove("selected"));
    botContinueBtn.classList.remove("selected");
}

function showBotMenu(user) {
    botButtons.innerHTML = "";
    resetBotSelection();

    // Создаём кнопки ботов
    if (user.access_siroga === "yes") {
        const btn = document.createElement("button");
        btn.className = "btn siroga";
        btn.innerText = "Сирога";
        botButtons.appendChild(btn);
    }
    if (user.access_celestial_bot === "yes") {
        const btn = document.createElement("button");
        btn.className = "btn celestial";
        btn.innerText = "Celestial Bot";
        botButtons.appendChild(btn);
    }

    // Обработчики кнопок выбора бота
    const allBotBtns = botButtons.querySelectorAll(".btn");
    allBotBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            allBotBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            botContinueBtn.classList.add("selected");
        });
    });

    // Кнопка Продолжить в меню ботов
    botContinueBtn.onclick = () => {
        const selected = botButtons.querySelector(".btn.selected");
        if (!selected) {
            showError("Выберите бота прежде чем продолжить!");
            return;
        }
        showNotification("Выбран бот", selected.innerText);
        console.log("Выбран бот:", selected.innerText);
    };
}
// ======================
// Уведомления стекло
// ======================
function showNotification(title, message) {
    if (activeNotification) {
        clearTimeout(notificationHideTimeout);
        activeNotification.classList.remove("show");
        setTimeout(() => activeNotification.remove(), 200);
    }

    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerHTML = `<div class="title">${title}</div><div class="message">${message}</div>`;
    notificationContainer.appendChild(notif);

    setTimeout(() => notif.classList.add("show"), 50);
    activeNotification = notif;

    notificationHideTimeout = setTimeout(() => {
        notif.classList.remove("show");
        setTimeout(() => {
            notif.remove();
            activeNotification = null;
        }, 400);
    }, 2000);
}
