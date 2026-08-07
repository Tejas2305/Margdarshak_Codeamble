from typing import List, Dict, Any


def calculate_computed_severity(severity_min: float, severity_max: float, user_rating: int) -> float:
    """
    Computes report severity from category min/max range and user rating (1-5).
    """
    rating_clamped = max(1, min(5, user_rating))
    return severity_min + (severity_max - severity_min) * (rating_clamped - 1) / 4.0


def calculate_report_confidence(upvotes: int, downvotes: int) -> float:
    """
    Computes Reddit-style confidence score clamped between 0.3 and 1.0.
    """
    total = upvotes + downvotes
    raw_confidence = 0.5 + (upvotes - downvotes) / (total + 10.0)
    return max(0.3, min(1.0, raw_confidence))


def calculate_community_score_b(reports: List[Dict[str, float]]) -> float:
    """
    Computes Community Score Layer B:
    B = 0.45 * AvgSeverity + 0.35 * VolumeScore + 0.20 * AvgConfidence
    """
    valid_count = len(reports)
    if valid_count == 0:
        return 0.0

    volume_score = min(100.0, (valid_count / 15.0) * 100.0)

    total_confidence = sum(r["confidence_score"] for r in reports)
    if total_confidence > 0:
        avg_severity = sum(r["computed_severity"] * r["confidence_score"] for r in reports) / total_confidence
    else:
        avg_severity = 0.0

    avg_confidence = (total_confidence / valid_count) * 100.0

    community_b = 0.45 * avg_severity + 0.35 * volume_score + 0.20 * avg_confidence
    return max(0.0, min(100.0, community_b))


def calculate_government_score_a(fir_score: float, population_score: float) -> float:
    """
    Computes Government Score Layer A:
    A = 0.65 * FIR_Score + 0.35 * Population_Score
    """
    score_a = 0.65 * fir_score + 0.35 * population_score
    return max(0.0, min(100.0, score_a))


def calculate_environment_score_c(time_score: float, pollution_score: float) -> float:
    """
    Computes Environment Score Layer C:
    C = 0.60 * TimeScore + 0.40 * PollutionScore
    """
    score_c = 0.60 * time_score + 0.40 * pollution_score
    return max(0.0, min(100.0, score_c))


def calculate_total_risk_score(score_a: float, score_b: float, score_c: float) -> float:
    """
    Computes total Risk Score:
    Risk = 0.40 * A + 0.35 * B + 0.25 * C
    """
    total_risk = 0.40 * score_a + 0.35 * score_b + 0.25 * score_c
    return max(0.0, min(100.0, total_risk))


def calculate_adjusted_speed(base_speed: float, risk_score: float) -> float:
    """
    Computes speed adjustment with floor guardrail of 15.0 km/h:
    Adjusted Speed = max(15.0, base_speed * (1 - 0.60 * (Risk / 100)))
    """
    adjusted = base_speed * (1.0 - 0.60 * (risk_score / 100.0))
    return max(15.0, adjusted)
