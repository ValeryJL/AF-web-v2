// Custom Carousel Logic for Project Modals
document.addEventListener('DOMContentLoaded', () => {

    // Initialize carousels inside modals
    const carousels = document.querySelectorAll('.project-carousel');

    carousels.forEach(carousel => {
        const mainImg = carousel.querySelector('.carousel-main-img');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const thumbs = carousel.querySelectorAll('.carousel-thumb');

        if (!mainImg || thumbs.length === 0) return;

        let currentIndex = 0;

        // Function to update the main image and active thumbnail
        const updateCarousel = (index) => {
            // Remove active class from all thumbs
            thumbs.forEach(t => t.classList.remove('active'));

            // Set new active thumb
            const activeThumb = thumbs[index];
            activeThumb.classList.add('active');

            // Update main image src
            const fullSrc = activeThumb.getAttribute('data-fullsrc');

            // simple fade effect
            mainImg.style.opacity = '0.5';
            setTimeout(() => {
                mainImg.src = fullSrc;
                mainImg.style.opacity = '1';
            }, 150);

            currentIndex = index;

            // Scroll thumbnail into view if needed
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        };

        // Initialize with first image
        updateCarousel(0);

        // Click on thumbnails
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                updateCarousel(index);
            });
        });

        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= thumbs.length) {
                    nextIndex = 0; // loop back to start
                }
                updateCarousel(nextIndex);
            });
        }

        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = thumbs.length - 1; // loop to end
                }
                updateCarousel(prevIndex);
            });
        }
    });
});
