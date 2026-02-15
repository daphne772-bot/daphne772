/* =========================================
   김민수 자기소개 페이지 — JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ──────────────────────────────
    // 1. 파티클 배경 애니메이션
    // ──────────────────────────────
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth * 0.05));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.12;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ──────────────────────────────
    // 2. 타이핑 효과
    // ──────────────────────────────
    const typingTexts = [
        'Web Developer',
        'React Specialist',
        'Problem Solver',
        'Full-Stack Engineer',
        'Team Player'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingEl = document.getElementById('typing-text');

    function type() {
        const currentText = typingTexts[textIndex];
        if (isDeleting) {
            typingEl.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 90;

        if (!isDeleting && charIndex === currentText.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }
    type();

    // ──────────────────────────────
    // 3. 네비게이션 스크롤 효과
    // ──────────────────────────────
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        const scrollY = window.scrollY;

        // 네비게이션 배경
        navbar.classList.toggle('scrolled', scrollY > 50);

        // 맨 위로 버튼
        backToTop.classList.toggle('visible', scrollY > 500);

        // 활성 섹션 감지
        let currentSection = '';
        sections.forEach(section => {
            const top = section.offsetTop - 200;
            if (scrollY >= top) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === currentSection);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ──────────────────────────────
    // 4. 모바일 메뉴
    // ──────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ──────────────────────────────
    // 5. 스크롤 애니메이션 (Intersection Observer)
    // ──────────────────────────────
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // 약간의 지연으로 순차 효과
                const delay = entry.target.style.animationDelay
                    ? parseFloat(entry.target.style.animationDelay) * 1000
                    : 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // ──────────────────────────────
    // 6. 기술 스택 바 애니메이션
    // ──────────────────────────────
    const techFills = document.querySelectorAll('.tech-fill');

    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                techObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    techFills.forEach(fill => techObserver.observe(fill));

    // ──────────────────────────────
    // 7. 부드러운 앵커 스크롤
    // ──────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offsetTop = targetEl.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ──────────────────────────────
    // 8. 카드 마우스 기울기 효과
    // ──────────────────────────────
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
