document.addEventListener('DOMContentLoaded', () => {
    const mediaItems = Array.from(document.querySelectorAll('.hero-media'));
    if (mediaItems.length === 0) {
        return;
    }

    const isReady = (item) => {
        if (item.tagName === 'IMG') {
            return item.complete && item.naturalWidth > 0;
        }

        if (item.tagName === 'VIDEO') {
            return item.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
        }

        return true;
    };

    mediaItems.forEach((item) => {
        if (item.tagName === 'VIDEO') {
            item.load();
        }
    });

    let activeIndex = mediaItems.findIndex((item) => item.classList.contains('is-active'));
    if (activeIndex === -1) {
        activeIndex = 0;
        mediaItems[activeIndex].classList.add('is-active');
    }

    window.setInterval(() => {
        const previousIndex = activeIndex;
        const nextIndex = (activeIndex + 1) % mediaItems.length;
        if (!isReady(mediaItems[nextIndex])) {
            return;
        }

        activeIndex = nextIndex;
        mediaItems[previousIndex].classList.add('is-leaving');
        mediaItems[activeIndex].classList.add('is-active');
        mediaItems[previousIndex].classList.remove('is-active');
        window.setTimeout(() => {
            mediaItems[previousIndex].classList.remove('is-leaving');
        }, 220);
    }, 4000);
});
