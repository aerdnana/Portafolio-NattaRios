document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.work-item[data-preview]');
    const frame = document.querySelector('.work-preview-frame');

    if (!items.length || !frame) {
        return;
    }

    const isVideo = (src) => {
        const cleanSrc = src.split('?')[0].toLowerCase();
        return cleanSrc.endsWith('.mp4') || cleanSrc.endsWith('.webm') || cleanSrc.endsWith('.mov');
    };

    const setPreview = (item) => {
        const previewSrc = item.getAttribute('data-preview');
        if (!previewSrc) {
            return;
        }

        const previewUrl = new URL(previewSrc, window.location.href).href;
        const media = document.createElement(isVideo(previewSrc) ? 'video' : 'img');
        media.className = 'work-preview-media';

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

        frame.replaceChildren(media);

        if (media.tagName === 'VIDEO') {
            media.play().catch((error) => {
                console.warn('[category-preview] video play failed', previewSrc, error);
            });
        }
    };

    items.forEach((item) => {
        item.addEventListener('mouseenter', () => setPreview(item));
        item.addEventListener('focus', () => setPreview(item));
    });

    setPreview(items[0]);
});
