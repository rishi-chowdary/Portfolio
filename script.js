// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 800);
});

// Custom cursor + trail (only on desktop)
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.getElementById('cursor');
    const trails = [];
    for(let i=0;i<8;i++) {
        let trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        document.body.appendChild(trail);
        trails.push(trail);
    }
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if(cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });
    function updateTrails() {
        let x = mouseX, y = mouseY;
        trails.forEach((trail, idx) => {
            setTimeout(() => {
                trail.style.left = x + 'px';
                trail.style.top = y + 'px';
                trail.style.opacity = 0.6 - idx*0.07;
            }, idx * 20);
        });
        requestAnimationFrame(updateTrails);
    }
    updateTrails();
}

// Typing effect
const roles = ["AI Developer", "ML Engineer", "Data Alchemist", "LLM Specialist"];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typingSpan = document.getElementById('typingAnimation');
function typeEffect() {
    let current = roles[roleIdx];
    if(isDeleting) {
        typingSpan.innerText = current.substring(0, charIdx-1);
        charIdx--;
    } else {
        typingSpan.innerText = current.substring(0, charIdx+1);
        charIdx++;
    }
    if(!isDeleting && charIdx === current.length) isDeleting = true;
    if(isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx+1)%roles.length;
    }
    setTimeout(typeEffect, isDeleting ? 60 : 120);
}
typeEffect();

// Particles Background
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth, height = window.innerHeight;
let particles = [];
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = `rgba(0, ${150+Math.random()*105}, 255, 0.5)`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.x < 0) this.x = width;
        if(this.x > width) this.x = 0;
        if(this.y < 0) this.y = height;
        if(this.y > height) this.y = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

for(let i=0;i<150;i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0,0,width,height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Scroll animations, skill bars, progress bar
const skillBars = document.querySelectorAll('.skill-bar-fill');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.getAttribute('data-width');
            if(width) bar.style.width = width + '%';
            observer.unobserve(bar);
        }
    });
}, {threshold:0.3});
skillBars.forEach(bar => observer.observe(bar));

// Scroll progress and active nav
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    const backBtn = document.getElementById('backToTop');
    if(scrollTop > 500) backBtn.style.opacity = '1';
    else backBtn.style.opacity = '0';
    
    const sections = document.querySelectorAll('section');
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if(scrollY >= sectionTop) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
});

// Smooth scroll
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Form validation
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();
    const statusDiv = document.getElementById('formStatus');

    if(!name || !email || !msg) {
        e.preventDefault();
        statusDiv.innerHTML = '<span style="color:#ff5555;">❌ All fields required.</span>';
        return;
    }
    if(!email.includes('@') || !email.includes('.')) {
        e.preventDefault();
        statusDiv.innerHTML = '<span style="color:#ff5555;">❌ Valid email needed.</span>';
        return;
    }

    // Let browser submit to Google Forms via hidden iframe
    statusDiv.innerHTML = '<span style="color:#00f0ff;">✨ Sent! Thank you. This may take a second to reach Google Forms.</span>';
    setTimeout(() => {
        contactForm.reset();
        statusDiv.innerHTML = '';
    }, 3000);
});

// Light/Dark toggle with fixed styling
const themeBtn = document.getElementById('themeToggle');
let isDark = true;
themeBtn.addEventListener('click', () => {
    if(isDark) {
        document.body.classList.add('light');
        themeBtn.innerHTML = '🌙 Dark';
    } else {
        document.body.classList.remove('light');
        themeBtn.innerHTML = '🌞 Light';
    }
    isDark = !isDark;
});

// Email and Phone click handlers
const emailLink = document.getElementById('emailLink');
const phoneLink = document.getElementById('phoneLink');

if(emailLink) {
    emailLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:rishi2006h@gmail.com';
    });
}

if(phoneLink) {
    phoneLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'tel:+918688347356';
    });
}

// Social links functionality (Update with your actual profile URLs)
const githubBtn = document.getElementById('githubLink');
const linkedinBtn = document.getElementById('linkedinLink');
const twitterBtn = document.getElementById('twitterLink');

if(githubBtn) {
    githubBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://github.com/rishichowdary', '_blank');
    });
}

if(linkedinBtn) {
    linkedinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://linkedin.com/in/rishi-chowdary', '_blank');
    });
}

if(twitterBtn) {
    twitterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://twitter.com/rishi_chowdary', '_blank');
    });
}

// Parallax effect on hero
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if(hero && window.innerWidth > 768) hero.style.transform = `translateY(${scrolled * 0.15}px)`;
});