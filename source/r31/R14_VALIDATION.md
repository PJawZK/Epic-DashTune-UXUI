# EpicDash UX r14 validation

## Browser simulation

Validated at a 1600 × 960 viewport using the complete asset bundle in Chromium:

- no JavaScript page errors;
- Tables 2D trace: one current cell plus a bounded 12-cell trail during the Pull demo scenario;
- live-cell indication uses a direct animated outline rather than pseudo-elements on numeric input controls;
- Logging bottom panel hides through the centered fold handle and restores through the dedicated reveal rail;
- Trigger / Sync defaults to Combo and its waveform changes over time;
- Trigger bottom context shows RPM, sync and tooth-error trends;
- Sensor Health shows sensor trends;
- ECU Info correctly removes the contextual lower panel;
- Diagnostics bottom panel uses the same centered hide/reveal pattern.

## APK validation

The r14 APK is rebuilt from the physically working r13 native base with revised assets and manifest version metadata. It retains the r8+ experimental signing certificate and includes one v2 signer and one v3 signer record for the same certificate.
