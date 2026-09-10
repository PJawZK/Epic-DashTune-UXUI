# EpicDash UX r21 radial-gauge performance optimization

## Observed r20 cost

r20 rebuilt the primary gauges with 224 individual SVG zone segments. At the dashboard's 20 Hz render cadence, every gauge update iterated all segments and toggled active classes. The six gauges also updated a second animated inner arc and four pointer coordinates, while SVG/CSS blur, glow, drop-shadow, radial gradients and transitions increased paint and compositing cost.

## r21 correction

- Replaces 224 zone segments with 20 static gauge-zone paths.
- Removes the secondary moving inner active arc requested by the user.
- Keeps one static colored zone band and one value pointer per gauge.
- Runtime updates change at most one SVG group transform per gauge, quantized to 0.25 degree.
- Skips pointer DOM writes when the visual angle has not changed.
- Removes SVG blur filters, glow, drop-shadow, animated transitions and decorative radial/repeating gradients from the primary gauges.
- Preserves the r20 grid, symbols, numeric scales, zone boundaries, status strips and responsive rules.

## Expected update-work reduction

At 20 Hz, the primary radial renderer changes from hundreds of class/style/attribute operations per render to at most six pointer transforms plus validity changes. Static artwork is constructed once when the dashboard loads.
