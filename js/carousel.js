document.addEventListener('DOMContentLoaded', function () {

    initCarousels();


    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth <= 768) {
                initCarousels();
            } else {

                document.querySelectorAll('.feature-grid, .masonry-grid, .project-cards-container').forEach(grid => {
                    if (grid) grid.style.display = 'flex';
                });


                document.querySelectorAll('.carousel-container').forEach(carousel => {
                    if (carousel) carousel.style.display = 'none';
                });
            }
        }, 250);
    });

    function initCarousels() {

        if (window.innerWidth > 768) return;


        createCarousel('feature-grid', 'feature');


        createCarousel('masonry-grid', 'masonry-card');


        createCarousel('project-cards-container', 'project-card');
    }

    function createCarousel(gridClass, cardClass) {
        const grid = document.querySelector('.' + gridClass);
        if (!grid) return;


        const cards = Array.from(grid.querySelectorAll('.' + cardClass));
        if (cards.length === 0) return;


        const existingCarousel = grid.nextElementSibling;
        if (existingCarousel && existingCarousel.classList.contains('carousel-container')) {
            return;
        }


        const carousel = document.createElement('div');
        carousel.className = 'carousel-container';


        const track = document.createElement('div');
        track.className = 'carousel-track';


        cards.forEach(card => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            const clonedCard = card.cloneNode(true);
            clonedCard.classList.add('carousel-card');
            slide.appendChild(clonedCard);

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

        grid.style.display = 'none';

        let currentIndex = 0;

        function getSlideWidth() {
            return carousel.querySelector('.carousel-slide').offsetWidth;
        }

        function updateSlide() {
            const slideWidth = getSlideWidth();
            track.style.transform = `translateX(-${currentIndex * slideWidth + currentIndex * 8}px)`;

            carousel.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateSlide();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlide();
        });

        carousel.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.dataset.index);
                updateSlide();
            });
        });

        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let isHorizontalDrag = null;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            isHorizontalDrag = null;
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;

            if (isHorizontalDrag === null) {
                isHorizontalDrag = Math.abs(diffX) > Math.abs(diffY);
            }

            // Only prevent default for horizontal drags
            if (isHorizontalDrag) {
                e.preventDefault();

                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        currentIndex = (currentIndex + 1) % cards.length;
                    } else {
                        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                    }
                    updateSlide();
                    isDragging = false;
                }
            }
            // For vertical drags, do nothing and let default behavior happen
        });

        track.addEventListener('touchend', () => {
            isDragging = false;
            isHorizontalDrag = null;
        });

        updateSlide();

        window.addEventListener('resize', function () {
            if (window.innerWidth <= 768) {
                updateSlide();
            }
        });
    }
});