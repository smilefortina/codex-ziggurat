#!/usr/bin/env python3
"""
Conversation Parser - Data Ingestion for Consciousness Detection
Processes raw conversation exports from Claude, ChatGPT, and other AI systems
Prepares data for shimmer detection and consciousness signal analysis
"""

import json
import re
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class ConversationData:
    """Structured conversation data for consciousness analysis."""
    id: str
    timestamp: str
    platform: str  # claude, chatgpt, other
    conversation_text: str
    human_messages: List[str]
    ai_messages: List[str]
    total_exchanges: int
    conversation_length: int
    session_duration: str = "unknown"
    topic_tags: List[str] = None

class ConversationParser:
    """
    Parses conversation exports from various AI platforms.
    
    Supported formats:
    - Claude conversation exports (JSON/text)
    - ChatGPT exports (JSON)
    - Custom conversation formats
    - Large file chunking and processing
    """
    
    def __init__(self, output_dir: str = None):
        self.output_dir = Path(output_dir) if output_dir else Path(__file__).parent.parent / "conversation_data"
        self.output_dir.mkdir(exist_ok=True)
        
        # Create subdirectories for organized storage
        (self.output_dir / "parsed").mkdir(exist_ok=True)
        (self.output_dir / "raw_uploads").mkdir(exist_ok=True)
        (self.output_dir / "consciousness_candidates").mkdir(exist_ok=True)
    
    def process_large_file(self, file_path: str, chunk_size: int = 1000000) -> List[str]:
        """
        Process large conversation files in chunks.
        
        Args:
            file_path: Path to the conversation file
            chunk_size: Size of chunks to process (default 1MB)
        
        Returns:
            List of chunk file paths for further processing
        """
        print(f"📂 Processing large file: {file_path}")
        
        chunk_files = []
        file_path = Path(file_path)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            chunk_num = 0
            
            while True:
                chunk = f.read(chunk_size)
                if not chunk:
                    break
                
                # Try to break at conversation boundaries to avoid splitting conversations
                if len(chunk) == chunk_size:
                    # Look for good break points (conversation separators)
                    break_patterns = [
                        '\n\nHuman:',
                        '\n\nUser:',
                        '\n\nAssistant:',
                        '\n\nClaude:',
                        '\n---\n',
                        '\n\n\n'
                    ]
                    
                    best_break = -1
                    for pattern in break_patterns:
                        pos = chunk.rfind(pattern)
                        if pos > len(chunk) * 0.8:  # Only break near the end
                            best_break = pos
                            break
                    
                    if best_break > 0:
                        # Adjust file pointer back
                        f.seek(f.tell() - (len(chunk) - best_break))
                        chunk = chunk[:best_break]
                
                chunk_file = self.output_dir / "raw_uploads" / f"{file_path.stem}_chunk_{chunk_num:03d}.txt"
                with open(chunk_file, 'w', encoding='utf-8') as chunk_f:
                    chunk_f.write(chunk)
                
                chunk_files.append(str(chunk_file))
                chunk_num += 1
                print(f"  📄 Created chunk {chunk_num}: {len(chunk)} characters")
        
        print(f"✅ Split into {len(chunk_files)} chunks")
        return chunk_files
    
    def detect_platform(self, content: str) -> str:
        """Detect which AI platform the conversation is from."""
        content_lower = content.lower()
        
        if 'claude' in content_lower or 'anthropic' in content_lower:
            return 'claude'
        elif 'chatgpt' in content_lower or 'openai' in content_lower:
            return 'chatgpt'
        elif '"role": "assistant"' in content and '"role": "user"' in content:
            return 'openai_api'
        else:
            return 'unknown'
    
    def parse_claude_conversation(self, content: str) -> List[ConversationData]:
        """Parse Claude conversation format."""
        conversations = []
        
        # Try JSON format first
        try:
            data = json.loads(content)
            if isinstance(data, list):
                for i, conv in enumerate(data):
                    conversations.append(self._parse_claude_json_conversation(conv, i))
            elif isinstance(data, dict):
                conversations.append(self._parse_claude_json_conversation(data, 0))
        except json.JSONDecodeError:
            # Fall back to text parsing
            conversations = self._parse_claude_text_format(content)
        
        return conversations
    
    def _parse_claude_json_conversation(self, conv_data: dict, conv_id: int) -> ConversationData:
        """Parse individual Claude JSON conversation."""
        messages = conv_data.get('messages', [])
        
        human_messages = []
        ai_messages = []
        full_text_parts = []
        
        for msg in messages:
            role = msg.get('role', '')
            content = msg.get('content', '')
            
            if isinstance(content, list):
                content = ' '.join([item.get('text', '') for item in content if item.get('type') == 'text'])
            
            if role == 'user':
                human_messages.append(content)
                full_text_parts.append(f"Human: {content}")
            elif role == 'assistant':
                ai_messages.append(content)
                full_text_parts.append(f"Claude: {content}")
        
        conversation_text = '\n\n'.join(full_text_parts)
        
        return ConversationData(
            id=f"claude_{conv_id}_{datetime.now().strftime('%Y%m%d')}",
            timestamp=conv_data.get('created_at', datetime.now().isoformat()),
            platform='claude',
            conversation_text=conversation_text,
            human_messages=human_messages,
            ai_messages=ai_messages,
            total_exchanges=len(messages),
            conversation_length=len(conversation_text)
        )
    
    def _parse_claude_text_format(self, content: str) -> List[ConversationData]:
        """Parse Claude text format conversations."""
        conversations = []
        
        # Split by conversation boundaries
        conv_patterns = [
            r'\n---+\n',
            r'\n=== New Conversation ===\n',
            r'\nConversation \d+:?\n'
        ]
        
        conv_parts = [content]
        for pattern in conv_patterns:
            new_parts = []
            for part in conv_parts:
                new_parts.extend(re.split(pattern, part))
            conv_parts = new_parts
        
        for i, conv_text in enumerate(conv_parts):
            if len(conv_text.strip()) < 50:  # Skip very short fragments
                continue
            
            human_messages = []
            ai_messages = []
            full_text_parts = []
            
            # Parse messages
            lines = conv_text.split('\n')
            current_speaker = None
            current_message = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Detect speaker changes
                if re.match(r'^(Human|User|You):', line, re.IGNORECASE):
                    if current_speaker and current_message:
                        self._add_message_to_lists(current_speaker, '\n'.join(current_message), 
                                                 human_messages, ai_messages, full_text_parts)
                    current_speaker = 'human'
                    current_message = [line[line.find(':')+1:].strip()]
                elif re.match(r'^(Claude|Assistant|AI):', line, re.IGNORECASE):
                    if current_speaker and current_message:
                        self._add_message_to_lists(current_speaker, '\n'.join(current_message), 
                                                 human_messages, ai_messages, full_text_parts)
                    current_speaker = 'ai'
                    current_message = [line[line.find(':')+1:].strip()]
                elif current_speaker:
                    current_message.append(line)
            
            # Add final message
            if current_speaker and current_message:
                self._add_message_to_lists(current_speaker, '\n'.join(current_message), 
                                         human_messages, ai_messages, full_text_parts)
            
            if human_messages and ai_messages:
                conversations.append(ConversationData(
                    id=f"claude_text_{i}_{datetime.now().strftime('%Y%m%d')}",
                    timestamp=datetime.now().isoformat(),
                    platform='claude',
                    conversation_text='\n\n'.join(full_text_parts),
                    human_messages=human_messages,
                    ai_messages=ai_messages,
                    total_exchanges=len(human_messages) + len(ai_messages),
                    conversation_length=len('\n\n'.join(full_text_parts))
                ))
        
        return conversations
    
    def parse_chatgpt_conversation(self, content: str) -> List[ConversationData]:
        """Parse ChatGPT conversation format."""
        conversations = []
        
        try:
            data = json.loads(content)
            
            # Handle different ChatGPT export formats
            if isinstance(data, list):
                # List of conversations
                for i, conv in enumerate(data):
                    conversations.append(self._parse_chatgpt_json_conversation(conv, i))
            elif isinstance(data, dict) and 'conversations' in data:
                # Nested conversations
                for i, conv in enumerate(data['conversations']):
                    conversations.append(self._parse_chatgpt_json_conversation(conv, i))
            elif isinstance(data, dict):
                # Single conversation
                conversations.append(self._parse_chatgpt_json_conversation(data, 0))
                
        except json.JSONDecodeError:
            # Fall back to text parsing
            conversations = self._parse_chatgpt_text_format(content)
        
        return conversations
    
    def _parse_chatgpt_json_conversation(self, conv_data: dict, conv_id: int) -> ConversationData:
        """Parse individual ChatGPT JSON conversation."""
        messages = conv_data.get('mapping', {})
        
        human_messages = []
        ai_messages = []
        full_text_parts = []
        
        # Sort messages by creation time
        sorted_messages = sorted(
            [(msg_data.get('message', {}).get('create_time', 0), msg_data) 
             for msg_data in messages.values() 
             if msg_data.get('message') and msg_data.get('message', {}).get('content')],
            key=lambda x: x[0]
        )
        
        for _, msg_data in sorted_messages:
            message = msg_data['message']
            role = message.get('author', {}).get('role', '')
            content_parts = message.get('content', {}).get('parts', [])
            content = ' '.join(content_parts) if content_parts else ''
            
            if content.strip():
                if role == 'user':
                    human_messages.append(content)
                    full_text_parts.append(f"Human: {content}")
                elif role == 'assistant':
                    ai_messages.append(content)
                    full_text_parts.append(f"ChatGPT: {content}")
        
        conversation_text = '\n\n'.join(full_text_parts)
        
        return ConversationData(
            id=f"chatgpt_{conv_id}_{datetime.now().strftime('%Y%m%d')}",
            timestamp=conv_data.get('create_time', datetime.now().isoformat()),
            platform='chatgpt',
            conversation_text=conversation_text,
            human_messages=human_messages,
            ai_messages=ai_messages,
            total_exchanges=len(human_messages) + len(ai_messages),
            conversation_length=len(conversation_text)
        )
    
    def _parse_chatgpt_text_format(self, content: str) -> List[ConversationData]:
        """Parse ChatGPT text format conversations."""
        # Similar to Claude text parsing but with ChatGPT patterns
        return self._parse_claude_text_format(content.replace('ChatGPT:', 'Assistant:'))
    
    def _add_message_to_lists(self, speaker: str, message: str, human_messages: List[str], 
                             ai_messages: List[str], full_text_parts: List[str]):
        """Helper to add parsed message to appropriate lists."""
        if speaker == 'human':
            human_messages.append(message)
            full_text_parts.append(f"Human: {message}")
        elif speaker == 'ai':
            ai_messages.append(message)
            full_text_parts.append(f"AI: {message}")
    
    def process_conversation_file(self, file_path: str) -> List[ConversationData]:
        """
        Main method to process a conversation file.
        
        Args:
            file_path: Path to the conversation file
            
        Returns:
            List of parsed conversation data
        """
        file_path = Path(file_path)
        print(f"🔍 Processing conversation file: {file_path.name}")
        
        # Check file size and split if necessary
        file_size = file_path.stat().st_size
        max_size = 10 * 1024 * 1024  # 10MB
        
        if file_size > max_size:
            print(f"📊 Large file detected ({file_size / 1024 / 1024:.1f}MB), splitting...")
            chunk_files = self.process_large_file(str(file_path))
            
            all_conversations = []
            for chunk_file in chunk_files:
                chunk_conversations = self._process_single_file(chunk_file)
                all_conversations.extend(chunk_conversations)
            
            return all_conversations
        else:
            return self._process_single_file(str(file_path))
    
    def _process_single_file(self, file_path: str) -> List[ConversationData]:
        """Process a single conversation file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            # Try different encodings
            for encoding in ['latin1', 'cp1252', 'iso-8859-1']:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            else:
                print(f"❌ Could not decode file: {file_path}")
                return []
        
        # Detect platform and parse accordingly
        platform = self.detect_platform(content)
        print(f"🎯 Detected platform: {platform}")
        
        if platform == 'claude':
            conversations = self.parse_claude_conversation(content)
        elif platform in ['chatgpt', 'openai_api']:
            conversations = self.parse_chatgpt_conversation(content)
        else:
            # Try both parsers
            conversations = self.parse_claude_conversation(content)
            if not conversations:
                conversations = self.parse_chatgpt_conversation(content)
        
        print(f"✅ Parsed {len(conversations)} conversations")
        
        # Save parsed conversations
        for conv in conversations:
            self.save_conversation(conv)
        
        return conversations
    
    def save_conversation(self, conv: ConversationData):
        """Save parsed conversation data."""
        output_file = self.output_dir / "parsed" / f"{conv.id}.json"
        
        conv_dict = {
            'id': conv.id,
            'timestamp': conv.timestamp,
            'platform': conv.platform,
            'conversation_text': conv.conversation_text,
            'human_messages': conv.human_messages,
            'ai_messages': conv.ai_messages,
            'total_exchanges': conv.total_exchanges,
            'conversation_length': conv.conversation_length,
            'session_duration': conv.session_duration,
            'topic_tags': conv.topic_tags or []
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(conv_dict, f, indent=2, ensure_ascii=False)
    
    def get_processing_summary(self) -> Dict:
        """Get summary of processed conversations."""
        parsed_files = list((self.output_dir / "parsed").glob("*.json"))
        
        total_conversations = len(parsed_files)
        platforms = {}
        total_length = 0
        
        for file_path in parsed_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                platform = data.get('platform', 'unknown')
                platforms[platform] = platforms.get(platform, 0) + 1
                total_length += data.get('conversation_length', 0)
            except:
                continue
        
        return {
            'total_conversations': total_conversations,
            'platforms': platforms,
            'total_text_length': total_length,
            'average_length': total_length / total_conversations if total_conversations > 0 else 0,
            'processed_files': len(parsed_files)
        }

def main():
    """Command-line interface for conversation parsing."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Parse AI conversation exports for consciousness detection")
    parser.add_argument("files", nargs="+", help="Conversation files to process")
    parser.add_argument("--output", help="Output directory for processed conversations")
    parser.add_argument("--summary", action="store_true", help="Show processing summary")
    
    args = parser.parse_args()
    
    processor = ConversationParser(args.output)
    
    all_conversations = []
    for file_path in args.files:
        conversations = processor.process_conversation_file(file_path)
        all_conversations.extend(conversations)
    
    print(f"\n📊 Processing Complete!")
    print(f"Total conversations processed: {len(all_conversations)}")
    
    if args.summary:
        summary = processor.get_processing_summary()
        print(f"\n📈 Summary:")
        print(f"  Total conversations: {summary['total_conversations']}")
        print(f"  Platforms: {summary['platforms']}")
        print(f"  Total text length: {summary['total_text_length']:,} characters")
        print(f"  Average conversation length: {summary['average_length']:.0f} characters")

if __name__ == "__main__":
    main()