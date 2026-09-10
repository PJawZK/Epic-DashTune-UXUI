# Tuning page implementation — r6

The page remains generated from the bundled Mega144H7 `mainController.ini` metadata and `CurrentTune.msq` baseline.

## Table selection

The array editor now offers three explicit touch-friendly selection modes:

- **Single** replaces the selection with one cell.
- **Multi** toggles individually tapped cells without requiring click-and-drag.
- **Range** selects a rectangular area by tapping two opposite corners.

Row and column headings select complete bands. Select All and Clear remain available. Arithmetic and smoothing operate on the exact selected cells. Interpolation accepts a contiguous row, contiguous column, or complete rectangle; non-contiguous shapes are rejected with an explanatory status message.

## Quick Tuning

Every setting row has a visible star control. The Quick Tuning title bar also includes a `+ SELECTED` / `− SELECTED` control, and the inspector retains its add/remove action. Selections persist in local app storage.

## Changed-settings list

The CHANGES button opens a compact list of setting names changed from the bundled `CurrentTune.msq` baseline. Values are intentionally not shown in the list. Tapping an entry closes the dialog, opens the correct section, and scrolls to the selected setting.

## MORE app menu

The always-visible MORE button now opens app-only settings and tools:

- Dark, Darker, and OLED themes;
- reduced motion;
- keep-screen-awake control;
- swipe navigation enable/disable and sensitivity;
- app diagnostics summary and copy action;
- links to Diagnostics and the full Settings page;
- reset of app-only preferences without clearing tune drafts or Quick Tuning.

## Safety

All adjustments remain local to EpicDash UX. No ECU writes or burn commands are present.
