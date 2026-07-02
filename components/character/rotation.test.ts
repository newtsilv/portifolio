import { getLimitedPointerRotation } from "./rotation";

describe("getLimitedPointerRotation", () => {
  it("maps pointer position to a limited character rotation", () => {
    expect(getLimitedPointerRotation(1, -1, 0.35, 0.18)).toEqual({
      x: -0.18,
      y: 0.35,
    });
  });

  it("clamps pointer values beyond the viewport range", () => {
    expect(getLimitedPointerRotation(4, -3, 0.35, 0.18)).toEqual({
      x: -0.18,
      y: 0.35,
    });
  });

  it("tilts down when the pointer is below the center", () => {
    expect(getLimitedPointerRotation(0, 1, 0.35, 0.18)).toEqual({
      x: 0.18,
      y: 0,
    });
  });

  it("turns left when the pointer is left of center", () => {
    expect(getLimitedPointerRotation(-1, 0, 0.35, 0.18)).toEqual({
      x: 0,
      y: -0.35,
    });
  });
});
