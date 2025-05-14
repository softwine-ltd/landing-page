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
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

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
                if (diff > 0) {
                    currentIndex = (currentIndex + 1) % cards.length;
                } else {
                    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                }
                updateSlide();
                isDragging = false;
            }
        });

        track.addEventListener('touchend', () => {
            isDragging = false;
        });

        updateSlide();

        window.addEventListener('resize', function () {
            if (window.innerWidth <= 768) {
                updateSlide();
            }
        });
    }
});