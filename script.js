/* ===========================================================
   PORTFOLIO — YAHYA AZZABI
   script.js
   -----------------------------------------------------------
   - Toggle thème clair / sombre (avec persistance)
   - Menu mobile (burger)
   - Barre de navigation : effet de scroll + lien actif
   - Bouton "retour en haut"
   - Apparitions progressives au scroll (IntersectionObserver)
   =========================================================== */

(function () {
    'use strict';

    /* -------------------------------------------------------
       1. THÈME CLAIR / SOMBRE
       Stocké dans localStorage. Respecte la préférence système
       au premier chargement si rien n'est encore enregistré.
       ------------------------------------------------------- */

    const THEME_KEY = 'yahya-portfolio-theme';
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    function getInitialTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') return stored;

        // Fallback : préférence système
        return window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem(THEME_KEY, theme);
    }

    applyTheme(getInitialTheme());

    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        applyTheme(current === 'light' ? 'dark' : 'light');
    });


    /* -------------------------------------------------------
       2. MENU MOBILE
       Burger + fermeture automatique au clic sur un lien.
       ------------------------------------------------------- */

    const burger  = document.getElementById('nav-burger');
    const navMenu = document.getElementById('nav-menu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Fermer le menu en cliquant sur un lien
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // Fermer si l'utilisateur clique en dehors
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('open');
            navMenu.classList.remove('open');
        }
    });


    /* -------------------------------------------------------
       3. NAVBAR : effet "scrolled" + lien actif
       ------------------------------------------------------- */

    const navbar      = document.getElementById('navbar');
    const navLinks    = navMenu.querySelectorAll('.nav-link');
    const backToTop   = document.getElementById('back-to-top');

    // Sections suivies pour le surlignage du lien actif
    const sections = Array.from(document.querySelectorAll('section[id]'));

    function onScroll() {
        const y = window.scrollY;

        // Effet de fond / ombre quand on quitte le haut
        navbar.classList.toggle('scrolled', y > 30);

        // Bouton retour en haut visible après 400px
        backToTop.classList.toggle('visible', y > 400);

        // Lien actif : on cherche la section la plus proche du haut
        // (avec une marge pour la navbar fixe)
        const offset = 120;
        let current = sections[0].id;

        for (const section of sections) {
            if (section.offsetTop - offset <= y) {
                current = section.id;
            }
        }

        navLinks.forEach((link) => {
            const target = link.getAttribute('href').slice(1);
            link.classList.toggle('active', target === current);
        });
    }

    // Throttle léger via requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // État initial au chargement
    onScroll();


    /* -------------------------------------------------------
       4. BOUTON "RETOUR EN HAUT"
       ------------------------------------------------------- */

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* -------------------------------------------------------
       5. APPARITIONS AU SCROLL (IntersectionObserver)
       On marque les blocs à révéler, puis on les observe.
       ------------------------------------------------------- */

    // Sélecteurs des blocs à animer
    const revealSelectors = [
        '.section-header',
        '.about-text > p',
        '.about-facts',
        '.skill-category',
        '.timeline-item',
        '.exp-card',
        '.project-card',
        '.interest-card',
        '.contact-intro',
        '.contact-card'
    ];

    const revealEls = document.querySelectorAll(revealSelectors.join(','));
    revealEls.forEach((el) => el.classList.add('reveal'));

    // Si l'utilisateur a demandé "reduced motion", on affiche tout
    // immédiatement et on n'utilise pas d'observer
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('visible'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    // Léger décalage entre éléments d'un même bloc
                    const siblings = entry.target.parentElement
                        ? Array.from(entry.target.parentElement.children).filter((c) =>
                              c.classList.contains('reveal')
                          )
                        : [];
                    const position = Math.max(siblings.indexOf(entry.target), 0);
                    entry.target.style.transitionDelay = `${Math.min(position * 80, 400)}ms`;

                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach((el) => io.observe(el));
    }


    /* -------------------------------------------------------
       6. DEFENSE LÉGÈRE : log discret en console
       Sympa pour les recruteurs un peu curieux qui ouvrent
       les outils de développement (vu plusieurs fois sur des
       portfolios d'ingés que j'admire).
       ------------------------------------------------------- */

    if (typeof console !== 'undefined' && console.log) {
        console.log(
            '%c> Yahya AZZABI ',
            'color:#22d3ee; font-weight:bold; font-family:monospace;',
            '\nDispo pour un échange : yahyaazzabi11@gmail.com'
        );
    }

})();
