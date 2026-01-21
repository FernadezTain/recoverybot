const card = document.getElementById("card");
const continueBtn = document.getElementById("continueBtn");
const backBtn = document.getElementById("backBtn");
const verifyBtn = document.getElementById("verifyBtn");
const codeInput = document.getElementById("codeInput");
const botButtons = document.getElementById("botButtons");
const botContinueBtn = document.getElementById("botContinueBtn");
const botBackBtn = document.getElementById("botBackBtn");

let currentUser = null;

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
continueBtn.addEventListener("click", () => {
    card.classList.remove("active-bot", "active-code");
    card.classList.add("active-code");
});

backBtn.addEventListener("click", () => {
    card.classList.remove("active-code", "active-bot");
});

// Меню ботов → возврат в ввод кода
botBackBtn.addEventListener("click", () => {
    card.classList.remove("active-bot");
    card.classList.add("active-code");
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

                // Показ уведомления
                showNotification(
                    "Выполнен вход в систему",
                    `Пользователь: ${currentUser.name}`
                );

                // Переходим сразу в меню ботов (без главного меню)
                showBotMenu(currentUser);

            } else {
                alert("❌ Неверный верификационный код");
            }
        })
        .catch((err) => console.error("Ошибка загрузки vrs.json:", err));
});

// ======================
// Показ меню ботов
// ======================
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

    // Полностью скрываем другие блоки
    card.classList.remove("active-code", "active-main");
    card.classList.add("active-bot");
}

// ======================
// Уведомления стекло
// ======================
let activeNotification = null;
let hideTimeout = null;

function showNotification(title, message) {
    const container = document.getElementById("notification-container");

    if (activeNotification) {
        clearTimeout(hideTimeout);
        activeNotification.classList.remove("show");
        setTimeout(() => activeNotification.remove(), 200);
    }

    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerHTML = `<div class="title">${title}</div><div class="message">${message}</div>`;
    container.appendChild(notif);

    // Появление
    setTimeout(() => notif.classList.add("show"), 50);

    activeNotification = notif;

    // Авто-скрытие
    hideTimeout = setTimeout(() => {
        notif.classList.remove("show");
        setTimeout(() => {
            notif.remove();
            activeNotification = null;
        }, 400);
    }, 2000);
}
