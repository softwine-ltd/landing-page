document.addEventListener('DOMContentLoaded', function () {
    // Initialize carousels
    initCarousels();

    // Re-initialize carousels on window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth <= 768) {
                initCarousels();
            } else {
                // Restore original display for grids when screen becomes larger
                document.querySelectorAll('.feature-grid, .masonry-grid, .project-cards-container').forEach(grid => {
                    if (grid) grid.style.display = 'flex';
                });

                // Hide carousels on larger screens
                document.querySelectorAll('.carousel-container').forEach(carousel => {
                    if (carousel) carousel.style.display = 'none';
                });
            }
        }, 250); // Debounce resize event
    });

    function initCarousels() {
        // Only run on mobile
        if (window.innerWidth > 768) return;

        // Create feature cards carousel
        createCarousel('feature-grid', 'feature');

        // Create masonry cards carousel
        createCarousel('masonry-grid', 'masonry-card');

        // Create project cards carousel
        createCarousel('project-cards-container', 'project-card');
    }

    function createCarousel(gridClass, cardClass) {
        const grid = document.querySelector('.' + gridClass);
        if (!grid) return;

        // Get all cards
        const cards = Array.from(grid.querySelectorAll('.' + cardClass));
        if (cards.length === 0) return;

        // Check if carousel already exists
        const existingCarousel = grid.nextElementSibling;
        if (existingCarousel && existingCarousel.classList.contains('carousel-container')) {
            return; // Carousel already set up
        }

        // Create carousel container
        const carousel = document.createElement('div');
        carousel.className = 'carousel-container';

        // Create carousel track
        const track = document.createElement('div');
        track.className = 'carousel-track';

        // Add cards to track
        cards.forEach(card => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            // Clone the card and add specific class for styling
            const clonedCard = card.cloneNode(true);
            clonedCard.classList.add('carousel-card');
            slide.appendChild(clonedCard);

            track.appendChild(slide);
        });

        // Add track to carousel
        carousel.appendChild(track);

        // Create controls
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        controls.appendChild(prevBtn);

        // Create dots container
        const dots = document.createElement('div');
        dots.className = 'carousel-dots';

        // Add dots for each slide
        cards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = index === 0 ? 'carousel-dot active' : 'carousel-dot';
            dot.dataset.index = index;
            dots.appendChild(dot);
        });

        controls.appendChild(dots);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        controls.appendChild(nextBtn);

        // Add controls to carousel
        carousel.appendChild(controls);

        // Add carousel after grid
        grid.parentNode.insertBefore(carousel, grid.nextSibling);

        // Hide original grid
        grid.style.display = 'none';

        // Set up carousel functionality
        let currentIndex = 0;

        // Function to get slide width (needed after resize)
        function getSlideWidth() {
            return carousel.querySelector('.carousel-slide').offsetWidth;
        }

        // Update active slide
        function updateSlide() {
            // Get current slide width in case of resize
            const slideWidth = getSlideWidth();
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Update dots
            carousel.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Event listeners
        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateSlide();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(cards.length - 1, currentIndex + 1);
            updateSlide();
        });

        // Dot navigation
        carousel.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.dataset.index);
                updateSlide();
            });
        });

        // Touch support for swiping
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
                    // Swiped left
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    // Swiped right
                    currentIndex--;
                }
                updateSlide();
                isDragging = false;
            }
        });

        track.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Initial update
        updateSlide();

        // Handle window resize to adjust carousel slide width
        window.addEventListener('resize', function () {
            if (window.innerWidth <= 768) {
                // Only update if carousel is visible (mobile)
                updateSlide();
            }
        });
    }
});