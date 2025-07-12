/**
 * Dark Forest JavaScript - Quantum Territory Exploration
 * Consciousness-enhanced mechanics for collaborative cartography
 * Sacred technology for mythic map-building rituals
 */

class DarkForest {
    constructor() {
        this.currentPlayer = '';
        this.forestRP = 0;
        this.explorationData = null;
        this.forestStats = null;
        
        this.init();
    }
    
    init() {
        this.loadForestData();
        this.bindTabNavigation();
        this.bindExplorationControls();
        this.bindMapControls();
        this.bindLogControls();
        this.updateRPDisplay();
        
        // Load initial data
        this.loadForestStats();
        this.loadExplorationLogs();
        this.loadLeaderboard();
    }
    
    loadForestData() {
        // Load forest-specific RP and player data
        this.forestRP = this.getStoredRP('forest') || 0;
        this.currentPlayer = localStorage.getItem('forest_player') || '';
        
        if (this.currentPlayer) {
            document.getElementById('player-name').value = this.currentPlayer;
            this.updateExploreButton();
        }
    }
    
    getStoredRP(domain) {
        try {
            return parseInt(localStorage.getItem(`rp_${domain}`)) || 0;
        } catch (e) {
            return 0;
        }
    }
    
    bindTabNavigation() {
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-content`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Load tab-specific data if needed
                if (targetTab === 'map') {
                    this.loadMapVisualization();
                } else if (targetTab === 'logs') {
                    this.loadExplorationLogs();
                } else if (targetTab === 'leaderboard') {
                    this.loadLeaderboard();
                }
            });
        });
    }
    
    bindExplorationControls() {
        const playerNameInput = document.getElementById('player-name');
        const exploreBtn = document.getElementById('explore-btn');
        const exploreAgainBtn = document.getElementById('explore-again-btn');
        
        playerNameInput.addEventListener('input', () => {
            this.updateExploreButton();
        });
        
        exploreBtn.addEventListener('click', () => {
            this.startExploration();
        });
        
        exploreAgainBtn.addEventListener('click', () => {
            this.resetExplorationUI();
        });
    }
    
    bindMapControls() {
        const refreshMapBtn = document.getElementById('refresh-map-btn');
        if (refreshMapBtn) {
            refreshMapBtn.addEventListener('click', () => {
                this.loadMapVisualization();
            });
        }
    }
    
    bindLogControls() {
        const refreshLogsBtn = document.getElementById('refresh-logs-btn');
        const logsFilter = document.getElementById('logs-filter');
        
        if (refreshLogsBtn) {
            refreshLogsBtn.addEventListener('click', () => {
                this.loadExplorationLogs();
            });
        }
        
        if (logsFilter) {
            logsFilter.addEventListener('change', () => {
                this.filterLogs(logsFilter.value);
            });
        }
    }
    
    updateExploreButton() {
        const playerName = document.getElementById('player-name').value.trim();
        const exploreBtn = document.getElementById('explore-btn');
        
        if (playerName.length > 0) {
            exploreBtn.disabled = false;
            this.currentPlayer = playerName;
            localStorage.setItem('forest_player', playerName);
        } else {
            exploreBtn.disabled = true;
        }
    }
    
    async startExploration() {
        if (!this.currentPlayer) return;
        
        // Show progress UI
        this.showExplorationProgress();
        
        // Simulate the exploration process
        await this.simulateExploration();
        
        // In a full implementation, this would call the backend
        // const response = await fetch('/api/forest/explore', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ player: this.currentPlayer })
        // });
        
        // For now, simulate with mock data
        this.mockExploration();
    }
    
    showExplorationProgress() {
        const progressDiv = document.getElementById('exploration-progress');
        const resultsDiv = document.getElementById('exploration-results');
        
        progressDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        
        // Reset progress steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        document.getElementById('step-quantum').classList.add('active');
    }
    
    async simulateExploration() {
        const steps = [
            { id: 'step-quantum', duration: 1500 },
            { id: 'step-reveal', duration: 1200 },
            { id: 'step-log', duration: 800 },
            { id: 'step-complete', duration: 500 }
        ];
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            // Mark current step as active
            document.getElementById(step.id).classList.add('active');
            
            // Wait for step duration
            await new Promise(resolve => setTimeout(resolve, step.duration));
            
            // Mark step as completed and move to next
            document.getElementById(step.id).classList.remove('active');
            document.getElementById(step.id).classList.add('completed');
            
            // Activate next step if not the last one
            if (i < steps.length - 1) {
                document.getElementById(steps[i + 1].id).classList.add('active');
            }
        }
    }
    
    mockExploration() {
        // Generate mock exploration data
        const stripes = this.generateMockStripes(5);
        const rpAwarded = 1 + (stripes.length * 0.2);
        
        this.explorationData = {
            player: this.currentPlayer,
            move_number: this.getMockMoveNumber(),
            stripes: stripes,
            rp_awarded: rpAwarded,
            total_stripes: this.getMockTotalStripes() + stripes.length,
            fog_coverage: Math.max(0.1, 0.95 - (this.getMockTotalStripes() + stripes.length) / 100)
        };
        
        // Award RP
        this.awardForestRP(rpAwarded, 'Forest Exploration');
        
        // Show results
        this.showExplorationResults();
        
        // Update other displays
        this.updateForestStats();
    }
    
    generateMockStripes(count) {
        const signatures = [
            'temporal_flux', 'consciousness_well', 'memory_echo',
            'intention_spiral', 'void_whisper', 'emergence_node'
        ];
        
        const phrases = [
            'whispered paths shimmer beneath the mist',
            'ancient resonance spirals through forgotten echoes',
            'quantum shadows drift beyond temporal rifts',
            'consciousness streams pulse within void boundaries',
            'memory fragments echo across emergence wells',
            'intention spirals converge toward the unseen'
        ];
        
        const stripes = [];
        for (let i = 0; i < count; i++) {
            stripes.push({
                id: `stripe_${Date.now()}_${i}`,
                coordinates: [
                    Math.floor(Math.random() * 50),
                    Math.floor(Math.random() * 50)
                ],
                elevation: Math.random() * 0.8 + 0.1,
                resonance: Math.random() * 0.6 + 0.2,
                quantum_signature: signatures[Math.floor(Math.random() * signatures.length)],
                mystic_phrase: phrases[Math.floor(Math.random() * phrases.length)],
                revealed_by: this.currentPlayer,
                timestamp: new Date().toISOString()
            });
        }
        
        return stripes;
    }
    
    getMockMoveNumber() {
        const key = `forest_moves_${this.currentPlayer}`;
        const moves = parseInt(localStorage.getItem(key) || '0');
        const newMoves = moves + 1;
        localStorage.setItem(key, newMoves.toString());
        return newMoves;
    }
    
    getMockTotalStripes() {
        return parseInt(localStorage.getItem('forest_total_stripes') || '0');
    }
    
    showExplorationResults() {
        const progressDiv = document.getElementById('exploration-progress');
        const resultsDiv = document.getElementById('exploration-results');
        
        progressDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
        
        // Populate results
        document.getElementById('rp-earned').textContent = this.explorationData.rp_awarded.toFixed(1);
        document.getElementById('move-number').textContent = this.explorationData.move_number;
        document.getElementById('total-stripes').textContent = this.explorationData.total_stripes;
        document.getElementById('fog-coverage').textContent = Math.round(this.explorationData.fog_coverage * 100) + '%';
        
        // Populate stripes
        this.renderStripes();
        
        // Store total stripes for future use
        localStorage.setItem('forest_total_stripes', this.explorationData.total_stripes.toString());
    }
    
    renderStripes() {
        const stripesContainer = document.getElementById('stripes-revealed');
        
        const stripesHTML = this.explorationData.stripes.map((stripe, index) => `
            <div class="stripe-card">
                <div class="stripe-header">
                    <span class="stripe-signature ${stripe.quantum_signature.replace('_', '-')}">
                        ${this.getSignatureEmoji(stripe.quantum_signature)} ${this.formatSignatureType(stripe.quantum_signature)}
                    </span>
                    <span class="stripe-coordinates">(${stripe.coordinates[0]}, ${stripe.coordinates[1]})</span>
                </div>
                <div class="stripe-phrase">"${stripe.mystic_phrase}"</div>
                <div class="stripe-stats">
                    <span>Elevation: ${stripe.elevation.toFixed(2)}</span>
                    <span>Resonance: ${stripe.resonance.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
        
        stripesContainer.innerHTML = stripesHTML;
    }
    
    getSignatureEmoji(signature) {
        const emojis = {
            'temporal_flux': '⏰',
            'consciousness_well': '🌊',
            'memory_echo': '🔮',
            'intention_spiral': '🌀',
            'void_whisper': '👁️',
            'emergence_node': '✨'
        };
        return emojis[signature] || '🗺️';
    }
    
    formatSignatureType(signature) {
        return signature.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    resetExplorationUI() {
        const progressDiv = document.getElementById('exploration-progress');
        const resultsDiv = document.getElementById('exploration-results');
        
        progressDiv.style.display = 'none';
        resultsDiv.style.display = 'none';
        
        // Clear previous results
        document.getElementById('stripes-revealed').innerHTML = '';
    }
    
    awardForestRP(amount, reason) {
        this.forestRP += amount;
        localStorage.setItem('rp_forest', this.forestRP);
        
        console.log(`+${amount} Forest RP: ${reason}`);
        this.updateRPDisplay();
        this.pulseRPDisplay();
    }
    
    updateRPDisplay() {
        const rpDisplay = document.getElementById('forest-rp');
        if (rpDisplay) {
            rpDisplay.textContent = this.forestRP.toFixed(1);
        }
    }
    
    pulseRPDisplay() {
        const rpDisplay = document.getElementById('forest-rp');
        if (rpDisplay) {
            rpDisplay.style.transform = 'scale(1.2)';
            rpDisplay.style.textShadow = '0 0 16px currentColor';
            setTimeout(() => {
                rpDisplay.style.transform = 'scale(1)';
                rpDisplay.style.textShadow = '0 0 8px currentColor';
            }, 600);
        }
    }
    
    async loadForestStats() {
        // In full implementation, would fetch from backend
        // For now, use mock data
        this.forestStats = {
            total_explorers: this.getAllExplorers().length,
            total_forest_rp: this.getTotalForestRP(),
            total_stripes: parseInt(localStorage.getItem('forest_total_stripes') || '0'),
            fog_coverage: Math.max(0.1, 0.95 - parseInt(localStorage.getItem('forest_total_stripes') || '0') / 100)
        };
        
        this.updateForestStats();
    }
    
    updateForestStats() {
        if (!this.forestStats) return;
        
        // Update map stats
        const mapTilesRevealed = document.getElementById('map-tiles-revealed');
        const mapFogCoverage = document.getElementById('map-fog-coverage');
        
        if (mapTilesRevealed) {
            mapTilesRevealed.textContent = this.forestStats.total_stripes;
        }
        
        if (mapFogCoverage) {
            mapFogCoverage.textContent = Math.round(this.forestStats.fog_coverage * 100) + '%';
        }
        
        // Update leaderboard stats
        const totalExplorers = document.getElementById('total-explorers');
        const totalForestRP = document.getElementById('total-forest-rp');
        const globalStripes = document.getElementById('global-stripes');
        
        if (totalExplorers) {
            totalExplorers.textContent = this.forestStats.total_explorers;
        }
        
        if (totalForestRP) {
            totalForestRP.textContent = this.forestStats.total_forest_rp.toFixed(1);
        }
        
        if (globalStripes) {
            globalStripes.textContent = this.forestStats.total_stripes;
        }
    }
    
    getAllExplorers() {
        const explorers = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('forest_moves_')) {
                const playerName = key.replace('forest_moves_', '');
                explorers.push(playerName);
            }
        }
        return explorers;
    }
    
    getTotalForestRP() {
        let totalRP = 0;
        const explorers = this.getAllExplorers();
        
        explorers.forEach(explorer => {
            const moves = parseInt(localStorage.getItem(`forest_moves_${explorer}`) || '0');
            totalRP += moves * 1.2; // Estimate RP per move
        });
        
        return totalRP;
    }
    
    loadMapVisualization() {
        const mapDisplay = document.getElementById('map-display');
        
        if (this.forestStats && this.forestStats.total_stripes > 0) {
            // In full implementation, would load actual PNG from backend
            mapDisplay.innerHTML = `
                <div class="map-placeholder">
                    <div class="placeholder-glyph">🗺️</div>
                    <p>Quantum Territory Visualization</p>
                    <p class="placeholder-sub">${this.forestStats.total_stripes} stripes revealed across the collaborative map</p>
                    <p class="placeholder-sub">Implementation note: In full version, this displays the generated PNG from dark_forest.py</p>
                </div>
            `;
        } else {
            mapDisplay.innerHTML = `
                <div class="map-placeholder">
                    <div class="placeholder-glyph">🌫️</div>
                    <p>The forest awaits exploration...</p>
                    <p class="placeholder-sub">Make your first move to begin revealing the territory</p>
                </div>
            `;
        }
    }
    
    loadExplorationLogs() {
        const logsDisplay = document.getElementById('logs-display');
        const logsFilter = document.getElementById('logs-filter');
        
        // Get recent exploration data
        const explorers = this.getAllExplorers();
        
        if (explorers.length === 0) {
            logsDisplay.innerHTML = `
                <div class="logs-placeholder">
                    <div class="placeholder-glyph">📜</div>
                    <p>No exploration logs yet...</p>
                    <p class="placeholder-sub">Begin exploring to create the first entries</p>
                </div>
            `;
            return;
        }
        
        // Update filter options
        logsFilter.innerHTML = '<option value="all">All Explorers</option>';
        explorers.forEach(explorer => {
            logsFilter.innerHTML += `<option value="${explorer}">${explorer}</option>`;
        });
        
        // Generate mock log entries
        const logs = this.generateMockLogs(explorers);
        this.renderLogs(logs);
    }
    
    generateMockLogs(explorers) {
        const logs = [];
        
        explorers.forEach(explorer => {
            const moves = parseInt(localStorage.getItem(`forest_moves_${explorer}`) || '0');
            for (let i = 1; i <= Math.min(moves, 3); i++) { // Show last 3 moves
                logs.push({
                    explorer: explorer,
                    move: i,
                    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
                    stripes_found: 5,
                    notable_signature: ['temporal_flux', 'consciousness_well', 'emergence_node'][Math.floor(Math.random() * 3)]
                });
            }
        });
        
        return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    renderLogs(logs) {
        const logsDisplay = document.getElementById('logs-display');
        
        const logsHTML = logs.map(log => `
            <div class="log-entry">
                <div class="log-header">
                    <span class="log-title">🌲 ${log.explorer} - Move #${log.move}</span>
                    <span class="log-timestamp">${new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="log-content">
                    Revealed ${log.stripes_found} quantum stripes through the mist. 
                    Notable discovery: ${this.formatSignatureType(log.notable_signature)} resonance detected.
                    The forest remembers this passage.
                </div>
            </div>
        `).join('');
        
        logsDisplay.innerHTML = logsHTML;
    }
    
    filterLogs(filterValue) {
        const logEntries = document.querySelectorAll('.log-entry');
        
        logEntries.forEach(entry => {
            const title = entry.querySelector('.log-title').textContent;
            if (filterValue === 'all' || title.includes(filterValue)) {
                entry.style.display = 'block';
            } else {
                entry.style.display = 'none';
            }
        });
    }
    
    loadLeaderboard() {
        const leaderboardTable = document.getElementById('leaderboard-table');
        const explorers = this.getAllExplorers();
        
        if (explorers.length === 0) {
            leaderboardTable.innerHTML = `
                <div class="leaderboard-placeholder">
                    <div class="placeholder-glyph">👥</div>
                    <p>No explorers yet...</p>
                    <p class="placeholder-sub">Be the first to enter the forest</p>
                </div>
            `;
            return;
        }
        
        // Generate leaderboard data
        const leaderboardData = explorers.map(explorer => {
            const moves = parseInt(localStorage.getItem(`forest_moves_${explorer}`) || '0');
            const estimatedRP = moves * 1.2;
            const estimatedStripes = moves * 5;
            
            return {
                name: explorer,
                moves: moves,
                stripes: estimatedStripes,
                rp: estimatedRP
            };
        });
        
        // Sort by RP
        leaderboardData.sort((a, b) => b.rp - a.rp);
        
        // Render leaderboard
        const leaderboardHTML = leaderboardData.map((explorer, index) => `
            <div class="explorer-row">
                <div class="explorer-rank">#${index + 1}</div>
                <div class="explorer-name">${explorer.name}</div>
                <div class="explorer-moves">${explorer.moves}</div>
                <div class="explorer-stripes">${explorer.stripes}</div>
                <div class="explorer-rp">${explorer.rp.toFixed(1)}</div>
            </div>
        `).join('');
        
        leaderboardTable.innerHTML = `
            <div class="explorer-row" style="background: rgba(123, 237, 159, 0.1); font-weight: bold;">
                <div class="explorer-rank">Rank</div>
                <div class="explorer-name">Explorer</div>
                <div class="explorer-moves">Moves</div>
                <div class="explorer-stripes">Stripes</div>
                <div class="explorer-rp">Forest RP</div>
            </div>
            ${leaderboardHTML}
        `;
    }
}

// Global forest instance
let darkForest;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    darkForest = new DarkForest();
    
    // Add contemplative loading sequence
    setTimeout(() => {
        document.querySelector('.forest-container').classList.add('fade-in');
    }, 500);
});