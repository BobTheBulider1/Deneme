document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navbar & Mobile Menu Logic (Top Priority) ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    window.addEventListener('scroll', () => {
        // Add solid background class if scrolled more than 10px
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            if (scrollY >= (section.offsetTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    if(menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 2. Menu Tabs Logic ---
    function initializeMenuTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const menuPanels = document.querySelectorAll('.menu-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                menuPanels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const panel = document.getElementById(targetId);
                if(panel) {
                    panel.classList.add('active');
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(panel.querySelectorAll('.menu-card'), 
                            { y: 30, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
                        );
                    }
                }
            });
        });
    }
    initializeMenuTabs();

    // --- 3. Canvas Particle System ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3 - 0.2;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.blur = Math.random() > 0.7 ? Math.random() * 3 : 0;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 152, 0, ${this.opacity})`;
                if (this.blur > 0) {
                    ctx.shadowBlur = this.blur * 5;
                    ctx.shadowColor = '#ff9800';
                } else {
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            }
        }
        function initParticles() {
            particles = [];
            const numParticles = Math.min(window.innerWidth / 15, 100);
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        initParticles();
        animateParticles();
    }

    // --- 4. Reservation Form Submit (Supabase) ---
    const form = document.getElementById('reservation-form');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Gönderiliyor...';
            btn.style.background = '#d4af37';
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value;

            try {
                if (typeof supabaseClient !== 'undefined') {
                    const { data, error } = await supabaseClient
                        .from('reservations')
                        .insert([
                            { full_name: name, phone: phone, date: date, time: time, guests: guests, message: message }
                        ]);

                    if (error) throw error;
                } else {
                    console.warn("Supabase not initialized, simulating success.");
                }

                btn.textContent = 'Talebiniz Alındı!';
                btn.style.background = '#4caf50';
                form.reset();
            } catch (err) {
                console.error("Reservation Error:", err);
                btn.textContent = 'Hata: ' + (err.message || 'Bilinmeyen Hata');
                btn.style.background = '#f44336';
            } finally {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // --- 5. VanillaTilt 3D Initialization ---
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".3d-card, .review-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            scale: 1.02,
            easing: "cubic-bezier(.03,.98,.52,.99)"
        });
    }

    // --- 6. GSAP Animations & Parallax ---
    try {
        if (typeof gsap !== 'undefined') {
            // Mouse Parallax for Ambient Lights
            const lights = document.querySelectorAll('.ambient-light');
            if(lights.length > 0) {
                document.addEventListener('mousemove', (e) => {
                    const mouseX = e.clientX / window.innerWidth - 0.5;
                    const mouseY = e.clientY / window.innerHeight - 0.5;
                    gsap.to(lights[0], { x: mouseX * 60, y: mouseY * 60, duration: 2, ease: "power2.out" });
                    gsap.to(lights[1], { x: mouseX * -40, y: mouseY * -40, duration: 2, ease: "power2.out" });
                    gsap.to(lights[2], { x: mouseX * 80, y: mouseY * 80, duration: 2.5, ease: "power2.out" });
                });
            }

            // ScrollTrigger Animations
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);

                gsap.utils.toArray('.section-title').forEach(title => {
                    gsap.from(title, {
                        scrollTrigger: { trigger: title, start: "top 85%" },
                        y: 40, opacity: 0, duration: 1, ease: "power3.out"
                    });
                });

                if (document.querySelector('.about-text')) {
                    gsap.from('.about-text', { scrollTrigger: { trigger: '.about', start: "top 75%" }, x: -50, opacity: 0, duration: 1.2, ease: "power3.out" });
                    gsap.from('.about-image', { scrollTrigger: { trigger: '.about', start: "top 75%" }, x: 50, opacity: 0, duration: 1.2, ease: "power3.out" });
                }

                if (document.querySelector('.menu-card')) {
                    gsap.from('.menu-card', { scrollTrigger: { trigger: '.menu-grid', start: "top 80%" }, y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" });
                }

                if (document.querySelector('.review-card')) {
                    gsap.from('.review-card', { scrollTrigger: { trigger: '.reviews-slider', start: "top 80%" }, y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" });
                }

                if (document.querySelector('.gallery-item')) {
                    gsap.from('.gallery-item', { scrollTrigger: { trigger: '.gallery-grid', start: "top 85%" }, scale: 0.9, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" });
                }

                if (document.querySelector('.contact-form-wrapper')) {
                    gsap.from('.contact-form-wrapper', { scrollTrigger: { trigger: '.contact', start: "top 75%" }, y: 40, opacity: 0, duration: 1, ease: "power3.out" });
                }
            }
        }
    } catch (error) {
        console.error("GSAP Animation Error:", error);
    }

    // --- 7. Fetch Menu from Supabase ---
    async function loadMenu() {
        if (typeof supabaseClient === 'undefined') return;

        try {
            const { data: categories, error: catError } = await supabaseClient.from('categories').select('*').order('id');
            const { data: items, error: itemError } = await supabaseClient.from('menu_items').select('*').order('id');

            if (catError || itemError) {
                console.error("Menu fetch error:", catError || itemError);
                return;
            }

            if (!categories || categories.length === 0) return;

            const tabsContainer = document.querySelector('.menu-tabs');
            const contentContainer = document.querySelector('.menu-content');
            
            if (tabsContainer && contentContainer) {
                let tabsHtml = '';
                let contentHtml = '';

                categories.forEach((cat, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    tabsHtml += `<button class="tab-btn ${isActive}" data-target="${cat.slug}">${cat.name}</button>`;

                    const catItems = items ? items.filter(item => item.category_id === cat.id) : [];
                    
                    contentHtml += `
                    <div class="menu-panel ${isActive}" id="${cat.slug}">
                        <div class="menu-grid">
                    `;

                    catItems.forEach(item => {
                        contentHtml += `
                            <div class="menu-card 3d-card">
                                <div class="menu-img-placeholder premium-placeholder" ${item.image_url ? `style="background-image: url('${item.image_url}'); background-size: cover; background-position: center;"` : ''}>
                                    ${!item.image_url ? '<i class="fa-solid fa-bowl-food"></i><span>Görsel Yok</span>' : ''}
                                </div>
                                <div class="menu-info">
                                    <div class="menu-title-row">
                                        <h3>${item.name}</h3>
                                        <span class="price">₺${item.price}</span>
                                    </div>
                                    <p>${item.description || ''} ${item.is_popular ? '🔥 Popüler' : ''}</p>
                                </div>
                            </div>
                        `;
                    });

                    contentHtml += `
                        </div>
                    </div>
                    `;
                });

                tabsContainer.innerHTML = tabsHtml;
                contentContainer.innerHTML = contentHtml;

                // Re-initialize events and animations
                initializeMenuTabs();
                if (typeof VanillaTilt !== 'undefined') {
                    VanillaTilt.init(document.querySelectorAll(".3d-card"), {
                        max: 10, speed: 400, glare: true, "max-glare": 0.15, scale: 1.02
                    });
                }
            }
        } catch (error) {
            console.error("Error loading menu:", error);
        }
    }

    loadMenu();
});
