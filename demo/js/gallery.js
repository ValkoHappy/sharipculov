const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('galleryLightbox');
const lightboxImg = document.getElementById('galleryLightboxImg');
const lightboxClose = document.getElementById('galleryClose');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightboxImg.src = item.querySelector('img').src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox)
    closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape')
    closeLightbox(); });
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}
