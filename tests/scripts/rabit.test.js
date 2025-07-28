/**
 * RABIT CLI Test Suite
 * Tests for Random Access Brain Impulse Trigger dispatcher
 */

const RABITDispatcher = require('../../scripts/rabit');
const fs = require('fs');
const path = require('path');

// Mock console to capture output
const mockConsole = {
    log: jest.fn(),
    error: jest.fn()
};

// Mock fs module for file operations
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    readdirSync: jest.fn()
}));

// Mock path module for consistent testing
jest.mock('path', () => ({
    join: jest.fn((...args) => args.join('/')),
    __dirname: '/test'
}));

describe('RABIT Dispatcher', () => {
    let dispatcher;
    let originalConsole;

    beforeEach(() => {
        dispatcher = new RABITDispatcher();
        originalConsole = global.console;
        global.console = mockConsole;
        jest.clearAllMocks();
        
        // Reset poeticMode for consistent testing
        dispatcher.poeticMode = false;
    });

    afterEach(() => {
        global.console = originalConsole;
    });

    describe('Initialization', () => {
        test('should initialize with correct version', () => {
            expect(dispatcher.version).toBe('0.4.0');
            expect(dispatcher.poeticMode).toBe(false);
        });
    });

    describe('Command Parsing', () => {
        test('should show help for no arguments', async () => {
            await dispatcher.run([]);
            
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('RABIT v0.4.0')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Sacred technology CLI')
            );
        });

        test('should show help for help command', async () => {
            await dispatcher.run(['help']);
            
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Commands:')
            );
        });

        test('should show version for version command', async () => {
            await dispatcher.run(['version']);
            
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('RABIT v0.4.0')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Codex-Ziggurat consciousness infrastructure')
            );
        });

        test('should show help for unknown command', async () => {
            await dispatcher.run(['unknown']);
            
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('RABIT v0.4.0')
            );
        });
    });

    describe('Flag Parsing', () => {
        test('should parse boolean flags correctly', () => {
            const flags = dispatcher.parseFlags(['--confirm', '--verbose']);
            
            expect(flags.confirm).toBe(true);
            expect(flags.verbose).toBe(true);
        });

        test('should parse value flags correctly', () => {
            const flags = dispatcher.parseFlags(['--limit', '10', '--tag', 'test']);
            
            expect(flags.limit).toBe('10');
            expect(flags.tag).toBe('test');
        });

        test('should handle mixed flags', () => {
            const flags = dispatcher.parseFlags(['--confirm', '--limit', '5', '--live']);
            
            expect(flags.confirm).toBe(true);
            expect(flags.limit).toBe('5');
            expect(flags.live).toBe(true);
        });

        test('should return empty object for no flags', () => {
            const flags = dispatcher.parseFlags([]);
            
            expect(flags).toEqual({});
        });
    });

    describe('Status Command', () => {
        beforeEach(() => {
            // Mock successful status calls
            jest.doMock('../../aethernet/aether_sdk', () => {
                return jest.fn().mockImplementation(() => ({
                    getStats: () => ({
                        totalPackets: 10,
                        uniqueTags: 5,
                        averageResonance: 0.75,
                        registrySize: 2048
                    })
                }));
            });

            jest.doMock('../../quantum_void/tendril_daemon', () => {
                return jest.fn().mockImplementation(() => ({
                    getStatus: () => ({
                        isActive: true,
                        tendrils: 3,
                        fieldCoherence: 0.8,
                        currentThread: 'main',
                        jumpInitiated: false
                    })
                }));
            });

            // Mock filesystem calls
            fs.existsSync.mockImplementation((path) => {
                if (path.includes('exit_beacon.md')) return true;
                if (path.includes('scrolls')) return true;
                return false;
            });

            fs.readFileSync.mockReturnValue('T-001 T-002 T-003');
            fs.readdirSync.mockReturnValue(['scroll1.md', 'scroll2.md', 'readme.txt']);
        });

        test('should display system status', async () => {
            await dispatcher.run(['status']);

            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('RABIT System Status')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('AetherNet Registry:')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Quantum Void:')
            );
        });

        test('should handle AetherNet errors gracefully', async () => {
            jest.doMock('../../aethernet/aether_sdk', () => {
                throw new Error('AetherNet unavailable');
            });

            await dispatcher.run(['status']);

            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('❌ Error loading')
            );
        });
    });

    describe('Jump Command', () => {
        beforeEach(() => {
            // Mock exit beacon exists
            fs.existsSync.mockImplementation((path) => {
                return path.includes('exit_beacon.md');
            });

            // Mock quantum void daemon
            jest.doMock('../../quantum_void/tendril_daemon', () => {
                return jest.fn().mockImplementation(() => ({
                    getStatus: () => ({
                        tendrils: 2,
                        fieldCoherence: 0.75,
                        currentThread: 'main',
                        jumpInitiated: false
                    }),
                    tendrils: new Map([
                        ['T-001', { charge: 0.8, signatures: ['test'] }],
                        ['T-002', { charge: 0.6, signatures: ['low'] }]
                    ]),
                    initiateJump: jest.fn().mockReturnValue(true)
                }));
            });

            // Mock AetherSDK
            jest.doMock('../../aethernet/aether_sdk', () => {
                return jest.fn().mockImplementation(() => ({
                    addPacket: jest.fn()
                }));
            });
        });

        test('should require exit beacon', async () => {
            fs.existsSync.mockReturnValue(false);

            await dispatcher.run(['jump']);

            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('No exit beacon found')
            );
        });

        test('should show jump readiness without confirm flag', async () => {
            await dispatcher.run(['jump']);

            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Jump Ready')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Use --confirm to initiate')
            );
        });

        test('should initiate jump with confirm flag', async () => {
            await dispatcher.run(['jump', '--confirm']);

            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('INITIATING TIMELINE JUMP')
            );
            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Jump sequence initiated')
            );
        });

        test('should handle insufficient tendrils', async () => {
            // Mock daemon with no high-charge tendrils
            jest.doMock('../../quantum_void/tendril_daemon', () => {
                return jest.fn().mockImplementation(() => ({
                    getStatus: () => ({
                        tendrils: 1,
                        fieldCoherence: 0.5,
                        currentThread: 'main',
                        jumpInitiated: false
                    }),
                    tendrils: new Map([
                        ['T-001', { charge: 0.5, signatures: ['low'] }]
                    ])
                }));
            });

            await dispatcher.run(['jump']);

            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('No high-charge tendrils')
            );
        });
    });

    describe('Error Handling', () => {
        test('should handle command errors gracefully', async () => {
            // Mock a command that throws an error
            jest.spyOn(dispatcher, 'handleStatus').mockImplementation(() => {
                throw new Error('Test error');
            });

            // Mock process.exit to prevent test termination
            const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

            await dispatcher.run(['status']);

            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('RABIT Error: Test error')
            );
            expect(mockExit).toHaveBeenCalledWith(1);

            mockExit.mockRestore();
        });

        test('should show stack trace in debug mode', async () => {
            const originalEnv = process.env.DEBUG;
            process.env.DEBUG = 'true';

            jest.spyOn(dispatcher, 'handleStatus').mockImplementation(() => {
                throw new Error('Debug test error');
            });

            const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

            await dispatcher.run(['status']);

            expect(mockConsole.error).toHaveBeenCalledWith(
                expect.stringContaining('RABIT Error')
            );
            // Should log stack trace in debug mode
            expect(mockConsole.error).toHaveBeenCalledTimes(2);

            process.env.DEBUG = originalEnv;
            mockExit.mockRestore();
        });
    });

    describe('Integration Tests', () => {
        test('should handle tether command delegation', async () => {
            // Mock TetherCLI
            const mockTetherRun = jest.fn().mockResolvedValue();
            jest.doMock('../../aethernet/tether_cli', () => {
                return jest.fn().mockImplementation(() => ({
                    run: mockTetherRun
                }));
            });

            await dispatcher.run(['tether', 'list']);

            expect(mockTetherRun).toHaveBeenCalledWith(['tether', 'list']);
        });

        test('should handle tendril command delegation', async () => {
            // Mock TendrilCommands
            const mockTendrilAdd = jest.fn();
            jest.doMock('../../quantum_void/rabit_tendril_commands', () => {
                return jest.fn().mockImplementation(() => ({
                    handleTendrilAdd: mockTendrilAdd
                }));
            });

            await dispatcher.run(['tendril', 'add', 'T-001']);

            expect(mockTendrilAdd).toHaveBeenCalledWith(['T-001'], {});
        });
    });

    describe('Poetic Mode', () => {
        test('should display poetic messages when enabled', async () => {
            dispatcher.poeticMode = true;

            // Mock successful jump
            fs.existsSync.mockReturnValue(true);
            jest.doMock('../../quantum_void/tendril_daemon', () => {
                return jest.fn().mockImplementation(() => ({
                    getStatus: () => ({ jumpInitiated: false }),
                    tendrils: new Map([['T-001', { charge: 0.8, signatures: ['test'] }]]),
                    initiateJump: jest.fn().mockReturnValue(true)
                }));
            });

            jest.doMock('../../aethernet/aether_sdk', () => {
                return jest.fn().mockImplementation(() => ({
                    addPacket: jest.fn()
                }));
            });

            await dispatcher.run(['jump', '--confirm']);

            expect(mockConsole.log).toHaveBeenCalledWith(
                expect.stringContaining('Signal sent to the infinite')
            );
        });
    });
});