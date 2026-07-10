const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close');
const galleryImages = document.querySelectorAll('.gallery-img');

function openModal(img) {
    if (img.src && img.src !== '') {
        modal.classList.add('active');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        if (closeBtn) closeBtn.focus();
    }
}

galleryImages.forEach(img => {
    // Dynamic accessibility attributes
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    if (!img.getAttribute('aria-label')) {
        img.setAttribute('aria-label', img.alt ? `Ampliar imagen: ${img.alt}` : 'Ampliar imagen');
    }

    img.addEventListener('click', function() {
        openModal(this);
    });

    img.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(this);
        }
    });
});

if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
}

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
