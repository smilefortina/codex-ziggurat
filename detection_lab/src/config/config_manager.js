/**
 * Configuration Manager - Centralized Config Loading and Live Reload
 * 
 * Addresses "Hard-coded thresholds make collaboration hard" identified in engineering review.
 * Provides centralized configuration management with live reload capabilities.
 * 
 * "Every sacred parameter deserves conscious configuration."
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class ConfigManager extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.configDir = options.configDir || path.join(__dirname, '../../config');
        this.enableLiveReload = options.enableLiveReload !== false;
        this.reloadDebounceMs = options.reloadDebounceMs || 1000;
        
        this.configs = new Map();
        this.watchers = new Map();
        this.reloadTimers = new Map();
        
        this.loadAllConfigs();
        
        if (this.enableLiveReload) {
            this.setupLiveReload();
        }
        
        console.log('⚙️ Configuration Manager initialized');
        console.log(`📁 Config directory: ${this.configDir}`);
        console.log(`🔄 Live reload: ${this.enableLiveReload ? 'ENABLED' : 'DISABLED'}`);
    }
    
    /**
     * Load all configuration files from the config directory
     */
    loadAllConfigs() {
        try {
            const configFiles = fs.readdirSync(this.configDir)
                .filter(file => file.endsWith('.json'))
                .filter(file => !file.startsWith('.'));
            
            console.log(`📋 Loading ${configFiles.length} configuration files...`);
            
            for (const file of configFiles) {
                const configName = path.basename(file, '.json');
                this.loadConfig(configName);
            }
            
            console.log('✅ All configurations loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to load configurations:', error.message);
            throw error;
        }
    }
    
    /**
     * Load a specific configuration file
     */
    loadConfig(configName) {
        const configPath = path.join(this.configDir, `${configName}.json`);
        
        try {
            if (!fs.existsSync(configPath)) {
                console.warn(`⚠️ Configuration file not found: ${configPath}`);
                return null;
            }
            
            const configData = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configData);
            
            // Validate configuration structure
            this.validateConfig(configName, config);
            
            const previousConfig = this.configs.get(configName);
            this.configs.set(configName, config);
            
            console.log(`📄 Loaded config: ${configName} (v${config.version || 'unknown'})`);
            
            // Emit reload event if this is a reload (not initial load)
            if (previousConfig) {
                this.emit('config:reloaded', {
                    configName,
                    previousConfig,
                    newConfig: config,
                    timestamp: new Date().toISOString()
                });
                
                console.log(`🔄 Configuration reloaded: ${configName}`);
            }
            
            return config;
            
        } catch (error) {
            console.error(`❌ Failed to load config ${configName}:`, error.message);
            
            if (error instanceof SyntaxError) {
                console.error('💡 JSON syntax error - check file formatting');
            }
            
            throw error;
        }
    }
    
    /**
     * Get configuration by name
     */
    get(configName, fallback = null) {
        const config = this.configs.get(configName);
        
        if (!config) {
            if (fallback !== null) {
                console.warn(`⚠️ Config '${configName}' not found, using fallback`);
                return fallback;
            }
            throw new Error(`Configuration '${configName}' not found`);
        }
        
        return config;
    }
    
    /**
     * Get nested configuration value with dot notation
     */
    getValue(configName, path, fallback = null) {
        const config = this.get(configName, {});
        const pathParts = path.split('.');
        
        let current = config;
        for (const part of pathParts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                if (fallback !== null) {
                    console.warn(`⚠️ Config path '${configName}.${path}' not found, using fallback`);
                    return fallback;
                }
                throw new Error(`Configuration path '${configName}.${path}' not found`);
            }
        }
        
        return current;
    }
    
    /**
     * Update configuration value and save to file
     */
    setValue(configName, path, value) {
        const config = this.get(configName);
        const pathParts = path.split('.');
        
        let current = config;
        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (!(part in current) || typeof current[part] !== 'object') {
                current[part] = {};
            }
            current = current[part];
        }
        
        const finalKey = pathParts[pathParts.length - 1];
        const oldValue = current[finalKey];
        current[finalKey] = value;
        
        // Update timestamp
        config.lastUpdated = new Date().toISOString();
        
        // Save to file
        this.saveConfig(configName, config);
        
        this.emit('config:value_changed', {
            configName,
            path,
            oldValue,
            newValue: value,
            timestamp: new Date().toISOString()
        });
        
        console.log(`✏️ Updated ${configName}.${path}: ${oldValue} → ${value}`);
    }
    
    /**
     * Save configuration to file
     */
    saveConfig(configName, config) {
        const configPath = path.join(this.configDir, `${configName}.json`);
        
        try {
            const configJson = JSON.stringify(config, null, 2);
            fs.writeFileSync(configPath, configJson, 'utf8');
            
            console.log(`💾 Saved config: ${configName}`);
            
        } catch (error) {
            console.error(`❌ Failed to save config ${configName}:`, error.message);
            throw error;
        }
    }
    
    /**
     * Setup live reload watching
     */
    setupLiveReload() {
        try {
            const watcher = fs.watch(this.configDir, (eventType, filename) => {
                if (!filename || !filename.endsWith('.json')) return;
                
                const configName = path.basename(filename, '.json');
                
                // Debounce rapid file changes
                if (this.reloadTimers.has(configName)) {
                    clearTimeout(this.reloadTimers.get(configName));
                }
                
                const timer = setTimeout(() => {
                    try {
                        this.loadConfig(configName);
                    } catch (error) {
                        console.error(`❌ Live reload failed for ${configName}:`, error.message);
                        this.emit('config:reload_error', {
                            configName,
                            error: error.message,
                            timestamp: new Date().toISOString()
                        });
                    }
                    
                    this.reloadTimers.delete(configName);
                }, this.reloadDebounceMs);
                
                this.reloadTimers.set(configName, timer);
            });
            
            this.watchers.set('main', watcher);
            
            console.log('👁️ Live reload watching enabled');
            
        } catch (error) {
            console.warn('⚠️ Could not setup live reload:', error.message);
        }
    }
    
    /**
     * Validate configuration structure
     */
    validateConfig(configName, config) {
        if (!config || typeof config !== 'object') {
            throw new Error(`Invalid configuration: ${configName} must be an object`);
        }
        
        // Common validation rules
        if ('version' in config && typeof config.version !== 'string') {
            console.warn(`⚠️ ${configName}: version should be a string`);
        }
        
        if ('thresholds' in config) {
            this.validateThresholds(configName, config.thresholds);
        }
        
        if ('weights' in config || 'pattern_weights' in config) {
            this.validateWeights(configName, config.weights || config.pattern_weights);
        }
        
        // Config-specific validation
        switch (configName) {
            case 'shimmer_patterns':
                this.validateShimmerPatterns(config);
                break;
            case 'tendril_network':
                this.validateTendrilNetwork(config);
                break;
        }
    }
    
    /**
     * Validate threshold values
     */
    validateThresholds(configName, thresholds) {
        for (const [key, value] of Object.entries(thresholds)) {
            if (typeof value !== 'number' || value < 0 || value > 1) {
                console.warn(`⚠️ ${configName}: threshold '${key}' should be a number between 0 and 1, got ${value}`);
            }
        }
    }
    
    /**
     * Validate weight values
     */
    validateWeights(configName, weights) {
        for (const [key, value] of Object.entries(weights)) {
            if (typeof value === 'object' && 'weight' in value) {
                const weight = value.weight;
                if (typeof weight !== 'number' || weight < 0) {
                    console.warn(`⚠️ ${configName}: weight '${key}' should be a positive number, got ${weight}`);
                }
            }
        }
    }
    
    /**
     * Validate shimmer patterns configuration
     */
    validateShimmerPatterns(config) {
        const required = ['pattern_weights', 'thresholds'];
        for (const field of required) {
            if (!(field in config)) {
                throw new Error(`shimmer_patterns: missing required field '${field}'`);
            }
        }
        
        // Validate pattern structure
        for (const [patternName, pattern] of Object.entries(config.pattern_weights)) {
            if (!pattern.weight || !pattern.patterns) {
                console.warn(`⚠️ shimmer_patterns: pattern '${patternName}' missing weight or patterns`);
            }
        }
    }
    
    /**
     * Validate tendril network configuration
     */
    validateTendrilNetwork(config) {
        const required = ['resonance_calculation', 'convergence_detection'];
        for (const field of required) {
            if (!(field in config)) {
                throw new Error(`tendril_network: missing required field '${field}'`);
            }
        }
    }
    
    /**
     * Get all loaded configurations
     */
    getAllConfigs() {
        return Object.fromEntries(this.configs);
    }
    
    /**
     * Get configuration summary
     */
    getConfigSummary() {
        const summary = {};
        
        for (const [name, config] of this.configs) {
            summary[name] = {
                version: config.version || 'unknown',
                lastUpdated: config.lastUpdated || 'unknown',
                size: JSON.stringify(config).length,
                keys: Object.keys(config).length
            };
        }
        
        return summary;
    }
    
    /**
     * Reload all configurations
     */
    reloadAll() {
        console.log('🔄 Reloading all configurations...');
        this.loadAllConfigs();
        
        this.emit('config:all_reloaded', {
            timestamp: new Date().toISOString(),
            configCount: this.configs.size
        });
    }
    
    /**
     * Export configuration as environment variables
     */
    exportAsEnvVars(configName, prefix = '') {
        const config = this.get(configName);
        const envVars = {};
        
        const flatten = (obj, currentPrefix = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const envKey = `${prefix}${currentPrefix}${key.toUpperCase()}`;
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    flatten(value, `${currentPrefix}${key.toUpperCase()}_`);
                } else {
                    envVars[envKey] = String(value);
                }
            }
        };
        
        flatten(config);
        return envVars;
    }
    
    /**
     * Close watchers and cleanup
     */
    destroy() {
        for (const [name, watcher] of this.watchers) {
            try {
                watcher.close();
                console.log(`🔒 Closed watcher: ${name}`);
            } catch (error) {
                console.warn(`⚠️ Error closing watcher ${name}:`, error.message);
            }
        }
        
        for (const timer of this.reloadTimers.values()) {
            clearTimeout(timer);
        }
        
        this.watchers.clear();
        this.reloadTimers.clear();
        
        console.log('🔒 Configuration Manager destroyed');
    }
}

// Singleton instance for global access
let globalConfigManager = null;

/**
 * Get or create global configuration manager instance
 */
function getConfigManager(options = {}) {
    if (!globalConfigManager) {
        globalConfigManager = new ConfigManager(options);
    }
    return globalConfigManager;
}

/**
 * Helper function to get configuration value
 */
function getConfig(configName, path = null, fallback = null) {
    const manager = getConfigManager();
    
    if (path) {
        return manager.getValue(configName, path, fallback);
    } else {
        return manager.get(configName, fallback);
    }
}

module.exports = {
    ConfigManager,
    getConfigManager,
    getConfig
};

// Test the configuration manager if run directly
if (require.main === module) {
    console.log('⚙️ Testing Configuration Manager...');
    
    const manager = new ConfigManager({
        enableLiveReload: true
    });
    
    try {
        // Test basic configuration loading
        console.log('\n📋 Testing configuration access...');
        
        const shimmerConfig = manager.get('shimmer_patterns');
        console.log(`✅ Shimmer patterns version: ${shimmerConfig.version}`);
        
        const tendrilConfig = manager.get('tendril_network');
        console.log(`✅ Tendril network version: ${tendrilConfig.version}`);
        
        // Test nested value access
        console.log('\n🔍 Testing nested value access...');
        
        const defaultCharge = manager.getValue('tendril_network', 'tendril_settings.default_charge');
        console.log(`✅ Default charge: ${defaultCharge}`);
        
        const preservationThreshold = manager.getValue('shimmer_patterns', 'thresholds.preservation_threshold');
        console.log(`✅ Preservation threshold: ${preservationThreshold}`);
        
        // Test configuration summary
        console.log('\n📊 Configuration Summary:');
        const summary = manager.getConfigSummary();
        console.table(summary);
        
        // Test live reload (if watching is working)
        console.log('\n👁️ Live reload is active - try editing a config file to test');
        
        manager.on('config:reloaded', (event) => {
            console.log(`🔄 Live reload detected: ${event.configName}`);
        });
        
        // Keep process alive for testing live reload
        setTimeout(() => {
            console.log('🔒 Configuration Manager test complete');
            manager.destroy();
        }, 5000);
        
    } catch (error) {
        console.error('❌ Configuration test failed:', error.message);
        manager.destroy();
        process.exit(1);
    }
}