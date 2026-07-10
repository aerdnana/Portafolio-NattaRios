document.addEventListener('DOMContentLoaded', () => {
    const items = [...document.querySelectorAll('.work-item[data-preview]')];
    const frame = document.querySelector('.work-preview-frame');
    const workList = document.querySelector('.work-list');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const mobileBg = document.createElement('div');
    let activeItem = null;
    let scrollFrame = null;

    if (!items.length || !frame || !workList) {
        return;
    }

    mobileBg.className = 'mobile-work-bg';
    mobileBg.setAttribute('aria-hidden', 'true');
    document.body.appendChild(mobileBg);

    const isVideo = (src) => {
        const cleanSrc = src.split('?')[0].toLowerCase();
        return cleanSrc.endsWith('.mp4') || cleanSrc.endsWith('.webm') || cleanSrc.endsWith('.mov');
    };

    const createMedia = (item, className) => {
        const previewSrc = item.getAttribute('data-preview');
        if (!previewSrc) {
            return null;
        }

        const previewUrl = new URL(previewSrc, window.location.href).href;
        const media = document.createElement(isVideo(previewSrc) ? 'video' : 'img');
        media.className = className;

        if (media.tagName === 'VIDEO') {
            media.autoplay = true;
            media.muted = true;
            media.loop = true;
            media.playsInline = true;
            media.preload = 'metadata';
            media.src = previewUrl;
        } else {
            media.src = previewUrl;
            media.alt = '';
            media.decoding = 'async';
        }

        return media;
    };

    const playMedia = (media, item) => {
        if (media.tagName !== 'VIDEO') {
            return;
        }

        const previewSrc = item.getAttribute('data-preview');
        media.play().catch((error) => {
            console.warn('[category-preview] video play failed', previewSrc, error);
        });
    };

    const setPreview = (item) => {
        const media = createMedia(item, 'work-preview-media');
        if (!media) {
            return;
        }

        frame.replaceChildren(media);
        playMedia(media, item);
    };

    const setMobileBackground = (item) => {
        const media = createMedia(item, 'mobile-work-bg-media');
        if (!media) {
            return;
        }

        mobileBg.replaceChildren(media);
        playMedia(media, item);
    };

    const setActiveItem = (item) => {
        if (!item || activeItem === item) {
            return;
        }

        items.forEach((currentItem) => {
            currentItem.classList.toggle('is-active', currentItem === item);
        });

        activeItem = item;
        setMobileBackground(item);
    };

    const updateActiveFromScroll = () => {
        scrollFrame = null;

        if (!mobileQuery.matches) {
            return;
        }

        const listRect = workList.getBoundingClientRect();
        const pickerCenter = listRect.top + listRect.height / 2;
        const closestItem = items.reduce((closest, item) => {
            const rect = item.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - pickerCenter);
            return distance < closest.distance ? { item, distance } : closest;
        }, { item: items[0], distance: Number.POSITIVE_INFINITY }).item;

        setActiveItem(closestItem);
    };

    const requestActiveUpdate = () => {
        if (scrollFrame) {
            return;
        }

        scrollFrame = requestAnimationFrame(updateActiveFromScroll);
    };

    items.forEach((item) => {
        item.addEventListener('mouseenter', () => {
            if (!mobileQuery.matches) {
                setPreview(item);
            }
        });

        item.addEventListener('focus', () => {
            if (!mobileQuery.matches) {
                setPreview(item);
            }
        });

        item.addEventListener('click', (event) => {
            if (!mobileQuery.matches || item === activeItem) {
                return;
            }

            event.preventDefault();
            setActiveItem(item);
            item.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', requestActiveUpdate, { passive: true });
    workList.addEventListener('scroll', requestActiveUpdate, { passive: true });
    window.addEventListener('resize', requestActiveUpdate);

    setPreview(items[0]);
    setActiveItem(items[0]);
    requestActiveUpdate();
});
