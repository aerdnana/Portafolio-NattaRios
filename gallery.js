const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close');
const galleryImages = document.querySelectorAll('.gallery-img');

galleryImages.forEach(img => {
    img.addEventListener('click', function() {
        if (this.src && this.src !== '') {
            modal.classList.add('active');
            modalImg.src = this.src;
            modalImg.alt = this.alt;
        }
    });
});


closeBtn.addEventListener('click', function() {
    modal.classList.remove('active');
});


modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        modal.classList.remove('active');
    }
});
