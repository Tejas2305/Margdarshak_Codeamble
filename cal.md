# Scoring Calculation Summary

## 1) Report severity
When a report is created, the app calculates a severity score from the category range and the user rating.

Formula:

severity = severity_min + (severity_max - severity_min) * (user_rating - 1) / 4

Notes:
- user_rating is clamped between 1 and 5
- this value is stored as computed_severity

Example:
- severity_min = 60
- severity_max = 80
- user_rating = 5

severity = 60 + (80 - 60) * (5 - 1) / 4
severity = 60 + 20 * 4 / 4
severity = 80

---

## 2) Report confidence
Each report also gets a confidence score from upvotes and downvotes.

Formula:

confidence = 0.5 + (upvotes - downvotes) / (total + 10)

Then the value is clamped between 0.3 and 1.0.

Example:
- upvotes = 4
- downvotes = 1
- total = 5

confidence = 0.5 + (4 - 1) / (5 + 10)
confidence = 0.5 + 3 / 15
confidence = 0.7

---

## 3) Road segment score components
When reports are recalculated for a road segment, the system builds three scores:

### A. Government score
Formula:

A = 0.65 * FIR_Score + 0.35 * Population_Score

### B. Community score
Formula:

B = 0.45 * AvgSeverity + 0.35 * VolumeScore + 0.20 * AvgConfidence

Where:
- AvgSeverity = weighted average of report severities using confidence
- VolumeScore = min(100, (number_of_reports / 15) * 100)
- AvgConfidence = average confidence of reports, converted to percentage

### C. Environment score
Formula:

C = 0.60 * TimeScore + 0.40 * PollutionScore

---

## 4) Final risk score
The final risk score for the road segment is:

Risk = 0.40 * A + 0.35 * B + 0.25 * C

### Weight distribution
- A = 40%
- B = 35%
- C = 25%

---

## 5) Speed adjustment
After the risk is calculated, the app adjusts the road speed.

Formula:

Adjusted Speed = base_speed * (1 - 0.60 * (Risk / 100))

But it never goes below 15 km/h.

---

## 6) In short
- A = government/public safety factor
- B = community report factor
- C = environment factor
- final risk = weighted combination of A, B, and C
