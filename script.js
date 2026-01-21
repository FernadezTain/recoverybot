const card = document.getElementById("card");
const btn = document.getElementById("continueBtn");

// 3D эффект
card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)
    `;
});

card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

// Переключение
btn.addEventListener("click", () => {
    card.classList.add("active");
});
