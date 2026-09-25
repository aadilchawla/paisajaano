document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.getElementById('navLinks');

    const closeMobileMenu = () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
    };

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        mobileMenuBtn.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });

    // Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            formStatus.textContent = 'Please fill in all required fields with a valid email.';
            formStatus.className = 'form-status error';
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // No backend is wired up yet; log the payload for now.
        console.log('Form submitted:', data);

        submitButton.disabled = true;
        formStatus.textContent = 'Sending...';
        formStatus.className = 'form-status';

        setTimeout(() => {
            formStatus.textContent = 'Thank you for your interest! We will contact you soon.';
            formStatus.className = 'form-status success';
            contactForm.reset();
            submitButton.disabled = false;
        }, 500);
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu();
            }
        });
    });

    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');
    const onNavbarScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onNavbarScroll, { passive: true });

    // Animate Stats on Scroll
    const stats = document.querySelectorAll('.stat-number');

    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = prefix + Math.floor(progress * (end - start) + start) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    stats.forEach(stat => {
        const match = stat.textContent.trim().match(/^(\D*)([\d,]+)(\D*)$/);
        stat.dataset.prefix = match ? match[1] : '';
        stat.dataset.target = match ? match[2].replace(/,/g, '') : '0';
        stat.dataset.suffix = match ? match[3] : '';
    });

    const animateStats = () => {
        stats.forEach(stat => {
            if (!stat.dataset.animated && isInViewport(stat)) {
                animateValue(stat, 0, parseInt(stat.dataset.target, 10) || 0, 2000);
                stat.dataset.animated = 'true';
            }
        });
    };

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();
});
