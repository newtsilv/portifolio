import { initState, reducer, windowKey } from "./windowState";

describe("windowState", () => {
  it("opens windows on top of each other, in order", () => {
    let state = initState([]);
    state = reducer(state, {
      type: "open",
      spec: { kind: "section", id: "about" },
    });
    state = reducer(state, {
      type: "open",
      spec: { kind: "section", id: "projects" },
    });

    const [about, projects] = state.windows;
    expect(state.windows).toHaveLength(2);
    expect(projects!.z).toBeGreaterThan(about!.z);
    expect(projects!.seq).toBeGreaterThan(about!.seq);
  });

  it("reuses the same window and updates its content when opened again", () => {
    let state = initState([{ kind: "properties", projectId: "p" }]);
    state = reducer(state, { type: "minimize", key: "properties:p" });
    state = reducer(state, {
      type: "open",
      spec: { kind: "properties", projectId: "p" },
    });

    expect(state.windows).toHaveLength(1);
    expect(state.windows[0]).toMatchObject({ minimized: false });
  });

  it("focus brings a window to the front and restores it", () => {
    let state = initState([
      { kind: "section", id: "about" },
      { kind: "section", id: "skills" },
    ]);
    state = reducer(state, { type: "minimize", key: "section:about" });
    state = reducer(state, { type: "focus", key: "section:about" });

    const about = state.windows.find((win) => win.key === "section:about")!;
    expect(about.minimized).toBe(false);
    expect(about.z).toBe(state.topZ);
  });

  it("closes and toggles maximize", () => {
    let state = initState([{ kind: "readme" }]);
    state = reducer(state, { type: "toggleMaximize", key: "readme" });
    expect(state.windows[0]!.maximized).toBe(true);
    state = reducer(state, { type: "close", key: "readme" });
    expect(state.windows).toHaveLength(0);
  });

  it("derives one key per project for secondary windows", () => {
    expect(windowKey({ kind: "properties", projectId: "edu" })).toBe(
      "properties:edu",
    );
    expect(windowKey({ kind: "section", id: "about" })).toBe("section:about");
  });
});
