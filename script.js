 
        document.getElementById('year').textContent = new Date().getFullYear();

        /* --- Navbar Logic --- */
        const header = document.getElementById('navbar');
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const navLinks = document.querySelector('.nav-links');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            if(navLinks.classList.contains('nav-active')){
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 4px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-4px, -4px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        /* --- Scroll Reveals --- */
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        /* --- Bento Hover Spotlight --- */
        document.querySelectorAll('.bento-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });

        /* --- FAQ Accordion --- */
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                });
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });

        /* --- Light Theme Digital Brain / Neural Network Canvas Effect --- */
        const canvas = document.getElementById('hero-canvas');
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null };

        // Interactivity with mouse
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Neuron {
            constructor() {
                // Concentrate particles somewhat centrally to mimic a "brain" cluster
                let angle = Math.random() * Math.PI * 2;
                let radius = Math.random() * 0.4; // 40% of dimensions
                
                this.x = (width / 2) + Math.cos(angle) * (width * radius) + (Math.random() - 0.5) * width * 0.5;
                this.y = (height / 2) + Math.sin(angle) * (height * radius) + (Math.random() - 0.5) * height * 0.5;
                
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(17, 17, 17, 0.7)'; // Dark nodes
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Gentle bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse repel interaction
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        this.x -= dx * 0.03;
                        this.y -= dy * 0.03;
                    }
                }
            }
        }

        function initNetwork() {
            particles = [];
            // Calculate responsive node density
            const numParticles = Math.floor((width * height) / 8000); 
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Neuron());
            }
        }

        function resize() {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            initNetwork();
        }

        window.addEventListener('resize', resize);
        
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw neural connections (synapses)
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 110) {
                        ctx.beginPath();
                        // Opacity fades smoothly based on distance
                        ctx.strokeStyle = `rgba(17, 17, 17, ${0.15 - (distance / 110) * 0.15})`; 
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        resize();
        animate();
