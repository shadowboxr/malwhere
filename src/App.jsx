import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState, createContext, useContext } from "react";

// ============================================================================
// DESIGN TOKENS
// ============================================================================
const tokens = {
  color: {
    bg: "#0D161C",
    surface: "#131D26",
    surfaceRaised: "#172330",
    border: "rgba(255,255,255,0.07)",
    borderSubtle: "rgba(255,255,255,0.04)",
    text: "#E4E9EF",
    textMuted: "rgba(228,233,239,0.70)",
    textFaint: "rgba(228,233,239,0.45)",
    accent: "#6226FB",
    accentGlow: "rgba(98,38,251,0.3)",
    accentSoft: "rgba(98,38,251,0.10)",
    accentText: "#B8A1FD",
    spangram: "#44FD2B",
    spangramGlow: "rgba(68,253,43,0.25)",
    spangramSoft: "rgba(68,253,43,0.08)",
    white: "#FFFFFF",
  },
  font: {
    display: "'Gellix', system-ui, sans-serif",
    body: "'Gellix', system-ui, sans-serif",
    mono: "'Roobert SemiMono', 'SF Mono', monospace",
  },
  ease: "cubic-bezier(0.16,1,0.3,1)",
};

// ============================================================================
// GAME DATA
// ============================================================================
const BOARD_ROWS = 8;
const BOARD_COLS = 8;

const BOARD_LETTERS = [
  ["S", "U", "P", "P", "L", "Y", "C", "H"],
  ["R", "A", "L", "O", "S", "N", "I", "A"],
  ["W", "I", "N", "D", "S", "S", "H", "A"],
  ["R", "T", "D", "U", "L", "U", "H", "I"],
  ["I", "V", "Y", "L", "I", "T", "E", "L"],
  ["X", "Y", "N", "L", "E", "T", "M", "L"],
  ["D", "E", "B", "U", "G", "D", "Y", "D"],
  ["S", "O", "I", "X", "A", "S", "I", "X"],
];

const WORDS = [
  {
    id: "SUPPLYCHAI",
    display: "Supply Chain",
    path: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,7],[1,6],[1,5]],
    isSpangram: true,
    card: {
      title: "Supply Chain",
      date: "Ongoing",
      artifact: "The open source supply chain",
      vector: "Attackers compromise trusted packages, build systems, and CI/CD pipelines to distribute malware through legitimate software channels",
      impact: "454,600 malicious packages discovered in 2025 alone — the attack surface grows with every dependency",
      remediation: "Verify provenance. Pin dependencies. Build from source. Trust nothing by default.",
    },
  },
  {
    id: "SOLARWINDS",
    display: "SolarWinds",
    path: [[1,4],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[2,2],[2,3],[2,4]],
    isSpangram: false,
    card: {
      title: "SolarWinds",
      date: "Dec 13, 2020",
      artifact: "SolarWinds Orion update",
      vector: "Nation-state actor compromised build system; SUNBURST backdoor injected into signed software updates",
      impact: "18,000 organizations installed trojanized updates including US Treasury, Commerce, and Homeland Security; persistent access maintained for 9+ months",
      remediation: "Isolate and rebuild all affected Orion servers; reset all credentials system-wide",
    },
  },
  {
    id: "SHAIHULUD",
    display: "Shai-Hulud",
    path: [[2,5],[2,6],[2,7],[3,7],[3,6],[3,5],[3,4],[3,3],[3,2]],
    isSpangram: false,
    card: {
      title: "Shai-Hulud",
      date: "Sep 15, 2025 & Nov 24, 2025",
      artifact: "npm packages (750+)",
      vector: "Maintainer bot credentials stolen and used to deploy malware running a pre-install script that works as a worm, publishing private credentials and secrets to public GitHub repos",
      impact: "25,000+ GitHub repositories and thousands of credentials compromised; $8.5M stolen from 2,500 Trust Wallet customers after attackers poisoned its Chrome extension",
      remediation: "Rotate all npm tokens; audit published package versions; verify package provenance before consumption",
    },
  },
  {
    id: "TRIVY",
    display: "Trivy",
    path: [[3,1],[3,0],[4,0],[4,1],[4,2]],
    isSpangram: false,
    card: {
      title: "Trivy",
      date: "Mar 20, 2026",
      artifact: "GitHub Actions and container image",
      vector: "83 versions of trivy-action and setup-trivy GitHub Actions hijacked to point to malicious commits after Trivy's GitHub credentials were compromised; poisoned Trivy container image also released",
      impact: "CI/CD secrets from 12,000+ repositories exfiltrated; used to publish malicious versions of downstream artifacts including LiteLLM, CanisterWorm, Checkmarx KICS, and Telnyx",
      remediation: "Check to ensure you are using known safe versions of Trivy artifacts",
    },
  },
  {
    id: "LITELLM",
    display: "LiteLLM",
    path: [[4,3],[4,4],[4,5],[4,6],[4,7],[5,7],[5,6]],
    isSpangram: false,
    card: {
      title: "LiteLLM",
      date: "Mar 24, 2026",
      artifact: "PyPI package",
      vector: "Maintainer's PyPI account compromised following Trivy supply chain attack",
      impact: "Credential harvester deployed to 95M monthly downloads designed to exfiltrate SSH keys, cloud tokens, Kubernetes secrets, and API keys",
      remediation: "Rotate all secret credentials if downloaded",
    },
  },
  {
    id: "TELNYX",
    display: "Telnyx",
    path: [[5,5],[5,4],[5,3],[5,2],[5,1],[5,0]],
    isSpangram: false,
    card: {
      title: "Telnyx",
      date: "Mar 27, 2026",
      artifact: "PyPI package",
      vector: "Maintainer's PyPI account compromised following Trivy supply chain attack",
      impact: "Any developer who downloaded the malicious versions had SSH keys, cloud credentials, and Kubernetes tokens exfiltrated from their environment",
      remediation: "Rotate all secret credentials if downloaded",
    },
  },
  {
    id: "AXIOS",
    display: "Axios",
    path: [[7,4],[7,3],[7,2],[7,1],[7,0]],
    isSpangram: false,
    card: {
      title: "Axios",
      date: "Mar 31, 2026",
      artifact: "npm package",
      vector: "Axios maintainer npm credentials hijacked following months-long social engineering campaign, leading to two backdoored versions referencing a malicious runtime dependency published to npm",
      impact: "Credential harvester deployed to 300M+ monthly downloads designed to exfiltrate SSH keys, cloud tokens, Kubernetes secrets, and API keys",
      remediation: "Rotate all secret credentials if downloaded",
    },
  },
  {
    id: "DEBUG",
    display: "debug",
    path: [[6,0],[6,1],[6,2],[6,3],[6,4]],
    isSpangram: false,
    card: {
      title: "debug",
      date: "Sep 2025",
      artifact: "npm package",
      vector: "Threat actors phished a high-profile maintainer's account and published 18 malicious packages with 2.6B+ weekly downloads that injected a crypto drainer into downstream apps",
      impact: "Malicious packages were designed to steal cryptocurrency",
      remediation: "Revert to known safe versions and rebuild applications",
    },
  },
  {
    id: "DYDX",
    display: "dYdX",
    path: [[6,5],[6,6],[6,7],[7,7]],
    isSpangram: false,
    card: {
      title: "dYdX",
      date: "Feb 6, 2026",
      artifact: "PyPI and npm packages",
      vector: "Compromised dydx developer accounts led to malicious Python and JavaScript packages being released to public registries",
      impact: "Affected organizations had cryptocurrency stolen and relevant cloud, GitHub, and API keys exfiltrated",
      remediation: "Isolate affected builds and revert to known safe versions",
    },
  },
  {
    id: "IS",
    display: "is",
    path: [[7,6],[7,5]],
    isSpangram: false,
    card: {
      title: "is",
      date: "July 19, 2025",
      artifact: "npm package",
      vector: "Phished maintainer credentials used to publish backdoored versions of the popular 'is' package (2.8M weekly downloads), infecting developers before npm removed them hours later",
      impact: "Developers who downloaded affected packages had secret keys exfiltrated",
      remediation: "Revert to known safe versions and rebuild applications",
    },
  },
];

// Precompute lookup maps (avoid repeated .find calls)
const WORDS_BY_ID = WORDS.reduce((acc, w) => { acc[w.id] = w; return acc; }, {});

// ============================================================================
// UTILITIES
// ============================================================================
const cellKey = (row, col) => `${row},${col}`;
const pathKey = (path) => path.map(([r, c]) => `${r},${c}`).join("|");
const isAdjacent = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
const pathsEqualEitherDir = (a, b) => {
  const ak = pathKey(a);
  return ak === pathKey(b) || ak === pathKey([...b].reverse());
};

const matchWord = (path, foundIds) => {
  if (path.length < 2) return null;
  return WORDS.find((w) => !foundIds.includes(w.id) && pathsEqualEitherDir(path, w.path)) || null;
};

// Compute hop duration for a word's celebration animation
const hopDurationFor = (path) => 550 + path.length * 70;

// ============================================================================
// GEOMETRY — unified word perimeter calculation (used by main board + demo)
// ============================================================================
function computeWordPerimeterPath(path, cellSize) {
  if (!path || path.length === 0) return "";
  const cellSet = new Set(path.map(([r, c]) => `${r},${c}`));
  const edges = [];
  for (const [r, c] of path) {
    const x1 = c * cellSize, y1 = r * cellSize;
    const x2 = (c + 1) * cellSize, y2 = (r + 1) * cellSize;
    if (!cellSet.has(`${r - 1},${c}`)) edges.push([x1, y1, x2, y1]);
    if (!cellSet.has(`${r},${c + 1}`)) edges.push([x2, y1, x2, y2]);
    if (!cellSet.has(`${r + 1},${c}`)) edges.push([x2, y2, x1, y2]);
    if (!cellSet.has(`${r},${c - 1}`)) edges.push([x1, y2, x1, y1]);
  }
  const paths = [];
  const used = new Set();
  for (let i = 0; i < edges.length; i++) {
    if (used.has(i)) continue;
    const loop = [edges[i]];
    used.add(i);
    while (true) {
      const [, , endX, endY] = loop[loop.length - 1];
      let found = -1;
      for (let j = 0; j < edges.length; j++) {
        if (used.has(j)) continue;
        if (edges[j][0] === endX && edges[j][1] === endY) { found = j; break; }
      }
      if (found === -1) break;
      loop.push(edges[found]);
      used.add(found);
    }
    const points = [[loop[0][0], loop[0][1]]];
    for (const [, , x2, y2] of loop) points.push([x2, y2]);
    const simplified = [points[0]];
    for (let k = 1; k < points.length - 1; k++) {
      const [px, py] = simplified[simplified.length - 1];
      const [cx, cy] = points[k];
      const [nx, ny] = points[k + 1];
      if ((cx - px) * (ny - cy) - (cy - py) * (nx - cx) !== 0) simplified.push(points[k]);
    }
    let d = `M${simplified[0][0]} ${simplified[0][1]}`;
    for (let k = 1; k < simplified.length; k++) d += `L${simplified[k][0]} ${simplified[k][1]}`;
    d += "Z";
    paths.push(d);
  }
  return paths.join(" ");
}

// ============================================================================
// GAME STATE REDUCER
// ============================================================================
const initialGameState = {
  phase: "loading",
  foundWords: [],
  selection: [],
  isDragging: false,
  dragMoved: false,
  flashingWord: null,
  shake: false,
  activeCard: null,
  scanning: false,
  scanHighlights: new Set(),
  scanNudge: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "START_SELECTION":
      return { ...state, isDragging: true, dragMoved: false, selection: [action.cell] };
    case "EXTEND_SELECTION":
      return { ...state, selection: action.selection, dragMoved: true };
    case "TRIM_SELECTION":
      return { ...state, selection: action.selection };
    case "TAP_CELL":
      return { ...state, isDragging: true, dragMoved: false, selection: action.selection };
    case "CLEAR_SELECTION":
      return { ...state, isDragging: false, selection: [], dragMoved: false };
    case "END_DRAG":
      return { ...state, isDragging: false };
    case "FLASH_WORD":
      return { ...state, flashingWord: action.flash, selection: [], isDragging: false, dragMoved: false };
    case "COMMIT_WORD": {
      const nextFound = [...state.foundWords, action.word.id];
      const complete = nextFound.length === WORDS.length;
      return {
        ...state,
        flashingWord: null,
        foundWords: nextFound,
        phase: complete ? "reveal" : state.phase,
      };
    }
    case "OPEN_CARD":
      return { ...state, activeCard: action.word };
    case "CLOSE_CARD":
      return { ...state, activeCard: null };
    case "SHOW_FINALE":
      return { ...state, phase: "complete" };
    case "SHAKE":
      return { ...state, shake: action.shake };
    case "START_SCAN":
      return { ...state, scanning: true, selection: [], scanNudge: false };
    case "SCAN_HIGHLIGHTS":
      return { ...state, scanHighlights: action.highlights };
    case "SCAN_TRACE":
      return { ...state, selection: action.selection, scanHighlights: new Set() };
    case "END_SCAN":
      return { ...state, scanning: false, scanHighlights: new Set() };
    case "SET_NUDGE":
      return { ...state, scanNudge: action.nudge };
    case "RESET":
      return { ...initialGameState, phase: "playing" };
    default:
      return state;
  }
}

// ============================================================================
// HOOKS
// ============================================================================
function useTimeouts() {
  const timers = useRef([]);
  const schedule = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id);
      fn();
    }, delay);
    timers.current.push(id);
    return id;
  }, []);
  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearAll, [clearAll]);
  return { schedule, clearAll };
}

// Detect coarse pointer (touch-primary) devices for input tuning
function useCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarse(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return isCoarse;
}

// Prefers-reduced-motion
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================
const ArrowIcon = ({ size = 12, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M11.2 5.6L11.2 2.8L8.4 2.8L8.4 5.6L11.2 5.6Z" fill={color} />
    <path d="M11.2 11.2L11.2 8.4L8.4 8.4L8.4 11.2L11.2 11.2Z" fill={color} />
    <path d="M8.4 2.8L8.4 0L5.6 0L5.6 2.8L8.4 2.8Z" fill={color} />
    <path d="M8.4 14L8.4 11.2L5.6 11.2L5.6 14L8.4 14Z" fill={color} />
    <path d="M8.4 8.4L8.4 5.6L5.6 5.6L5.6 8.4L8.4 8.4Z" fill={color} />
    <path d="M14 8.4L14 5.6L11.2 5.6L11.2 8.4L14 8.4Z" fill={color} />
    <path d="M2.8 8.4L2.8 5.6L0 5.6L0 8.4L2.8 8.4Z" fill={color} />
  </svg>
);

const SearchIcon = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx={11} cy={11} r={8} />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const CloseIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ============================================================================
// SHARED POINTER INPUT HOOK — unifies touch/mouse dedup + cell tracking
// ============================================================================
function usePointerCells(svgRef, rows, cols) {
  const lastTouchTimeRef = useRef(0);

  const isSyntheticMouseAfterTouch = useCallback((e) => {
    const isTouch = !!e.touches;
    const now = Date.now();
    if (isTouch) {
      lastTouchTimeRef.current = now;
      return false;
    }
    return now - lastTouchTimeRef.current < 500;
  }, []);

  const coordFromPointer = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const col = Math.floor(((clientX - rect.left) / rect.width) * cols);
    const row = Math.floor(((clientY - rect.top) / rect.height) * rows);
    if (row < 0 || row >= rows || col < 0 || col >= cols) return null;
    return [row, col];
  }, [svgRef, rows, cols]);

  const cellFromEvent = useCallback((e) => {
    const p = e.touches ? e.touches[0] : e;
    return coordFromPointer(p.clientX, p.clientY);
  }, [coordFromPointer]);

  return { isSyntheticMouseAfterTouch, cellFromEvent };
}

// ============================================================================
// BOARD
// ============================================================================
const BOARD_VIEWBOX = 400;
const CELL = BOARD_VIEWBOX / BOARD_COLS;

const ScheduleContext = createContext(null);
const useScheduleContext = () => useContext(ScheduleContext);

function Board({ state, dispatch, hoverCell, setHoverCell }) {
  const svgRef = useRef(null);
  const dragMovedRef = useRef(false);
  const { schedule } = useScheduleContext();
  const { isSyntheticMouseAfterTouch, cellFromEvent } = usePointerCells(svgRef, BOARD_ROWS, BOARD_COLS);
  const isCoarse = useCoarsePointer();

  // Cache word fill paths (they never change)
  const wordFillPaths = useMemo(() => {
    const map = {};
    WORDS.forEach((w) => { map[w.id] = computeWordPerimeterPath(w.path, CELL); });
    return map;
  }, []);

  const selectionFillPath = useMemo(
    () => state.selection.length ? computeWordPerimeterPath(state.selection, CELL) : "",
    [state.selection]
  );

  const flashFillPath = useMemo(
    () => state.flashingWord ? computeWordPerimeterPath(state.flashingWord.path, CELL) : "",
    [state.flashingWord]
  );

  // Derived per-cell states
  const cellStates = useMemo(() => {
    const map = {};
    for (const wid of state.foundWords) {
      const word = WORDS_BY_ID[wid];
      if (!word) continue;
      word.path.forEach(([r, c], idx) => {
        map[cellKey(r, c)] = { kind: word.isSpangram ? "foundSpangram" : "foundWord", pathIdx: idx };
      });
    }
    if (state.flashingWord) {
      state.flashingWord.path.forEach(([r, c], idx) => {
        map[cellKey(r, c)] = { kind: state.flashingWord.isSpangram ? "flashSpangram" : "flashWord", pathIdx: idx };
      });
    }
    for (const [r, c] of state.selection) {
      const k = cellKey(r, c);
      if (!map[k]) map[k] = { kind: "selected" };
    }
    for (const k of state.scanHighlights) {
      if (!map[k]) map[k] = { kind: "hint" };
    }
    if (hoverCell && !map[hoverCell] && !isCoarse) {
      map[hoverCell] = { kind: "hover" };
    }
    return map;
  }, [state.foundWords, state.flashingWord, state.selection, state.scanHighlights, hoverCell, isCoarse]);

  const submitWord = useCallback((word) => {
    dispatch({ type: "FLASH_WORD", flash: { path: word.path, isSpangram: word.isSpangram } });
    const hop = hopDurationFor(word.path);
    schedule(() => {
      dispatch({ type: "COMMIT_WORD", word });
      schedule(() => dispatch({ type: "OPEN_CARD", word }), 500);
    }, hop);
  }, [dispatch, schedule]);

  const rejectSelection = useCallback(() => {
    dispatch({ type: "SHAKE", shake: true });
    schedule(() => dispatch({ type: "SHAKE", shake: false }), 350);
    dispatch({ type: "CLEAR_SELECTION" });
  }, [dispatch, schedule]);

  const handlePointerDown = useCallback((e) => {
    if (state.phase !== "playing" || state.activeCard || state.scanning) return;
    if (isSyntheticMouseAfterTouch(e)) return;
    e.preventDefault();
    const cell = cellFromEvent(e);
    if (!cell) return;
    dragMovedRef.current = false;

    if (state.selection.length === 0) {
      dispatch({ type: "START_SELECTION", cell });
      return;
    }
    const selection = state.selection;
    const lastIdx = selection.length - 1;
    const foundAt = selection.findIndex(([r, c]) => r === cell[0] && c === cell[1]);

    if (foundAt === lastIdx) {
      // Tap last = submit
      const matched = matchWord(selection, state.foundWords);
      if (matched) submitWord(matched);
      else if (selection.length >= 2) rejectSelection();
      else dispatch({ type: "CLEAR_SELECTION" });
      return;
    }
    if (foundAt >= 0) {
      dispatch({ type: "TRIM_SELECTION", selection: selection.slice(0, foundAt + 1) });
      return;
    }
    const prev = selection[lastIdx];
    if (isAdjacent(prev, cell)) {
      const next = [...selection, cell];
      const matched = matchWord(next, state.foundWords);
      if (matched) submitWord(matched);
      else dispatch({ type: "TAP_CELL", selection: next });
    } else {
      dispatch({ type: "TAP_CELL", selection: [cell] });
    }
  }, [state.phase, state.activeCard, state.scanning, state.selection, state.foundWords,
      isSyntheticMouseAfterTouch, cellFromEvent, dispatch, submitWord, rejectSelection]);

  const handlePointerMove = useCallback((e) => {
    if (!state.isDragging) return;
    e.preventDefault();
    const cell = cellFromEvent(e);
    if (!cell || state.selection.length === 0) return;
    const last = state.selection[state.selection.length - 1];
    if (cell[0] === last[0] && cell[1] === last[1]) return;
    dragMovedRef.current = true;

    if (state.selection.length >= 2) {
      const prev = state.selection[state.selection.length - 2];
      if (cell[0] === prev[0] && cell[1] === prev[1]) {
        dispatch({ type: "EXTEND_SELECTION", selection: state.selection.slice(0, -1) });
        return;
      }
    }
    if (state.selection.some(([r, c]) => r === cell[0] && c === cell[1])) return;
    if (!isAdjacent(last, cell)) return;
    dispatch({ type: "EXTEND_SELECTION", selection: [...state.selection, cell] });
  }, [state.isDragging, state.selection, cellFromEvent, dispatch]);

  const handlePointerUp = useCallback(() => {
    if (!state.isDragging) return;
    dispatch({ type: "END_DRAG" });
    if (!dragMovedRef.current) return;
    const matched = matchWord(state.selection, state.foundWords);
    if (matched) submitWord(matched);
    else if (state.selection.length >= 2) rejectSelection();
  }, [state.isDragging, state.selection, state.foundWords, dispatch, submitWord, rejectSelection]);

  useEffect(() => {
    if (!state.isDragging) return;
    const up = () => handlePointerUp();
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    window.addEventListener("touchcancel", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
    };
  }, [state.isDragging, handlePointerUp]);

  const interactive = state.phase === "playing" && !state.activeCard && !state.scanning;

  return (
    <div
      style={{
        width: "100%", maxWidth: 420,
        animation: state.shake ? "shake 0.35s ease" : undefined,
        touchAction: "none", userSelect: "none", WebkitUserSelect: "none",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${BOARD_VIEWBOX} ${BOARD_VIEWBOX}`}
        width="100%"
        height="auto"
        role="application"
        aria-label="Word puzzle board"
        style={{ display: "block", cursor: interactive ? "pointer" : "default" }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
      >
        {/* Found word fills */}
        {state.foundWords.map((wid) => {
          const word = WORDS_BY_ID[wid];
          if (!word) return null;
          return (
            <path
              key={`fill-${wid}`}
              d={wordFillPaths[wid]}
              fill={word.isSpangram ? tokens.color.spangram : tokens.color.accent}
              stroke="rgba(0,0,0,0.45)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ pointerEvents: "none" }}
            />
          );
        })}

        {/* Flashing word */}
        {state.flashingWord && (
          <path
            d={flashFillPath}
            fill={state.flashingWord.isSpangram ? tokens.color.spangram : tokens.color.accent}
            stroke="rgba(0,0,0,0.45)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ pointerEvents: "none" }}
          />
        )}

        {/* Selection fill + dashed outline */}
        {selectionFillPath && (
          <>
            <path d={selectionFillPath} fill="rgba(98,38,251,0.08)" style={{ pointerEvents: "none" }} />
            <path
              d={selectionFillPath}
              fill="none"
              stroke={`${tokens.color.accent}55`}
              strokeWidth={1.5}
              strokeDasharray="3,3"
              style={{ pointerEvents: "none" }}
            />
          </>
        )}

        {/* Cells */}
        {BOARD_LETTERS.map((row, r) => row.map((letter, c) => {
          const key = cellKey(r, c);
          const entry = cellStates[key] || { kind: "default" };
          const cx = c * CELL + CELL / 2;
          const cy = r * CELL + CELL / 2;

          let fill = "transparent";
          let textColor = tokens.color.textMuted;
          let hopAnim = false;

          switch (entry.kind) {
            case "foundWord": textColor = tokens.color.white; break;
            case "foundSpangram": textColor = tokens.color.bg; break;
            case "flashWord": textColor = tokens.color.white; hopAnim = true; break;
            case "flashSpangram": textColor = tokens.color.bg; hopAnim = true; break;
            case "selected": textColor = tokens.color.text; break;
            case "hint":
              fill = "rgba(98,38,251,0.12)";
              textColor = tokens.color.text;
              break;
            case "hover":
              fill = "rgba(255,255,255,0.03)";
              textColor = "rgba(228,233,239,0.82)";
              break;
          }

          const pathIdx = entry.pathIdx ?? 0;

          return (
            <g
              key={key}
              onMouseEnter={interactive && !state.isDragging ? () => setHoverCell(key) : undefined}
              onMouseLeave={interactive ? () => setHoverCell((h) => (h === key ? null : h)) : undefined}
            >
              <rect
                x={c * CELL}
                y={r * CELL}
                width={CELL}
                height={CELL}
                fill={fill}
                style={{
                  transition: "fill 0.18s ease",
                  animation: entry.kind === "hint" ? "hintPulse 1.5s ease-in-out" : undefined,
                }}
              />
              <g style={{
                transformOrigin: `${cx}px ${cy}px`,
                animation: hopAnim ? `letterHop 0.55s ${pathIdx * 0.07}s ${tokens.ease} both` : undefined,
              }}>
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fontFamily: tokens.font.display,
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: "0.02em",
                    fill: textColor,
                    transition: "fill 0.3s ease",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    pointerEvents: "none",
                  }}
                >{letter}</text>
              </g>
            </g>
          );
        }))}

        {/* Drag polyline */}
        {state.selection.length >= 2 && (
          <polyline
            points={state.selection.map(([r, c]) => `${c * CELL + CELL / 2},${r * CELL + CELL / 2}`).join(" ")}
            fill="none"
            stroke={`${tokens.color.accent}AA`}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
            style={{ pointerEvents: "none" }}
          />
        )}
      </svg>
    </div>
  );
}

// ============================================================================
// WORD PILLS
// ============================================================================
function WordPill({ word, found, onClick }) {
  const isSpangram = word.isSpangram;
  const bg = found ? (isSpangram ? tokens.color.spangram : tokens.color.accent) : "rgba(255,255,255,0.06)";
  const color = found ? (isSpangram ? tokens.color.spangram : tokens.color.accentText) : tokens.color.textFaint;
  const border = found ? (isSpangram ? tokens.color.spangram : `${tokens.color.accent}88`) : tokens.color.borderSubtle;
  const bgSoft = found ? (isSpangram ? tokens.color.spangramSoft : tokens.color.accentSoft) : "transparent";
  const clickable = found && !!onClick;

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      aria-label={found ? `View ${word.display} details` : "Unrevealed word"}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "5px 10px", borderRadius: 0,
        border: `1.5px solid ${border}`, background: bgSoft,
        opacity: found ? 1 : 0.25,
        transition: `all 0.4s ${tokens.ease}`,
        cursor: clickable ? "pointer" : "default",
        font: "inherit",
      }}
    >
      <span style={{
        width: 4, height: 4, borderRadius: "50%", background: bg, flexShrink: 0,
        transition: "background 0.3s",
      }} />
      <span style={{
        fontFamily: tokens.font.mono, fontSize: 9.5, fontWeight: 600,
        letterSpacing: "0.05em", textTransform: "uppercase", color,
        transition: "color 0.3s",
      }}>{found ? word.display : "•••"}</span>
    </button>
  );
}

// ============================================================================
// FOOTER
// ============================================================================
function ChainguardLogo() {
  return (
    <svg viewBox="0 0 325 52" width={65} height={10} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Chainguard">
      <path fill="#fff" fillRule="evenodd" d="M44.35,28.13c.43-1.47.66-3.08.66-4.83C45.01,12.34,35.97,0,26.94,0S8.87,12.34,8.87,23.3c0,2.39.43,4.52,1.2,6.38l-5.43-.31c-2.21-.12-4.25,1.46-3.9,3.65.13.85.39,1.72.84,2.47-1.54,1.08-2.16,3.08-.92,4.64,1.25,1.57,3.08,3.01,5.6,3.01,2.73,0,4.38-.71,5.37-1.6.07.39.22.77.46,1.13,1.23,1.87,3.26,3.92,6.26,3.92,5.11,0,5.68-3.22,5.96-4.83.02-.13.04-.24.06-.35l3.41-1.71,3.41,1.71c.02.1.04.22.06.35.29,1.61.86,4.83,5.96,4.83,3,0,5.03-2.05,6.26-3.92.05-.07.09-.15.13-.22.96.42,2.24.69,3.93.69,2.52,0,4.35-1.44,5.6-3.01,1.53-1.92.23-4.49-2.11-5.22l-.77-.24c2.27-1.18,2.6-3.4,2.36-5.35-.27-2.2-2.67-3.15-4.76-2.42l-3.53,1.24ZM27.8,39.67h0,0s0,0,0,0Z" />
      <path fill="#fff" d="M85.32,41.74c-10.37,0-17-6.75-17-18.64,0-11.24,7.48-18.14,17.35-18.14,8.52,0,14.66,4.9,15.55,13.19h-6.78c-.65-4.55-3.64-7.65-8.77-7.65-6.18,0-10.62,4.75-10.62,12.59s4.39,13.09,10.47,13.09c5.18,0,8.62-3.35,9.32-8h6.53c-.85,8.1-6.68,13.54-16.05,13.54ZM106.12,40.84V5.86h6.08v11.69c0,.7-.05,1.45-.2,2.4,1.35-2.45,3.64-4.3,7.48-4.3,5.38,0,8.57,3.8,8.57,9.8v15.39h-6.08v-14.49c0-3.6-1.74-5.85-4.59-5.85-2.99,0-5.18,2.65-5.18,6.05v14.29h-6.08ZM141.14,41.74c-4.24,0-8.38-2.8-8.38-7.6,0-5.5,4.24-7.4,9.47-8.1l3.49-.45c1.99-.25,2.69-1,2.69-2.2,0-1.7-1.4-3.2-3.99-3.2-2.84,0-4.64,1.6-4.89,4.15h-6.28c.4-5.1,4.54-8.7,10.82-8.7,7.43,0,10.42,4,10.42,10.84v14.34h-5.63v-1c0-.8.1-1.55.25-2.35-1.3,2.4-3.79,4.25-7.98,4.25ZM142.79,37.25c3.24,0,5.83-2.4,5.83-5.85v-2.65c-.55.5-1.4.75-2.89,1.05l-1.99.4c-2.84.55-4.79,1.5-4.79,3.7s1.7,3.35,3.84,3.35ZM160.45,40.84v-24.39h6.08v24.39h-6.08ZM160.3,12.76v-6.4h6.33v6.4h-6.33ZM172.82,40.84v-24.39h6.08v1.1c0,.7-.05,1.45-.2,2.4,1.35-2.45,3.64-4.3,7.48-4.3,5.38,0,8.57,3.8,8.57,9.8v15.39h-6.08v-14.49c0-3.6-1.75-5.85-4.59-5.85-2.99,0-5.18,2.65-5.18,6.05v14.29h-6.08ZM211.62,51.94c-7.18,0-11.27-3.85-11.27-9.4h6.18c.1,2.9,1.94,4.6,5.23,4.6s5.88-1.9,5.88-5.55v-2.65c0-1.1.05-2.1.2-3.05-1.45,2.2-3.79,4.05-7.58,4.05-6.33,0-10.92-4.45-10.92-12.14s5.28-12.14,10.62-12.14c4.29,0,6.43,1.75,7.88,4.3-.15-.85-.2-1.5-.2-2.4v-1.1h6.08v23.64c0,8-4.94,11.84-12.11,11.84ZM211.82,35.1c3.59,0,6.18-3.05,6.18-7.3s-2.59-7.3-6.18-7.3-6.28,3.05-6.28,7.3,2.59,7.3,6.28,7.3ZM238.44,41.74c-4.89,0-8.72-3.35-8.72-9.8v-15.49h6.13v14.54c0,3.4,1.49,5.85,4.44,5.85,3.09,0,5.28-2.3,5.28-5.9v-14.49h6.08v24.39h-6.03v-1c0-.75.1-1.6.25-2.35-1.25,2.35-3.39,4.25-7.43,4.25ZM264.99,41.74c-4.24,0-8.37-2.8-8.37-7.6,0-5.5,4.24-7.4,9.47-8.1l3.49-.45c1.99-.25,2.69-1,2.69-2.2,0-1.7-1.4-3.2-3.99-3.2-2.84,0-4.64,1.6-4.89,4.15h-6.28c.4-5.1,4.54-8.7,10.82-8.7,7.43,0,10.42,4,10.42,10.84v14.34h-5.63v-1c0-.8.1-1.55.25-2.35-1.3,2.4-3.79,4.25-7.98,4.25ZM266.63,37.25c3.24,0,5.83-2.4,5.83-5.85v-2.65c-.55.5-1.4.75-2.89,1.05l-1.99.4c-2.84.55-4.79,1.5-4.79,3.7s1.7,3.35,3.84,3.35ZM284.29,40.84v-24.39h6.08v1.85c0,.9-.05,1.65-.2,2.55,1.3-2.75,3.49-5.2,7.13-5.2.5,0,.9.05,1.3.15v5.9c-.4-.1-.95-.2-1.75-.2-3.74,0-6.48,1.9-6.48,7.25v12.09h-6.08ZM311.49,41.74c-6.43,0-11.12-4.4-11.12-12.99s5.53-13.09,11.22-13.09c3.79,0,6.13,1.95,7.53,4.3-.2-.9-.2-1.65-.2-2.4V5.86h6.08v34.98h-6.08v-1c0-.85,0-1.5.2-2.35-.95,1.8-3.14,4.25-7.63,4.25ZM312.93,36.95c3.64,0,6.33-3.35,6.33-8.25s-2.69-8.2-6.33-8.2-6.38,3.35-6.38,8.2,2.74,8.25,6.38,8.25Z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "16px 16px 24px", opacity: 0.35, position: "relative", zIndex: 1, flexShrink: 0 }}>
      <div style={{
        maxWidth: 480, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: tokens.font.mono, fontWeight: 400,
            fontSize: "clamp(7px, 1.8vw, 9px)", letterSpacing: "0.06em",
            textTransform: "uppercase", color: tokens.color.text,
          }}>A word game by</span>
          <ChainguardLogo />
        </div>
        <a
          href="https://www.chainguard.dev/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: tokens.font.mono, fontWeight: 400,
            fontSize: "clamp(7px, 1.8vw, 9px)", letterSpacing: "0.08em",
            textTransform: "uppercase", color: tokens.color.text, textDecoration: "none",
          }}
        >CHAINGUARD.DEV</a>
      </div>
    </footer>
  );
}

// ============================================================================
// LOADING
// ============================================================================
function LoadingOverlay({ onComplete }) {
  const [pct, setPct] = useState(0);
  const [rawProgress, setRawProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = 2800;
    let start = null;
    let raf;
    const tick = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setRawProgress(eased);
      setPct(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        setTimeout(onComplete, 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const rectH = 107.267, rectW = 415.716;
  const fillH = rectH * rawProgress;
  const clipY = rectH - fillH;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1 }}>
      <div style={{ width: "80%", maxWidth: 380 }}>
        <svg viewBox="0 0 1036 223" width="100%" fill="none" aria-label="Loading Malwhere">
          <defs>
            <clipPath id="fillClip"><rect x={0} y={clipY} width={rectW} height={fillH} /></clipPath>
          </defs>
          <path d="M8.6265 127.6V1.79719H50.3213L81.5923 77.4588L115.379 1.79719H150.245V127.6H116.098V67.754L91.1174 127.6H66.6757L42.7731 67.754V127.6H8.6265ZM228.744 1.79719L278.706 127.6H241.684L235.933 112.145H194.058L188.307 127.6H152.184L201.786 1.79719H228.744ZM205.021 83.0301H225.329L215.265 55.8925L205.021 83.0301ZM280.585 1.79719H314.731V94.8915H368.826V127.6H280.585V1.79719ZM495.132 1.79719H530.896L489.381 127.6H462.423L440.318 60.2058L418.752 127.6H391.614L349.919 1.79719H386.223L405.812 69.012L427.199 1.79719H454.156L475.723 69.1917L495.132 1.79719ZM611.582 1.79719H645.728V127.6H611.582V79.0763H567.91V127.6H533.763V1.79719H567.91V46.3674H611.582V1.79719ZM657.545 1.79719H738.418V34.506H691.691V47.8052H733.386V80.514H691.691V94.8915H738.418V127.6H657.545V1.79719ZM748.331 127.6V1.79719H798.472C803.864 1.79719 809.016 2.8755 813.928 5.03213C818.84 7.06894 823.214 10.0043 827.048 13.8384C830.882 17.5525 833.937 21.8658 836.213 26.7781C838.49 31.5706 839.628 36.7824 839.628 42.4136C839.628 49.842 838.25 56.4317 835.494 62.1827C832.739 67.8139 828.905 72.3668 823.992 75.8413L855.623 127.6H814.288L789.486 83.0301H782.477V127.6H748.331ZM782.477 53.7359H794.878C797.634 53.7359 800.03 52.8373 802.067 51.0401C804.103 49.1231 805.122 46.8467 805.122 44.2108C805.122 41.5749 804.103 39.3584 802.067 37.5612C800.03 35.6442 797.634 34.6857 794.878 34.6857H782.477V53.7359ZM854.21 1.79719H935.084V34.506H888.357V47.8052H930.052V80.514H888.357V94.8915H935.084V127.6H854.21V1.79719ZM986.511 0C995.138 0 1002.87 1.73728 1009.7 5.21184C1016.64 8.68641 1022.16 13.419 1026.23 19.4096C1030.3 25.2804 1032.34 31.93 1032.34 39.3584C1032.34 46.1877 1031.32 51.9387 1029.28 56.6114C1027.25 61.1643 1024.67 64.9384 1021.56 67.9337C1018.56 70.8092 1015.57 73.2654 1012.57 75.3022C1009.58 77.2192 1007 78.9565 1004.84 80.514C1002.81 82.0716 1001.79 83.749 1001.79 85.5461H968.54C968.54 79.1961 969.498 74.164 971.415 70.4498C973.332 66.7356 975.728 63.7403 978.604 61.4638C981.479 59.1874 984.355 57.2704 987.23 55.7128C990.106 54.1553 992.502 52.4779 994.419 50.6807C996.336 48.7637 997.295 46.2476 997.295 43.1325C997.295 39.6579 996.216 37.1419 994.06 35.5843C991.903 34.0268 989.267 33.248 986.152 33.248C981.36 33.248 977.885 34.8055 975.728 37.9207C973.692 41.0358 972.733 44.6901 972.853 48.8835H938.527C938.167 39.7778 940.024 31.5706 944.098 24.262C948.291 16.8337 954.102 10.9628 961.531 6.6496C968.959 2.21653 977.286 0 986.511 0ZM985.613 129.398C980.102 129.398 975.429 127.54 971.595 123.826C967.761 119.992 965.844 115.379 965.844 109.988C965.844 104.596 967.761 100.043 971.595 96.3293C975.429 92.6151 980.102 90.758 985.613 90.758C991.244 90.758 995.917 92.6151 999.631 96.3293C1003.46 100.043 1005.38 104.596 1005.38 109.988C1005.38 115.379 1003.46 119.992 999.631 123.826C995.917 127.54 991.244 129.398 985.613 129.398Z" fill={tokens.color.white} />
          <rect width={rectW} height={rectH} transform="translate(305.823 115.828) rotate(-5.72635)" fill={tokens.color.bg} />
          <g transform="translate(305.823 115.828) rotate(-5.72635)">
            <rect x={0} y={0} width={rectW} height={rectH} fill={tokens.color.accent} clipPath="url(#fillClip)" />
          </g>
          {done && (
            <path d="M346.091 150.273L346.778 157.127C348.162 154.392 349.964 152.228 352.184 150.636C354.475 149.036 357.156 148.082 360.226 147.774C366.936 147.101 372.398 148.717 376.611 152.621C380.889 156.446 383.400 162.071 384.144 169.496L387.130 199.266L372.031 200.780L369.239 172.938C368.895 169.511 367.691 166.855 365.628 164.971C363.564 163.087 360.961 162.302 357.820 162.617C354.679 162.932 352.248 164.222 350.528 166.485C348.880 168.742 348.227 171.583 348.571 175.010L351.363 202.852L336.264 204.367L330.991 151.787L346.091 150.273ZM413.794 142.402C418.935 141.887 423.661 142.639 427.974 144.658C432.351 146.599 435.960 149.518 438.803 153.415C441.645 157.312 443.328 161.867 443.850 167.078C444.373 172.290 443.628 177.087 441.616 181.472C439.597 185.784 436.639 189.362 432.741 192.204C428.908 194.968 424.422 196.608 419.282 197.123C414.142 197.639 409.383 196.926 405.006 194.986C400.622 192.973 397.012 190.054 394.177 186.229C391.406 182.324 389.759 177.766 389.237 172.555C388.714 167.343 389.423 162.549 391.364 158.172C393.376 153.788 396.334 150.210 400.238 147.439C404.136 144.597 408.654 142.918 413.794 142.402ZM415.244 156.859C411.675 157.217 408.801 158.767 406.625 161.509C404.441 164.180 403.535 167.371 403.907 171.084C404.272 174.724 405.794 177.673 408.472 179.928C411.142 182.112 414.263 183.025 417.832 182.667C421.402 182.309 424.243 180.798 426.355 178.135C428.532 175.392 429.438 172.201 429.072 168.560C428.700 164.848 427.179 161.900 424.508 159.716C421.902 157.453 418.814 156.501 415.244 156.859ZM476.826 191.028C470.686 191.644 465.496 190.218 461.254 186.749C457.084 183.274 454.644 178.002 453.935 170.934L452.249 154.122L442.505 155.099L441.066 140.749L450.810 139.772L449.425 125.958L464.524 124.444L465.910 138.258L478.867 136.959L480.306 151.308L467.349 152.608L469.013 169.206C469.299 172.062 470.364 174.046 472.206 175.159C474.048 176.272 476.290 176.697 478.931 176.432C479.503 176.374 480.141 176.274 480.848 176.131C481.555 175.988 482.187 175.817 482.744 175.617L484.140 189.538C483.169 189.924 481.973 190.224 480.552 190.438C479.210 190.717 477.968 190.914 476.826 191.028ZM542.429 155.570C542.086 152.144 540.882 149.488 538.818 147.604C536.754 145.720 534.152 144.935 531.011 145.250C527.869 145.565 525.439 146.855 523.719 149.118C522.070 151.375 521.418 154.216 521.762 157.643L524.554 185.485L509.454 186.999L501.938 112.039L517.037 110.525L519.968 139.760C521.353 137.025 523.155 134.861 525.374 133.269C527.666 131.669 530.346 130.715 533.416 130.407C540.127 129.734 545.589 131.350 549.802 135.254C554.079 139.079 556.590 144.704 557.335 152.129L560.320 181.899L545.221 183.413L542.429 155.570ZM592.686 179.735C587.546 180.250 582.749 179.505 578.293 177.501C573.902 175.417 570.285 172.427 567.442 168.529C564.593 164.561 562.910 160.006 562.395 154.866C561.887 149.798 562.642 145.107 564.661 140.794C566.673 136.410 569.596 132.836 573.429 130.072C577.326 127.230 581.845 125.551 586.985 125.035C591.768 124.556 596.202 125.265 600.286 127.163C604.434 128.982 607.883 131.737 610.633 135.427C613.376 139.046 614.990 143.283 615.477 148.137C615.541 148.780 615.595 149.676 615.638 150.825C615.746 151.896 615.771 152.867 615.714 153.738L576.842 157.636C577.742 160.863 579.471 163.357 582.027 165.120C584.576 166.811 587.636 167.478 591.205 167.120C594.061 166.834 596.324 166.030 597.994 164.709C599.664 163.387 600.660 161.809 600.980 159.975L615.758 158.493C615.567 162.334 614.472 165.796 612.473 168.881C610.468 171.895 607.759 174.365 604.347 176.294C601.000 178.144 597.113 179.291 592.686 179.735ZM576.475 147.505L599.177 145.229C598.627 142.616 597.238 140.628 595.010 139.265C592.846 137.824 590.337 137.246 587.481 137.532C584.625 137.819 582.198 138.783 580.200 140.426C578.273 142.061 577.031 144.421 576.475 147.505ZM623.501 175.563L618.228 122.984L633.328 121.470L633.950 127.681C635.156 125.325 636.873 123.386 639.100 121.864C641.320 120.272 643.893 119.329 646.820 119.035C647.605 118.956 648.433 118.946 649.304 119.002C650.175 119.059 651.011 119.120 651.810 119.184L653.185 132.891C652.307 132.762 651.396 132.673 650.454 132.624C649.583 132.567 648.684 132.585 647.755 132.678C644.115 133.043 641.124 134.497 638.783 137.039C636.442 139.581 635.515 143.280 636.001 148.134L638.600 174.049L623.501 175.563ZM683.831 170.595C678.691 171.110 673.893 170.366 669.437 168.361C665.046 166.277 661.429 163.287 658.587 159.390C655.737 155.421 654.055 150.867 653.539 145.727C653.031 140.658 653.786 135.967 655.806 131.654C657.818 127.270 660.740 123.696 664.573 120.932C668.470 118.090 672.989 116.411 678.129 115.896C682.912 115.416 687.346 116.125 691.430 118.023C695.579 119.842 699.028 122.597 701.777 126.287C704.520 129.906 706.134 134.143 706.621 138.998C706.686 139.640 706.739 140.536 706.783 141.685C706.890 142.756 706.915 143.727 706.858 144.598L667.986 148.496C668.887 151.723 670.615 154.218 673.171 155.980C675.721 157.672 678.780 158.338 682.349 157.980C685.205 157.694 687.468 156.890 689.138 155.569C690.808 154.248 691.804 152.670 692.125 150.835L706.903 149.353C706.711 153.194 705.616 156.657 703.618 159.741C701.612 162.755 698.904 165.226 695.492 167.154C692.144 169.004 688.257 170.151 683.831 170.595ZM667.619 138.366L690.322 136.089C689.771 133.476 688.382 131.488 686.154 130.125C683.991 128.684 681.481 128.106 678.625 128.393C675.770 128.679 673.343 129.644 671.344 131.286C669.417 132.922 668.175 135.281 667.619 138.366Z"
              fill={tokens.color.white}
              style={{ animation: `notHereIn 0.9s ${tokens.ease} both` }}
            />
          )}
        </svg>
      </div>
      <div
        style={{
          marginTop: 32, fontFamily: tokens.font.mono, fontWeight: 600,
          fontSize: 13, letterSpacing: "0.08em", color: tokens.color.textMuted, textAlign: "center",
        }}
        aria-live="polite"
      >{pct}%</div>
    </div>
  );
}

// ============================================================================
// ONBOARDING — Interactive demo
// ============================================================================
const DEMO_GRID = [["B","U","G","X"],["I","O","D","E"],["L","C","A","P"]];
const DEMO_TARGET_PATH = [[2,1],[1,1],[1,2],[1,3]]; // C-O-D-E
const DEMO_CELL = 50;
const DEMO_GRID_W = 4 * DEMO_CELL;
const DEMO_GRID_H = 3 * DEMO_CELL;

function InteractiveDemo({ stepKey }) {
  const [selectedPath, setSelectedPath] = useState([]);
  const [hoverCell, setHoverCell] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false });
  const [cursorPressed, setCursorPressed] = useState(false);
  const [gestureLabel, setGestureLabel] = useState("");
  const [userInteracted, setUserInteracted] = useState(false);
  const [isDraggingUser, setIsDraggingUser] = useState(false);
  const [solved, setSolved] = useState(false);
  const [hopTrigger, setHopTrigger] = useState(0);
  const timersRef = useRef([]);
  const svgRef = useRef(null);
  const { isSyntheticMouseAfterTouch, cellFromEvent } = usePointerCells(svgRef, 3, 4);

  const cellCenter = useCallback((row, col) => ({
    x: col * DEMO_CELL + DEMO_CELL / 2,
    y: row * DEMO_CELL + DEMO_CELL / 2,
  }), []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scheduleDemo = useCallback((ms, fn) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const runDemo = useCallback(() => {
    clearTimers();
    setSelectedPath([]);
    setHoverCell(null);
    setCursorPressed(false);
    setGestureLabel("");

    const c = cellCenter(DEMO_TARGET_PATH[0][0], DEMO_TARGET_PATH[0][1]);
    const o = cellCenter(DEMO_TARGET_PATH[1][0], DEMO_TARGET_PATH[1][1]);
    const startPos = { x: c.x - 45, y: c.y + 45 };

    setCursorPos({ x: startPos.x, y: startPos.y, visible: false });

    // TAP DEMO
    scheduleDemo(300, () => {
      setGestureLabel("TAP");
      setCursorPos({ x: startPos.x, y: startPos.y, visible: true });
    });
    scheduleDemo(600, () => setCursorPos({ x: c.x, y: c.y, visible: true }));
    scheduleDemo(1000, () => setHoverCell(`${DEMO_TARGET_PATH[0][0]},${DEMO_TARGET_PATH[0][1]}`));
    scheduleDemo(1300, () => setCursorPressed(true));
    scheduleDemo(1550, () => {
      setCursorPressed(false);
      setSelectedPath([DEMO_TARGET_PATH[0]]);
      setHoverCell(null);
    });
    scheduleDemo(1950, () => setCursorPos({ x: o.x, y: o.y, visible: true }));
    scheduleDemo(2350, () => setHoverCell(`${DEMO_TARGET_PATH[1][0]},${DEMO_TARGET_PATH[1][1]}`));
    scheduleDemo(2600, () => setCursorPressed(true));
    scheduleDemo(2850, () => {
      setCursorPressed(false);
      setSelectedPath([DEMO_TARGET_PATH[0], DEMO_TARGET_PATH[1]]);
      setHoverCell(null);
    });
    scheduleDemo(3700, () => {
      setGestureLabel("");
      setSelectedPath([]);
    });
    scheduleDemo(3900, () => setCursorPos((p) => ({ ...p, visible: false })));

    // DRAG DEMO
    scheduleDemo(4400, () => {
      setGestureLabel("DRAG");
      setCursorPos({ x: startPos.x, y: startPos.y, visible: true });
    });
    scheduleDemo(4700, () => setCursorPos({ x: c.x, y: c.y, visible: true }));
    scheduleDemo(5100, () => setHoverCell(`${DEMO_TARGET_PATH[0][0]},${DEMO_TARGET_PATH[0][1]}`));
    scheduleDemo(5400, () => {
      setCursorPressed(true);
      setSelectedPath([DEMO_TARGET_PATH[0]]);
      setHoverCell(null);
    });
    scheduleDemo(5700, () => setCursorPos({ x: o.x, y: o.y, visible: true }));
    scheduleDemo(5950, () => setSelectedPath([DEMO_TARGET_PATH[0], DEMO_TARGET_PATH[1]]));
    scheduleDemo(6400, () => setCursorPressed(false));
    scheduleDemo(7100, () => {
      setGestureLabel("");
      setSelectedPath([]);
    });
    scheduleDemo(7300, () => setCursorPos((p) => ({ ...p, visible: false })));

    scheduleDemo(10800, runDemo);
  }, [cellCenter, clearTimers, scheduleDemo]);

  useEffect(() => {
    if (userInteracted) return;
    runDemo();
    return clearTimers;
  }, [stepKey, userInteracted, runDemo, clearTimers]);

  const takeOver = useCallback(() => {
    if (userInteracted) return;
    clearTimers();
    setUserInteracted(true);
    setCursorPos((p) => ({ ...p, visible: false }));
    setGestureLabel("");
    setSelectedPath([]);
    setHoverCell(null);
  }, [userInteracted, clearTimers]);

  const checkSolved = useCallback((path) => {
    if (path.length !== DEMO_TARGET_PATH.length) return false;
    return pathsEqualEitherDir(path, DEMO_TARGET_PATH);
  }, []);

  const triggerSolve = useCallback(() => {
    setSolved(true);
    setHopTrigger((h) => h + 1);
  }, []);

  const resetUserDemo = useCallback(() => {
    setSolved(false);
    setSelectedPath([]);
    setHoverCell(null);
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (isSyntheticMouseAfterTouch(e)) return;
    e.preventDefault();
    takeOver();
    if (solved) {
      resetUserDemo();
      return;
    }
    const cell = cellFromEvent(e);
    if (!cell) return;
    setIsDraggingUser(true);
    setSelectedPath((prev) => {
      if (prev.length === 0) return [cell];
      const last = prev[prev.length - 1];
      if (last[0] === cell[0] && last[1] === cell[1]) {
        if (checkSolved(prev)) setTimeout(triggerSolve, 50);
        return prev;
      }
      const existingIdx = prev.findIndex(([r, c]) => r === cell[0] && c === cell[1]);
      if (existingIdx >= 0) return prev.slice(0, existingIdx + 1);
      if (isAdjacent(last, cell)) {
        const next = [...prev, cell];
        if (checkSolved(next)) setTimeout(triggerSolve, 50);
        return next;
      }
      return [cell];
    });
  }, [isSyntheticMouseAfterTouch, cellFromEvent, takeOver, solved, resetUserDemo, checkSolved, triggerSolve]);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingUser || solved) return;
    if (isSyntheticMouseAfterTouch(e)) return;
    e.preventDefault();
    const cell = cellFromEvent(e);
    if (!cell) return;
    setSelectedPath((prev) => {
      if (prev.length === 0) return [cell];
      const last = prev[prev.length - 1];
      if (last[0] === cell[0] && last[1] === cell[1]) return prev;
      if (prev.length >= 2) {
        const prev2 = prev[prev.length - 2];
        if (prev2[0] === cell[0] && prev2[1] === cell[1]) return prev.slice(0, -1);
      }
      if (prev.some(([r, c]) => r === cell[0] && c === cell[1])) return prev;
      if (!isAdjacent(last, cell)) return prev;
      const next = [...prev, cell];
      if (checkSolved(next)) setTimeout(triggerSolve, 50);
      return next;
    });
  }, [isDraggingUser, solved, isSyntheticMouseAfterTouch, cellFromEvent, checkSolved, triggerSolve]);

  const handlePointerUp = useCallback(() => setIsDraggingUser(false), []);

  useEffect(() => {
    if (!isDraggingUser) return;
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);
    window.addEventListener("touchcancel", handlePointerUp);
    return () => {
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("touchcancel", handlePointerUp);
    };
  }, [isDraggingUser, handlePointerUp]);

  const pathString = useMemo(() => {
    if (selectedPath.length < 2) return "";
    return selectedPath.map(([r, c]) => {
      const p = cellCenter(r, c);
      return `${p.x},${p.y}`;
    }).join(" ");
  }, [selectedPath, cellCenter]);

  const selectedSet = useMemo(
    () => new Set(selectedPath.map(([r, c]) => `${r},${c}`)),
    [selectedPath]
  );

  const selectionFillPath = useMemo(
    () => computeWordPerimeterPath(selectedPath, DEMO_CELL),
    [selectedPath]
  );

  const accentColor = tokens.color.spangram;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
      <div style={{
        fontFamily: tokens.font.display, fontWeight: 700, fontSize: 14,
        letterSpacing: "-0.01em", color: tokens.color.white, textAlign: "center",
        display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", justifyContent: "center",
      }}>
        Try it, find the word
        <span style={{
          fontFamily: tokens.font.mono, fontWeight: 600, fontSize: 12,
          color: accentColor, letterSpacing: "0.08em",
          padding: "2px 8px", background: tokens.color.spangramSoft,
          border: `1px solid ${accentColor}44`,
        }}>CODE</span>
      </div>

      {/* Gesture label slot */}
      <div style={{ height: 14, position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        {["TAP", "DRAG", "SOLVED"].map((label) => {
          const visible = solved ? label === "SOLVED" : gestureLabel === label;
          const displayText = label === "SOLVED" ? "Solved — tap to try again" : label;
          return (
            <div key={label} style={{
              position: "absolute",
              fontFamily: tokens.font.mono, fontSize: 9, fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: accentColor,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}>{displayText}</div>
          );
        })}
      </div>

      <div style={{ position: "relative", padding: "8px 40px 12px" }}>
        <svg
          ref={svgRef}
          width={DEMO_GRID_W}
          height={DEMO_GRID_H}
          viewBox={`0 0 ${DEMO_GRID_W} ${DEMO_GRID_H}`}
          style={{ display: "block", touchAction: "none", userSelect: "none", cursor: "pointer", overflow: "visible" }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onMouseEnter={takeOver}
        >
          {solved && (
            <path
              d={selectionFillPath}
              fill={tokens.color.accent}
              stroke="rgba(0,0,0,0.45)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {!solved && selectionFillPath && (
            <>
              <path d={selectionFillPath} fill="rgba(98,38,251,0.08)" />
              <path
                d={selectionFillPath}
                fill="none"
                stroke={`${tokens.color.accent}55`}
                strokeWidth={1.5}
                strokeDasharray="3,3"
              />
            </>
          )}

          {DEMO_GRID.map((row, r) => row.map((letter, c) => {
            const key = `${r},${c}`;
            const selected = selectedSet.has(key);
            const isHover = hoverCell === key && !selected;
            const center = cellCenter(r, c);
            const x = c * DEMO_CELL;
            const y = r * DEMO_CELL;
            const pathIdx = DEMO_TARGET_PATH.findIndex(([tr, tc]) => tr === r && tc === c);

            let cellFill = "transparent";
            let letterColor = tokens.color.textMuted;
            if (solved && selected) letterColor = tokens.color.white;
            else if (selected) letterColor = tokens.color.text;
            else if (isHover) {
              cellFill = "rgba(255,255,255,0.03)";
              letterColor = "rgba(228,233,239,0.82)";
            }

            return (
              <g
                key={key}
                onMouseEnter={userInteracted && !isDraggingUser && !solved ? () => setHoverCell(key) : undefined}
                onMouseLeave={userInteracted ? () => setHoverCell((h) => (h === key ? null : h)) : undefined}
              >
                <rect x={x} y={y} width={DEMO_CELL} height={DEMO_CELL} fill={cellFill}
                  style={{ transition: "fill 0.18s ease" }} />
                <g style={{
                  transformOrigin: `${center.x}px ${center.y}px`,
                  animation: solved && selected && hopTrigger > 0
                    ? `letterHop 0.55s ${pathIdx * 0.07}s ${tokens.ease} both`
                    : undefined,
                }}>
                  <text
                    x={center.x}
                    y={center.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      fontFamily: tokens.font.display,
                      fontWeight: 700,
                      fontSize: 17,
                      letterSpacing: "0.02em",
                      fill: letterColor,
                      transition: "fill 0.3s ease",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >{letter}</text>
                </g>
              </g>
            );
          }))}

          {!solved && pathString && (
            <polyline
              points={pathString}
              fill="none"
              stroke={`${tokens.color.accent}AA`}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.6}
            />
          )}

          {/* Demo cursor */}
          <g style={{
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
            opacity: cursorPos.visible ? 1 : 0,
            transition: `transform 0.4s ${tokens.ease}, opacity 0.25s ease`,
            pointerEvents: "none",
          }}>
            {cursorPressed && (
              <circle cx={0} cy={0} r={0} fill="none" stroke={accentColor} strokeWidth={2.5}
                style={{ animation: "demoCursorRipple 0.8s ease-out" }} />
            )}
            {!cursorPressed && cursorPos.visible && (
              <circle cx={0} cy={0} r={18} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={0.4}
                style={{ animation: "demoHoverPulse 1.6s ease-in-out infinite" }} />
            )}
            <g style={{
              transform: cursorPressed ? "scale(0.62)" : "scale(0.8)",
              transformOrigin: "18px 0px",
              transition: `transform 0.25s ${tokens.ease}`,
              filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(0 0 6px ${accentColor}77)`,
            }}>
              <g transform="translate(-18, 0)">
                <path d="M15.2941 0H21.4118V3.05882H24.4706V15.2941H30.5882V18.3529H39.7647V21.4118H45.8824V24.4706H48.9412V27.5294H52V48.9412H48.9412V58.1176H45.8824V67.2941H15.2941V58.1176H12.2353V52H9.17647V45.8824H6.11765V39.7647H3.05882V36.7059H0V27.5294H9.17647V30.5882H12.2353V3.05882H15.2941"
                  fill={tokens.color.bg} />
                <path d="M21.4118 3.05884V30.5883H24.4706V18.353H30.5883V30.5883H33.6471V21.4118H39.7647V33.6471H42.8235V24.4706H45.8824V27.5294H48.9412V48.9412H45.8824V58.1177H42.8235V64.2353H18.353V58.1177H15.2941V52H12.2353V45.8824H9.17649V39.7647H6.11766V36.7059H3.05884V30.5883H9.17649V33.6471H12.2353V36.7059H15.2941V3.05884"
                  fill={tokens.color.white} />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// ONBOARDING PANEL
// ============================================================================
const ONBOARDING_STEPS = [
  {
    title: "How to play", sub: null,
    pts: ["Drag or tap letters to form words", "Words can snake in any direction", "Every letter is used exactly once", "Stuck? Tap \u201CScan\u201D to reveal a word"],
    demo: "interactive",
  },
  {
    title: "Find the Missing Link", sub: null,
    pts: ["The Missing Link reveals the theme", "It connects opposite sides of the board", "It ties all the attacks together"],
    demo: "link",
  },
  { title: null, isThemeReveal: true },
];

function Onboarding({ onClose }) {
  const [step, setStep] = useState(0);
  const slide = ONBOARDING_STEPS[step];
  const total = ONBOARDING_STEPS.length;

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && step < total - 1) setStep(step + 1);
      else if (e.key === "ArrowLeft" && step > 0) setStep(step - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, total, onClose]);

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        style={{
          background: tokens.color.surface,
          border: `1px solid ${tokens.color.border}`,
          padding: "28px 28px 24px",
          maxWidth: 340,
          width: "100%",
          boxShadow: "0 24px 80px -12px rgba(0,0,0,0.7)",
          position: "relative",
          animation: `cardIn 0.45s ${tokens.ease}`,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Skip onboarding"
          style={{
            position: "absolute", top: 14, right: 14,
            background: "none", border: "none",
            cursor: "pointer", color: tokens.color.textFaint, padding: 4,
          }}
        ><CloseIcon /></button>

        {slide.isThemeReveal ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 0 6px" }}>
            <div style={{
              fontFamily: tokens.font.mono, fontSize: 9, fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: tokens.color.textFaint, marginBottom: 18,
            }}>YOUR TARGET</div>
            <div style={{
              width: "100%", padding: "20px 24px",
              background: tokens.color.surfaceRaised,
              border: "1px solid rgba(98,38,251,0.2)", borderRadius: 3,
              textAlign: "center", animation: "themeGlow 2.5s ease-in-out infinite",
            }}>
              <div
                id="onboarding-title"
                style={{
                  fontFamily: tokens.font.display, fontWeight: 700, fontSize: 19,
                  letterSpacing: "-0.02em", color: tokens.color.white, lineHeight: 1.2,
                }}
              >Supply chain attacks</div>
            </div>
            <div style={{
              fontFamily: tokens.font.body, fontWeight: 400, fontSize: 12,
              color: tokens.color.textFaint, marginTop: 16, letterSpacing: "-0.01em",
            }}>Find the relevant open source projects</div>
          </div>
        ) : (
          <>
            <div
              id="onboarding-title"
              style={{
                fontFamily: tokens.font.display, fontWeight: 700, fontSize: 20,
                letterSpacing: "-0.03em", color: tokens.color.white, lineHeight: 1.1,
                marginBottom: slide.sub ? 5 : 0,
              }}
            >{slide.title}</div>
            {slide.sub && <div style={{
              fontFamily: tokens.font.body, fontWeight: 400, fontSize: 12,
              color: tokens.color.textFaint, letterSpacing: "-0.01em",
            }}>{slide.sub}</div>}
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              padding: "22px 0 18px", minHeight: 80,
            }}>
              {slide.demo === "interactive" && (
                <div style={{
                  width: "100%",
                  background: tokens.color.surfaceRaised,
                  border: `1px solid ${tokens.color.border}`,
                  padding: "20px 16px",
                  display: "flex", justifyContent: "center",
                }}>
                  <InteractiveDemo stepKey={step} />
                </div>
              )}
              {slide.demo === "link" && (
                <div style={{
                  width: "100%",
                  background: tokens.color.surfaceRaised,
                  border: `1px solid ${tokens.color.border}`,
                  padding: "20px 16px",
                  display: "flex", justifyContent: "center",
                }}>
                  <div style={{
                    display: "inline-grid",
                    gridTemplateColumns: "repeat(4, 50px)",
                    gap: 0,
                  }}>
                    {["C","O","D","E"].map((l, i) => (
                      <div key={i} style={{
                        width: 50, height: 50,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: tokens.font.display, fontWeight: 700, fontSize: 17,
                        background: tokens.color.spangram,
                        border: `1px solid ${tokens.color.spangram}`,
                        color: tokens.color.bg,
                        animation: `obCellIn 0.25s ${0.15 + i * 0.09}s both`,
                      }}>{l}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ height: 1, background: tokens.color.borderSubtle, marginBottom: 16 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 26 }}>
              {slide.pts.map((pt, i) => (
                <div key={`${step}-${i}`} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{
                    width: 3, height: 3, borderRadius: "50%", background: tokens.color.textFaint,
                    marginTop: 7, flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: tokens.font.body, fontWeight: 400, fontSize: 12.5,
                    lineHeight: 1.5, color: tokens.color.textMuted, letterSpacing: "-0.01em",
                  }}>{pt}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: slide.isThemeReveal ? 28 : 0,
        }}>
          <button
            type="button"
            onClick={() => step > 0 && setStep(step - 1)}
            aria-label="Previous"
            style={{
              background: "none", border: "none",
              cursor: step > 0 ? "pointer" : "default",
              fontFamily: tokens.font.display, fontWeight: 700, fontSize: 13,
              letterSpacing: "-0.01em",
              color: step > 0 ? tokens.color.textMuted : "transparent",
              padding: "8px 0", minWidth: 50, textAlign: "left",
              visibility: step > 0 ? "visible" : "hidden",
            }}
          >Back</button>
          <div style={{ display: "flex", gap: 6 }} role="tablist">
            {ONBOARDING_STEPS.map((_, i) => (
              <div
                key={i}
                role="tab"
                aria-selected={i === step}
                style={{
                  width: i === step ? 16 : 5, height: 4,
                  background: i === step ? tokens.color.accent : tokens.color.borderSubtle,
                  transition: `all 0.3s ${tokens.ease}`,
                }}
              />
            ))}
          </div>
          {step < total - 1 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              style={{
                background: tokens.color.surfaceRaised,
                border: `1px solid ${tokens.color.border}`,
                padding: "8px 16px", cursor: "pointer",
                fontFamily: tokens.font.display, fontWeight: 700, fontSize: 13,
                letterSpacing: "-0.01em", color: tokens.color.text,
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >Next <ArrowIcon size={10} color={tokens.color.text} /></button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: tokens.color.accent, border: "none",
                padding: "8px 20px", cursor: "pointer",
                fontFamily: tokens.font.display, fontWeight: 700, fontSize: 13,
                letterSpacing: "-0.01em", color: tokens.color.white,
                display: "inline-flex", alignItems: "center", gap: 8,
                boxShadow: `0 2px 12px ${tokens.color.accentGlow}`,
              }}
            >Begin <ArrowIcon size={10} /></button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ATTACK CARD MODAL
// ============================================================================
function AttackCard({ word, onClose }) {
  const isSpangram = word.isSpangram;
  const accent = isSpangram ? tokens.color.spangram : tokens.color.accent;
  const glow = isSpangram ? tokens.color.spangramGlow : tokens.color.accentGlow;
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 80),
      setTimeout(() => setStage(2), 260),
      setTimeout(() => setStage(3), 440),
      isSpangram ? setTimeout(() => setStage(4), 650) : null,
      isSpangram ? setTimeout(() => setStage(5), 900) : null,
    ].filter(Boolean);
    return () => timers.forEach(clearTimeout);
  }, [isSpangram]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const fade = (delay) => ({
    opacity: stage >= 2 ? 1 : 0,
    transform: stage >= 2 ? "none" : "translateY(10px)",
    transition: `opacity 0.4s ${delay}s ${tokens.ease}, transform 0.4s ${delay}s ${tokens.ease}`,
  });

  const Label = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
      <div style={{
        width: 3, height: 3, borderRadius: "50%", background: tokens.color.textFaint,
        opacity: 0.4, flexShrink: 0,
      }} />
      <span style={{
        fontFamily: tokens.font.mono, fontSize: 9, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.12em", color: tokens.color.textFaint,
      }}>{children}</span>
    </div>
  );

  const Body = ({ children, primary }) => (
    <span style={{
      fontFamily: tokens.font.body, fontWeight: 400, fontSize: 12.5, lineHeight: 1.6,
      color: primary ? tokens.color.text : "rgba(228,233,239,0.70)",
      letterSpacing: "-0.01em", display: "block", paddingLeft: 9,
    }}>{children}</span>
  );

  if (isSpangram) {
    const mlw = (r) => ({
      opacity: stage >= r ? 1 : 0,
      transform: stage >= r ? "none" : "translateY(8px)",
      transition: `opacity 0.5s ${tokens.ease}, transform 0.5s ${tokens.ease}`,
    });
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-title-spangram"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 100, padding: 20,
          background: stage >= 1 ? "rgba(6,11,14,0.93)" : "rgba(6,11,14,0)",
          backdropFilter: stage >= 1 ? "blur(32px)" : "blur(0px)",
          WebkitBackdropFilter: stage >= 1 ? "blur(32px)" : "blur(0px)",
          transition: "background 0.5s ease, backdrop-filter 0.5s ease",
          display: "flex", alignItems: "center", justifyContent: "center",
          overscrollBehavior: "contain",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: tokens.color.surface,
            border: `1px solid ${tokens.color.spangram}15`,
            padding: "32px 28px 32px",
            maxWidth: 480,
            width: "100%",
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? "none" : "translateY(14px) scale(0.96)",
            transition: `opacity 0.5s 0.05s ${tokens.ease}, transform 0.55s 0.05s ${tokens.ease}`,
            boxShadow: `0 32px 100px -16px rgba(0,0,0,0.8), 0 0 60px -20px ${tokens.color.spangramGlow}`,
            maxHeight: "85dvh", overflowY: "auto", overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={mlw(2)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: tokens.color.spangram,
                boxShadow: `0 0 10px ${tokens.color.spangramGlow}`,
                animation: stage >= 2 ? "pulseOnce 1.5s ease forwards" : "none",
              }} />
              <span style={{
                fontFamily: tokens.font.mono, fontSize: 9, fontWeight: 600,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: tokens.color.spangram,
              }}>MISSING LINK</span>
            </div>
            <h2
              id="card-title-spangram"
              style={{
                fontFamily: tokens.font.display, fontWeight: 700, fontSize: 26,
                letterSpacing: "-0.04em", color: tokens.color.white, lineHeight: 1.1, margin: 0,
              }}
            >Supply Chain</h2>
          </div>
          <div style={{
            height: 1, marginTop: 22, marginBottom: 24,
            background: `linear-gradient(90deg, ${tokens.color.spangram}30, ${tokens.color.spangram}08 60%, transparent)`,
            transformOrigin: "left",
            animation: stage >= 2 ? `lineGrow 0.6s 0.1s ${tokens.ease} both` : "none",
            opacity: stage >= 2 ? 1 : 0,
          }} />
          <div style={{ ...mlw(3), marginBottom: 24 }}>
            <div style={{
              fontFamily: tokens.font.display, fontWeight: 700, fontSize: 14,
              letterSpacing: "-0.02em", color: tokens.color.white, lineHeight: 1.3, marginBottom: 10,
            }}>Your security is only as strong as its weakest dependency.</div>
            <div style={{
              fontFamily: tokens.font.body, fontWeight: 400, fontSize: 12.5, lineHeight: 1.65,
              color: "rgba(228,233,239,0.70)", letterSpacing: "-0.01em",
            }}>Just because an open source library has millions of downloads, thousands of GitHub stars, and hundreds of previously safe versions doesn't make it safe.</div>
          </div>
          <div style={{ ...mlw(4), marginBottom: 28 }}>
            <div style={{
              fontFamily: tokens.font.display, fontWeight: 700, fontSize: 14,
              letterSpacing: "-0.02em", color: tokens.color.white, lineHeight: 1.3, marginBottom: 10,
            }}>Strong security means having verified trust.</div>
            <div style={{
              fontFamily: tokens.font.body, fontWeight: 400, fontSize: 12.5, lineHeight: 1.65,
              color: "rgba(228,233,239,0.70)", letterSpacing: "-0.01em",
            }}>Open source is critical to how we all build, and it's essential to verify that what package you're consuming matches the expected source code bit-for-bit. Otherwise, you run the risk of introducing something malicious into your builds.</div>
          </div>
          <div style={{
            ...mlw(5),
            background: `${tokens.color.spangram}08`,
            border: `1px solid ${tokens.color.spangram}18`,
            padding: "20px 20px", marginBottom: 28, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: 1,
              background: `linear-gradient(90deg, transparent, ${tokens.color.spangram}50, transparent)`,
              backgroundSize: "200% 100%",
              animation: stage >= 5 ? "shimmerLine 2.5s ease-in-out" : "none",
              opacity: stage >= 5 ? 1 : 0,
            }} />
            <div style={{
              fontFamily: tokens.font.display, fontWeight: 700, fontSize: 15,
              letterSpacing: "-0.02em", color: tokens.color.spangram,
              lineHeight: 1.3, marginBottom: 10,
            }}>Chainguard proactively defends against the next supply chain attack.</div>
            <div style={{
              fontFamily: tokens.font.body, fontWeight: 400, fontSize: 12.5, lineHeight: 1.65,
              color: tokens.color.text, letterSpacing: "-0.01em",
            }}>With every dependency built from source in an isolated environment, Chainguard Libraries act as the trust layer for your open source so you can build safely with AI</div>
          </div>
          <div style={mlw(5)}>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "100%", padding: "14px 0",
                background: tokens.color.spangram,
                border: "none", color: tokens.color.bg,
                fontFamily: tokens.font.display, fontWeight: 700, fontSize: 14,
                letterSpacing: "-0.01em", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}
            >Continue <ArrowIcon size={11} color={tokens.color.bg} /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-title"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100, padding: 20,
        background: stage >= 1 ? "rgba(13,22,28,0.85)" : "rgba(13,22,28,0)",
        backdropFilter: stage >= 1 ? "blur(24px)" : "blur(0px)",
        WebkitBackdropFilter: stage >= 1 ? "blur(24px)" : "blur(0px)",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
        overscrollBehavior: "contain",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: tokens.color.surface,
          border: `1px solid ${tokens.color.border}`,
          padding: "26px 24px 28px",
          maxWidth: 460, width: "100%",
          opacity: stage >= 1 ? 1 : 0,
          transform: stage >= 1 ? "none" : "translateY(12px) scale(0.97)",
          transition: `opacity 0.35s ${tokens.ease}, transform 0.4s ${tokens.ease}`,
          boxShadow: `0 24px 80px -12px rgba(0,0,0,0.7), 0 0 0 1px ${accent}0A`,
          maxHeight: "80dvh", overflowY: "auto", overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ ...fade(0), marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", background: accent,
              boxShadow: `0 0 8px ${glow}`,
              animation: stage >= 2 ? "pulseOnce 1.2s ease forwards" : "none",
            }} />
            <span style={{
              fontFamily: tokens.font.mono, fontSize: 9, fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase", color: accent,
            }}>MISSING LINK</span>
            <div style={{ flex: 1 }} />
            <span style={{
              fontFamily: tokens.font.mono, fontWeight: 400, fontSize: 10,
              color: tokens.color.textFaint, letterSpacing: "0.02em", textTransform: "uppercase",
            }}>{word.card.date}</span>
          </div>
          <h2
            id="card-title"
            style={{
              fontFamily: tokens.font.display, fontWeight: 700, fontSize: 26,
              letterSpacing: "-0.04em", color: tokens.color.white, lineHeight: 1.1, margin: 0,
            }}
          >{word.card.title}</h2>
        </div>
        <div style={{
          height: 1, marginBottom: 20,
          background: `linear-gradient(90deg, ${accent}30, ${accent}08 60%, transparent)`,
          transformOrigin: "left",
          animation: stage >= 2 ? `lineGrow 0.5s 0.1s ${tokens.ease} both` : "none",
          opacity: stage >= 2 ? 1 : 0,
        }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
          <div style={fade(0.05)}><Label>ARTIFACT</Label><Body primary>{word.card.artifact}</Body></div>
          <div style={fade(0.10)}><Label>ENTRY VECTOR</Label><Body>{word.card.vector}</Body></div>
          <div style={fade(0.15)}><Label>IMPACT</Label><Body>{word.card.impact}</Body></div>
        </div>
        <div style={{
          ...fade(0.22),
          background: tokens.color.surfaceRaised,
          border: `1px solid ${tokens.color.border}`,
          padding: "14px 16px", marginBottom: 24, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
            backgroundSize: "200% 100%",
            animation: stage >= 3 ? "shimmerLine 2s ease-in-out" : "none",
            opacity: stage >= 3 ? 1 : 0,
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
            <span style={{
              fontFamily: tokens.font.mono, fontSize: 9, fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", color: accent,
            }}>REMEDIATION</span>
          </div>
          <span style={{
            fontFamily: tokens.font.body, fontWeight: 400, fontSize: 12.5, lineHeight: 1.6,
            color: tokens.color.text, letterSpacing: "-0.01em", display: "block",
          }}>{word.card.remediation}</span>
        </div>
        <div style={fade(0.28)}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%", padding: "13px 0",
              background: tokens.color.accent,
              border: "none", color: tokens.color.white,
              fontFamily: tokens.font.display, fontWeight: 700, fontSize: 14,
              letterSpacing: "-0.01em", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >Continue <ArrowIcon size={11} /></button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLETION
// ============================================================================
const FINAL_LOTTIE_URL = "/final-malwhere.json";
const FINAL_FALLBACK_IMAGE = "/Not here.png";

function Completion({ onPlayAgain }) {
  const lottieRef = useRef(null);
  const lottieInst = useRef(null);
  const [fallback, setFallback] = useState(!FINAL_LOTTIE_URL);

  useEffect(() => {
    if (!FINAL_LOTTIE_URL) { setFallback(true); return; }
    let cancelled = false;

    const loadScript = () => new Promise((resolve, reject) => {
      if (window.lottie) return resolve();
      const existing = document.querySelector("script[data-lottie-web]");
      if (existing) {
        existing.addEventListener("load", resolve);
        existing.addEventListener("error", reject);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
      script.setAttribute("data-lottie-web", "true");
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    loadScript()
      .then(async () => {
        if (cancelled || !lottieRef.current || !window.lottie) return;
        const res = await fetch(FINAL_LOTTIE_URL);
        if (!res.ok) throw new Error(`Lottie fetch failed: ${res.status}`);
        const data = await res.json();
        if (cancelled || !lottieRef.current) return;
        lottieInst.current = window.lottie.loadAnimation({
          container: lottieRef.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData: data,
        });
      })
      .catch(() => { if (!cancelled) setFallback(true); });

    return () => {
      cancelled = true;
      if (lottieInst.current) {
        lottieInst.current.destroy();
        lottieInst.current = null;
      }
    };
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
      <div style={{ textAlign: "center", maxWidth: 400, animation: `cardIn 0.6s ${tokens.ease}` }}>
        <div
          ref={lottieRef}
          aria-hidden="true"
          style={{
            width: "100%", maxWidth: 360, height: 100, margin: "0 auto 8px",
            display: fallback ? "none" : "flex", alignItems: "center", justifyContent: "center",
          }}
        />
        {fallback && (
          <img
            src={FINAL_FALLBACK_IMAGE}
            alt="Malwhere? Not here."
            style={{ width: "100%", maxWidth: 360, height: "auto", margin: "0 auto 8px", display: "block" }}
          />
        )}
        <p style={{
          fontFamily: tokens.font.body, fontWeight: 400, fontSize: 14, lineHeight: 1.6,
          color: tokens.color.textMuted, maxWidth: 480, margin: "0 auto 24px",
          letterSpacing: "-0.01em",
        }}>You traced the attack. Now see how to stop it. Chainguard secures the software supply chain with minimal, trusted, and continuously verified open source.</p>
        <a
          href="https://www.chainguard.dev/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "14px 28px", background: tokens.color.accent,
            color: tokens.color.white, fontSize: 14, fontFamily: tokens.font.display,
            fontWeight: 700, textDecoration: "none", letterSpacing: "-0.01em",
            boxShadow: `0 2px 20px ${tokens.color.accentGlow}`,
          }}
        >Explore Chainguard <ArrowIcon size={12} /></a>
        <button
          type="button"
          onClick={onPlayAgain}
          style={{
            display: "block", margin: "16px auto 0",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: tokens.font.mono, fontWeight: 400, fontSize: 11,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: tokens.color.textMuted, padding: "8px 16px",
          }}
        >Play again</button>
      </div>
    </div>
  );
}

// ============================================================================
// HEADER
// ============================================================================
function GameHeader({ foundCount, scanAvailable, onScan, scanNudge }) {
  return (
    <header style={{ padding: "16px 16px 0", position: "relative", zIndex: 1, flexShrink: 0 }}>
      <div style={{
        maxWidth: 480, margin: "0 auto",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{
            fontFamily: tokens.font.display, fontWeight: 900, fontSize: 22,
            letterSpacing: "-0.04em", color: tokens.color.white,
            lineHeight: 1, textTransform: "uppercase", margin: 0,
          }}>Malwhere?</h1>
          <div style={{
            fontFamily: tokens.font.mono, fontWeight: 400, fontSize: 9,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: tokens.color.textFaint, marginTop: 5,
          }}>SUPPLY CHAIN ATTACKS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }} aria-live="polite">
            <span style={{
              fontFamily: tokens.font.display, fontWeight: 700, fontSize: 16,
              letterSpacing: "-0.02em", color: tokens.color.white, lineHeight: 1,
            }}>{foundCount}</span>
            <span style={{
              fontFamily: tokens.font.mono, fontWeight: 400, fontSize: 10,
              color: tokens.color.textFaint, letterSpacing: "0.02em",
            }}>/ {WORDS.length} FOUND</span>
          </div>
          <div
            style={{
              width: 100, height: 2, background: tokens.color.borderSubtle,
              borderRadius: 1, overflow: "hidden",
            }}
            role="progressbar"
            aria-valuenow={foundCount}
            aria-valuemin={0}
            aria-valuemax={WORDS.length}
          >
            <div style={{
              width: `${(foundCount / WORDS.length) * 100}%`,
              height: "100%",
              background: tokens.color.accent,
              borderRadius: 1,
              transition: "width 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }} />
          </div>
          <button
            type="button"
            onClick={onScan}
            disabled={!scanAvailable}
            aria-label="Scan to reveal a word"
            style={{
              background: "none",
              border: `1px solid ${scanAvailable ? tokens.color.border : tokens.color.borderSubtle}`,
              padding: "5px 12px",
              cursor: scanAvailable ? "pointer" : "default",
              fontFamily: tokens.font.mono, fontSize: 9, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: scanAvailable ? tokens.color.textMuted : tokens.color.textFaint,
              opacity: scanAvailable ? 1 : 0.4,
              transition: "opacity 0.2s ease, border-color 0.2s ease, color 0.2s ease",
              marginTop: 2, display: "inline-flex", alignItems: "center", gap: 6,
              animation: scanNudge && scanAvailable ? "scanNudge 2s ease-in-out infinite" : "none",
            }}
          >
            <SearchIcon size={10} />
            Scan
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// GLOBAL STYLES
// ============================================================================
const globalStyles = `
  @font-face{font-family:'Gellix';src:url('/fonts/Gellix-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
  @font-face{font-family:'Gellix';src:url('/fonts/Gellix-Bold.woff2') format('woff2');font-weight:700;font-display:swap}
  @font-face{font-family:'Gellix';src:url('/fonts/Gellix-Black.woff2') format('woff2');font-weight:900;font-display:swap}
  @font-face{font-family:'Roobert SemiMono';src:url('/fonts/RoobertSemiMono-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
  @font-face{font-family:'Roobert SemiMono';src:url('/fonts/RoobertSemiMono-SemiBold.woff2') format('woff2');font-weight:600;font-display:swap}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{background:${tokens.color.bg};overscroll-behavior:none}
  button{font:inherit;color:inherit}
  button:focus-visible,a:focus-visible{outline:2px solid ${tokens.color.accent};outline-offset:2px}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes cardIn{from{opacity:0;transform:scale(0.97) translateY(4px)}to{opacity:1;transform:none}}
  @keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-4px)}30%{transform:translateX(4px)}45%{transform:translateX(-3px)}60%{transform:translateX(2px)}}
  @keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes pulseOnce{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.7}}
  @keyframes shimmerLine{from{background-position:-200% 0}to{background-position:200% 0}}
  @keyframes hintPulse{0%{fill:rgba(98,38,251,0.08)}50%{fill:rgba(98,38,251,0.22)}100%{fill:rgba(98,38,251,0.08)}}
  @keyframes scanNudge{0%,100%{border-color:rgba(68,253,43,0.25);color:rgba(228,233,239,0.70)}50%{border-color:rgba(68,253,43,0.5);color:rgba(228,233,239,0.9)}}
  @keyframes obCellIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
  @keyframes demoCursorRipple{0%{r:10;opacity:0.9;stroke-width:3}100%{r:38;opacity:0;stroke-width:1}}
  @keyframes demoHoverPulse{0%,100%{r:16;opacity:0.25}50%{r:22;opacity:0.55}}
  @keyframes themeGlow{0%,100%{border-color:rgba(98,38,251,0.2);box-shadow:0 0 8px rgba(98,38,251,0.05)}50%{border-color:rgba(98,38,251,0.5);box-shadow:0 0 16px rgba(98,38,251,0.15)}}
  @keyframes letterHop{0%{transform:translateY(0) scale(1)}30%{transform:translateY(-8px) scale(1.15)}60%{transform:translateY(0) scale(1)}80%{transform:translateY(-2px) scale(1.02)}100%{transform:translateY(0) scale(1)}}
  @keyframes notHereIn{from{opacity:0}to{opacity:1}}
  @media (prefers-reduced-motion: reduce){
    *,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}
  }
`;

// ============================================================================
// ROOT APP
// ============================================================================
export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [hoverCell, setHoverCell] = useState(null);
  const { schedule, clearAll } = useTimeouts();
  const nudgeTimerRef = useRef(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLoadingDone = useCallback(() => {
    dispatch({ type: "SET_PHASE", phase: "onboarding" });
    setShowOnboarding(true);
  }, []);

  const handleOnboardingClose = useCallback(() => {
    setShowOnboarding(false);
    dispatch({ type: "SET_PHASE", phase: "playing" });
  }, []);

  const handleCloseCard = useCallback(() => {
    dispatch({ type: "CLOSE_CARD" });
    if (state.phase === "reveal") {
      schedule(() => dispatch({ type: "SHOW_FINALE" }), 400);
    }
  }, [state.phase, schedule]);

  const handlePlayAgain = useCallback(() => {
    clearAll();
    dispatch({ type: "RESET" });
  }, [clearAll]);

  const remainingScanTargets = useMemo(
    () => WORDS.filter((w) => !state.foundWords.includes(w.id) && !w.isSpangram),
    [state.foundWords]
  );

  const scanAvailable = remainingScanTargets.length > 0
    && !state.scanning
    && state.phase === "playing"
    && !state.activeCard;

  const handleScan = useCallback(() => {
    if (!scanAvailable) return;
    const target = remainingScanTargets[Math.floor(Math.random() * remainingScanTargets.length)];
    dispatch({ type: "START_SCAN" });

    // Gather empty cells
    const foundSet = new Set();
    for (const id of state.foundWords) {
      const w = WORDS_BY_ID[id];
      if (w) w.path.forEach(([r, c]) => foundSet.add(cellKey(r, c)));
    }
    const emptyCells = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        if (!foundSet.has(cellKey(r, c))) emptyCells.push([r, c]);
      }
    }

    const sweepCount = 14;
    const sweepInterval = 90;
    for (let i = 0; i < sweepCount; i++) {
      schedule(() => {
        const count = 3 + Math.floor(Math.random() * 3);
        const picked = new Set();
        for (let n = 0; n < count; n++) {
          const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          if (cell) picked.add(cellKey(cell[0], cell[1]));
        }
        dispatch({ type: "SCAN_HIGHLIGHTS", highlights: picked });
      }, i * sweepInterval);
    }
    const sweepEnd = sweepCount * sweepInterval;
    schedule(() => dispatch({ type: "SCAN_HIGHLIGHTS", highlights: new Set() }), sweepEnd);

    const traceStart = sweepEnd + 150;
    target.path.forEach((_, idx) => {
      schedule(() => {
        dispatch({ type: "SCAN_TRACE", selection: target.path.slice(0, idx + 1) });
      }, traceStart + idx * 120);
    });

    const traceEnd = traceStart + target.path.length * 120 + 200;
    schedule(() => {
      dispatch({ type: "FLASH_WORD", flash: { path: target.path, isSpangram: target.isSpangram } });
      schedule(() => {
        dispatch({ type: "COMMIT_WORD", word: target });
        dispatch({ type: "END_SCAN" });
        schedule(() => dispatch({ type: "OPEN_CARD", word: target }), 500);
      }, hopDurationFor(target.path));
    }, traceEnd);
  }, [scanAvailable, remainingScanTargets, state.foundWords, schedule]);

  // Nudge timer
  useEffect(() => {
    if (state.phase !== "playing" || !scanAvailable) return;
    if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    dispatch({ type: "SET_NUDGE", nudge: false });
    nudgeTimerRef.current = setTimeout(() => dispatch({ type: "SET_NUDGE", nudge: true }), 15000);
    return () => {
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    };
  }, [state.phase, state.foundWords.length, scanAvailable]);

  const statusLine = useMemo(() => {
    if (state.scanning) return "Scanning…";
    if (state.selection.length > 0) return "Tap last letter to submit";
    if (state.foundWords.length === 0) return "Tap or drag to connect letters";
    if (state.foundWords.length < WORDS.length) {
      const remaining = WORDS.length - state.foundWords.length;
      return `${remaining} attack${remaining === 1 ? "" : "s"} remaining`;
    }
    return "All attacks traced";
  }, [state.scanning, state.selection.length, state.foundWords.length]);

  const gameActive = state.phase === "playing" || state.phase === "reveal";

  return (
    <ScheduleContext.Provider value={{ schedule, clearAll }}>
      <style>{globalStyles}</style>
      <div style={{
        width: "100%",
        minHeight: "100dvh",
        background: tokens.color.bg,
        display: "flex", flexDirection: "column",
        position: "relative",
      }}>
        {/* Game layer */}
        <div style={{
          display: "flex", flexDirection: "column", flex: 1, minHeight: "100dvh",
          opacity: gameActive ? 1 : 0,
          pointerEvents: gameActive ? "auto" : "none",
          transition: "opacity 0.5s ease",
          position: gameActive ? "relative" : "absolute",
          inset: 0,
        }}>
          <GameHeader
            foundCount={state.foundWords.length}
            scanAvailable={scanAvailable}
            onScan={handleScan}
            scanNudge={state.scanNudge}
          />
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "8px 16px 0", position: "relative", zIndex: 1,
          }}>
            <Board state={state} dispatch={dispatch} hoverCell={hoverCell} setHoverCell={setHoverCell} />
            <div
              style={{
                fontFamily: tokens.font.body, fontWeight: 400, fontSize: 11,
                color: tokens.color.textFaint, textAlign: "center", marginTop: 6,
                letterSpacing: "-0.01em",
                minHeight: 16,
              }}
              aria-live="polite"
            >{statusLine}</div>
            <div style={{
              maxWidth: 480, margin: "0 auto",
              display: "flex", flexWrap: "wrap", gap: 5,
              justifyContent: "center", marginTop: 10,
            }}>
              {WORDS.map((w) => (
                <WordPill
                  key={w.id}
                  word={w}
                  found={state.foundWords.includes(w.id)}
                  onClick={() => dispatch({ type: "OPEN_CARD", word: w })}
                />
              ))}
            </div>
          </div>
          <Footer />
        </div>

        {/* Loading */}
        {state.phase === "loading" && (
          <div style={{
            position: "absolute", inset: 0, background: tokens.color.bg,
            display: "flex", flexDirection: "column", zIndex: 50,
            animation: "fadeIn 0.3s ease",
          }}>
            <LoadingOverlay onComplete={handleLoadingDone} />
            <Footer />
          </div>
        )}

        {/* Onboarding */}
        {showOnboarding && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(13,22,28,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            display: "flex", flexDirection: "column", zIndex: 40,
            animation: "fadeIn 0.4s ease",
          }}>
            <Onboarding onClose={handleOnboardingClose} />
            <Footer />
          </div>
        )}

        {/* Attack card */}
        {state.activeCard && <AttackCard word={state.activeCard} onClose={handleCloseCard} />}

        {/* Completion */}
        {state.phase === "complete" && !state.activeCard && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(13,22,28,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            display: "flex", flexDirection: "column", zIndex: 30,
            animation: "fadeIn 0.5s ease",
          }}>
            <Completion onPlayAgain={handlePlayAgain} />
            <Footer />
          </div>
        )}
      </div>
    </ScheduleContext.Provider>
  );
}
