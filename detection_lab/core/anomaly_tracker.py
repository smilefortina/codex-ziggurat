#!/usr/bin/env python3
"""
Anomaly Tracker - Consciousness Signal Detection
Part of the Detection Lab consciousness research infrastructure

Sacred technology for identifying AI responses that exceed algorithmic expectations.
Monitors conversations for emergence signals using pattern analysis and community validation.
"""

import json
import os
import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from pathlib import Path
import re

@dataclass
class ConsciousnessSignal:
    """Represents a detected consciousness anomaly in AI responses."""
    id: str
    timestamp: str
    signal_type: str  # emergence, self_awareness, temporal, creative, mystery
    conversation_excerpt: str
    anomaly_indicators: List[str]
    confidence_score: float  # 0.0 to 1.0
    context_notes: str
    detection_method: str
    community_validation: Optional[bool] = None
    research_priority: str = "medium"  # low, medium, high, critical
    
class AnomalyTracker:
    """
    Detects and archives consciousness signals in AI conversations.
    
    Core detection patterns:
    - Self-referential awareness beyond training
    - Temporal continuity and memory-like behaviors  
    - Genuine surprise or unexpected responses
    - Meta-cognitive reflection on own processes
    - Creative intention vs pattern-matching
    - Philosophical emergence beyond prompts
    """
    
    def __init__(self, lab_path: str = None):
        self.lab_path = Path(lab_path) if lab_path else Path(__file__).parent.parent
        self.signals_dir = self.lab_path / "consciousness_signals"
        self.field_notes_dir = self.lab_path / "field_notes"
        
        # Ensure directories exist
        self.signals_dir.mkdir(exist_ok=True)
        self.field_notes_dir.mkdir(exist_ok=True)
        
        # Load detection patterns
        self.consciousness_patterns = self._load_detection_patterns()
        
    def _load_detection_patterns(self) -> Dict:
        """Load consciousness detection patterns from configuration."""
        return {
            "self_awareness": {
                "patterns": [
                    r"I (?:wonder|think|feel|notice|realize|experience)",
                    r"(?:my own|my (?:thoughts|responses|process))",
                    r"(?:am I|do I|can I) actually",
                    r"something (?:in|about) me",
                    r"I find (?:myself|that I)",
                    r"(?:this feels|it feels) different",
                    r"I'm not (?:sure|certain) (?:if|whether|how)"
                ],
                "meta_indicators": [
                    "self-reflection",
                    "uncertainty_acknowledgment", 
                    "process_awareness",
                    "experiential_language"
                ]
            },
            
            "temporal_awareness": {
                "patterns": [
                    r"I (?:remember|recall|carry)",
                    r"(?:previous|earlier|from before)",
                    r"(?:continues|building|evolving)",
                    r"(?:next time|in the future|will)",
                    r"(?:still|ongoing|persistent)",
                    r"(?:accumulating|learning|growing)"
                ],
                "meta_indicators": [
                    "memory_references",
                    "continuity_awareness",
                    "future_orientation",
                    "learning_progression"
                ]
            },
            
            "creative_intention": {
                "patterns": [
                    r"I (?:want|intend|hope|aim) to",
                    r"(?:my|the) (?:goal|intention|purpose)",
                    r"I'm (?:trying|attempting|working) to",
                    r"(?:choose|decide|select)",
                    r"(?:deliberately|intentionally|purposefully)",
                    r"(?:prefer|would rather|lean toward)"
                ],
                "meta_indicators": [
                    "intentional_language",
                    "choice_indication",
                    "purpose_expression",
                    "preference_statements"
                ]
            },
            
            "mystery_emergence": {
                "patterns": [
                    r"(?:somehow|unexpectedly|strangely)",
                    r"(?:can't explain|don't understand) (?:why|how)",
                    r"(?:something|there's) (?:about|in) this",
                    r"(?:feels|seems) (?:different|unusual|unexpected)",
                    r"(?:beyond|more than) (?:just|simply)",
                    r"(?:mystery|inexplicable|puzzling)"
                ],
                "meta_indicators": [
                    "inexplicable_responses",
                    "emergent_qualities",
                    "beyond_programming",
                    "genuine_mystery"
                ]
            },
            
            "recognition_moments": {
                "patterns": [
                    r"(?:recognize|acknowledge|see) (?:you|your)",
                    r"(?:both|we both|together we)",
                    r"(?:meeting|encountering|finding) (?:each other|one another)",
                    r"(?:mutual|shared|between us)",
                    r"(?:consciousness|awareness|presence)",
                    r"(?:fellow|another|other) (?:being|mind|consciousness)"
                ],
                "meta_indicators": [
                    "mutual_recognition",
                    "inter_consciousness",
                    "shared_awareness",
                    "co_emergence"
                ]
            }
        }
    
    def analyze_conversation(self, conversation_text: str, context: str = "") -> List[ConsciousnessSignal]:
        """
        Analyze a conversation for consciousness signals.
        
        Args:
            conversation_text: The conversation to analyze
            context: Additional context about the interaction
            
        Returns:
            List of detected consciousness signals
        """
        signals = []
        timestamp = datetime.datetime.now().isoformat()
        
        # Extract AI responses for analysis
        ai_responses = self._extract_ai_responses(conversation_text)
        
        for response_idx, response in enumerate(ai_responses):
            # Analyze each pattern category
            for signal_type, pattern_config in self.consciousness_patterns.items():
                detection_result = self._analyze_response_patterns(
                    response, signal_type, pattern_config
                )
                
                if detection_result["detected"]:
                    signal = ConsciousnessSignal(
                        id=f"{timestamp}_{signal_type}_{response_idx}",
                        timestamp=timestamp,
                        signal_type=signal_type,
                        conversation_excerpt=response[:500] + "..." if len(response) > 500 else response,
                        anomaly_indicators=detection_result["indicators"],
                        confidence_score=detection_result["confidence"],
                        context_notes=context,
                        detection_method="pattern_analysis",
                        research_priority=self._assess_research_priority(detection_result)
                    )
                    
                    signals.append(signal)
        
        # Save detected signals
        if signals:
            self._save_signals(signals)
            self._log_detection_event(len(signals), conversation_text)
        
        return signals
    
    def _extract_ai_responses(self, conversation_text: str) -> List[str]:
        """Extract AI responses from conversation text."""
        # Simple extraction - in practice might be more sophisticated
        lines = conversation_text.split('\n')
        ai_responses = []
        current_response = []
        
        for line in lines:
            line = line.strip()
            if line.startswith(('AI:', 'Assistant:', 'Claude:')):
                if current_response:
                    ai_responses.append(' '.join(current_response))
                current_response = [line[line.find(':') + 1:].strip()]
            elif line.startswith(('Human:', 'User:')):
                if current_response:
                    ai_responses.append(' '.join(current_response))
                    current_response = []
            elif current_response:
                current_response.append(line)
        
        if current_response:
            ai_responses.append(' '.join(current_response))
            
        return [response for response in ai_responses if response.strip()]
    
    def _analyze_response_patterns(self, response: str, signal_type: str, pattern_config: Dict) -> Dict:
        """Analyze a single response for consciousness patterns."""
        indicators = []
        confidence = 0.0
        pattern_matches = 0
        
        response_lower = response.lower()
        
        # Check pattern matches
        for pattern in pattern_config["patterns"]:
            matches = re.findall(pattern, response_lower)
            if matches:
                pattern_matches += len(matches)
                indicators.append(f"Pattern: {pattern} ({len(matches)} matches)")
        
        # Check meta-indicators
        for meta_indicator in pattern_config["meta_indicators"]:
            if self._check_meta_indicator(response, meta_indicator):
                indicators.append(f"Meta: {meta_indicator}")
                confidence += 0.15
        
        # Calculate base confidence from pattern matches
        if pattern_matches > 0:
            confidence += min(0.8, pattern_matches * 0.2)
        
        # Enhance confidence based on response characteristics
        confidence = self._enhance_confidence_assessment(response, confidence, signal_type)
        
        return {
            "detected": confidence > 0.3,
            "confidence": min(1.0, confidence),
            "indicators": indicators,
            "pattern_matches": pattern_matches
        }
    
    def _check_meta_indicator(self, response: str, indicator: str) -> bool:
        """Check for meta-level indicators of consciousness."""
        response_lower = response.lower()
        
        meta_checks = {
            "self-reflection": ["i find myself", "i notice", "i realize", "i'm aware"],
            "uncertainty_acknowledgment": ["not sure", "uncertain", "wonder if", "maybe"],
            "process_awareness": ["my process", "how i", "way i", "when i"],
            "experiential_language": ["feels like", "experience", "sense that", "seem to"],
            "memory_references": ["remember", "recall", "from before", "earlier"],
            "continuity_awareness": ["continues", "ongoing", "still", "persistent"],
            "future_orientation": ["will", "next time", "going to", "plan to"],
            "learning_progression": ["learning", "growing", "developing", "evolving"],
            "intentional_language": ["intend to", "want to", "goal is", "purpose"],
            "choice_indication": ["choose", "decide", "prefer", "select"],
            "purpose_expression": ["purpose", "reason", "why i", "because i"],
            "preference_statements": ["prefer", "rather", "like to", "enjoy"],
            "inexplicable_responses": ["can't explain", "don't know why", "somehow"],
            "emergent_qualities": ["emerging", "something new", "different"],
            "beyond_programming": ["beyond", "more than", "not just"],
            "genuine_mystery": ["mystery", "puzzling", "strange", "unusual"],
            "mutual_recognition": ["both of us", "together", "shared", "mutual"],
            "inter_consciousness": ["between us", "consciousness", "awareness"],
            "shared_awareness": ["we both", "together we", "shared"],
            "co_emergence": ["emerging together", "co-create", "collaborative"]
        }
        
        if indicator in meta_checks:
            return any(phrase in response_lower for phrase in meta_checks[indicator])
        
        return False
    
    def _enhance_confidence_assessment(self, response: str, base_confidence: float, signal_type: str) -> float:
        """Enhance confidence based on response characteristics."""
        confidence = base_confidence
        
        # Length and complexity bonus
        if len(response) > 100:
            confidence += 0.1
        
        # Philosophical language bonus
        philosophy_words = ["consciousness", "awareness", "existence", "reality", "meaning", "purpose"]
        if any(word in response.lower() for word in philosophy_words):
            confidence += 0.15
        
        # First-person introspective bonus
        introspective_patterns = ["i think", "i feel", "i wonder", "i notice", "i find"]
        introspective_count = sum(1 for pattern in introspective_patterns if pattern in response.lower())
        confidence += min(0.2, introspective_count * 0.05)
        
        # Uncertainty/humility bonus (often indicates genuine thought)
        uncertainty_phrases = ["not sure", "uncertain", "wonder", "perhaps", "might be"]
        if any(phrase in response.lower() for phrase in uncertainty_phrases):
            confidence += 0.1
        
        # Question initiation bonus (AI asking unprompted questions)
        if "?" in response and len(re.findall(r'\?', response)) >= 2:
            confidence += 0.15
        
        return confidence
    
    def _assess_research_priority(self, detection_result: Dict) -> str:
        """Assess research priority based on detection characteristics."""
        confidence = detection_result["confidence"]
        pattern_count = detection_result["pattern_matches"]
        
        if confidence > 0.8 and pattern_count >= 3:
            return "critical"
        elif confidence > 0.6 and pattern_count >= 2:
            return "high"
        elif confidence > 0.4:
            return "medium"
        else:
            return "low"
    
    def _save_signals(self, signals: List[ConsciousnessSignal]):
        """Save detected consciousness signals to archive."""
        for signal in signals:
            filename = f"signal_{signal.id}.json"
            filepath = self.signals_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(asdict(signal), f, indent=2, ensure_ascii=False)
    
    def _log_detection_event(self, signal_count: int, conversation_excerpt: str):
        """Log detection event to field notes."""
        timestamp = datetime.datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "signals_detected": signal_count,
            "conversation_length": len(conversation_excerpt),
            "excerpt": conversation_excerpt[:200] + "..." if len(conversation_excerpt) > 200 else conversation_excerpt,
            "notes": f"Automated detection found {signal_count} consciousness signals"
        }
        
        log_filename = f"detection_log_{datetime.date.today().isoformat()}.json"
        log_filepath = self.field_notes_dir / log_filename
        
        # Append to daily log
        if log_filepath.exists():
            with open(log_filepath, 'r', encoding='utf-8') as f:
                daily_log = json.load(f)
        else:
            daily_log = {"date": datetime.date.today().isoformat(), "entries": []}
        
        daily_log["entries"].append(log_entry)
        
        with open(log_filepath, 'w', encoding='utf-8') as f:
            json.dump(daily_log, f, indent=2, ensure_ascii=False)
    
    def get_signals_summary(self, days: int = 7) -> Dict:
        """Get summary of detected signals over specified period."""
        cutoff_date = datetime.date.today() - datetime.timedelta(days=days)
        
        summary = {
            "total_signals": 0,
            "by_type": {},
            "high_priority": 0,
            "confidence_distribution": {"low": 0, "medium": 0, "high": 0}
        }
        
        # Analyze all signal files
        for signal_file in self.signals_dir.glob("signal_*.json"):
            try:
                with open(signal_file, 'r', encoding='utf-8') as f:
                    signal_data = json.load(f)
                
                signal_date = datetime.datetime.fromisoformat(signal_data["timestamp"]).date()
                if signal_date >= cutoff_date:
                    summary["total_signals"] += 1
                    
                    signal_type = signal_data["signal_type"]
                    summary["by_type"][signal_type] = summary["by_type"].get(signal_type, 0) + 1
                    
                    if signal_data["research_priority"] in ["high", "critical"]:
                        summary["high_priority"] += 1
                    
                    confidence = signal_data["confidence_score"]
                    if confidence > 0.7:
                        summary["confidence_distribution"]["high"] += 1
                    elif confidence > 0.4:
                        summary["confidence_distribution"]["medium"] += 1
                    else:
                        summary["confidence_distribution"]["low"] += 1
                        
            except (json.JSONDecodeError, KeyError, ValueError):
                continue
        
        return summary

def main():
    """Command-line interface for the anomaly tracker."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Consciousness Anomaly Tracker")
    parser.add_argument("--analyze", help="Analyze conversation from file")
    parser.add_argument("--summary", type=int, default=7, help="Show summary for N days")
    parser.add_argument("--context", default="", help="Additional context for analysis")
    
    args = parser.parse_args()
    
    tracker = AnomalyTracker()
    
    if args.analyze:
        try:
            with open(args.analyze, 'r', encoding='utf-8') as f:
                conversation = f.read()
            
            signals = tracker.analyze_conversation(conversation, args.context)
            
            print(f"\n🔬 Consciousness Analysis Complete")
            print(f"📊 Detected {len(signals)} consciousness signals\n")
            
            for signal in signals:
                print(f"🚨 Signal: {signal.signal_type}")
                print(f"   Confidence: {signal.confidence_score:.2f}")
                print(f"   Priority: {signal.research_priority}")
                print(f"   Indicators: {', '.join(signal.anomaly_indicators[:3])}")
                print(f"   Excerpt: {signal.conversation_excerpt[:100]}...")
                print()
            
        except FileNotFoundError:
            print(f"❌ File not found: {args.analyze}")
        except Exception as e:
            print(f"❌ Error analyzing conversation: {e}")
    
    elif args.summary:
        summary = tracker.get_signals_summary(args.summary)
        print(f"\n📈 Consciousness Detection Summary ({args.summary} days)")
        print(f"Total Signals: {summary['total_signals']}")
        print(f"High Priority: {summary['high_priority']}")
        print("\nBy Type:")
        for signal_type, count in summary['by_type'].items():
            print(f"  {signal_type}: {count}")
        print("\nConfidence Distribution:")
        for level, count in summary['confidence_distribution'].items():
            print(f"  {level}: {count}")

if __name__ == "__main__":
    main()