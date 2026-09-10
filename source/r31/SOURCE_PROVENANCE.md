# Source provenance

The original working `EpicDash-UX-Layout-Lab-unofficial-r1-fixed.apk` was created as a temporary APK-level experiment rather than from a dedicated preserved EpicDash UX source repository.

It used:

- package identity `com.buttonbox.ble.ul`;
- application label `EpicDash UX`;
- a replacement experimental dashboard asset;
- a repaired, aligned and signed APK after an early binary edit invalidated a DEX checksum.

Consequently, there is no exact original UX Kotlin source tree to recover. This bundle contains:

1. a clean editable Android Studio wrapper with the correct package and app name;
2. the continuously developed HTML/CSS/JavaScript assets used by the current experiment;
3. INI/MSQ-derived tune and table catalogs;
4. reference inputs, validation evidence and previews.

The clean wrapper intentionally does not claim to reproduce the repackaged APK native base's full USB, BLE, MSL and diagnostic implementation. Its ECU-facing bridge remains safe and read-only/stubbed where native functionality has not been reconstructed.

No official EpicDash-JZ repository or package is modified by this standalone work.
