document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create a placeholder element to prevent layout jumping
    const placeholder = document.createElement('div');
    let placeholderHeight = 0;
    let heroHeight = hero.offsetHeight;
    const heroOriginalPadding = parseFloat(getComputedStyle(hero).paddingTop) + 
                               parseFloat(getComputedStyle(hero).paddingBottom);
    const heroStickyPadding = 2; // 1rem top + 1rem bottom (adjust if your sticky padding differs)
    const heightDifference = heroOriginalPadding - heroStickyPadding;
    
    // Insert the placeholder after the hero
    hero.parentNode.insertBefore(placeholder, hero.nextSibling);
    
    function updateStickyState() {
        // Get the hero's position relative to the viewport
        const heroRect = hero.getBoundingClientRect();
        
        // If hero top is at or above the viewport top, make it sticky
        if (heroRect.top <= 0) {
            if (!hero.classList.contains('is-sticky')) {
                hero.classList.add('is-sticky');
                
                // Update placeholder height to match the height difference
                placeholderHeight = heightDifference;
                placeholder.style.height = placeholderHeight + 'rem';
            }
        } else {
            if (hero.classList.contains('is-sticky')) {
                hero.classList.remove('is-sticky');
                placeholder.style.height = '0px';
            }
        }
    }
    
    // Run on scroll and resize
    window.addEventListener('scroll', updateStickyState);
    window.addEventListener('resize', function() {
        // Recalculate hero height on resize
        heroHeight = hero.offsetHeight;
        updateStickyState();
    });
    
    // Initial check
    updateStickyState();
});