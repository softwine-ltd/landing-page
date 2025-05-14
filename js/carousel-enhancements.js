document.addEventListener('DOMContentLoaded', function() {
    // Run after a small delay to ensure carousels are created
    setTimeout(enhanceCarousels, 500);
    
    // Also enhance after window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            setTimeout(enhanceCarousels, 300);
        }
    });
    
    function enhanceCarousels() {
        // Only apply on mobile
        if (window.innerWidth > 768) return;
        
        // Find all carousel cards
        const carouselCards = document.querySelectorAll('.carousel-slide .feature, .carousel-slide .masonry-card, .carousel-slide .project-card');
        
        carouselCards.forEach(card => {
            // Add scrollable content class to paragraphs and lists
            const contentElements = card.querySelectorAll('p, ul');
            contentElements.forEach(el => {
                el.classList.add('scrollable-content');
            });
            
            // Check if card has overflow content
            const paragraphs = card.querySelectorAll('p');
            paragraphs.forEach(p => {
                // Check if paragraph has overflow
                if (p.scrollHeight > p.clientHeight) {
                    // Add overflow indicator if not already present
                    if (!card.querySelector('.overflow-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'overflow-indicator';
                        indicator.title = 'Scroll for more content';
                        card.appendChild(indicator);
                        indicator.style.display = 'block';
                    }
                    
                    // Add scroll event to hide indicator when scrolled to bottom
                    p.addEventListener('scroll', function() {
                        const indicator = card.querySelector('.overflow-indicator');
                        if (indicator) {
                            if (Math.abs(p.scrollHeight - p.clientHeight - p.scrollTop) < 10) {
                                indicator.style.display = 'none';
                            } else {
                                indicator.style.display = 'block';
                            }
                        }
                    });
                }
            });
            
            // Do the same for lists
            const lists = card.querySelectorAll('ul');
            lists.forEach(list => {
                if (list.scrollHeight > list.clientHeight) {
                    if (!card.querySelector('.overflow-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'overflow-indicator';
                        indicator.title = 'Scroll for more content';
                        card.appendChild(indicator);
                        indicator.style.display = 'block';
                    }
                    
                    list.addEventListener('scroll', function() {
                        const indicator = card.querySelector('.overflow-indicator');
                        if (indicator) {
                            if (Math.abs(list.scrollHeight - list.clientHeight - list.scrollTop) < 10) {
                                indicator.style.display = 'none';
                            } else {
                                indicator.style.display = 'block';
                            }
                        }
                    });
                }
            });
        });
        
        // Enhance carousel navigation
        const carousels = document.querySelectorAll('.carousel-container');
        carousels.forEach(carousel => {
            // Add keyboard navigation
            document.addEventListener('keydown', function(e) {
                // Only apply keyboard navigation when carousel is in viewport
                const rect = carousel.getBoundingClientRect();
                const isInViewport = (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
                
                if (!isInViewport) return;
                
                if (e.key === 'ArrowLeft') {
                    carousel.querySelector('.carousel-btn.prev').click();
                } else if (e.key === 'ArrowRight') {
                    carousel.querySelector('.carousel-btn.next').click();
                }
            });
        });
    }
});