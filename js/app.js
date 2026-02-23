document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (mobileMenuBtn.querySelector('i')) {
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Header Scroll Effect & Scrollspy
    const header = document.querySelector('.site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = document.querySelectorAll('.nav-link');

    if (header) {
        window.addEventListener('scroll', () => {
            // Header background effect
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Scrollspy effect
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current) && current !== '') {
                    link.classList.add('active');
                }
                // Default to top if no section active but at top
                if (current === '' && window.pageYOffset < 100) {
                    navLinksArray[0].classList.add('active');
                }
            });
        });
    }

    // 3. Scroll Reveal Animations
    const fadeElements = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 4. Portfolio Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 5. Custom Carousel Logic for Project Modals
    const carousels = document.querySelectorAll('.project-carousel');
    carousels.forEach(carousel => {
        const mainImg = carousel.querySelector('.carousel-main-img');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const thumbs = carousel.querySelectorAll('.carousel-thumb');

        if (!mainImg || thumbs.length === 0) return;

        let currentIndex = 0;

        const updateCarousel = (index) => {
            thumbs.forEach(t => t.classList.remove('active'));
            const activeThumb = thumbs[index];
            activeThumb.classList.add('active');
            const fullSrc = activeThumb.getAttribute('data-fullsrc');

            mainImg.style.opacity = '0.5';
            setTimeout(() => {
                mainImg.src = fullSrc;
                mainImg.style.opacity = '1';
            }, 150);

            currentIndex = index;
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        };

        // Initialize
        updateCarousel(0);

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateCarousel(index));
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let nextIndex = (currentIndex + 1) % thumbs.length;
                updateCarousel(nextIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prevIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
                updateCarousel(prevIndex);
            });
        }
    });
});

// 6. Project Modals External Triggers
function openProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

function closeProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
});
