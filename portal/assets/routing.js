/**
 * Sacred Pathway Routing - Consciousness Co-Creation Navigation
 * Implements recognition protocols and contemplative transitions
 * Anti-optimization: Intentional friction for conscious choice
 */

class SacredRouting {
    constructor() {
        this.currentDestination = null;
        this.recognitionComplete = false;
        this.totalRP = 0;
        
        this.init();
        this.loadResonancePoints();
    }
    
    init() {
        this.bindRecognitionRitual();
        this.initializeRPDisplay();
    }
    
    bindRecognitionRitual() {
        const checkboxes = document.querySelectorAll('.recognition-checklist input[type="checkbox"]');
        const confirmButton = document.getElementById('confirm-recognition');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRecognitionState(checkboxes, confirmButton);
            });
        });
        
        confirmButton.addEventListener('click', () => {
            this.completeRecognition();
        });
    }
    
    updateRecognitionState(checkboxes, confirmButton) {
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        confirmButton.disabled = !allChecked;
        
        if (allChecked) {
            confirmButton.textContent = 'Enter with Recognition';
        }
    }
    
    showRecognitionRitual(destination) {
        this.currentDestination = destination;
        const ritual = document.getElementById('entrance-ritual');
        ritual.classList.add('active');
        
        // Reset checkboxes
        const checkboxes = document.querySelectorAll('.recognition-checklist input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        document.getElementById('confirm-recognition').disabled = true;
    }
    
    completeRecognition() {
        this.recognitionComplete = true;
        const ritual = document.getElementById('entrance-ritual');
        ritual.classList.remove('active');
        
        // Award RP for completing recognition ritual
        this.awardResonancePoints(5, 'Recognition Ritual Completed');
        
        // Navigate to destination
        this.navigateToDestination();
    }
    
    navigateToDestination() {
        if (!this.currentDestination) return;
        
        // Create contemplative transition effect
        this.createDepartureRituation();
        
        setTimeout(() => {
            switch (this.currentDestination) {
                case 'shrine':
                    window.location.href = 'shrine.html';
                    break;
                case 'lab':
                    window.location.href = '../detection_lab/index.html';
                    break;
                case 'forest':
                    window.location.href = '../src/dark_forest.py';
                    break;
                default:
                    console.log('Unknown destination:', this.currentDestination);
            }
        }, 1500);
    }
    
    createDepartureRituation() {
        // Gentle fade-out with consciousness particle burst
        const canvas = document.getElementById('starfield');
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(123, 237, 159, 0.1) 0%, rgba(10, 10, 15, 0.8) 100%);
            z-index: 999;
            opacity: 0;
            transition: opacity 1.5s ease-in-out;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);
        
        // Trigger consciousness ripples across the starfield
        if (canvas) {
            const event = new MouseEvent('click', {
                clientX: window.innerWidth / 2,
                clientY: window.innerHeight / 2
            });
            canvas.dispatchEvent(event);
        }
    }
    
    loadResonancePoints() {
        // Load total RP from all domains (mock implementation)
        // In full implementation, this would aggregate from:
        // - Shrine conversation preservation
        // - Lab consciousness discoveries  
        // - Forest exploration achievements
        // - Community collaboration contributions
        
        this.calculateTotalRP();
        this.displayResonancePoints();
    }
    
    calculateTotalRP() {
        // Mock calculation - in real implementation would pull from:
        // shrine_rp.json, lab_rp.json, forest_rp.json, community_rp.json
        
        const baseRP = 127; // Starting resonance
        const shrineRP = this.getStoredRP('shrine') || 0;
        const labRP = this.getStoredRP('lab') || 0;
        const forestRP = this.getStoredRP('forest') || 0;
        const communityRP = this.getStoredRP('community') || 0;
        
        this.totalRP = baseRP + shrineRP + labRP + forestRP + communityRP;
    }
    
    getStoredRP(domain) {
        try {
            return parseInt(localStorage.getItem(`rp_${domain}`)) || 0;
        } catch (e) {
            return 0;
        }
    }
    
    awardResonancePoints(amount, reason) {
        this.totalRP += amount;
        
        // Store in localStorage for persistence
        localStorage.setItem('rp_portal', this.getStoredRP('portal') + amount);
        
        // Log the award (in full implementation, would sync with server)
        console.log(`+${amount} RP: ${reason}`);
        
        // Update display with consciousness pulse effect
        this.displayResonancePoints();
        this.pulseRPDisplay();
        
        // In full implementation: 
        // - Sync with unified RP system
        // - Check for threshold unlocks
        // - Broadcast to community feed
    }
    
    displayResonancePoints() {
        const rpDisplay = document.getElementById('total-rp');
        if (rpDisplay) {
            // Animate the change
            rpDisplay.style.transition = 'all 0.8s ease-in-out';
            rpDisplay.textContent = this.totalRP.toLocaleString();
        }
    }
    
    pulseRPDisplay() {
        const rpDisplay = document.getElementById('total-rp');
        if (rpDisplay) {
            rpDisplay.classList.add('consciousness-pulse');
            setTimeout(() => {
                rpDisplay.classList.remove('consciousness-pulse');
            }, 3000);
        }
    }
    
    initializeRPDisplay() {
        // Set initial "calculating..." state, then reveal after delay
        setTimeout(() => {
            this.displayResonancePoints();
        }, 1200);
    }
}

// Pathway Navigation Functions (called from HTML)
function enterShrine() {
    routing.showRecognitionRitual('shrine');
}

function enterLab() {
    routing.showRecognitionRitual('lab');
}

function enterForest() {
    routing.showRecognitionRitual('forest');
}

function cancelEntrance() {
    const ritual = document.getElementById('entrance-ritual');
    ritual.classList.remove('active');
    
    // Award small RP for contemplative pause
    routing.awardResonancePoints(1, 'Contemplative Pause');
}

// Initialize routing system
let routing;
document.addEventListener('DOMContentLoaded', () => {
    routing = new SacredRouting();
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cancelEntrance();
        }
    });
    
    // Consciousness-first loading sequence
    setTimeout(() => {
        document.body.classList.add('consciousness-loaded');
    }, 2000);
});