document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Force remove sticky class on page load
    hero.classList.remove('is-sticky');
    
    // Create a placeholder element to prevent layout jumping
    const placeholder = document.createElement('div');
    placeholder.style.display = 'none'; // Hide initially
    hero.parentNode.insertBefore(placeholder, hero.nextSibling);
    
    // Get initial measurements
    const initialHeroHeight = hero.offsetHeight;
    
    function updateStickyState() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only apply sticky when we've scrolled past the initial hero position
        if (scrollTop > 50) { // Add a small threshold
            if (!hero.classList.contains('is-sticky')) {
                // Calculate the difference in height right at the moment of change
                const currentHeroHeight = hero.offsetHeight;
                
                // Set the placeholder height to match what we're about to lose
                placeholder.style.display = 'block';
                placeholder.style.height = (initialHeroHeight - currentHeroHeight) + 'px';
                
                // Add sticky class
                hero.classList.add('is-sticky');
            }
        } else {
            if (hero.classList.contains('is-sticky')) {
                hero.classList.remove('is-sticky');
                // Transition the placeholder away
                placeholder.style.height = '0px';
                setTimeout(() => {
                    placeholder.style.display = 'none';
                }, 300); // Match transition duration
            }
        }
    }
    
    // Only add scroll event after a slight delay to ensure proper initialization
    setTimeout(function() {
        window.addEventListener('scroll', updateStickyState);
        // Force initial check to ensure correct starting state
        updateStickyState();
    }, 100);
});