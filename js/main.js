// ===== CONFIGURATION =====
const CONFIG = {
    scrollThreshold: 300,
    modalDelay: 12000,
    particleCount: 25,
    counterDuration: 2000
};

// ===== PARTICLE SYSTEM =====
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random() * 0.3 + 0.1;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            opacity: ${opacity};
            animation: float ${duration}s ease-in-out ${delay}s infinite;
        `;
        
        container.appendChild(particle);
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const fomoBar = document.querySelector('.fomo-bar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                nav?.classList.toggle('nav-scrolled', currentScroll > 50);
                fomoBar?.classList.toggle('hidden', currentScroll > 150);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    const toggleMenu = (show) => {
        if (show) {
            mobileMenu?.classList.remove('hidden');
            mobileMenu?.classList.add('flex');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu?.classList.add('hidden');
            mobileMenu?.classList.remove('flex');
            document.body.style.overflow = '';
        }
    };

    mobileMenuBtn?.addEventListener('click', () => toggleMenu(true));
    closeMenuBtn?.addEventListener('click', () => toggleMenu(false));
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}

// ===== TWITCH FACADE =====
function initTwitchCards() {
    document.querySelectorAll('.twitch-card').forEach(card => {
        card.addEventListener('click', function handleClick() {
            const streamer = this.dataset.streamer;
            const img = this.querySelector('img');
            
            if (!streamer || !img) return;
            
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.twitch.tv/?channel=${streamer}&parent=${window.location.hostname}&muted=true`;
            iframe.width = '100%';
            iframe.height = '176';
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            iframe.className = 'rounded-t-2xl';
            
            img.parentNode.replaceChild(iframe, img);
            this.style.cursor = 'default';
            this.removeEventListener('click', handleClick);
        });
    });
}

// ===== SOUND EFFECTS =====
let audioContext = null;

function initSoundEffects() {
    document.querySelectorAll('.btn-sound').forEach(btn => {
        btn.addEventListener('mouseenter', playClickSound);
        btn.addEventListener('click', playClickSound);
    });
}

function playClickSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.06);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.06);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.06);
    } catch (e) {
        // Silent fail
    }
}

// ===== STICKY BOTTOM BAR =====
function initStickyBar() {
    const stickyBar = document.querySelector('.sticky-bottom');
    const downloadSection = document.getElementById('download');
    if (!stickyBar || !downloadSection) return;

    let isBottomInView = false;
    
    // Use IntersectionObserver to track if bottom section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isBottomInView = entry.isIntersecting;
            
            // Immediate update when entering/leaving bottom
            if (isBottomInView) {
                stickyBar.classList.remove('show');
            } else if (window.pageYOffset > 600) {
                stickyBar.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(downloadSection);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPos = window.pageYOffset;
                const isPastTop = scrollPos > 600;

                if (isPastTop && !isBottomInView) {
                    stickyBar.classList.add('show');
                } else {
                    stickyBar.classList.remove('show');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SMART VIDEO AUTOPLAY =====
function initSmartVideoAutoplay() {
    const videos = document.querySelectorAll('.gameplay-card video, .showcase-card video');
    if (!videos.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.3 });

    videos.forEach(video => observer.observe(video));
}

// ===== VIDEO MODAL SYSTEM =====
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const content = document.getElementById('videoModalContent');
    const closeBtn = document.getElementById('closeVideoModal');
    const overlay = modal?.querySelector('.modal-overlay');
    const ytPlayer = document.getElementById('youtubePlayer');
    const localPlayer = document.getElementById('localVideoPlayer');

    if (!modal || !ytPlayer || !localPlayer) return;

    // Extract YouTube video ID from any URL format
    function extractYouTubeId(url) {
        let id = '';
        try {
            if (url.includes('v=')) {
                id = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtube.com/live/')) {
                id = url.split('youtube.com/live/')[1].split('?')[0];
            } else if (url.includes('youtu.be/')) {
                id = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                id = url.split('youtube.com/embed/')[1].split('?')[0];
            }
        } catch(e) { id = ''; }
        return id;
    }

    function openModal(src) {
        // Step 1: Remove hidden + add flex so it becomes visible (but opacity:0 via CSS)
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Step 2: Load the video content
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
            const videoId = extractYouTubeId(src);
            if (videoId) {
                ytPlayer.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
                ytPlayer.classList.remove('hidden');
                localPlayer.classList.add('hidden');
            }
        } else {
            localPlayer.querySelector('source').src = src;
            localPlayer.classList.remove('hidden');
            ytPlayer.classList.add('hidden');
            localPlayer.load();
            localPlayer.play().catch(function(){});
        }

        // Step 3: Use double rAF to guarantee browser has painted the initial state
        // before adding 'show' class to trigger CSS transition
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                modal.classList.add('show');
            });
        });

        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');

        setTimeout(function() {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            
            // Safely stop YouTube
            ytPlayer.src = '';
            ytPlayer.classList.add('hidden');
            
            // Safely stop local video
            try { localPlayer.pause(); } catch(e) {}
            localPlayer.querySelector('source').src = '';
            localPlayer.classList.add('hidden');
            
            document.body.style.overflow = '';
        }, 500);
    }

    // Event delegation — catches clicks on .video-trigger links and their children
    document.addEventListener('click', function(e) {
        var trigger = e.target.closest('.video-trigger');
        if (!trigger) return;

        var href = trigger.getAttribute('href');
        if (!href) return;

        e.preventDefault();
        e.stopPropagation();
        openModal(href);
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Overlay click
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    // ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// ===== IMAGE MODAL SYSTEM (LIGHTBOX) =====
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalContent = document.getElementById('imageModalContent');
    const modalImg = document.getElementById('modalImage');
    const loading = document.getElementById('imageLoading');
    const closeBtn = document.getElementById('closeImageModal');
    const downloadBtn = document.getElementById('downloadImage');
    const overlay = modal?.querySelector('.modal-overlay');
    const titleEl = document.getElementById('imageModalTitle');

    if (!modal) return;

    const showImage = (src, alt) => {
        modal.classList.add('flex');
        modal.classList.remove('hidden');
        
        // Reset image state
        modalImg.classList.remove('loaded');
        loading.classList.remove('hidden');
        modalImg.src = '';
        
        // Set new source
        modalImg.src = src;
        modalImg.alt = alt || 'Visual Archive';
        downloadBtn.href = src;
        titleEl.textContent = `Visual Archive // ${alt || 'ID-' + Math.floor(Math.random() * 999)}`;
        
        // Use double rAF to trigger animation without forcing reflow
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        });
        
        modalImg.onload = () => {
            modalImg.classList.add('loaded');
            loading.classList.add('hidden');
        };
        
        document.body.style.overflow = 'hidden';
    };

    const hideImage = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 500);
    };    // Target Media Center screenshots, wallpapers, Gallery items, AND Horizontal Marquee
    const selectors = [
        '.media-panel[data-index="1"] a', 
        '.media-panel[data-index="2"] a',
        '.gallery-grid a',
        '.horizontal-marquee-section a'
    ].join(', ');

    document.addEventListener('click', (e) => {
        const link = e.target.closest(selectors);
        if (!link) return;

        // Only if it's an image link
        if (link.href && link.href.match(/\.(jpg|jpeg|png|webp|gif|bmp)/i)) {
            e.preventDefault();
            e.stopPropagation();
            const alt = link.querySelector('img')?.alt;
            showImage(link.href, alt);
        }
    });

    closeBtn?.addEventListener('click', hideImage);
    overlay?.addEventListener('click', hideImage);
    
    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideImage();
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => entry.target.classList.add('aos-animate'), delay);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// ===== VIDEO LAZY LOADING =====
function initVideoLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (!video.src && video.querySelector('source')) {
                    video.load();
                }
                observer.unobserve(video);
            }
        });
    }, { rootMargin: '100px' });
    
    document.querySelectorAll('video[preload="metadata"]').forEach(video => observer.observe(video));
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ===== SCROLL INDICATOR =====
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    
    window.addEventListener('scroll', () => {
        indicator.classList.toggle('hidden', window.pageYOffset > 100);
    }, { passive: true });
}

// ===== KEYBOARD NAVIGATION =====
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }
        }
    });
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    // Use localStorage to persist the countdown across page loads
    const STORAGE_KEY = 'oncehuman_promo_end';
    let endTime = localStorage.getItem(STORAGE_KEY);
    
    if (!endTime || parseInt(endTime) <= Date.now()) {
        // Set a new 4-hour countdown
        endTime = Date.now() + (4 * 60 * 60 * 1000);
        localStorage.setItem(STORAGE_KEY, endTime.toString());
    } else {
        endTime = parseInt(endTime);
    }
    
    function updateCountdown() {
        const now = Date.now();
        let remaining = endTime - now;
        
        if (remaining <= 0) {
            // Reset timer
            endTime = Date.now() + (4 * 60 * 60 * 1000);
            localStorage.setItem(STORAGE_KEY, endTime.toString());
            remaining = endTime - Date.now();
        }
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        const newHours = String(hours).padStart(2, '0');
        const newMinutes = String(minutes).padStart(2, '0');
        const newSeconds = String(seconds).padStart(2, '0');
        
        // Add flip animation on change
        if (secondsEl.textContent !== newSeconds) {
            secondsEl.style.transform = 'scale(1.1)';
            setTimeout(() => { secondsEl.style.transform = 'scale(1)'; }, 150);
        }
        
        hoursEl.textContent = newHours;
        minutesEl.textContent = newMinutes;
        secondsEl.textContent = newSeconds;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== SECTION TAB SWITCHING =====
function initSectionTabs() {
    const sections = [
        { tabs: '.scenario-tab', panels: '.scenario-panel', container: '#scenario-tabs' },
        { tabs: '.season-tab', panels: '.season-panel', container: '#season-tabs' },
        { tabs: '.class-tab', panels: '.class-panel', container: '#class-tabs' },
        { tabs: '.media-tab', panels: '.media-panel', container: '#media-tabs' }
    ];

    sections.forEach(section => {
        const container = document.querySelector(section.container);
        if (!container) return;

        container.addEventListener('click', (e) => {
            const tab = e.target.closest(`[data-index]`);
            if (!tab) return;

            const index = tab.dataset.index;

            // Update tabs
            container.querySelectorAll('[data-index]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            const panels = document.querySelectorAll(section.panels);
            panels.forEach(panel => {
                const isActive = panel.dataset.index === index;
                panel.classList.toggle('active', isActive);

                // Handle video play/pause for scenario & season panels
                const video = panel.querySelector('video');
                if (video) {
                    if (isActive) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                }
            });
        });
    });
}

// ===== HERO PARALLAX =====
function initHeroParallax() {
    const heroSection = document.getElementById('home');
    const heroBg = heroSection?.querySelector('img, video');
    
    if (!heroSection || !heroBg) return;

    let ticking = false;
    heroSection.addEventListener('mousemove', (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
                const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
                heroBg.style.transform = `translate(${-xPos}px, ${-yPos}px) scale(1.05)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            heroBg.style.transform = `translate(0px, 0px) scale(1.05)`;
        });
    });
}

// ===== STAT COUNTERS =====
function initStatCounters() {
    const statsElements = document.querySelectorAll('.text-blood.font-display.text-4xl, .text-white.font-display.text-4xl');
    if (!statsElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                if (el.dataset.animated) return;
                el.dataset.animated = 'true';

                const text = el.textContent.trim();
                let targetNum = 0;
                let suffix = '';

                if (text.includes('12M+')) {
                    targetNum = 12;
                    suffix = 'M+';
                } else if (text.includes('256')) {
                    targetNum = 256;
                    suffix = '<span class="text-xl text-gray-500">km²</span>';
                } else if (text.includes('100+')) {
                    targetNum = 100;
                    suffix = '+';
                }

                if (targetNum > 0) {
                    let current = 0;
                    const duration = 2000;
                    const increment = targetNum / (duration / 16);

                    const updateCounter = () => {
                        current += increment;
                        if (current >= targetNum) {
                            el.innerHTML = targetNum + suffix;
                        } else {
                            el.innerHTML = Math.ceil(current) + suffix;
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    updateCounter();
                }
            }
        });
    }, { threshold: 0.5 });

    statsElements.forEach(el => observer.observe(el));
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initTwitchCards();
    initSoundEffects();
    initStickyBar();
    initScrollAnimations();
    initVideoLazyLoading();
    initSmoothScroll();
    initScrollIndicator();
    initKeyboardNav();
    initCountdown();
    initSectionTabs();
    initBackToTop();
    initSmartVideoAutoplay();
    initVideoModal();
    initImageModal();
    initHeroParallax();
    initStatCounters();
    initFeatureSlider();
    initVideoFallback();
});

// ===== FEATURE SLIDER =====
function initFeatureSlider() {
    const slides = document.querySelectorAll('.feature-slide');
    const dots = document.querySelectorAll('.feature-dot');
    const prevBtn = document.getElementById('feature-prev');
    const nextBtn = document.getElementById('feature-next');
    const slider = document.getElementById('feature-slider');
    
    if (!slides.length) return;
    
    let current = 0;
    let interval = null;
    const total = slides.length;

    function goTo(i) {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (i + total) % total;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        stopAuto();
        interval = setInterval(next, 5000);
    }

    function stopAuto() {
        if (interval) { clearInterval(interval); interval = null; }
    }

    prevBtn?.addEventListener('click', () => { prev(); startAuto(); });
    nextBtn?.addEventListener('click', () => { next(); startAuto(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
            startAuto();
        });
    });

    slider?.addEventListener('mouseenter', stopAuto);
    slider?.addEventListener('mouseleave', startAuto);

    startAuto();
}

// ===== GLOBAL EXPORTS =====
window.playClickSound = playClickSound;

// ===== VIDEO FALLBACK =====
function initVideoFallback() {
    const backgroundVideos = document.querySelectorAll('video');
    backgroundVideos.forEach(video => {
        // Catch connection/source failures (e.g. from ad blockers or dead links)
        video.addEventListener('error', function() {
            console.warn('Background video failed to load, deploying fallback.', this.src);
            
            // Hide the broken video so CSS fallback is visible underneath
            this.style.display = 'none';
            
            // Allow CSS to trigger specific fallback styling
            if (this.parentElement) {
                this.parentElement.classList.add('bg-fallback-active');
            }
        }, true);
    });
}