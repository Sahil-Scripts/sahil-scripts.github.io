/* ===== Sahil Pradhan Portfolio JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCustomCursor();
    initNavbar();
    initTypewriter();
    initSkills();
    initProjects();
    initScrollReveal();
    initCountUp();
    initContactForm();
    initSmoothScroll();
});

/* ========================================
   PARTICLE BACKGROUND
   ======================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 60;
    const connectionDistance = 150;
    let mouse = { x: null, y: null, radius: 120 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }
        draw() {
            ctx.fillStyle = `rgba(167, 139, 250, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDistance) {
                    const opacity = (1 - dist / connectionDistance) * 0.15;
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

/* ========================================
   CUSTOM CURSOR
   ======================================== */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (!dot || !outline) return;

    if (window.matchMedia('(max-width: 768px)').matches) return;

    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
    });

    function animateCursor() {
        outlineX += (dotX - outlineX) * 0.15;
        outlineY += (dotY - outlineY) * 0.15;

        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .skill-card, .project-card, .info-item, .contact-method, .timeline-content, .floating-badge')) {
            dot.classList.add('hover');
            outline.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .skill-card, .project-card, .info-item, .contact-method, .timeline-content, .floating-badge')) {
            dot.classList.remove('hover');
            outline.classList.remove('hover');
        }
    });
}

/* ========================================
   NAVBAR
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;

        // Active link based on scroll position
        const sections = document.querySelectorAll('section');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
}

/* ========================================
   TYPEWRITER EFFECT
   ======================================== */
function initTypewriter() {
    const textEl = document.querySelector('.typewriter-text');
    if (!textEl) return;

    const words = [
        'AI-Driven Developer',
        'Full Stack Engineer',
        'FKCCI & Hackathon Winner',
        'VP @ Developer Student Club',
        'Cybersecurity & ML Builder'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            textEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80 + Math.random() * 40;

            if (charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            }
        } else {
            textEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;

            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1500);
}

/* ========================================
   SKILLS DATA & RENDERING
   ======================================== */
function initSkills() {
    const skillsData = {
        languages: [
            { name: 'Python', icon: '🐍', level: '95%' },
            { name: 'Java', icon: '☕', level: '85%' },
            { name: 'JavaScript', icon: '⚡', level: '88%' },
            { name: 'SQL', icon: '🗄️', level: '85%' },
            { name: 'C', icon: '⚙️', level: '70%' },
        ],
        frameworks: [
            { name: 'FastAPI', icon: '🚀', level: '92%' },
            { name: 'Flask', icon: '🧪', level: '88%' },
            { name: 'TensorFlow', icon: '🧠', level: '82%' },
            { name: 'PyTorch', icon: '🔥', level: '80%' },
            { name: 'Transformers', icon: '🤖', level: '85%' },
            { name: 'LightGBM', icon: '📈', level: '85%' },
            { name: 'MediaPipe', icon: '🙌', level: '78%' },
            { name: 'Streamlit', icon: '📊', level: '92%' },
            { name: 'Node.js', icon: '🟢', level: '82%' },
            { name: 'React.js', icon: '⚛️', level: '80%' },
            { name: 'Electron', icon: '💻', level: '78%' },
        ],
        'data-web': [
            { name: 'NumPy', icon: '🔢', level: '90%' },
            { name: 'Pandas', icon: '🐼', level: '92%' },
            { name: 'Matplotlib', icon: '📉', level: '88%' },
            { name: 'Plotly', icon: '📊', level: '88%' },
            { name: 'Seaborn', icon: '🎨', level: '85%' },
            { name: 'HTML & CSS', icon: '🌐', level: '92%' },
            { name: 'Tailwind CSS', icon: '🌊', level: '90%' },
            { name: 'REST APIs', icon: '🔌', level: '92%' },
            { name: 'Chrome Ext (MV3)', icon: '🧩', level: '88%' },
        ],
        tools: [
            { name: 'Git & GitHub', icon: '📝', level: '92%' },
            { name: 'VS Code', icon: '💻', level: '95%' },
            { name: 'Jupyter Notebook', icon: '📓', level: '90%' },
            { name: 'Eclipse', icon: '🌘', level: '75%' },
            { name: 'MySQL', icon: '🐬', level: '85%' },
            { name: 'SQLite', icon: '💾', level: '88%' },
            { name: 'PostgreSQL', icon: '🐘', level: '80%' },
            { name: 'Postman', icon: '📬', level: '85%' },
            { name: 'Windows', icon: '🪟', level: '95%' },
            { name: 'Ubuntu', icon: '🐧', level: '85%' },
        ],
    };

    const grid = document.getElementById('skills-grid');
    const tabs = document.querySelectorAll('.skill-tab');
    let currentTab = 'languages';

    function renderSkills(category) {
        const skills = skillsData[category];
        grid.innerHTML = '';

        skills.forEach((skill, index) => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.style.animationDelay = `${index * 0.05}s`;
            card.innerHTML = `
                <span class="skill-icon">${skill.icon}</span>
                <span class="skill-name">${skill.name}</span>
                <div class="skill-level">
                    <div class="skill-level-bar" style="--level: ${skill.level}"></div>
                </div>
            `;
            grid.appendChild(card);

            setTimeout(() => {
                card.classList.add('visible');
            }, 100 + index * 50);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            if (tabName === currentTab) return;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tabName;

            grid.style.opacity = '0';
            grid.style.transform = 'translateY(10px)';
            setTimeout(() => {
                renderSkills(tabName);
                grid.style.opacity = '1';
                grid.style.transform = 'translateY(0)';
            }, 200);
        });
    });

    grid.style.transition = 'opacity 0.2s, transform 0.2s';
    renderSkills('languages');
}

/* ========================================
   PROJECTS DATA & SHOWCASE MODAL
   ======================================== */
function initProjects() {
    const projects = [
        {
            id: 'sentinel-mind',
            title: 'Sentinel Mind',
            tag: 'Cybersecurity / Log Analysis',
            emoji: '🛡️',
            description: 'Security Log Analysis & Attack Visualization Platform: AI-assisted cybersecurity pipeline using IBM Granite and GPT-4o to analyze raw system logs and generate structured forensic reports.',
            bullets: [
                'Implemented an AI-assisted cybersecurity pipeline using IBM Granite and GPT-4o to analyze raw system logs and generate structured forensic reports.',
                'Automated MITRE ATT&CK mapping and interactive attack-chain visualization to trace adversary behavior step-by-step.',
                'Designed modular workflows for log ingestion, anomaly detection, timeline generation, and investigation reporting.',
                'Engineered modular backend services in FastAPI with Cytoscape.js threat propagation graphs and packaged Electron desktop interface.'
            ],
            tech: ['IBM Granite', 'GPT-4o', 'FastAPI', 'MITRE ATT&CK', 'Cytoscape.js', 'Electron', 'PostgreSQL'],
            demoLink: 'https://www.youtube.com/watch?v=ep3N_wRwrlI',
            sourceLink: 'https://github.com/Sahil-Scripts/Sentinel-Mind'
        },
        {
            id: 'fronthaul-optimizer',
            title: 'Fronthaul Capacity Optimizer',
            tag: 'AI / 5G Networks',
            emoji: '📡',
            description: '5G Network Optimization Platform: AI-powered 5G fronthaul optimization platform built for capacity planning, traffic analysis, and network performance monitoring.',
            bullets: [
                'Developed an AI-powered 5G fronthaul optimization platform for capacity planning, traffic analysis, and network performance monitoring.',
                'Implemented binary-search-based capacity planning and traffic simulation to maintain low packet loss and high SLA compliance.',
                'Built an interactive Streamlit dashboard with network visualization, congestion detection, and optimization recommendations.',
                'Simulated dynamic traffic spikes to maintain high SLA compliance and reduce infrastructure and operating costs by 30-50%.'
            ],
            tech: ['Streamlit', 'Python', 'Plotly', 'Binary Search', '5G Simulation', 'SLA Optimizer'],
            demoLink: 'https://www.youtube.com/watch?v=ZUUU0ReNvaE',
            sourceLink: 'https://github.com/Sahil-Scripts'
        },
        {
            id: 'phishproto',
            title: 'PhishProto Threat Analyzer',
            tag: 'Deep Learning / Security',
            emoji: '🎣',
            description: 'Real-Time AI-Powered Phishing Detection System: Multimodal phishing detection system combining RoBERTa, CLIP, and GraphSAGE for real-time website threat analysis.',
            bullets: [
                'Built a multimodal phishing detection system using RoBERTa, CLIP, and GraphSAGE for real-time website threat analysis.',
                'Developed a LightGBM ensemble combining text, visual, and domain-relationship signals into a unified risk score.',
                'Built a Flask backend and Chrome Extension using Manifest V3 to deliver live, explainable website risk alerts.',
                'Anchored tamper-proof threat audit logs to the Ethereum Sepolia testnet to guarantee forensic data integrity.'
            ],
            tech: ['RoBERTa', 'CLIP', 'GraphSAGE', 'LightGBM', 'Flask', 'Chrome Extension (MV3)', 'Python'],
            demoLink: 'https://www.youtube.com/watch?v=qSOSvd0-St8',
            sourceLink: 'https://github.com/Sahil-Scripts'
        },
        {
            id: 'virtual-lab',
            title: 'Assignment Problem Virtual Lab',
            tag: 'Education / Algorithms',
            emoji: '🧬',
            description: 'An interactive algorithmic simulation environment built to visualize and teach Exhaustive Search and Branch-and-Bound solutions for the assignment problem.',
            bullets: [
                'Built step-by-step animated matrix solvers and decision tree builders utilizing native web technologies.',
                'Designed a responsive interface with Tailwind CSS containing dynamic graph plotting and custom dark mode states.',
                'Created complex state machines to enable students to pause, rewind, and inspect algorithm variables in real-time.'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'State Machine', 'Algorithms'],
            demoLink: 'https://www.youtube.com/watch?v=GaUOO8YNxeI',
            sourceLink: 'https://github.com/Sahil-Scripts/Assignment-Problem-Virtual-Lab'
        }
    ];

    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Render Project Cards
    projects.forEach((proj, idx) => {
        const tiltContainer = document.createElement('div');
        tiltContainer.className = 'project-tilt-container';

        const card = document.createElement('div');
        card.className = 'project-card reveal-up';
        card.style.transitionDelay = `${idx * 0.1}s`;
        card.dataset.id = proj.id;
        
        card.innerHTML = `
            <div class="project-image">
                <div class="project-image-placeholder">${proj.emoji}</div>
                <div class="project-overlay">
                    <span class="project-overlay-text">Explore Case Study</span>
                </div>
            </div>
            <div class="project-body">
                <span class="project-tag">${proj.tag}</span>
                <h3 class="project-title">${proj.title}</h3>
                <p class="project-description">${proj.description}</p>
                <div class="project-tech">
                    ${proj.tech.slice(0, 3).map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    ${proj.tech.length > 3 ? `<span class="tech-tag">+${proj.tech.length - 3} more</span>` : ''}
                </div>
            </div>
        `;
        
        tiltContainer.appendChild(card);
        grid.appendChild(tiltContainer);
    });

    // 3D Tilt and Glow Border Effect
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((centerY - y) / centerY) * 10; // max 10 deg
            const tiltY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
        });

        // Click Handler for Modal
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const proj = projects.find(p => p.id === id);
            if (proj) openModal(proj);
        });
    });

    // Modal Handling
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    function openModal(proj) {
        document.getElementById('modal-image').textContent = proj.emoji;
        document.getElementById('modal-tag').textContent = proj.tag;
        document.getElementById('modal-title').textContent = proj.title;
        document.getElementById('modal-desc').textContent = proj.description;

        const bulletList = document.getElementById('modal-bullets');
        bulletList.innerHTML = proj.bullets.map(b => `<li>${b}</li>`).join('');

        const techContainer = document.getElementById('modal-tech-stack');
        techContainer.innerHTML = proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

        const actions = document.getElementById('modal-actions');
        actions.innerHTML = `
            <a href="${proj.demoLink}" target="_blank" class="btn btn-primary">
                <span>Watch Video Demo</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </a>
            <a href="${proj.sourceLink}" target="_blank" class="btn btn-outline">
                <span>View Source</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
        `;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto'; // Unlock scrolling
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
}

/* ========================================
   SCROLL REVEAL ANIMATIONS
   ======================================== */
function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   COUNT-UP ANIMATION
   ======================================== */
function initCountUp() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const target = parseFloat(counter.dataset.count);
                        let current = 0;
                        const duration = 1500;
                        const steps = duration / 16;
                        const step = target / steps;

                        const update = () => {
                            current += step;
                            if (current < target) {
                                counter.textContent = Math.floor(current);
                                requestAnimationFrame(update);
                            } else {
                                counter.textContent = target;
                            }
                        };
                        update();
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) observer.observe(statsSection);
}

/* ========================================
   CONTACT FORM (Web3Forms / Formspree)
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('form-submit');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.disabled = true;
        status.textContent = '';
        status.className = 'form-status';

        const formData = new FormData(form);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const subject = formData.get('subject') || 'Portfolio Inquiry';
        const message = formData.get('message') || '';
        const mailtoUrl = `mailto:pradhansahil046@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;

        const action = form.getAttribute('action') || 'https://api.web3forms.com/submit';
        const isFormspree = action.includes('formspree.io');
        const accessKey = formData.get('access_key');

        // Check if Web3Forms access key is still default placeholder
        if (!isFormspree && (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE')) {
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
            status.innerHTML = `⚠️ Access key not configured yet. <a href="${mailtoUrl}" style="color: var(--accent-4); text-decoration: underline; font-weight: 600;">Click here to send directly via email</a>, or paste your free Web3Forms key in <code>index.html</code>.`;
            status.className = 'form-status error';
            return;
        }

        try {
            let response;
            if (isFormspree) {
                response = await fetch(action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
            } else {
                response = await fetch(action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
            }

            const data = await response.json();

            if (response.ok && (data.success || response.status === 200)) {
                status.textContent = '✅ Thank you! Your message has been sent successfully.';
                status.className = 'form-status success';
                form.reset();

                setTimeout(() => {
                    status.textContent = '';
                    status.className = 'form-status';
                }, 6000);
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (error) {
            status.innerHTML = `⚠️ ${error.message || 'Could not send message'}. <a href="${mailtoUrl}" style="color: var(--accent-4); text-decoration: underline; font-weight: 600;">Click here to send directly via email</a>.`;
            status.className = 'form-status error';
        } finally {
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
