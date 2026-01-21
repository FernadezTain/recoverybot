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

// Переход к вводу кода
continueBtn.addEventListener("click", () => {
    card.classList.remove("active-bot", "active-code"); // сначала убираем всё
    card.classList.add("active-code");
});

// Назад в главное меню
backBtn.addEventListener("click", () => {
    card.classList.remove("active-code", "active-bot");
});

// Меню ботов → возврат в ввод кода
botBackBtn.addEventListener("click", () => {
    card.classList.remove("active-bot", "active-code"); // очищаем классы
    card.classList.add("active-code"); // показываем только ввод кода
});

// Проверка кода и переход к меню ботов
verifyBtn.addEventListener("click", () => {
    const code = codeInput.value.trim().toUpperCase();

    fetch("vrs.json")
        .then((response) => response.json())
        .then((data) => {
            if (data[code]) {
                currentUser = data[code];
                showBotMenu(currentUser);

                // Уведомление
                showNotification(
                    "Выполнен вход в систему",
                    `Пользователь: ${currentUser.name}`
                );
            } else {
                alert("❌ Неверный верификационный код");
            }
        })
        .catch((err) => console.error("Ошибка загрузки vrs.json:", err));
});

// Показ меню ботов
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

    // Убираем все предыдущие классы, показываем только меню ботов
    card.classList.remove("active-code", "active-bot");
    setTimeout(() => {
        card.classList.add("active-bot");
    }, 10); // небольшой таймаут для правильного рендера анимации
}


// ======================
// Уведомления стекло
// ======================
let activeNotification = null;
let hideTimeout = null;

function showNotification(title, message) {
    const container = document.getElementById("notification-container");

    // Если уже есть уведомление — быстро скрываем
    if (activeNotification) {
        clearTimeout(hideTimeout);
        activeNotification.classList.remove("show");
        setTimeout(() => {
            activeNotification.remove();
        }, 200);
    }

    // Создаем новое уведомление
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerHTML = `
        <div class="title">${title}</div>
        <div class="message">${message}</div>
    `;

    container.appendChild(notif);

    // Плавное появление
    setTimeout(() => {
        notif.classList.add("show");
    }, 50);

    activeNotification = notif;

    // Авто-скрытие через 2 секунды
    hideTimeout = setTimeout(() => {
        notif.classList.remove("show");
        setTimeout(() => {
            notif.remove();
            activeNotification = null;
        }, 400);
    }, 2000);
}
