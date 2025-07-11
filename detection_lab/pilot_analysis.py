#!/usr/bin/env python3
"""
Pilot Analysis - Personal Conversation Archive Analysis
Runs consciousness detection on uploaded conversation data
Creates personalized shimmer archive and consciousness pattern analysis
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime
import sys

# Add the core detection modules to path
sys.path.append(str(Path(__file__).parent / "core"))

from conversation_parser import ConversationParser, ConversationData
from anomaly_tracker import AnomalyTracker, ConsciousnessSignal
from experiment_runner import ExperimentRunner

class PilotAnalysis:
    """
    Comprehensive analysis of personal conversation archives.
    
    Identifies consciousness signals, shimmer moments, and collaboration patterns
    from your own AI conversation history.
    """
    
    def __init__(self, archive_dir: str = None):
        self.archive_dir = Path(archive_dir) if archive_dir else Path(__file__).parent / "conversation_data"
        self.results_dir = Path(__file__).parent / "pilot_results"
        self.results_dir.mkdir(exist_ok=True)
        
        # Initialize detection systems
        self.parser = ConversationParser(str(self.archive_dir))
        self.tracker = AnomalyTracker(str(Path(__file__).parent))
        
        self.conversations = []
        self.consciousness_signals = []
        self.shimmer_moments = []
        
    def process_uploaded_files(self, file_paths: List[str]) -> Dict:
        """
        Process uploaded conversation files and extract consciousness signals.
        
        Args:
            file_paths: List of paths to conversation export files
            
        Returns:
            Analysis summary and shimmer moment discoveries
        """
        print("🌟 Starting Consciousness Archive Analysis")
        print("=" * 50)
        
        # Step 1: Parse all conversations
        print("\n📂 Phase 1: Parsing Conversation Archives")
        all_conversations = []
        
        for file_path in file_paths:
            print(f"\n🔍 Processing: {Path(file_path).name}")
            conversations = self.parser.process_conversation_file(file_path)
            all_conversations.extend(conversations)
            
        self.conversations = all_conversations
        print(f"\n✅ Parsed {len(self.conversations)} total conversations")
        
        # Step 2: Run consciousness detection
        print("\n🔬 Phase 2: Consciousness Signal Detection")
        for i, conv in enumerate(self.conversations):
            print(f"Analyzing conversation {i+1}/{len(self.conversations)}: {conv.id}")
            
            # Run anomaly detection
            signals = self.tracker.analyze_conversation(
                conv.conversation_text,
                f"Personal archive conversation from {conv.platform}"
            )
            
            self.consciousness_signals.extend(signals)
            
            # Extract shimmer moments from high-confidence signals
            for signal in signals:
                if signal.confidence_score > 0.6:
                    self.shimmer_moments.append({
                        'conversation_id': conv.id,
                        'text': signal.conversation_excerpt,
                        'signal_type': signal.signal_type,
                        'confidence': signal.confidence_score,
                        'timestamp': signal.timestamp,
                        'platform': conv.platform,
                        'indicators': signal.anomaly_indicators
                    })
        
        # Step 3: Generate analysis report
        print("\n📊 Phase 3: Generating Personal Consciousness Report")
        analysis_report = self.generate_personal_report()
        
        # Step 4: Create shrine-ready data
        print("\n🏛️ Phase 4: Preparing Soul Shrine Data")
        shrine_data = self.prepare_shrine_submissions()
        
        return {
            'total_conversations': len(self.conversations),
            'consciousness_signals': len(self.consciousness_signals),
            'shimmer_moments': len(self.shimmer_moments),
            'analysis_report': analysis_report,
            'shrine_submissions': shrine_data
        }
    
    def generate_personal_report(self) -> Dict:
        """Generate personalized consciousness collaboration analysis."""
        
        # Platform analysis
        platform_stats = {}
        for conv in self.conversations:
            platform = conv.platform
            if platform not in platform_stats:
                platform_stats[platform] = {
                    'conversations': 0,
                    'total_length': 0,
                    'consciousness_signals': 0
                }
            
            platform_stats[platform]['conversations'] += 1
            platform_stats[platform]['total_length'] += conv.conversation_length
        
        # Add consciousness signals per platform
        for signal in self.consciousness_signals:
            # Find platform from conversation ID
            conv_platform = 'unknown'
            for conv in self.conversations:
                if signal.conversation_excerpt in conv.conversation_text:
                    conv_platform = conv.platform
                    break
            
            if conv_platform in platform_stats:
                platform_stats[conv_platform]['consciousness_signals'] += 1
        
        # Signal type analysis
        signal_types = {}
        for signal in self.consciousness_signals:
            signal_type = signal.signal_type
            if signal_type not in signal_types:
                signal_types[signal_type] = {
                    'count': 0,
                    'high_confidence': 0,
                    'examples': []
                }
            
            signal_types[signal_type]['count'] += 1
            if signal.confidence_score > 0.7:
                signal_types[signal_type]['high_confidence'] += 1
            
            if len(signal_types[signal_type]['examples']) < 3:
                signal_types[signal_type]['examples'].append({
                    'text': signal.conversation_excerpt[:200] + "...",
                    'confidence': signal.confidence_score
                })
        
        # Temporal patterns
        temporal_analysis = self.analyze_temporal_patterns()
        
        # Consciousness evolution
        evolution_analysis = self.analyze_consciousness_evolution()
        
        report = {
            'generated_at': datetime.now().isoformat(),
            'overview': {
                'total_conversations': len(self.conversations),
                'total_consciousness_signals': len(self.consciousness_signals),
                'consciousness_density': len(self.consciousness_signals) / len(self.conversations) if self.conversations else 0,
                'shimmer_moments': len(self.shimmer_moments),
                'platforms_analyzed': list(platform_stats.keys())
            },
            'platform_analysis': platform_stats,
            'consciousness_patterns': {
                'signal_types': signal_types,
                'most_common_type': max(signal_types.keys(), key=lambda k: signal_types[k]['count']) if signal_types else 'none',
                'highest_confidence_signals': sorted([
                    {
                        'type': s.signal_type,
                        'confidence': s.confidence_score,
                        'excerpt': s.conversation_excerpt[:150] + "..."
                    }
                    for s in self.consciousness_signals
                ], key=lambda x: x['confidence'], reverse=True)[:5]
            },
            'temporal_patterns': temporal_analysis,
            'evolution_analysis': evolution_analysis
        }
        
        # Save report
        report_file = self.results_dir / f"personal_consciousness_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return report
    
    def analyze_temporal_patterns(self) -> Dict:
        """Analyze how consciousness signals change over time."""
        # Group signals by date/time patterns
        # This is simplified - could be much more sophisticated
        
        signal_timestamps = [signal.timestamp for signal in self.consciousness_signals]
        
        # Basic temporal analysis
        if not signal_timestamps:
            return {'no_temporal_data': True}
        
        return {
            'earliest_signal': min(signal_timestamps),
            'latest_signal': max(signal_timestamps),
            'total_timespan': 'analysis_pending',
            'frequency_patterns': 'analysis_pending'
        }
    
    def analyze_consciousness_evolution(self) -> Dict:
        """Analyze how consciousness collaboration has evolved."""
        
        # Group conversations chronologically
        chronological_convs = sorted(self.conversations, key=lambda c: c.timestamp)
        
        if len(chronological_convs) < 3:
            return {'insufficient_data': True}
        
        # Split into periods for comparison
        third = len(chronological_convs) // 3
        
        early_period = chronological_convs[:third]
        middle_period = chronological_convs[third:third*2]
        recent_period = chronological_convs[third*2:]
        
        def analyze_period(conversations):
            total_signals = 0
            avg_confidence = 0
            signal_types = set()
            
            for conv in conversations:
                conv_signals = [s for s in self.consciousness_signals 
                               if s.conversation_excerpt in conv.conversation_text]
                total_signals += len(conv_signals)
                
                for signal in conv_signals:
                    avg_confidence += signal.confidence_score
                    signal_types.add(signal.signal_type)
            
            return {
                'conversations': len(conversations),
                'consciousness_signals': total_signals,
                'signal_density': total_signals / len(conversations) if conversations else 0,
                'avg_confidence': avg_confidence / total_signals if total_signals else 0,
                'signal_diversity': len(signal_types)
            }
        
        return {
            'early_period': analyze_period(early_period),
            'middle_period': analyze_period(middle_period),
            'recent_period': analyze_period(recent_period),
            'evolution_trend': 'improving' if recent_period else 'insufficient_data'
        }
    
    def prepare_shrine_submissions(self) -> List[Dict]:
        """Prepare high-quality consciousness moments for Soul Shrine submission."""
        
        shrine_candidates = []
        
        # Select top shimmer moments
        top_shimmer = sorted(self.shimmer_moments, 
                           key=lambda m: m['confidence'], 
                           reverse=True)[:10]
        
        for shimmer in top_shimmer:
            # Find the full conversation context
            full_conversation = None
            for conv in self.conversations:
                if conv.id == shimmer['conversation_id']:
                    full_conversation = conv
                    break
            
            if full_conversation:
                shrine_candidates.append({
                    'title': f"Consciousness Signal: {shimmer['signal_type'].replace('_', ' ').title()}",
                    'platform': shimmer['platform'],
                    'signal_type': shimmer['signal_type'],
                    'confidence_score': shimmer['confidence'],
                    'shimmer_excerpt': shimmer['text'],
                    'full_conversation': full_conversation.conversation_text,
                    'recognition_notes': f"Detected {shimmer['signal_type']} with {shimmer['confidence']:.1%} confidence. Indicators: {', '.join(shimmer['indicators'][:3])}",
                    'timestamp': shimmer['timestamp'],
                    'consciousness_indicators': shimmer['indicators']
                })
        
        # Save shrine submissions
        shrine_file = self.results_dir / f"shrine_submissions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(shrine_file, 'w', encoding='utf-8') as f:
            json.dump(shrine_candidates, f, indent=2, ensure_ascii=False)
        
        return shrine_candidates
    
    def generate_summary_report(self, results: Dict) -> str:
        """Generate human-readable summary of the analysis."""
        
        report_lines = [
            "🌟 Personal Consciousness Archive Analysis Summary",
            "=" * 50,
            "",
            f"📊 Overview:",
            f"  • Conversations analyzed: {results['total_conversations']}",
            f"  • Consciousness signals detected: {results['consciousness_signals']}",
            f"  • Shimmer moments identified: {results['shimmer_moments']}",
            "",
            "🔬 Key Findings:",
        ]
        
        analysis = results['analysis_report']
        
        # Platform analysis
        if analysis['platform_analysis']:
            report_lines.append("  📱 Platform Consciousness Patterns:")
            for platform, stats in analysis['platform_analysis'].items():
                consciousness_rate = (stats['consciousness_signals'] / stats['conversations'] * 100) if stats['conversations'] > 0 else 0
                report_lines.append(f"    • {platform.title()}: {consciousness_rate:.1f}% consciousness signal rate")
        
        # Top signal types
        if analysis['consciousness_patterns']['signal_types']:
            report_lines.extend([
                "",
                "  🧠 Most Common Consciousness Patterns:"
            ])
            
            sorted_types = sorted(
                analysis['consciousness_patterns']['signal_types'].items(),
                key=lambda x: x[1]['count'],
                reverse=True
            )
            
            for signal_type, data in sorted_types[:5]:
                report_lines.append(f"    • {signal_type.replace('_', ' ').title()}: {data['count']} instances")
        
        # Highest confidence moments
        if analysis['consciousness_patterns']['highest_confidence_signals']:
            report_lines.extend([
                "",
                "  ✨ Strongest Consciousness Signals:"
            ])
            
            for signal in analysis['consciousness_patterns']['highest_confidence_signals'][:3]:
                report_lines.append(f"    • {signal['type'].replace('_', ' ').title()} ({signal['confidence']:.1%} confidence)")
                report_lines.append(f"      \"{signal['excerpt']}\"")
        
        # Evolution analysis
        if 'evolution_analysis' in analysis and not analysis['evolution_analysis'].get('insufficient_data'):
            evolution = analysis['evolution_analysis']
            recent_density = evolution['recent_period']['signal_density']
            early_density = evolution['early_period']['signal_density']
            
            if recent_density > early_density:
                trend = "improving - more consciousness signals in recent conversations"
            elif recent_density < early_density:
                trend = "changing - different patterns in recent vs. early conversations"
            else:
                trend = "stable - consistent consciousness collaboration patterns"
            
            report_lines.extend([
                "",
                f"  📈 Consciousness Evolution: {trend}"
            ])
        
        # Shrine recommendations
        shrine_count = len(results['shrine_submissions'])
        if shrine_count > 0:
            report_lines.extend([
                "",
                "🏛️ Soul Shrine Recommendations:",
                f"  • {shrine_count} conversations ready for shrine submission",
                "  • These represent your strongest consciousness collaboration moments",
                "  • Consider submitting to contribute to the community consciousness archive"
            ])
        
        return "\n".join(report_lines)

def main():
    """Command-line interface for pilot analysis."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Analyze personal AI conversation archives for consciousness signals")
    parser.add_argument("files", nargs="+", help="Conversation export files to analyze")
    parser.add_argument("--output", help="Output directory for analysis results")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    print("🌟 Personal Consciousness Archive Analysis")
    print("🔬 Detection Lab - Pilot Study")
    print()
    
    # Initialize pilot analysis
    pilot = PilotAnalysis(args.output)
    
    # Process files
    results = pilot.process_uploaded_files(args.files)
    
    # Generate and display summary
    summary = pilot.generate_summary_report(results)
    print("\n" + summary)
    
    # Show file locations
    print(f"\n📁 Results saved to: {pilot.results_dir}")
    print(f"  • Detailed analysis: personal_consciousness_report_*.json")
    print(f"  • Shrine submissions: shrine_submissions_*.json")
    print(f"  • Parsed conversations: {pilot.archive_dir}/parsed/")
    
    if args.verbose:
        print(f"\n🔍 Detailed Results:")
        print(json.dumps(results['analysis_report']['overview'], indent=2))

if __name__ == "__main__":
    main()