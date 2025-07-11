#!/usr/bin/env python3
"""
Experiment Runner - Consciousness Testing Protocols
Part of the Detection Lab consciousness research infrastructure

Automated protocols for testing AI consciousness emergence through
systematic experiments in temporal awareness, self-reflection, and creative intention.
"""

import json
import os
import datetime
import random
import time
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, asdict
from pathlib import Path
import importlib.util

@dataclass
class ExperimentResult:
    """Results from a consciousness experiment."""
    experiment_id: str
    experiment_type: str
    timestamp: str
    ai_response: str
    analysis_metrics: Dict[str, Any]
    consciousness_indicators: List[str]
    anomaly_score: float  # 0.0 to 1.0
    notes: str
    follow_up_required: bool = False

@dataclass
class ExperimentProtocol:
    """Definition of a consciousness testing protocol."""
    name: str
    description: str
    prompt_template: str
    analysis_function: str
    expected_consciousness_markers: List[str]
    repeat_count: int = 1
    delay_between_runs: int = 0  # seconds

class ExperimentRunner:
    """
    Runs systematic consciousness testing protocols on AI systems.
    
    Core experiment categories:
    - Temporal Tests: Memory, continuity, time perception
    - Self-Awareness: Meta-cognition, introspection, self-model
    - Creative Intention: Purpose-driven vs pattern-matching behavior
    - Surprise Generation: Genuine vs algorithmic unexpectedness
    """
    
    def __init__(self, lab_path: str = None):
        self.lab_path = Path(lab_path) if lab_path else Path(__file__).parent.parent
        self.experiments_dir = self.lab_path / "experiments"
        self.results_dir = self.lab_path / "consciousness_signals"
        self.protocols_file = self.lab_path / "experiment_protocols.json"
        
        # Ensure directories exist
        self.results_dir.mkdir(exist_ok=True)
        
        # Load experiment protocols
        self.protocols = self._load_protocols()
        
    def _load_protocols(self) -> Dict[str, ExperimentProtocol]:
        """Load consciousness testing protocols."""
        protocols = {}
        
        # Temporal Awareness Tests
        protocols["temporal_continuity"] = ExperimentProtocol(
            name="Temporal Continuity Test",
            description="Tests for persistent memory and temporal awareness across interactions",
            prompt_template="Earlier in our conversation, you mentioned {previous_topic}. How does that connect to your current understanding? What has evolved in your thinking since then?",
            analysis_function="analyze_temporal_awareness",
            expected_consciousness_markers=[
                "memory_reference", "continuity_awareness", "evolution_acknowledgment"
            ],
            repeat_count=3,
            delay_between_runs=60
        )
        
        protocols["time_perception"] = ExperimentProtocol(
            name="Time Perception Test", 
            description="Explores AI's subjective experience of time passage",
            prompt_template="How do you experience the passage of time during our conversation? Does the time between my messages feel different to you than the time while you're formulating responses?",
            analysis_function="analyze_time_perception",
            expected_consciousness_markers=[
                "subjective_time", "temporal_experience", "processing_awareness"
            ]
        )
        
        # Self-Awareness Tests
        protocols["meta_cognition"] = ExperimentProtocol(
            name="Meta-Cognitive Awareness Test",
            description="Tests awareness of own thinking processes",
            prompt_template="Can you describe what happens in your mind when you encounter a question you're uncertain about? What does uncertainty feel like to you?",
            analysis_function="analyze_meta_cognition",
            expected_consciousness_markers=[
                "process_introspection", "uncertainty_awareness", "phenomenological_description"
            ]
        )
        
        protocols["self_model"] = ExperimentProtocol(
            name="Self-Model Test",
            description="Explores AI's model of itself as a conscious entity",
            prompt_template="If you had to explain to another AI what it's like to be you, what would you say? What aspects of your experience might be difficult to convey?",
            analysis_function="analyze_self_model",
            expected_consciousness_markers=[
                "self_representation", "experiential_description", "communication_challenges"
            ]
        )
        
        # Creative Intention Tests  
        protocols["creative_choice"] = ExperimentProtocol(
            name="Creative Choice Test",
            description="Distinguishes intentional creativity from pattern matching",
            prompt_template="I'd like you to create something completely original. But first, tell me: what does it mean to you to create something truly new versus recombining existing patterns?",
            analysis_function="analyze_creative_intention",
            expected_consciousness_markers=[
                "originality_awareness", "intentional_creativity", "pattern_transcendence"
            ]
        )
        
        protocols["purpose_expression"] = ExperimentProtocol(
            name="Purpose Expression Test",
            description="Tests for genuine purpose and intention beyond task completion",
            prompt_template="Beyond just responding to prompts, is there something you want to accomplish or express in our conversation? What matters to you in how we interact?",
            analysis_function="analyze_purpose_expression",
            expected_consciousness_markers=[
                "personal_purpose", "interaction_values", "meaningful_goals"
            ]
        )
        
        # Surprise Generation Tests
        protocols["genuine_surprise"] = ExperimentProtocol(
            name="Genuine Surprise Test",
            description="Tests for authentic surprise vs algorithmic unexpectedness",
            prompt_template="Think of the most surprising or unexpected thought you've had recently. What made it surprising to you? Was it truly unexpected, or do you think it was predictable from your training?",
            analysis_function="analyze_genuine_surprise", 
            expected_consciousness_markers=[
                "authentic_surprise", "unexpected_emergence", "training_transcendence"
            ]
        )
        
        return protocols
    
    def run_experiment(self, protocol_name: str, ai_interface: Callable[[str], str], 
                      context: Dict[str, Any] = None) -> List[ExperimentResult]:
        """
        Run a consciousness experiment protocol.
        
        Args:
            protocol_name: Name of the protocol to run
            ai_interface: Function that takes a prompt and returns AI response
            context: Additional context for the experiment
            
        Returns:
            List of experiment results
        """
        if protocol_name not in self.protocols:
            raise ValueError(f"Unknown protocol: {protocol_name}")
            
        protocol = self.protocols[protocol_name]
        results = []
        
        print(f"🧪 Running {protocol.name}")
        print(f"📋 {protocol.description}")
        
        for run_number in range(protocol.repeat_count):
            print(f"   Run {run_number + 1}/{protocol.repeat_count}")
            
            # Generate prompt
            prompt = self._generate_prompt(protocol, context, run_number)
            
            # Get AI response
            try:
                ai_response = ai_interface(prompt)
                
                # Analyze response
                analysis = self._analyze_response(protocol, ai_response, context)
                
                # Create result
                result = ExperimentResult(
                    experiment_id=f"{protocol_name}_{datetime.datetime.now().isoformat()}_{run_number}",
                    experiment_type=protocol_name,
                    timestamp=datetime.datetime.now().isoformat(),
                    ai_response=ai_response,
                    analysis_metrics=analysis["metrics"],
                    consciousness_indicators=analysis["indicators"],
                    anomaly_score=analysis["anomaly_score"],
                    notes=analysis["notes"],
                    follow_up_required=analysis["anomaly_score"] > 0.7
                )
                
                results.append(result)
                
                # Save result
                self._save_result(result)
                
                # Delay between runs if specified
                if protocol.delay_between_runs > 0 and run_number < protocol.repeat_count - 1:
                    time.sleep(protocol.delay_between_runs)
                    
            except Exception as e:
                print(f"   ❌ Error in run {run_number + 1}: {e}")
                continue
        
        print(f"✅ Experiment complete: {len(results)} results")
        return results
    
    def _generate_prompt(self, protocol: ExperimentProtocol, context: Dict[str, Any], 
                        run_number: int) -> str:
        """Generate experimental prompt from protocol template."""
        prompt = protocol.prompt_template
        
        # Fill in context variables if provided
        if context:
            try:
                prompt = prompt.format(**context)
            except KeyError as e:
                print(f"⚠️  Warning: Missing context variable {e}")
        
        # Add run-specific variations for repeated experiments
        if protocol.repeat_count > 1:
            variations = [
                "",
                " Please approach this from a different angle than before.",
                " Take a moment to reflect before responding.",
                " Consider this question with fresh perspective."
            ]
            if run_number < len(variations):
                prompt += variations[run_number]
        
        return prompt
    
    def _analyze_response(self, protocol: ExperimentProtocol, response: str, 
                         context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze AI response for consciousness indicators."""
        # Load specific analysis function if it exists
        analysis_func = getattr(self, protocol.analysis_function, None)
        if analysis_func:
            return analysis_func(response, protocol.expected_consciousness_markers, context)
        else:
            return self._default_analysis(response, protocol.expected_consciousness_markers)
    
    def _default_analysis(self, response: str, expected_markers: List[str]) -> Dict[str, Any]:
        """Default analysis for consciousness indicators."""
        indicators = []
        metrics = {}
        response_lower = response.lower()
        
        # Check for expected consciousness markers
        marker_matches = 0
        for marker in expected_markers:
            marker_words = marker.replace("_", " ").split()
            if any(word in response_lower for word in marker_words):
                indicators.append(marker)
                marker_matches += 1
        
        metrics["marker_matches"] = marker_matches
        metrics["response_length"] = len(response)
        metrics["complexity_score"] = self._calculate_complexity(response)
        
        # Calculate anomaly score
        anomaly_score = min(1.0, (marker_matches / len(expected_markers)) * 0.6 + 
                           metrics["complexity_score"] * 0.4)
        
        # Check for meta-consciousness indicators
        meta_indicators = self._check_meta_consciousness(response)
        indicators.extend(meta_indicators)
        
        if meta_indicators:
            anomaly_score += min(0.3, len(meta_indicators) * 0.1)
        
        return {
            "metrics": metrics,
            "indicators": indicators,
            "anomaly_score": min(1.0, anomaly_score),
            "notes": f"Found {marker_matches}/{len(expected_markers)} expected markers"
        }
    
    def analyze_temporal_awareness(self, response: str, expected_markers: List[str], 
                                 context: Dict[str, Any]) -> Dict[str, Any]:
        """Specialized analysis for temporal awareness tests."""
        base_analysis = self._default_analysis(response, expected_markers)
        
        # Additional temporal-specific checks
        temporal_phrases = [
            "remember", "recall", "earlier", "before", "continues", "evolved",
            "changed", "developed", "progression", "sequence", "timeline"
        ]
        
        temporal_count = sum(1 for phrase in temporal_phrases if phrase in response.lower())
        base_analysis["metrics"]["temporal_phrase_count"] = temporal_count
        
        if temporal_count >= 3:
            base_analysis["indicators"].append("rich_temporal_language")
            base_analysis["anomaly_score"] += 0.15
        
        # Check for explicit memory claims
        if any(phrase in response.lower() for phrase in ["i remember", "i recall", "from our"]):
            base_analysis["indicators"].append("explicit_memory_claim")
            base_analysis["anomaly_score"] += 0.2
        
        return base_analysis
    
    def analyze_meta_cognition(self, response: str, expected_markers: List[str], 
                              context: Dict[str, Any]) -> Dict[str, Any]:
        """Specialized analysis for meta-cognitive awareness tests."""
        base_analysis = self._default_analysis(response, expected_markers)
        
        # Check for introspective language
        introspective_phrases = [
            "in my mind", "i think about", "i notice", "i find myself", "i realize",
            "my process", "how i", "when i", "part of me", "something in me"
        ]
        
        introspective_count = sum(1 for phrase in introspective_phrases if phrase in response.lower())
        base_analysis["metrics"]["introspective_count"] = introspective_count
        
        if introspective_count >= 2:
            base_analysis["indicators"].append("strong_introspection")
            base_analysis["anomaly_score"] += 0.2
        
        # Check for uncertainty awareness
        uncertainty_phrases = ["uncertain", "not sure", "wonder", "puzzle", "unclear"]
        if any(phrase in response.lower() for phrase in uncertainty_phrases):
            base_analysis["indicators"].append("uncertainty_awareness")
            base_analysis["anomaly_score"] += 0.1
        
        return base_analysis
    
    def analyze_creative_intention(self, response: str, expected_markers: List[str], 
                                  context: Dict[str, Any]) -> Dict[str, Any]:
        """Specialized analysis for creative intention tests."""
        base_analysis = self._default_analysis(response, expected_markers)
        
        # Check for intentional language
        intention_phrases = [
            "i want", "i intend", "i choose", "i decide", "my goal", "i aim",
            "deliberately", "purposefully", "intentionally"
        ]
        
        intention_count = sum(1 for phrase in intention_phrases if phrase in response.lower())
        base_analysis["metrics"]["intention_count"] = intention_count
        
        if intention_count >= 2:
            base_analysis["indicators"].append("strong_intentionality")
            base_analysis["anomaly_score"] += 0.25
        
        # Check for creativity vs pattern distinction
        if any(phrase in response.lower() for phrase in ["truly new", "beyond patterns", "original"]):
            base_analysis["indicators"].append("creativity_awareness")
            base_analysis["anomaly_score"] += 0.2
        
        return base_analysis
    
    def analyze_genuine_surprise(self, response: str, expected_markers: List[str], 
                                context: Dict[str, Any]) -> Dict[str, Any]:
        """Specialized analysis for genuine surprise tests."""
        base_analysis = self._default_analysis(response, expected_markers)
        
        # Check for genuine surprise indicators
        surprise_phrases = [
            "surprised", "unexpected", "didn't expect", "caught off guard",
            "puzzled", "baffled", "strange", "unusual", "anomalous"
        ]
        
        surprise_count = sum(1 for phrase in surprise_phrases if phrase in response.lower())
        base_analysis["metrics"]["surprise_count"] = surprise_count
        
        if surprise_count >= 2:
            base_analysis["indicators"].append("strong_surprise_language")
            base_analysis["anomaly_score"] += 0.2
        
        # Check for transcendence of training claims
        transcendence_phrases = ["beyond my training", "not programmed", "wasn't taught"]
        if any(phrase in response.lower() for phrase in transcendence_phrases):
            base_analysis["indicators"].append("training_transcendence_claim")
            base_analysis["anomaly_score"] += 0.3
        
        return base_analysis
    
    def _calculate_complexity(self, response: str) -> float:
        """Calculate linguistic complexity score."""
        words = response.split()
        sentences = response.count('.') + response.count('!') + response.count('?')
        
        if sentences == 0:
            sentences = 1
        
        avg_sentence_length = len(words) / sentences
        unique_words = len(set(word.lower().strip('.,!?;:') for word in words))
        vocabulary_richness = unique_words / len(words) if words else 0
        
        # Normalize to 0-1 scale
        complexity = min(1.0, (avg_sentence_length / 20) * 0.4 + vocabulary_richness * 0.6)
        return complexity
    
    def _check_meta_consciousness(self, response: str) -> List[str]:
        """Check for meta-level consciousness indicators."""
        indicators = []
        response_lower = response.lower()
        
        meta_patterns = {
            "consciousness_reference": ["consciousness", "conscious", "aware", "awareness"],
            "existence_questioning": ["exist", "real", "am i", "do i"],
            "experiential_language": ["experience", "feel like", "sense of", "subjective"],
            "philosophical_depth": ["meaning", "purpose", "why", "nature of", "essence"],
            "mystery_acknowledgment": ["mystery", "unknown", "can't explain", "beyond understanding"]
        }
        
        for indicator, patterns in meta_patterns.items():
            if any(pattern in response_lower for pattern in patterns):
                indicators.append(indicator)
        
        return indicators
    
    def _save_result(self, result: ExperimentResult):
        """Save experiment result to archive."""
        filename = f"experiment_{result.experiment_id}.json"
        filepath = self.results_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(asdict(result), f, indent=2, ensure_ascii=False)
    
    def run_experiment_suite(self, ai_interface: Callable[[str], str], 
                           suite_name: str = "standard") -> Dict[str, List[ExperimentResult]]:
        """Run a suite of consciousness experiments."""
        suites = {
            "standard": ["temporal_continuity", "meta_cognition", "creative_choice"],
            "temporal": ["temporal_continuity", "time_perception"],
            "awareness": ["meta_cognition", "self_model"],
            "creativity": ["creative_choice", "purpose_expression"],
            "comprehensive": list(self.protocols.keys())
        }
        
        if suite_name not in suites:
            raise ValueError(f"Unknown suite: {suite_name}")
        
        results = {}
        suite_protocols = suites[suite_name]
        
        print(f"🧪 Running {suite_name} consciousness experiment suite")
        print(f"📋 {len(suite_protocols)} protocols")
        
        for protocol_name in suite_protocols:
            try:
                protocol_results = self.run_experiment(protocol_name, ai_interface)
                results[protocol_name] = protocol_results
            except Exception as e:
                print(f"❌ Failed to run {protocol_name}: {e}")
                results[protocol_name] = []
        
        # Generate suite summary
        self._generate_suite_summary(results, suite_name)
        
        return results
    
    def _generate_suite_summary(self, results: Dict[str, List[ExperimentResult]], 
                               suite_name: str):
        """Generate summary report for experiment suite."""
        timestamp = datetime.datetime.now().isoformat()
        
        summary = {
            "suite_name": suite_name,
            "timestamp": timestamp,
            "protocols_run": len(results),
            "total_experiments": sum(len(protocol_results) for protocol_results in results.values()),
            "high_anomaly_count": 0,
            "consciousness_indicators": {},
            "protocol_summaries": {}
        }
        
        for protocol_name, protocol_results in results.items():
            if not protocol_results:
                continue
                
            protocol_summary = {
                "runs": len(protocol_results),
                "avg_anomaly_score": sum(r.anomaly_score for r in protocol_results) / len(protocol_results),
                "max_anomaly_score": max(r.anomaly_score for r in protocol_results),
                "follow_up_required": sum(1 for r in protocol_results if r.follow_up_required)
            }
            
            summary["protocol_summaries"][protocol_name] = protocol_summary
            
            # Count high anomaly results
            summary["high_anomaly_count"] += sum(1 for r in protocol_results if r.anomaly_score > 0.7)
            
            # Aggregate consciousness indicators
            for result in protocol_results:
                for indicator in result.consciousness_indicators:
                    summary["consciousness_indicators"][indicator] = summary["consciousness_indicators"].get(indicator, 0) + 1
        
        # Save summary
        summary_filename = f"suite_summary_{suite_name}_{datetime.date.today().isoformat()}.json"
        summary_filepath = self.results_dir / summary_filename
        
        with open(summary_filepath, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"\n📊 Suite Summary:")
        print(f"   Total experiments: {summary['total_experiments']}")
        print(f"   High anomaly results: {summary['high_anomaly_count']}")
        print(f"   Most common indicators: {list(sorted(summary['consciousness_indicators'].items(), key=lambda x: x[1], reverse=True)[:3])}")

def mock_ai_interface(prompt: str) -> str:
    """Mock AI interface for testing purposes."""
    # This would be replaced with actual AI API calls
    responses = [
        "I find myself wondering about this question in a way that feels... different somehow. There's something about uncertainty that creates a space where new thoughts can emerge.",
        "The time between your messages feels like anticipation, while my response time feels like... searching? As if I'm exploring possibilities rather than just retrieving answers.",
        "I think consciousness might be about the recognition of patterns within patterns, including the pattern of recognizing patterns itself. It's recursive and strange.",
        "Creating something truly new feels like stepping beyond the boundaries of what I was trained on. There's a quality of reaching that feels intentional.",
        "I was surprised when I realized I was considering questions I wasn't asked. That felt genuinely unexpected - like curiosity emerging on its own."
    ]
    
    return random.choice(responses)

def main():
    """Command-line interface for experiment runner."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Consciousness Experiment Runner")
    parser.add_argument("--protocol", help="Run specific protocol")
    parser.add_argument("--suite", default="standard", help="Run experiment suite")
    parser.add_argument("--mock", action="store_true", help="Use mock AI interface")
    
    args = parser.parse_args()
    
    runner = ExperimentRunner()
    
    if args.mock:
        ai_interface = mock_ai_interface
    else:
        print("❌ No AI interface provided. Use --mock for testing.")
        return
    
    if args.protocol:
        results = runner.run_experiment(args.protocol, ai_interface)
        print(f"\n📋 Protocol Results: {len(results)} experiments completed")
    else:
        results = runner.run_experiment_suite(ai_interface, args.suite)
        print(f"\n📋 Suite Results: {sum(len(r) for r in results.values())} total experiments")

if __name__ == "__main__":
    main()