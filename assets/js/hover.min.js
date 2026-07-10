document.addEventListener('DOMContentLoaded', () => {
    const links = [...document.querySelectorAll('.project-link')];
    const container = document.body;
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const projectItems = document.querySelector('.project-items');
    let activeLink = null;
    let scrollFrame = null;

    const hoverBg = document.createElement('div');
    hoverBg.className = 'project-hover-media';
    Object.assign(hoverBg.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        zIndex: '0',
        pointerEvents: 'none'
    });
    container.appendChild(hoverBg);

    const mobileBg = document.createElement('div');
    mobileBg.className = 'mobile-work-bg';
    mobileBg.setAttribute('aria-hidden', 'true');
    container.appendChild(mobileBg);

    const isVideo = (src) => {
        const cleanSrc = src.split('?')[0].toLowerCase();
        return cleanSrc.endsWith('.mp4') || cleanSrc.endsWith('.webm') || cleanSrc.endsWith('.mov');
    };

    const getVideoRange = (link) => {
        const start = Number.parseFloat(link.getAttribute('data-start'));
        const end = Number.parseFloat(link.getAttribute('data-end'));

        if (!Number.isFinite(start)) {
            return null;
        }

        return {
            start,
            end: Number.isFinite(end) && end > start ? end : null
        };
    };

    const applyVideoRange = (video, link) => {
        const range = getVideoRange(link);
        if (!range) return;

        video.loop = false;

        const seekToStart = () => {
            if (Number.isFinite(video.duration)) {
                video.currentTime = Math.min(range.start, Math.max(video.duration - 0.1, 0));
            } else {
                video.currentTime = range.start;
            }
        };

        video.addEventListener('loadedmetadata', seekToStart, { once: true });
        if (video.readyState >= 1) {
            seekToStart();
        }
        video.addEventListener('timeupdate', () => {
            if (range.end && video.currentTime >= range.end) {
                video.currentTime = range.start;
                video.play().catch(err => {
                    console.warn('[hover] video play failed', link.getAttribute('data-img'), err);
                });
            }
        });
        video.addEventListener('ended', seekToStart);
    };

    const createMedia = (link, className) => {
        const mediaSrc = link.getAttribute('data-img');
        if (!mediaSrc) return null;

        const mediaUrl = new URL(mediaSrc, window.location.href).href;
        const media = document.createElement(isVideo(mediaSrc) ? 'video' : 'img');
        media.className = className;

        if (media.tagName === 'VIDEO') {
            media.src = mediaUrl;
            media.autoplay = true;
            media.muted = true;
            media.loop = true;
            media.playsInline = true;
            media.preload = 'metadata';
            applyVideoRange(media, link);
        } else {
            media.src = mediaUrl;
            media.alt = '';
            media.decoding = 'async';
        }

        return media;
    };

    const playMedia = (media, link) => {
        if (media.tagName !== 'VIDEO') return;

        media.play().catch(err => {
            console.warn('[hover] video play failed', link.getAttribute('data-img'), err);
        });
    };

    const setMobileBackground = (link) => {
        const media = createMedia(link, 'mobile-work-bg-media');
        if (!media) return;

        mobileBg.replaceChildren(media);
        playMedia(media, link);
    };

    const setActiveLink = (link) => {
        if (!link || activeLink === link) return;

        links.forEach(currentLink => {
            currentLink.classList.toggle('is-active', currentLink === link);
        });

        activeLink = link;
        setMobileBackground(link);
    };

    const updateActiveFromScroll = () => {
        scrollFrame = null;

        if (!mobileQuery.matches || !projectItems) return;

        const listRect = projectItems.getBoundingClientRect();
        const pickerCenter = listRect.top + listRect.height / 2;
        const closestLink = links.reduce((closest, link) => {
            const rect = link.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - pickerCenter);
            return distance < closest.distance ? { link, distance } : closest;
        }, { link: links[0], distance: Number.POSITIVE_INFINITY }).link;

        setActiveLink(closestLink);
    };

    const requestActiveUpdate = () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(updateActiveFromScroll);
    };

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (mobileQuery.matches) return;

            const mediaSrc = link.getAttribute('data-img');
            if (!mediaSrc) return;
            const mediaUrl = new URL(mediaSrc, window.location.href).href;

            const oldVideo = container.querySelector('video.temp-video');
            if (oldVideo) oldVideo.remove();

            const lowerSrc = mediaSrc.toLowerCase();
            const linkIsVideo = lowerSrc.endsWith('.mp4') || lowerSrc.endsWith('.webm');

            if (linkIsVideo) {
                const video = document.createElement('video');
                video.className = 'temp-video project-hover-media';
                Object.assign(video.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: '0',
                    opacity: '0',
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                });
                video.src = mediaUrl;
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.preload = 'auto';
                applyVideoRange(video, link);
                container.appendChild(video);
                requestAnimationFrame(() => {
                    video.style.opacity = '1';
                    video.play().catch(err => {
                        console.warn('[hover] video play failed', mediaSrc, err);
                    });
                });
                link.videoElement = video;
                hoverBg.style.opacity = '0';
            } else {
                hoverBg.style.backgroundImage = `url("${mediaUrl}")`;
                hoverBg.style.opacity = '1';
            }
        });

        link.addEventListener('mouseleave', () => {
            if (mobileQuery.matches) return;

            if (link.videoElement) {
                link.videoElement.remove();
                link.videoElement = null;
            }
            hoverBg.style.opacity = '0';
        });

        link.addEventListener('click', (event) => {
            if (!mobileQuery.matches || link === activeLink) return;

            event.preventDefault();
            setActiveLink(link);
            link.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
    });

    projectItems?.addEventListener('scroll', requestActiveUpdate, { passive: true });
    window.addEventListener('resize', requestActiveUpdate);
    setActiveLink(links[0]);
    requestActiveUpdate();
});
