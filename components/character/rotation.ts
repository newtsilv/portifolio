export type RotationTarget = {
  x: number;
  y: number;
};

export function getLimitedPointerRotation(
  pointerX: number,
  pointerY: number,
  maxY: number,
  maxX: number,
): RotationTarget {
  const clampedX = Math.max(-1, Math.min(1, pointerX));
  const clampedY = Math.max(-1, Math.min(1, pointerY));

  return {
    x: clampedY * maxX,
    y: clampedX * maxY,
  };
}
