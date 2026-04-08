(function () {
    'use strict';





    class HeroSlideshow {
        constructor() {
            this.slides = document.querySelectorAll('.slide');
            this.progressBars = document.querySelectorAll('.progress-bar');
            this.currentSlideEl = document.getElementById('currentSlide');
            this.totalSlidesEl = document.getElementById('totalSlides');
            this.currentIndex = 0;
            this.totalSlides = this.slides.length;
            this.duration = 6000;
            this.timer = null;
            this.isPaused = false;

            if (this.totalSlides === 0) return;


            document.documentElement.style.setProperty('--slide-duration', `${this.duration}ms`);

            this.init();
        }

        init() {

            if (this.totalSlidesEl) {
                this.totalSlidesEl.textContent = String(this.totalSlides).padStart(2, '0');
            }


            this.progressBars.forEach((bar, index) => {
                bar.addEventListener('click', () => {
                    this.goToSlide(index);
                });
            });


            this.showSlide(0);
            this.startTimer();


            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pause();
                } else {
                    this.resume();
                }
            });
        }

        showSlide(index) {

            this.slides.forEach(slide => slide.classList.remove('active'));


            this.progressBars.forEach((bar, i) => {
                bar.classList.remove('active', 'done');
                const fill = bar.querySelector('.progress-fill');

                fill.style.animation = 'none';
                fill.offsetHeight;
                fill.style.animation = '';

                if (i < index) {
                    bar.classList.add('done');
                }
            });


            this.currentIndex = index;
            this.slides[index].classList.add('active');
            this.progressBars[index].classList.add('active');


            if (this.currentSlideEl) {
                this.currentSlideEl.textContent = String(index + 1).padStart(2, '0');
            }
        }

        nextSlide() {
            const nextIndex = (this.currentIndex + 1) % this.totalSlides;
            this.showSlide(nextIndex);
        }

        goToSlide(index) {
            this.clearTimer();
            this.showSlide(index);
            this.startTimer();
        }

        startTimer() {
            this.clearTimer();
            this.timer = setInterval(() => {
                if (!this.isPaused) {
                    this.nextSlide();
                }
            }, this.duration);
        }

        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }

        pause() {
            this.isPaused = true;
        }

        resume() {
            this.isPaused = false;
        }
    }





    class HeaderController {
        constructor() {
            this.header = document.getElementById('mainHeader');
            if (!this.header) return;


            if (this.header.classList.contains('scrolled-always')) return;

            this.scrollThreshold = 80;
            this.lastScroll = 0;

            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            this.onScroll();
        }

        onScroll() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollY > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            this.lastScroll = scrollY;
        }
    }





    class MobileMenuController {
        constructor() {
            this.hamburger = document.getElementById('hamburgerBtn');
            this.mobileMenu = document.getElementById('mobileMenu');
            this.closeBtn = document.getElementById('mobileClose');
            this.mobileLinks = document.querySelectorAll('.mobile-link');
            this.body = document.body;

            if (!this.hamburger || !this.mobileMenu) return;

            this.isOpen = false;
            this.init();
        }

        init() {
            this.hamburger.addEventListener('click', () => this.toggle());


            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }


            this.mobileLinks.forEach((link, index) => {

                link.style.transitionDelay = `${0.1 + index * 0.06}s`;

                link.addEventListener('click', () => {
                    this.close();
                });
            });


            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.isOpen = true;
            this.hamburger.classList.add('open');
            this.mobileMenu.classList.add('open');
            this.body.style.overflow = 'hidden';
        }

        close() {
            this.isOpen = false;
            this.hamburger.classList.remove('open');
            this.mobileMenu.classList.remove('open');
            this.body.style.overflow = '';
        }
    }





    class SmoothScrollController {
        constructor() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }





    class ScrollAnimator {
        constructor() {
            this.elements = document.querySelectorAll('[data-animate]');
            if (this.elements.length === 0) return;

            const options = {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {

                        const parent = entry.target.parentElement;
                        const siblings = parent ? parent.querySelectorAll('[data-animate]') : [];
                        let siblingIndex = 0;

                        siblings.forEach((el, i) => {
                            if (el === entry.target) siblingIndex = i;
                        });

                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, siblingIndex * 100);

                        this.observer.unobserve(entry.target);
                    }
                });
            }, options);

            this.elements.forEach(el => this.observer.observe(el));
        }
    }





    class NavActiveTracker {
        constructor() {
            this.navLinks = document.querySelectorAll('.nav-link, .mobile-link');
            this.sections = [];

            this.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const section = document.querySelector(href);
                    if (section) {
                        this.sections.push({ link, section, href });
                    }
                }
            });

            if (this.sections.length === 0) return;

            window.addEventListener('scroll', () => this.update(), { passive: true });
            this.update();
        }

        update() {
            const scrollY = window.pageYOffset + 150;
            let current = '';

            this.sections.forEach(({ section, href }) => {
                if (scrollY >= section.offsetTop) {
                    current = href;
                }
            });

            this.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === current) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }





    class ScrollToTop {
        constructor() {
            this.button = document.createElement('button');
            this.button.className = 'scroll-to-top';
            this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
            this.button.setAttribute('aria-label', 'Scroll to top');
            document.body.appendChild(this.button);

            this.button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 600) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            }, { passive: true });
        }
    }





    class ImagePreloader {
        constructor() {
            const slides = document.querySelectorAll('.slide');
            slides.forEach(slide => {
                const bgImage = slide.style.backgroundImage;
                const url = bgImage.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
                if (url) {
                    const img = new Image();
                    img.src = url;
                }
            });
        }
    }





    class IntroCarousel {
        constructor() {
            this.container = document.getElementById('introCarousel');
            if (!this.container) return;

            this.track = document.getElementById('introCarouselTrack');
            this.slides = Array.from(this.track.querySelectorAll('.intro-carousel-slide'));
            this.total = this.slides.length;
            this.current = 0;
            this.autoPlayDelay = 3500;
            this.timer = null;
            this.gap = 12;

            this.init();
        }

        init() {

            this.layout();
            this.startAutoPlay();


            window.addEventListener('resize', () => this.layout());


            document.addEventListener('visibilitychange', () => {
                document.hidden ? this.stopAutoPlay() : this.startAutoPlay();
            });
        }

        layout() {
            const containerH = this.container.offsetHeight;

            this.slideH = Math.floor((containerH - this.gap * 2) / 3);

            this.slides.forEach(slide => {
                slide.style.height = this.slideH + 'px';
            });

            this.positionSlides(false);
        }

        positionSlides(animate = true) {
            const containerH = this.container.offsetHeight;
            const centerY = containerH / 2;

            this.slides.forEach((slide, i) => {

                let offset = i - this.current;
                if (offset > Math.floor(this.total / 2)) offset -= this.total;
                if (offset < -Math.floor(this.total / 2)) offset += this.total;

                const y = centerY + offset * (this.slideH + this.gap) - this.slideH / 2;
                const absOffset = Math.abs(offset);


                slide.style.transition = animate
                    ? 'all 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
                    : 'none';


                slide.style.top = y + 'px';


                if (absOffset === 0) {
                    slide.style.opacity = '1';
                    slide.style.transform = 'scale(1)';
                    slide.style.zIndex = '3';
                    slide.style.boxShadow = '0 16px 48px rgba(0,0,0,0.15)';
                } else if (absOffset === 1) {
                    slide.style.opacity = '0.4';
                    slide.style.transform = 'scale(0.93)';
                    slide.style.zIndex = '2';
                    slide.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                } else {
                    slide.style.opacity = '0';
                    slide.style.transform = 'scale(0.85)';
                    slide.style.zIndex = '1';
                    slide.style.boxShadow = 'none';
                }
            });
        }

        next() {
            this.current = (this.current + 1) % this.total;
            this.positionSlides(true);
        }

        startAutoPlay() {
            this.stopAutoPlay();
            this.timer = setInterval(() => this.next(), this.autoPlayDelay);
        }

        stopAutoPlay() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    }





    class ReviewsCarousel {
        constructor() {
            this.carousel = document.getElementById('reviewsCarousel');
            if (!this.carousel) return;

            this.track = document.getElementById('reviewsTrack');
            this.prevBtn = document.getElementById('reviewsPrev');
            this.nextBtn = document.getElementById('reviewsNext');
            this.dotsContainer = document.getElementById('reviewsDots');
            this.cards = Array.from(this.track.querySelectorAll('.review-card'));
            this.total = this.cards.length;
            this.current = 0;

            
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.swipeThreshold = 50;

            this.init();
        }

        init() {
            this.updateVisibleCount();

            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());

            
            this.track.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            this.track.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });

            window.addEventListener('resize', () => {
                this.updateVisibleCount();
                this.goTo(this.current);
            });

            this.updateButtons();
            this.renderDots();
        }

        handleSwipe() {
            const distance = this.touchEndX - this.touchStartX;
            if (Math.abs(distance) > this.swipeThreshold) {
                if (distance < 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }

        updateVisibleCount() {
            const width = window.innerWidth;
            if (width < 768) {
                this.visible = 1;
            } else if (width < 1024) {
                this.visible = 2;
            } else {
                this.visible = 3;
            }
            this.maxIndex = this.total - this.visible;
            if (this.current > this.maxIndex) this.current = this.maxIndex;

            this.renderDots();
        }

        renderDots() {
            if (!this.dotsContainer) return;
            this.dotsContainer.innerHTML = '';
            for (let i = 0; i <= this.maxIndex; i++) {
                const dot = document.createElement('button');
                dot.className = 'reviews-dot' + (i === this.current ? ' active' : '');
                dot.setAttribute('aria-label', `Go to review group ${i + 1}`);
                dot.addEventListener('click', () => this.goTo(i));
                this.dotsContainer.appendChild(dot);
            }
        }

        goTo(index) {
            this.current = Math.max(0, Math.min(index, this.maxIndex));
            const cardWidth = this.cards[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
            const offset = this.current * (cardWidth + gap);
            this.track.style.transform = `translateX(-${offset}px)`;
            this.updateButtons();
            this.updateDots();
        }

        prev() {
            if (this.current > 0) this.goTo(this.current - 1);
        }

        next() {
            if (this.current < this.maxIndex) this.goTo(this.current + 1);
        }

        updateButtons() {
            this.prevBtn.disabled = this.current === 0;
            this.nextBtn.disabled = this.current >= this.maxIndex || this.maxIndex < 0;
        }

        updateDots() {
            const dots = this.dotsContainer.querySelectorAll('.reviews-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.current);
            });
        }
    }







    class ContactFormHandler {
        constructor() {
            this.form = document.getElementById('contactForm');
            this.result = document.getElementById('contactResult');
            if (!this.form || !this.result) return;
            this.init();
        }

        init() {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        async handleSubmit(e) {
            e.preventDefault();
            const formData = new FormData(this.form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            this.showStatus('Sending...', '#e4cfa3', '#1a4d2e');

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const res = await response.json();

                if (response.status === 200) {
                    this.showStatus('Message Sent Successfully!', '#1a4d2e', '#ffffff');
                    this.form.reset();
                } else {
                    this.showStatus(res.message || 'Error occurred.', '#e07a42', '#ffffff');
                }
            } catch (error) {
                this.showStatus('Network error.', '#e07a42', '#ffffff');
            }

            setTimeout(() => {
                this.result.style.display = 'none';
            }, 5000);
        }

        showStatus(message, bgColor, textColor) {
            this.result.style.display = 'block';
            this.result.textContent = message;
            this.result.style.backgroundColor = bgColor;
            this.result.style.color = textColor;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new HeroSlideshow();
        new HeaderController();
        new MobileMenuController();
        new SmoothScrollController();
        new ScrollAnimator();
        new NavActiveTracker();
        new ScrollToTop();
        new ImagePreloader();
        new IntroCarousel();
        new ReviewsCarousel();
        new ContactFormHandler();
    });

})();
