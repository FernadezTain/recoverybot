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

// Новые элементы
const controlBackBtn = document.getElementById("controlBackBtn");
const ownerBtn = document.getElementById("ownerBtn");
const deleteBtn = document.getElementById("deleteBtn");
const controlBotName = document.getElementById("controlBotName");
const ownerBackBtn = document.getElementById("ownerBackBtn");
const giveMyself = document.getElementById("giveMyself");
const giveOwner = document.getElementById("giveOwner");
const telegramIdInput = document.getElementById("telegramIdInput");

let currentUser = null;
let selectedBot = null;
let errorTimeout = null;
let activeNotification = null;
let notificationHideTimeout = null;

// Адреса ботов
const botLinks = {
    "Сирога": "https://t.me/SirogaXBot",
    "Celestial Bot": "https://t.me/CelestialXBot"
};

function getBotLink() {
    return botLinks[selectedBot] || "https://t.me/bot_address";
}

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
    card.classList.remove("active-main", "active-bot", "active-control", "active-owner");
    card.classList.add("active-code");
});

backBtn.addEventListener("click", () => {
    card.classList.remove("active-code", "active-bot", "active-control", "active-owner");
    card.classList.add("active-main");
});

botBackBtn.addEventListener("click", () => {
    card.classList.remove("active-bot", "active-control", "active-owner");
    card.classList.add("active-code");
    resetBotSelection();
});

controlBackBtn.addEventListener("click", () => {
    card.classList.remove("active-control", "active-owner");
    card.classList.add("active-bot");
});

ownerBackBtn.addEventListener("click", () => {
    card.classList.remove("active-owner");
    card.classList.add("active-control");
    telegramIdInput.value = "";
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

                showBotMenu(currentUser);
                
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

    const allBotBtns = botButtons.querySelectorAll(".btn");
    allBotBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            allBotBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            botContinueBtn.classList.add("selected");
        });
    });

    botContinueBtn.onclick = () => {
        const selected = botButtons.querySelector(".btn.selected");
        if (!selected) {
            showError("Выберите бота прежде чем продолжить!");
            return;
        }
        selectedBot = selected.innerText;
        showNotification("Выбран бот", selectedBot);
        
        controlBotName.innerText = selectedBot;
        card.classList.remove("active-bot");
        setTimeout(() => {
            card.classList.add("active-control");
        }, 50);
    };
}

// ======================
// Меню управления ботом
// ======================
ownerBtn.addEventListener("click", () => {
    card.classList.remove("active-control");
    setTimeout(() => {
        card.classList.add("active-owner");
        setTimeout(() => {
            telegramIdInput.focus();
        }, 100);
    }, 50);
});

deleteBtn.addEventListener("click", () => {
    showError("Функция удаления БД в разработке!");
});

// ======================
// Выдача прав владельца
// ======================
giveMyself.addEventListener("click", () => {
    const botLink = getBotLink();
    const telegramUrl = `${botLink}?start=setownerID_me`;
    window.open(telegramUrl, "_blank");
    
    showNotification("Переход в Telegram", "Следуйте инструкциям в боте");
    
    setTimeout(() => {
        card.classList.remove("active-owner");
        setTimeout(() => {
            card.classList.add("active-control");
            telegramIdInput.value = "";
        }, 50);
    }, 1000);
});

giveOwner.addEventListener("click", () => {
    const telegramId = telegramIdInput.value.trim();
    
    if (!telegramId) {
        showError("Введите TelegramID!");
        return;
    }
    
    if (!/^\d+$/.test(telegramId)) {
        showError("TelegramID должен содержать только цифры!");
        return;
    }
    
    const botLink = getBotLink();
    const telegramUrl = `${botLink}?start=setownerID_${telegramId}`;
    window.open(telegramUrl, "_blank");
    
    showNotification("Переход в Telegram", `ID: ${telegramId}`);
    
    setTimeout(() => {
        card.classList.remove("active-owner");
        setTimeout(() => {
            card.classList.add("active-control");
            telegramIdInput.value = "";
        }, 50);
    }, 1000);
});

// ======================
// Уведомления
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
