document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const videoSrc = card.getAttribute('data-video');
        if (!videoSrc) { return; }

        const imgcontainer = card.querySelector('.image-container');
        if (!imgcontainer) { return; }

        const safeVideoSrc = encodeURI(videoSrc);

        card.addEventListener('mouseenter', () => {
            const video = document.createElement('video');
            video.src = safeVideoSrc;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = 'auto';

            video.addEventListener('loadedmetadata', () => {
                video.currentTime = 0;
                video.play().catch(err => {
                    console.warn('[cardhover] play failed', safeVideoSrc, err);
                });
            });

            video.addEventListener('error', (e) => {
                console.error('[cardhover] video load error', safeVideoSrc, e);
            });

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