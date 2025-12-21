export function makeBoxForLogo(
  px: number,
  py: number,
  cellSize: number,
  canvasSize: number,
  logoScaleNormalized: number,
) {
  const logoSize = Math.max(16, Math.floor(canvasSize * logoScaleNormalized));
  const logoX = (canvasSize - logoSize) / 2;
  const logoY = (canvasSize - logoSize) / 2;
  const clearMarginPx = 0;
  const clearSize = logoSize + clearMarginPx * 2;
  const clearX = logoX - clearMarginPx;
  const clearY = logoY - clearMarginPx;

  const cellX2 = px + cellSize;
  const cellY2 = py + cellSize;
  const clearX2 = clearX + clearSize;
  const clearY2 = clearY + clearSize;

  const intersects = px < clearX2 && cellX2 > clearX && py < clearY2 && cellY2 > clearY;

  return intersects;
}
