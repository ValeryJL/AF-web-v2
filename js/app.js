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
        const carouselMain = carousel.querySelector('.carousel-main');
        const mainImg = carousel.querySelector('.carousel-main-img');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const thumbs = carousel.querySelectorAll('.carousel-thumb');

        if (!carouselMain || !mainImg || thumbs.length === 0) return;

        // Create custom video player container inside .carousel-main for video slides
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'video-player-wrapper';
        videoWrapper.innerHTML = `
            <div class="video-badge"><span class="video-badge-dot"></span> VIDEO DE OBRA</div>
            <video class="carousel-main-video" playsinline preload="metadata"></video>
            <button type="button" class="video-center-play" aria-label="Reproducir video">
                <i class="fas fa-play"></i>
            </button>
            <button type="button" class="carousel-mute-btn" aria-label="Silenciar / Activar sonido" title="Activar / Silenciar sonido">
                <i class="fas fa-volume-up"></i>
            </button>
        `;
        carouselMain.insertBefore(videoWrapper, nextBtn || null);

        const mainVideo = videoWrapper.querySelector('.carousel-main-video');
        const centerPlayBtn = videoWrapper.querySelector('.video-center-play');
        const muteBtn = videoWrapper.querySelector('.carousel-mute-btn');

        // Create loading spinner inside .carousel-main
        const spinner = document.createElement('div');
        spinner.className = 'carousel-spinner';
        carouselMain.appendChild(spinner);

        // Create small pause/play button for 15s auto-advance timer & video playback
        const pauseBtn = document.createElement('button');
        pauseBtn.type = 'button';
        pauseBtn.className = 'carousel-pause-btn';
        pauseBtn.setAttribute('aria-label', 'Pausar presentación automática');
        pauseBtn.setAttribute('title', 'Pausar presentación');
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        carouselMain.appendChild(pauseBtn);

        // Create thin progress bar at the bottom of .carousel-main (shared by photos & videos)
        const progressTrack = document.createElement('div');
        progressTrack.className = 'carousel-progress-track';
        const progressBar = document.createElement('div');
        progressBar.className = 'carousel-progress-bar';
        progressTrack.appendChild(progressBar);
        carouselMain.appendChild(progressTrack);

        let currentIndex = 0;
        let loadRequestId = 0;
        let isPaused = false;

        const syncPauseBtnUI = (pausedState) => {
            carouselMain.classList.toggle('is-paused', pausedState);
            pauseBtn.classList.toggle('is-paused', pausedState);
            pauseBtn.innerHTML = pausedState ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
            pauseBtn.setAttribute('title', pausedState ? 'Reanudar' : 'Pausar');
            pauseBtn.setAttribute('aria-label', pausedState ? 'Reanudar' : 'Pausar');
        };

        const syncVideoUI = () => {
            const playing = !mainVideo.paused && !mainVideo.ended;
            videoWrapper.classList.toggle('is-playing', playing);
            centerPlayBtn.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
            muteBtn.innerHTML = mainVideo.muted
                ? '<i class="fas fa-volume-mute"></i>'
                : '<i class="fas fa-volume-up"></i>';
            muteBtn.classList.toggle('is-muted', mainVideo.muted);
            if (carouselMain.classList.contains('is-video')) {
                syncPauseBtnUI(!playing);
            }
        };

        const toggleVideoPlay = (e) => {
            if (e) e.stopPropagation();
            if (mainVideo.paused || mainVideo.ended) {
                isPaused = false;
                mainVideo.play().catch(() => {});
            } else {
                isPaused = true;
                mainVideo.pause();
            }
            syncVideoUI();
        };

        mainVideo.addEventListener('click', toggleVideoPlay);
        centerPlayBtn.addEventListener('click', toggleVideoPlay);

        mainVideo.addEventListener('play', syncVideoUI);
        mainVideo.addEventListener('pause', syncVideoUI);
        mainVideo.addEventListener('volumechange', syncVideoUI);

        mainVideo.addEventListener('timeupdate', () => {
            if (!carouselMain.classList.contains('is-video')) return;
            const duration = mainVideo.duration || 0;
            const current = mainVideo.currentTime || 0;
            const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
            progressBar.style.width = `${pct}%`;
        });

        // Allow clicking the bottom thin progress bar to seek when viewing a video
        progressTrack.addEventListener('click', (e) => {
            if (!carouselMain.classList.contains('is-video') || !mainVideo.duration) return;
            e.stopPropagation();
            const rect = progressTrack.getBoundingClientRect();
            if (rect.width <= 0) return;
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            mainVideo.currentTime = ratio * mainVideo.duration;
            progressBar.style.width = `${ratio * 100}%`;
        });

        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainVideo.muted = !mainVideo.muted;
            syncVideoUI();
        });

        const stopVideo = () => {
            if (!mainVideo.paused) {
                mainVideo.pause();
            }
            if (mainVideo.getAttribute('src')) {
                mainVideo.removeAttribute('src');
                mainVideo.load();
            }
            videoWrapper.style.display = 'none';
            videoWrapper.classList.remove('is-playing');
            progressBar.style.width = '';
            carouselMain.classList.remove('is-video');
            syncPauseBtnUI(isPaused);
        };

        const restartProgressBar = () => {
            progressBar.classList.remove('is-running');
            progressBar.style.width = '';
            if (carouselMain.classList.contains('is-video')) {
                const modalOverlay = carousel.closest('.modal-overlay');
                if (modalOverlay && modalOverlay.classList.contains('active') && !isPaused) {
                    mainVideo.play().catch(() => {});
                }
                return;
            }
            // Force reflow so the CSS animation restarts cleanly from 0%
            void progressBar.offsetWidth;
            progressBar.classList.add('is-running');
        };

        progressBar.addEventListener('animationend', () => {
            if (carouselMain.classList.contains('is-video')) return;
            let nextIndex = (currentIndex + 1) % thumbs.length;
            updateCarousel(nextIndex, true);
        });

        mainVideo.addEventListener('ended', () => {
            progressBar.style.width = '100%';
            if (!isPaused) {
                let nextIndex = (currentIndex + 1) % thumbs.length;
                updateCarousel(nextIndex, true);
            }
        });

        const updateCarousel = (index, shouldScrollThumb = true) => {
            thumbs.forEach(t => t.classList.remove('active'));
            const activeThumb = thumbs[index];
            activeThumb.classList.add('active');
            const fullSrc = activeThumb.getAttribute('data-fullsrc') || activeThumb.getAttribute('src');
            const isVideo = /\.mp4(\?.*)?$/i.test(fullSrc);

            const requestId = ++loadRequestId;
            progressBar.classList.remove('is-running');
            stopVideo();

            if (isVideo) {
                mainImg.style.opacity = '0';
                mainImg.style.display = 'none';
                carouselMain.classList.add('is-video', 'is-loading');
                videoWrapper.style.display = 'flex';
                progressBar.style.width = '0%';
                mainVideo.src = fullSrc;
                syncVideoUI();

                const onVideoReady = () => {
                    if (requestId !== loadRequestId) return;
                    carouselMain.classList.remove('is-loading');
                    const modalOverlay = carousel.closest('.modal-overlay');
                    if (modalOverlay && modalOverlay.classList.contains('active') && !isPaused) {
                        mainVideo.play().catch(() => {
                            mainVideo.muted = true;
                            mainVideo.play().catch(() => {
                                syncVideoUI();
                            });
                        });
                    } else {
                        syncVideoUI();
                    }
                };

                mainVideo.onloadeddata = onVideoReady;
                mainVideo.onerror = () => {
                    if (requestId !== loadRequestId) return;
                    carouselMain.classList.remove('is-loading');
                };
                mainVideo.load();
            } else {
                mainImg.style.display = 'block';
                mainImg.style.opacity = '0';
                carouselMain.classList.add('is-loading');

                const preloadImg = new Image();
                preloadImg.onload = () => {
                    if (requestId !== loadRequestId) return;
                    mainImg.src = fullSrc;
                    carouselMain.classList.remove('is-loading');
                    mainImg.style.opacity = '1';
                    restartProgressBar();
                };
                preloadImg.onerror = () => {
                    if (requestId !== loadRequestId) return;
                    mainImg.src = fullSrc;
                    carouselMain.classList.remove('is-loading');
                    mainImg.style.opacity = '1';
                    restartProgressBar();
                };
                preloadImg.src = fullSrc;
            }

            currentIndex = index;
            if (shouldScrollThumb) {
                activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        };

        // Expose reset and stop methods on carousel element for modal open/close
        carousel._restartTimer = restartProgressBar;
        carousel._stopMedia = () => {
            if (!mainVideo.paused) {
                mainVideo.pause();
            }
        };

        // Initialize without scrolling the page
        updateCarousel(0, false);

        pauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (carouselMain.classList.contains('is-video')) {
                toggleVideoPlay();
            } else {
                isPaused = !isPaused;
                syncPauseBtnUI(isPaused);
            }
        });

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateCarousel(index, true));
        });

        const goNext = () => {
            let nextIndex = (currentIndex + 1) % thumbs.length;
            updateCarousel(nextIndex, true);
        };

        const goPrev = () => {
            let prevIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
            updateCarousel(prevIndex, true);
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', goNext);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', goPrev);
        }

        // Touch swipe support on .carousel-main for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        carouselMain.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        carouselMain.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const deltaX = e.changedTouches[0].clientX - touchStartX;
                const deltaY = e.changedTouches[0].clientY - touchStartY;
                // Trigger horizontal swipe if horizontal movement exceeds 40px and dominates vertical
                if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX < 0) {
                        goNext();
                    } else {
                        goPrev();
                    }
                }
            }
        }, { passive: true });
    });

    // 5b. Mobile Modal View Switcher (Gallery <-> Description)
    const modalContainers = document.querySelectorAll('.modal-container');
    modalContainers.forEach(container => {
        container.setAttribute('data-mobile-view', 'gallery');
        const gallery = container.querySelector('.modal-gallery');
        const info = container.querySelector('.modal-info');
        const titleEl = container.querySelector('.modal-title');
        const projectTitle = titleEl ? titleEl.textContent.trim() : 'Obra';

        // Top segmented bar for mobile
        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'mobile-modal-header';
        mobileHeader.innerHTML = `
            <div class="mobile-modal-tabs">
                <button type="button" class="mobile-tab-btn active" data-target-view="gallery">
                    <i class="fas fa-images"></i> Galería
                </button>
                <button type="button" class="mobile-tab-btn" data-target-view="info">
                    <i class="fas fa-align-left"></i> Descripción
                </button>
            </div>
        `;
        container.insertBefore(mobileHeader, container.firstChild);

        // Minimized bar for Gallery (shown at top when Description is active)
        if (gallery) {
            const minGalleryBar = document.createElement('button');
            minGalleryBar.type = 'button';
            minGalleryBar.className = 'mobile-min-bar mobile-min-gallery';
            minGalleryBar.innerHTML = `
                <span class="mobile-min-label"><i class="fas fa-camera"></i> Galería de Fotos (${container.querySelectorAll('.carousel-thumb').length})</span>
                <span class="mobile-min-cta">Ver fotos <i class="fas fa-chevron-down"></i></span>
            `;
            gallery.insertBefore(minGalleryBar, gallery.firstChild);
            minGalleryBar.addEventListener('click', () => setMobileModalView(container, 'gallery'));
        }

        // Minimized bar for Description (shown at bottom when Gallery is active)
        if (info) {
            const minInfoBar = document.createElement('button');
            minInfoBar.type = 'button';
            minInfoBar.className = 'mobile-min-bar mobile-min-info';
            minInfoBar.innerHTML = `
                <span class="mobile-min-label"><i class="fas fa-info-circle"></i> ${projectTitle}</span>
                <span class="mobile-min-cta">Ver descripción <i class="fas fa-chevron-up"></i></span>
            `;
            info.insertBefore(minInfoBar, info.firstChild);
            minInfoBar.addEventListener('click', () => setMobileModalView(container, 'info'));
        }

        const tabBtns = mobileHeader.querySelectorAll('.mobile-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setMobileModalView(container, btn.getAttribute('data-target-view'));
            });
        });
    });
});

function setMobileModalView(container, view) {
    container.setAttribute('data-mobile-view', view);
    const tabBtns = container.querySelectorAll('.mobile-tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target-view') === view);
    });
}

// 6. Project Modals External Triggers
function openProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const container = modal.querySelector('.modal-container');
        if (container) {
            setMobileModalView(container, 'gallery');
        }
        const carousel = modal.querySelector('.project-carousel');
        if (carousel && typeof carousel._restartTimer === 'function') {
            carousel._restartTimer();
        }
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

function closeProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const carousel = modal.querySelector('.project-carousel');
        if (carousel && typeof carousel._stopMedia === 'function') {
            carousel._stopMedia();
        }
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-overlay')) {
        const carousel = event.target.querySelector('.project-carousel');
        if (carousel && typeof carousel._stopMedia === 'function') {
            carousel._stopMedia();
        }
        event.target.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
});
