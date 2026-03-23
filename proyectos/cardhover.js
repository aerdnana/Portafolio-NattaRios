document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const videoSrc = card.getAttribute('data-video');
        if (!videoSrc) { return; }

        const imgcontainer = card.querySelector('.image-container');

        card.addEventListener('mouseenter', () => {
            const video = document.createElement('video');
            video.src = videoSrc;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;

            Object.assign(video.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: '2',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
            });
            imgcontainer.appendChild(video);

            requestAnimationFrame(() => {
                video.style.opacity = '1';
            });
            imgcontainer.style.position = 'relative';
            card.videoElement = video;
        });

        card.addEventListener('mouseleave', () => {
            if (card.videoElement) {
                imgcontainer.removeChild(card.videoElement);
                card.videoElement = null;
            }
        });
    });
});