document.addEventListener("DOMContentLoaded", function () {
    const video = document.querySelector(".training-video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                video
                    .play()
                    .catch((e) => console.log("Autoplay prevented:", e));
            }
        });
    }, { threshold: 0.5 });
    observer.observe(video);
    video.addEventListener("pause", function () {
        if (!video.ended) {
            setTimeout(() => video.play(), 300);
        }
    });
    video.controls = false;
});
