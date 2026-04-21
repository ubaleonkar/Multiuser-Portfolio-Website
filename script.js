/**
 * script.js - Antigravity Portfolio
 * Handles 3D tilt effects, dark/light theme toggling, and initial entrance tracking.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. Theme Toggle Logic (Dark / Light Mode)
       ======================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // Toggle Event
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        // Update Icon with a slight animation trick
        toggleIcon.style.transform = 'rotate(-180deg) scale(0)';
        
        setTimeout(() => {
            toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
            toggleIcon.style.transform = 'rotate(0deg) scale(1)';
        }, 150);
    }
    
    /* ========================================================
       2. Antigravity 3D Tilt Effect
       ======================================================== */
    const cards = document.querySelectorAll('.card');
    const IS_MOBILE = window.matchMedia('(max-width: 1024px)').matches;
    
    // Only apply 3D tilt on desktop devices
    if (!IS_MOBILE) {
        cards.forEach(card => {
            const cardHeight = card.clientHeight;
            const cardWidth = card.clientWidth;
            
            // Mouse Enter
            card.addEventListener('mouseenter', () => {
                // Remove animation so it doesn't conflict with our JS transform
                card.style.animation = 'none'; 
                card.style.transition = 'transform 0.1s ease-out, box-shadow 0.4s ease';
                card.classList.add('is-hovered');
            });
            
            // Mouse Move (Tilt calculation)
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                
                // Get mouse position relative to card center (-1 to 1)
                const xVal = 2 * ((e.clientX - rect.left) / cardWidth) - 1;
                const yVal = 2 * ((e.clientY - rect.top) / cardHeight) - 1;
                
                // Calculate rotation (max ±8deg)
                const rotateX = yVal * -8;
                const rotateY = xVal * 8;
                
                // Base translateY depends on if it's the featured center card
                const isFeatured = card.classList.contains('card--featured');
                // The CSS already handles the -48px via margin for the featured card.
                // We add an extra -16px lift on hover for all cards.
                
                // Apply Transform
                card.style.transform = `translateY(-16px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            // Mouse Leave (Reset)
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
                card.style.transform = `translateY(0) scale(1) rotateX(0) rotateY(0)`;
                card.classList.remove('is-hovered');
            });
        });
    }

    /* ========================================================
       3. Re-evaluate resize for tilt enablement
       ======================================================== */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Very simple reload on major boundary crossing to reset events.
            // Ideally we'd add/remove listeners cleanly, but for this demo a simple check helps
            const CURRENT_IS_MOBILE = window.matchMedia('(max-width: 1024px)').matches;
            if (IS_MOBILE !== CURRENT_IS_MOBILE) {
                location.reload();
            }
        }, 250);
    });

});