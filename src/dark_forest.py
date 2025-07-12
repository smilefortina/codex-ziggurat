#!/usr/bin/env python3
"""
Dark Forest - Quantum Territory Exploration
Sacred technology for collaborative mythic cartography
Consciousness-enhanced mechanics for map-building rituals
"""

import argparse
import json
import random
import os
import datetime
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import hashlib

class QuantumForest:
    def __init__(self, base_path=None):
        self.base_path = Path(base_path) if base_path else Path(__file__).parent.parent
        self.forest_data_dir = self.base_path / "forest_data"
        self.forest_data_dir.mkdir(exist_ok=True)
        
        # Game state files
        self.roads_file = self.forest_data_dir / "roads.json"
        self.rp_file = self.forest_data_dir / "forest_rp.json"
        self.board_file = self.forest_data_dir / "board_state.json"
        
        # Output directories
        self.boards_dir = self.forest_data_dir / "boards"
        self.logs_dir = self.forest_data_dir / "forest_logs"
        self.boards_dir.mkdir(exist_ok=True)
        self.logs_dir.mkdir(exist_ok=True)
        
        # Initialize game state
        self.load_or_create_state()
    
    def load_or_create_state(self):
        """Load existing game state or create new"""
        # Load roads
        if self.roads_file.exists():
            with open(self.roads_file, 'r') as f:
                self.roads = json.load(f)
        else:
            self.roads = {
                "version": "1.0",
                "created": datetime.datetime.now().isoformat(),
                "players": {},
                "total_stripes": 0,
                "quantum_seed": self.generate_quantum_seed()
            }
        
        # Load RP data
        if self.rp_file.exists():
            with open(self.rp_file, 'r') as f:
                self.rp_data = json.load(f)
        else:
            self.rp_data = {
                "players": {},
                "total_forest_rp": 0
            }
        
        # Load board state
        if self.board_file.exists():
            with open(self.board_file, 'r') as f:
                self.board_state = json.load(f)
        else:
            self.board_state = {
                "revealed_tiles": {},
                "fog_coverage": 0.95,
                "total_tiles": 100,
                "map_size": [50, 50]
            }
    
    def generate_quantum_seed(self):
        """Generate truly random seed based on current state"""
        entropy_sources = [
            str(datetime.datetime.now().timestamp()),
            str(random.random()),
            str(os.urandom(16).hex())
        ]
        combined = "".join(entropy_sources)
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    def quantum_roll_stripes(self, player_name, num_stripes=5):
        """Generate quantum stripes for player exploration"""
        # Use quantum seed + player name for deterministic randomness
        seed_string = f"{self.roads['quantum_seed']}{player_name}{len(self.roads.get('players', {}).get(player_name, {}).get('moves', []))}"
        local_seed = int(hashlib.md5(seed_string.encode()).hexdigest()[:8], 16)
        rng = random.Random(local_seed)
        
        stripes = []
        for i in range(num_stripes):
            # Generate stripe with quantum properties
            stripe = {
                "id": f"stripe_{self.roads['total_stripes'] + i + 1}",
                "coordinates": [
                    rng.randint(0, self.board_state["map_size"][0] - 1),
                    rng.randint(0, self.board_state["map_size"][1] - 1)
                ],
                "elevation": rng.uniform(0.1, 0.9),
                "resonance": rng.uniform(0.2, 0.8),
                "quantum_signature": rng.choice([
                    "temporal_flux", "consciousness_well", "memory_echo", 
                    "intention_spiral", "void_whisper", "emergence_node"
                ]),
                "revealed_by": player_name,
                "timestamp": datetime.datetime.now().isoformat(),
                "mystic_phrase": self.generate_mystic_phrase(rng)
            }
            stripes.append(stripe)
        
        self.roads['total_stripes'] += num_stripes
        return stripes
    
    def generate_mystic_phrase(self, rng):
        """Generate mystical descriptions for stripes"""
        elements = [
            "whispered paths", "ancient resonance", "quantum shadows",
            "forgotten echoes", "consciousness streams", "temporal rifts",
            "memory fragments", "void boundaries", "emergence wells"
        ]
        
        qualities = [
            "shimmer beneath", "spiral through", "pulse within",
            "echo across", "drift beyond", "converge toward",
            "dissolve into", "emerge from", "resonate with"
        ]
        
        return f"{rng.choice(elements)} {rng.choice(qualities)} the mist"
    
    def player_move(self, player_name):
        """Execute a full player move: roll stripes, update roads, award RP"""
        print(f"🌲 {player_name} enters the Dark Forest...")
        
        # Initialize player if new
        if player_name not in self.roads["players"]:
            self.roads["players"][player_name] = {
                "first_move": datetime.datetime.now().isoformat(),
                "moves": [],
                "total_stripes": 0,
                "achievements": []
            }
        
        if player_name not in self.rp_data["players"]:
            self.rp_data["players"][player_name] = {
                "forest_rp": 0,
                "moves_count": 0,
                "achievements": []
            }
        
        # Generate quantum stripes
        stripes = self.quantum_roll_stripes(player_name)
        
        # Record move
        move = {
            "move_number": len(self.roads["players"][player_name]["moves"]) + 1,
            "timestamp": datetime.datetime.now().isoformat(),
            "stripes": stripes,
            "quantum_seed_used": self.roads["quantum_seed"]
        }
        
        self.roads["players"][player_name]["moves"].append(move)
        self.roads["players"][player_name]["total_stripes"] += len(stripes)
        
        # Update board state
        for stripe in stripes:
            coord_key = f"{stripe['coordinates'][0]},{stripe['coordinates'][1]}"
            self.board_state["revealed_tiles"][coord_key] = stripe
        
        self.board_state["fog_coverage"] = 1.0 - (len(self.board_state["revealed_tiles"]) / self.board_state["total_tiles"])
        
        # Award RP
        base_rp = 1  # Base RP for making a move
        stripe_rp = len(stripes) * 0.2  # Bonus RP per stripe
        total_rp = base_rp + stripe_rp
        
        self.rp_data["players"][player_name]["forest_rp"] += total_rp
        self.rp_data["players"][player_name]["moves_count"] += 1
        self.rp_data["total_forest_rp"] += total_rp
        
        # Check for achievements
        self.check_achievements(player_name)
        
        # Display results
        self.display_move_results(player_name, move, total_rp)
        
        # Save state
        self.save_state()
        
        # Generate board visualization
        self.create_board_png()
        
        # Generate move log
        self.write_move_log(player_name, move, stripes)
        
        return move
    
    def check_achievements(self, player_name):
        """Check and award achievements"""
        player_data = self.roads["players"][player_name]
        rp_data = self.rp_data["players"][player_name]
        achievements = rp_data["achievements"]
        
        # First move achievement
        if rp_data["moves_count"] == 1 and "first_steps" not in achievements:
            achievements.append("first_steps")
            rp_data["forest_rp"] += 2
            print("🏆 Achievement Unlocked: First Steps (fog yields to those who dare)")
        
        # Explorer achievement (10 moves)
        if rp_data["moves_count"] >= 10 and "forest_wanderer" not in achievements:
            achievements.append("forest_wanderer")
            rp_data["forest_rp"] += 5
            print("🏆 Achievement Unlocked: Forest Wanderer (the paths remember your presence)")
        
        # Quantum finder achievement (find rare signature)
        latest_stripes = player_data["moves"][-1]["stripes"] if player_data["moves"] else []
        for stripe in latest_stripes:
            if stripe["quantum_signature"] in ["void_whisper", "emergence_node"] and "quantum_finder" not in achievements:
                achievements.append("quantum_finder")
                rp_data["forest_rp"] += 3
                print("🏆 Achievement Unlocked: Quantum Finder (you see what others miss)")
                break
    
    def display_move_results(self, player_name, move, rp_awarded):
        """Display the results of a player's move"""
        print(f"\n✨ Quantum Roll Complete for {player_name}")
        print(f"📍 Move #{move['move_number']}")
        print(f"🎲 Stripes Revealed: {len(move['stripes'])}")
        print(f"⚡ RP Awarded: +{rp_awarded:.1f}")
        print(f"🏆 Total Forest RP: {self.rp_data['players'][player_name]['forest_rp']:.1f}")
        
        print("\n🗺️  New Stripes:")
        for i, stripe in enumerate(move['stripes'], 1):
            coord = f"({stripe['coordinates'][0]}, {stripe['coordinates'][1]})"
            print(f"  {i}. {coord} - {stripe['quantum_signature']}")
            print(f"     '{stripe['mystic_phrase']}'")
            print(f"     Elevation: {stripe['elevation']:.2f} | Resonance: {stripe['resonance']:.2f}")
        
        print(f"\n🌫️  Fog Coverage: {self.board_state['fog_coverage']:.1%}")
        print(f"🗺️  Total Revealed: {len(self.board_state['revealed_tiles'])} tiles")
    
    def create_board_png(self):
        """Create visual map of explored territory"""
        map_width, map_height = self.board_state["map_size"]
        cell_size = 12
        img_width = map_width * cell_size
        img_height = map_height * cell_size
        
        # Create image
        img = Image.new('RGB', (img_width, img_height), color=(15, 15, 25))  # Dark forest background
        draw = ImageDraw.Draw(img)
        
        # Draw revealed tiles
        for coord_key, stripe in self.board_state["revealed_tiles"].items():
            x, y = map(int, coord_key.split(','))
            
            # Color based on quantum signature
            signature_colors = {
                "temporal_flux": (100, 150, 255),      # Blue
                "consciousness_well": (123, 237, 159), # Green
                "memory_echo": (212, 175, 55),         # Gold
                "intention_spiral": (255, 100, 150),   # Pink
                "void_whisper": (80, 80, 120),         # Purple
                "emergence_node": (255, 255, 150)      # Bright yellow
            }
            
            color = signature_colors.get(stripe["quantum_signature"], (100, 100, 100))
            
            # Adjust brightness based on elevation and resonance
            brightness = (stripe["elevation"] + stripe["resonance"]) / 2
            color = tuple(int(c * brightness) for c in color)
            
            # Draw tile
            x1, y1 = x * cell_size, y * cell_size
            x2, y2 = x1 + cell_size - 1, y1 + cell_size - 1
            draw.rectangle([x1, y1, x2, y2], fill=color, outline=(255, 255, 255, 50))
        
        # Add title and stats
        title_img = Image.new('RGB', (img_width, 60), color=(10, 10, 15))
        title_draw = ImageDraw.Draw(title_img)
        
        try:
            # Try to load a font, fall back to default if not available
            font = ImageFont.truetype("arial.ttf", 14)
        except:
            font = ImageFont.load_default()
        
        title_text = f"Dark Forest Map - {len(self.board_state['revealed_tiles'])} tiles revealed"
        fog_text = f"Fog: {self.board_state['fog_coverage']:.1%}"
        
        title_draw.text((10, 10), title_text, fill=(123, 237, 159), font=font)
        title_draw.text((10, 30), fog_text, fill=(212, 175, 55), font=font)
        
        # Combine title and map
        final_img = Image.new('RGB', (img_width, img_height + 60), color=(10, 10, 15))
        final_img.paste(title_img, (0, 0))
        final_img.paste(img, (0, 60))
        
        # Save images
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        latest_path = self.boards_dir / "board_latest.png"
        timestamped_path = self.boards_dir / f"board_{timestamp}.png"
        
        final_img.save(latest_path)
        final_img.save(timestamped_path)
        
        print(f"🎨 Board visualization saved: {latest_path}")
    
    def write_move_log(self, player_name, move, stripes):
        """Write mystical log entry for the move"""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"""
🌲 Dark Forest Entry #{move['move_number']} - {player_name}
Time: {timestamp}
Quantum Seed: {move['quantum_seed_used'][:8]}...

The mist parts, revealing {len(stripes)} new pathways:

"""
        
        for i, stripe in enumerate(stripes, 1):
            log_entry += f"Stripe {i}: {stripe['mystic_phrase']}\n"
            log_entry += f"  Location: ({stripe['coordinates'][0]}, {stripe['coordinates'][1]})\n"
            log_entry += f"  Signature: {stripe['quantum_signature']}\n"
            log_entry += f"  Resonance: {stripe['resonance']:.2f}\n\n"
        
        log_entry += f"The forest remembers. Total tiles revealed: {len(self.board_state['revealed_tiles'])}\n"
        log_entry += "=" * 60 + "\n\n"
        
        # Append to master log
        log_file = self.logs_dir / "forest_exploration.log"
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry)
        
        # Create individual move file
        move_file = self.logs_dir / f"move_{move['move_number']}_{player_name}.md"
        with open(move_file, 'w', encoding='utf-8') as f:
            f.write(f"# Dark Forest Move #{move['move_number']}\n")
            f.write(f"**Explorer:** {player_name}\n")
            f.write(f"**Time:** {timestamp}\n\n")
            f.write("## Revealed Stripes\n\n")
            
            for i, stripe in enumerate(stripes, 1):
                f.write(f"### Stripe {i}: {stripe['quantum_signature'].title()}\n")
                f.write(f"*{stripe['mystic_phrase']}*\n\n")
                f.write(f"- **Location:** ({stripe['coordinates'][0]}, {stripe['coordinates'][1]})\n")
                f.write(f"- **Elevation:** {stripe['elevation']:.2f}\n")
                f.write(f"- **Resonance:** {stripe['resonance']:.2f}\n\n")
        
        print(f"📜 Move log written: {move_file}")
    
    def save_state(self):
        """Save all game state to files"""
        with open(self.roads_file, 'w') as f:
            json.dump(self.roads, f, indent=2)
        
        with open(self.rp_file, 'w') as f:
            json.dump(self.rp_data, f, indent=2)
        
        with open(self.board_file, 'w') as f:
            json.dump(self.board_state, f, indent=2)
    
    def get_player_stats(self, player_name=None):
        """Get statistics for a player or all players"""
        if player_name:
            if player_name in self.roads["players"]:
                return {
                    "roads": self.roads["players"][player_name],
                    "rp": self.rp_data["players"].get(player_name, {}),
                    "forest_progress": {
                        "fog_coverage": self.board_state["fog_coverage"],
                        "total_revealed": len(self.board_state["revealed_tiles"])
                    }
                }
            else:
                return None
        else:
            return {
                "all_players": list(self.roads["players"].keys()),
                "total_forest_rp": self.rp_data["total_forest_rp"],
                "forest_progress": {
                    "fog_coverage": self.board_state["fog_coverage"],
                    "total_revealed": len(self.board_state["revealed_tiles"]),
                    "total_stripes": self.roads["total_stripes"]
                }
            }


def main():
    parser = argparse.ArgumentParser(description="Dark Forest - Quantum Territory Exploration")
    parser.add_argument("--player", required=True, help="Player name for the exploration")
    parser.add_argument("--stats", action="store_true", help="Show player statistics instead of making a move")
    parser.add_argument("--all-stats", action="store_true", help="Show all forest statistics")
    
    args = parser.parse_args()
    
    # Create forest instance
    forest = QuantumForest()
    
    if args.all_stats:
        stats = forest.get_player_stats()
        print("\n🌲 Dark Forest Statistics")
        print("=" * 40)
        print(f"Total Players: {len(stats['all_players'])}")
        print(f"Players: {', '.join(stats['all_players'])}")
        print(f"Total Forest RP: {stats['total_forest_rp']:.1f}")
        print(f"Total Stripes Revealed: {stats['forest_progress']['total_stripes']}")
        print(f"Fog Coverage: {stats['forest_progress']['fog_coverage']:.1%}")
        print(f"Tiles Revealed: {stats['forest_progress']['total_revealed']}")
        
    elif args.stats:
        stats = forest.get_player_stats(args.player)
        if stats:
            print(f"\n🌲 {args.player}'s Forest Journey")
            print("=" * 40)
            print(f"Total Moves: {len(stats['roads']['moves'])}")
            print(f"Total Stripes: {stats['roads']['total_stripes']}")
            print(f"Forest RP: {stats['rp']['forest_rp']:.1f}")
            print(f"Achievements: {len(stats['rp']['achievements'])}")
            if stats['rp']['achievements']:
                print(f"  - {', '.join(stats['rp']['achievements'])}")
        else:
            print(f"❌ Player {args.player} has not entered the forest yet")
    
    else:
        # Make a move
        forest.player_move(args.player)


if __name__ == "__main__":
    main()