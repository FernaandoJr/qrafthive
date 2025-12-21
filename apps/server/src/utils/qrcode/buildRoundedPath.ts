export function buildRoundedPath(
  x: number,
  y: number,
  size: number,
  radii: { tl: number; tr: number; br: number; bl: number },
) {
  const { tl, tr, br, bl } = radii;
  const x2 = x + size;
  const y2 = y + size;
  return [
    `M ${x + tl} ${y}`,
    `L ${x2 - tr} ${y}`,
    tr ? `Q ${x2} ${y} ${x2} ${y + tr}` : `L ${x2} ${y}`,
    `L ${x2} ${y2 - br}`,
    br ? `Q ${x2} ${y2} ${x2 - br} ${y2}` : `L ${x2} ${y2}`,
    `L ${x + bl} ${y2}`,
    bl ? `Q ${x} ${y2} ${x} ${y2 - bl}` : `L ${x} ${y2}`,
    `L ${x} ${y + tl}`,
    tl ? `Q ${x} ${y} ${x + tl} ${y}` : `L ${x} ${y}`,
    'Z',
  ].join(' ');
}
