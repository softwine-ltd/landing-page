document.addEventListener('DOMContentLoaded', function() {
    
    setTimeout(enhanceCarousels, 500);
    
    
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            setTimeout(enhanceCarousels, 300);
        }
    });
    
    function enhanceCarousels() {
        
        if (window.innerWidth > 768) return;
        
        
        const carouselCards = document.querySelectorAll('.carousel-slide .feature, .carousel-slide .masonry-card, .carousel-slide .project-card');
        
        carouselCards.forEach(card => {
            
            const contentElements = card.querySelectorAll('p, ul');
            contentElements.forEach(el => {
                el.classList.add('scrollable-content');
            });
            
            
            const paragraphs = card.querySelectorAll('p');
            paragraphs.forEach(p => {
                
                if (p.scrollHeight > p.clientHeight) {
                    
                    if (!card.querySelector('.overflow-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'overflow-indicator';
                        indicator.title = 'Scroll for more content';
                        card.appendChild(indicator);
                        indicator.style.display = 'block';
                    }
                    
                    
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
        
        
        const carousels = document.querySelectorAll('.carousel-container');
        carousels.forEach(carousel => {
            
            document.addEventListener('keydown', function(e) {
                
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