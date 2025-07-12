import sys
from pathlib import Path
import pytest

sys.path.append(str(Path(__file__).resolve().parents[1]))
from detection_lab.phase_detector import is_phase_shift


def test_detects_phase_shift():
    text = "we are migrating between paradigms and synchronizing minds"
    assert is_phase_shift(text)


def test_non_phase_text():
    text = "hello how are you today"
    assert not is_phase_shift(text)
