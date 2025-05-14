document.addEventListener('DOMContentLoaded', function () {

    initCarousels();

    window.addEventListener('resize', function () {
        if (window.innerWidth <= 768) {
            initCarousels();
        }
    });

    function initCarousels() {
        if (window.innerWidth > 768) return;

        createCarousel('feature-grid', 'feature');

        createCarousel('masonry-grid', 'masonry-card');
    }

    function createCarousel(gridClass, cardClass) {
        const grid = document.querySelector('.' + gridClass);
        if (!grid) return;

        const cards = Array.from(grid.querySelectorAll('.' + cardClass));
        if (cards.length === 0) return;

        const existingCarousel = grid.nextElementSibling;
        if (existingCarousel && existingCarousel.classList.contains('carousel-container')) {
            return; // Carousel already set up
        }

        const carousel = document.createElement('div');
        carousel.className = 'carousel-container';

        const track = document.createElement('div');
        track.className = 'carousel-track';

        cards.forEach(card => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.appendChild(card.cloneNode(true));
            track.appendChild(slide);
        });

        carousel.appendChild(track);

        const controls = document.createElement('div');
        controls.className = 'carousel-controls';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        controls.appendChild(prevBtn);

        const dots = document.createElement('div');
        dots.className = 'carousel-dots';

        cards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = index === 0 ? 'carousel-dot active' : 'carousel-dot';
            dot.dataset.index = index;
            dots.appendChild(dot);
        });

        controls.appendChild(dots);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        controls.appendChild(nextBtn);

        carousel.appendChild(controls);

        grid.parentNode.insertBefore(carousel, grid.nextSibling);

        let currentIndex = 0;
        const slideWidth = carousel.querySelector('.carousel-slide').offsetWidth;

        function updateSlide() {
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            carousel.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateSlide();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(cards.length - 1, currentIndex + 1);
            updateSlide();
        });

        carousel.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.dataset.index);
                updateSlide();
            });
        });

        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < cards.length - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateSlide();
                isDragging = false;
            }
        });

        track.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
});