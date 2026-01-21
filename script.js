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

let currentUser = null;
let errorTimeout = null; // отдельный таймаут для баннера ошибки
let notificationTimeout = null; // отдельный таймаут для уведомлений

// ======================
// 3D tilt эффект блока
// ======================
card.addEventListener("mousemove", (e) => {
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
// Главное меню → Ввод кода
continueBtn.addEventListener("click", () => {
    card.classList.remove("active-main", "active-bot");
    card.classList.add("active-code");
});

// Ввод кода → Главное меню
backBtn.addEventListener("click", () => {
    card.classList.remove("active-code", "active-bot");
    card.classList.add("active-main");
});

// Меню ботов → Ввод кода
botBackBtn.addEventListener("click", () => {
    card.classList.remove("active-bot");
    card.classList.add("active-code");
    resetBotSelection(); // сброс выделения
});

// ======================
// Проверка кода и вход
// ======================
verifyBtn.addEventListener("click", () => {
    const code = codeInput.value.trim().toUpperCase();

    fetch("vrs.json")
        .then((response) => response.json())
        .then((data) => {
            if (data[code]) {
                currentUser = data[code];

                showNotification(
                    "Выполнен вход в систему",
                    `Пользователь: ${currentUser.name}`
                );

                showBotMenu(currentUser);

            } else {
                showError("Неверный верификационный код");
            }
        })
        .catch((err) => console.error("Ошибка загрузки vrs.json:", err));
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
// Показ меню ботов
// ======================
function resetBotSelection() {
    const allBotBtns = botButtons.querySelectorAll(".btn");
    allBotBtns.forEach(btn => btn.classList.remove("selected"));
    botContinueBtn.classList.remove("selected");
}

function showBotMenu(user) {
    // Сброс прошлых кнопок и выделений
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

    // Сбрасываем состояния карточки и показываем меню ботов
    card.classList.remove("active-main", "active-code");
    setTimeout(() => card.classList.add("active-bot"), 20);

    // Обработчики выбора бота
    const allBotBtns = botButtons.querySelectorAll(".btn");
    allBotBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            allBotBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            botContinueBtn.classList.add("selected"); // зеленая кнопка
        });
    });

    // Обработчик кнопки Продолжить (если ещё не назначен)
    botContinueBtn.onclick = () => {
        const selected = botButtons.querySelector(".btn.selected");
        if (!selected) {
            showError("Выберите бота прежде чем продолжить!");
            return;
        }
        showNotification("Выбран бот", selected.innerText);
        console.log("Выбран бот:", selected.innerText);
        // Здесь можно добавить переход дальше
    };
}


// ======================
// Уведомления стекло
// ======================
function showNotification(title, message) {
    const container = document.getElementById("notification-container");

    if (activeNotification) {
        clearTimeout(notificationTimeout);
        activeNotification.classList.remove("show");
        setTimeout(() => activeNotification.remove(), 200);
    }

    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerHTML = `
        <div class="title">${title}</div>
        <div class="message">${message}</div>
    `;
    container.appendChild(notif);

    setTimeout(() => notif.classList.add("show"), 50);
    activeNotification = notif;

    notificationTimeout = setTimeout(() => {
        notif.classList.remove("show");
        setTimeout(() => {
            notif.remove();
            activeNotification = null;
        }, 400);
    }, 2000);
}
