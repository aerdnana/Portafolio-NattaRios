document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.project-link');
    const container = document.querySelector('.project') || document.body;

    const hoverBg = document.createElement('div');
    Object.assign(hoverBg.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        zIndex: '-1',
        pointerEvents: 'none'
    });
    container.appendChild(hoverBg);

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const mediaSrc = link.getAttribute('data-img');
            if (!mediaSrc) return;

            const oldVideo = container.querySelector('video.temp-video');
            if (oldVideo) oldVideo.remove();

            const lowerSrc = mediaSrc.toLowerCase();
            const isVideo = lowerSrc.endsWith('.mp4') || lowerSrc.endsWith('.webm');

            if (isVideo) {
                const video = document.createElement('video');
                video.classList.add('temp-video'); 
                Object.assign(video.style, {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: '-1',
                    pointerEvents: 'none'
                });
                video.src = mediaSrc;
                video.muted = true;
                video.loop = true;
                video.play();
                container.appendChild(video);
                link.videoElement = video;
                hoverBg.style.opacity = '0';
            } else {
                hoverBg.style.backgroundImage = `url("${encodeURI(mediaSrc)}")`;
                hoverBg.style.opacity = '1';
            }
        });

        link.addEventListener('mouseleave', () => {
            if (link.videoElement) {
                link.videoElement.remove();
                link.videoElement = null;
            }
            hoverBg.style.opacity = '0';
        });
    });
});