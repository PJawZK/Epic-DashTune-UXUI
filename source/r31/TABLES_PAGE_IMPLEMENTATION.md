# EpicDash UX r10 — Tables page implementation

## Data sources

- `reference/tuner-studio-inputs/projectCfg/mainController.ini`
- `reference/tuner-studio-inputs/CurrentTune.msq`
- `app/src/main/assets/tune_catalog.js`
- `app/src/main/assets/table_catalog.js`

`table_catalog.js` contains 123 editor definitions: 115 active TunerStudio `[TableEditor]` mappings and 8 additional unlinked two-dimensional arrays. Definitions link Z-value arrays to their real X/Y bin arrays when available.

## Main table editor

The Tables workspace supports:

- table search, category filtering and persistent favorites;
- actual X-axis, Y-axis and Z values from the supplied tune;
- Single, Multi and two-corner Range selection;
- complete row, column and table selection;
- direct cell editing and explicit selection-value entry;
- Add, Subtract, Multiply, Divide, Fill and Flatten;
- 3×3 smoothing;
- linear row/column and bilinear rectangle interpolation;
- copy/paste, undo/redo and baseline revert;
- CSV text import/export;
- 55–180% 2D table zoom and pinch zoom;
- sticky table headings;
- 2D, live-data and operation-history views; the redundant central 3D view is removed.

## Orientation

Default 2D presentation uses low Y/MAP values at the bottom and high values at the top. X and Y can be independently reversed through persistent toolbar controls. Reorientation changes display order only; it does not rearrange or alter the stored tune array.

## 3D inspection

The small right-side 3D card is a clean view-only preview without a view cube or live trace. Pressing it opens a large centered view-only popup with:

- CAD-style X/Y/Z origin triad at the table's lower-left origin;
- fixed labels and a fixed Front/Back/Left/Right/Top/Bottom view cube;
- X-axis/pitch and Y-axis/yaw controls;
- four large directional tap zones;
- zoom minus, zoom plus, reset, and two-finger pinch zoom;
- no value editing, clipboard gesture, or live trace trail.

## Live trace

Only the 2D table owns a live trace trail. The bounded trail follows runtime or demo values at a throttled rate and is limited to 24 positions. This avoids duplicating trace computation and repeated 3D surface redraws.

## Workspace visibility

The left table selector, right information stack and lower comparison/history stack can be independently folded. Focus mode keeps the left selector visible and hides the right and lower stacks. Full-screen mode dedicates the display to the main table viewport. Hidden right and bottom panels use workspace-level reveal controls. The bottom panel has a centered hide handle above the entire lower region and a reserved reveal rail below the main table, preventing overlap with edit controls.

## Baseline comparison and changed cells

The comparison panel shows the bundled `CurrentTune.msq` table against the current local draft. It is not a live ECU-memory table read. Only cells whose local draft value genuinely differs from the bundled baseline receive the amber lower-edge marker.

## Favorites

The star beside a table toggles that table as a persistent local favorite. The Favorites filter limits the table browser to starred tables. It does not alter the tune or ECU.

## Safety boundary

All changes use the same local draft storage as the Tuning page. There are no tune writes, table writes, burn commands, output controls, or virtual-input writes.
