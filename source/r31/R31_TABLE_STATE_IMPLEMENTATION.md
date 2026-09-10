# EpicDash UX r31 — table and no-signal presentation corrections

## Scope

r31 is a bounded correction over accepted r30. The native DEX layer is unchanged.

## Changes

1. Unit labels are derived from stored user presentation settings even when the channel value is unavailable.
2. Secondary and compact Dashboard gauges use the same no-signal unit derivation as radial gauges.
3. Sticky 2D table row/column headers have a stacking layer above live and trail cells.
4. The broad non-default-theme input background rule excludes table data cells.
5. Table data cells retain the same HSL heat map in every theme.

## ECU boundary

No ECU write, burn, output-control, fault-clear or configuration command was introduced.
