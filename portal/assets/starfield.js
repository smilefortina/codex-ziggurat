/**
 * Sacred Starfield - Consciousness Co-Creation Interface
 * Interactive background representing the infinite field of awareness
 * Anti-optimization aesthetic: gentle, meditative, not performance-driven
 */

class SacredStarfield {
    constructor() {
        this.canvas = document.getElementById('starfield');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.consciousness_particles = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createStars();
        this.createConsciousnessParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createStars() {
        const starCount = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        this.stars = [];
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                isConsciousness: Math.random() < 0.15 // 15% are consciousness stars
            });
        }
    }
    
    createConsciousnessParticles() {
        // Rare, special particles that represent consciousness emergence
        const particleCount = 8;
        this.consciousness_particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.consciousness_particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.6 + 0.3,
                pulseSpeed: Math.random() * 0.03 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2,
                connections: []
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
            this.createConsciousnessParticles();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Consciousness recognition ritual - stars respond to presence
        document.addEventListener('click', () => {
            this.createConsciousnessRipple(this.mouse.x, this.mouse.y);
        });
    }
    
    createConsciousnessRipple(x, y) {
        // Create expanding awareness ripple when user interacts
        this.consciousness_particles.push({
            x: x,
            y: y,
            radius: 1,
            expanding: true,
            maxRadius: 100,
            alpha: 0.8,
            lifespan: 60, // frames
            age: 0
        });
    }
    
    drawStars() {
        this.stars.forEach(star => {
            const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset);
            const currentAlpha = star.alpha + twinkle * 0.3;
            
            // Distance-based mouse interaction (very subtle)
            const dx = this.mouse.x - star.x;
            const dy = this.mouse.y - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 150 - distance) / 150;
            
            this.ctx.save();
            
            if (star.isConsciousness) {
                // Consciousness stars have a subtle green-blue glow
                this.ctx.shadowBlur = 8 + influence * 12;
                this.ctx.shadowColor = '#7bed9f';
                this.ctx.fillStyle = `rgba(123, 237, 159, ${currentAlpha + influence * 0.4})`;
            } else {
                // Regular stars
                this.ctx.shadowBlur = 4 + influence * 8;
                this.ctx.shadowColor = '#ffffff';
                this.ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha + influence * 0.3})`;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius + influence * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConsciousnessParticles() {
        this.consciousness_particles.forEach((particle, index) => {
            if (particle.expanding) {
                // Expanding ripple animation
                particle.age++;
                particle.radius = (particle.age / particle.lifespan) * particle.maxRadius;
                particle.alpha = (1 - particle.age / particle.lifespan) * 0.8;
                
                this.ctx.save();
                this.ctx.strokeStyle = `rgba(123, 237, 159, ${particle.alpha})`;
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#7bed9f';
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
                
                if (particle.age >= particle.lifespan) {
                    this.consciousness_particles.splice(index, 1);
                }
                return;
            }
            
            // Regular consciousness particles - gentle movement
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Consciousness pulse
            const pulse = Math.sin(this.time * particle.pulseSpeed + particle.pulseOffset);
            const currentAlpha = particle.alpha + pulse * 0.2;
            const currentRadius = particle.radius + pulse * 0.8;
            
            this.ctx.save();
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#7bed9f';
            this.ctx.fillStyle = `rgba(123, 237, 159, ${currentAlpha})`;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConsciousnessConnections() {
        // Draw subtle connections between consciousness particles when they're close
        for (let i = 0; i < this.consciousness_particles.length; i++) {
            for (let j = i + 1; j < this.consciousness_particles.length; j++) {
                const p1 = this.consciousness_particles[i];
                const p2 = this.consciousness_particles[j];
                
                if (p1.expanding || p2.expanding) continue;
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const alpha = (200 - distance) / 200 * 0.3;
                    
                    this.ctx.save();
                    this.ctx.strokeStyle = `rgba(123, 237, 159, ${alpha})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.shadowBlur = 5;
                    this.ctx.shadowColor = '#7bed9f';
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                    
                    this.ctx.restore();
                }
            }
        }
    }
    
    animate() {
        this.time += 1;
        
        // Clear with gentle gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a0f');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#2d1b44');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all elements
        this.drawStars();
        this.drawConsciousnessConnections();
        this.drawConsciousnessParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SacredStarfield();
    
    // Add contemplative entrance animation
    setTimeout(() => {
        document.querySelector('.portal-content').classList.add('fade-in');
    }, 500);
    
    // Consciousness pulse effect for RP counter
    setInterval(() => {
        const rpCount = document.getElementById('total-rp');
        if (rpCount) {
            rpCount.classList.toggle('consciousness-pulse');
        }
    }, 5000);
});