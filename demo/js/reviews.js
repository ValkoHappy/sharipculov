class ReviewsManager {
    constructor() {
        this.reviewsData = [
            {
                id: 1,
                name: "Мария, 28 лет",
                avatar: "../img/clients/client1.jpg",
                tariff: "Всё включено (6 месяцев)",
                text: "Благодаря персональной программе от Андрея смогла подготовиться к свадьбе! За 4 месяца: -18кг жира, +5кг мышц. Тренировки были 3 раза в неделю, питание - без жестких ограничений.",
                results: [
                    { value: "-18 кг", label: "жира" },
                    { value: "+5 кг", label: "мышц" },
                ],
                video: "video/reviews/review1.mp4",
                poster: "../img/reviews/review1-poster.jpg",
            },
            {
                id: 2,
                name: "Дмитрий, 35 лет",
                avatar: "../img/clients/client2.jpg",
                tariff: "Для соревнований",
                text: "Подготовка к чемпионату по кроссфиту. За 8 месяцев увеличил силовые показатели на 40%. Андрей помог исправить технику и разработал идеальную программу питания.",
                results: [
                    { value: "+40%", label: "к результатам" },
                    { value: "1 место", label: "на турнире" },
                ],
                video: "video/reviews/review2.mp4",
                poster: "../img/reviews/review2-poster.jpg",
            },
            {
                id: 3,
                name: "Анна, 25 лет",
                avatar: "../img/clients/client3.jpg",
                tariff: "Всё включено (3 месяца)",
                text: "После родов вернула форму за 3 месяца. Без изнурительных диет, с грамотным подходом к тренировкам.",
                results: [
                    { value: "-15 кг", label: "веса" },
                    { value: "+3 кг", label: "мышц" },
                ],
                video: "video/reviews/review3.mp4",
                poster: "../img/reviews/review3-poster.jpg",
            },
            {
                id: 3,
                name: "Анна, 25 лет",
                avatar: "../img/clients/client3.jpg",
                tariff: "Всё включено (3 месяца)",
                text: "После родов вернула форму за 3 месяца. Без изнурительных диет, с грамотным подходом к тренировкам.",
                results: [
                    { value: "-15 кг", label: "веса" },
                    { value: "+3 кг", label: "мышц" },
                ],
                video: "video/reviews/review3.mp4",
                poster: "../img/reviews/review3-poster.jpg",
            },
            {
                id: 3,
                name: "Анна, 25 лет",
                avatar: "../img/clients/client3.jpg",
                tariff: "Всё включено (3 месяца)",
                text: "После родов вернула форму за 3 месяца. Без изнурительных диет, с грамотным подходом к тренировкам.",
                results: [
                    { value: "-15 кг", label: "веса" },
                    { value: "+3 кг", label: "мышц" },
                ],
                video: "video/reviews/review3.mp4",
                poster: "../img/reviews/review3-poster.jpg",
            },
            {
                id: 3,
                name: "Анна, 25 лет",
                avatar: "../img/clients/client3.jpg",
                tariff: "Всё включено (3 месяца)",
                text: "После родов вернула форму за 3 месяца. Без изнурительных диет, с грамотным подходом к тренировкам.",
                results: [
                    { value: "-15 кг", label: "веса" },
                    { value: "+3 кг", label: "мышц" },
                ],
                video: "video/reviews/review3.mp4",
                poster: "../img/reviews/review3-poster.jpg",
            },
            {
                id: 3,
                name: "Анна, 25 лет",
                avatar: "../img/clients/client3.jpg",
                tariff: "Всё включено (3 месяца)",
                text: "После родов вернула форму за 3 месяца. Без изнурительных диет, с грамотным подходом к тренировкам.",
                results: [
                    { value: "-15 кг", label: "веса" },
                    { value: "+3 кг", label: "мышц" },
                ],
                video: "video/reviews/review3.mp4",
                poster: "../img/reviews/review3-poster.jpg",
            },
            {
                id: 3,
                name: "Анна, 25 лет",
                avatar: "../img/clients/client3.jpg",
                tariff: "Всё включено (3 месяца)",
                text: "После родов вернула форму за 3 месяца. Без изнурительных диет, с грамотным подходом к тренировкам.",
                results: [
                    { value: "-15 кг", label: "веса" },
                    { value: "+3 кг", label: "мышц" },
                ],
                video: "video/reviews/review3.mp4",
                poster: "../img/reviews/review3-poster.jpg",
            },
            {
                id: 3,
                name: "Анна, 25 лет",
                avatar: "../img/clients/client3.jpg",
                tariff: "Всё включено (3 месяца)",
                text: "После родов вернула форму за 3 месяца. Без изнурительных диет, с грамотным подходом к тренировкам.",
                results: [
                    { value: "-15 кг", label: "веса" },
                    { value: "+3 кг", label: "мышц" },
                ],
                video: "video/reviews/review3.mp4",
                poster: "../img/reviews/review3-poster.jpg",
            },
            {
                id: 3,
                name: "Анна, 25 лет",
                avatar: "../img/clients/client3.jpg",
                tariff: "Всё включено (3 месяца)",
                text: "После родов вернула форму за 3 месяца. Без изнурительных диет, с грамотным подходом к тренировкам.",
                results: [
                    { value: "-15 кг", label: "веса" },
                    { value: "+3 кг", label: "мышц" },
                ],
                video: "video/reviews/review3.mp4",
                poster: "../img/reviews/review3-poster.jpg",
            },
        ];
        this.currentReviewId = 1;
        this.init();
    }
    init() {
        this.renderAvatars();
        this.renderReviewContent();
        this.setupEventListeners();
    }
    renderAvatars() {
        const carousel = document.getElementById("clientsCarousel");
        this.reviewsData.forEach((review) => {
            const avatar = document.createElement("div");
            avatar.className = `client-avatar ${review.id === 1 ? "active" : ""}`;
            avatar.dataset.review = review.id;
            avatar.innerHTML = `
        <img src="${review.avatar}" alt="${review.name}">
      `;
            carousel.appendChild(avatar);
        });
    }
    renderReviewContent() {
        const review = this.reviewsData.find((r) => r.id === this.currentReviewId);
        const contentContainer = document.getElementById("reviewContent");
        const videoContainer = document.getElementById("videoReview");
        contentContainer.innerHTML = `
      <div class="review active">
        <h3>${review.name}</h3>
        <div class="tariff-badge">${review.tariff}</div>
        <p>${review.text}</p>
        <div class="results">
          ${review.results
            .map((result) => `
            <div class="result-item">
              <span class="result-value">${result.value}</span>
              <span class="result-label">${result.label}</span>
            </div>
          `)
            .join("")}
        </div>
      </div>
    `;
        const video = videoContainer.querySelector(".review-video");
        video.querySelector("source").src = review.video;
        video.poster = review.poster;
        video.load();
    }
    setupEventListeners() {
        document
            .getElementById("clientsCarousel")
            .addEventListener("click", (e) => {
            const avatar = e.target.closest(".client-avatar");
            if (!avatar)
                return;
            this.currentReviewId = parseInt(avatar.dataset.review);
            document.querySelectorAll(".client-avatar").forEach((av) => {
                av.classList.remove("active");
            });
            avatar.classList.add("active");
            avatar.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
            this.renderReviewContent();
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new ReviewsManager();
});
