document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    
    hero.classList.remove('is-sticky');
    
    
    const placeholder = document.createElement('div');
    placeholder.style.display = 'none'; 
    hero.parentNode.insertBefore(placeholder, hero.nextSibling);
    
    
    const initialHeroHeight = hero.offsetHeight;
    
    function updateStickyState() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        
        if (scrollTop > 50) { 
            if (!hero.classList.contains('is-sticky')) {
                
                const currentHeroHeight = hero.offsetHeight;
                
                
                placeholder.style.display = 'block';
                placeholder.style.height = (initialHeroHeight - currentHeroHeight) + 'px';
                
                
                hero.classList.add('is-sticky');
            }
        } else {
            if (hero.classList.contains('is-sticky')) {
                hero.classList.remove('is-sticky');
                
                placeholder.style.height = '0px';
                setTimeout(() => {
                    placeholder.style.display = 'none';
                }, 300); 
            }
        }
    }
    
    
    setTimeout(function() {
        window.addEventListener('scroll', updateStickyState);
        
        updateStickyState();
    }, 100);
});