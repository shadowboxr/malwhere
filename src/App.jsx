import React, {
  useState as k,
  useRef as Y,
  useCallback as C,
  useEffect as z,
  useMemo as V,
} from "react";
const e = {
    bg: "#0D161C",
    surface: "#131D26",
    surfaceRaised: "#172330",
    border: "rgba(255,255,255,0.07)",
    borderSubtle: "rgba(255,255,255,0.04)",
    ring: "rgba(98,38,251,0.5)",
    text: "#E4E9EF",
    textMuted: "rgba(228,233,239,0.70)",
    textFaint: "rgba(228,233,239,0.70)",
    accent: "#6226FB",
    accentMid: "#7B4AFD",
    accentGlow: "rgba(98,38,251,0.3)",
    accentSoft: "rgba(98,38,251,0.10)",
    accentText: "#B8A1FD",
    spangram: "#44FD2B",
    spangramGlow: "rgba(68,253,43,0.25)",
    spangramSoft: "rgba(68,253,43,0.08)",
    white: "#FFFFFF",
  },
  p = {
    display: "'Gellix', system-ui, sans-serif",
    displayWeight: 700,
    body: "'Gellix', system-ui, sans-serif",
    bodyWeight: 400,
    mono: "'Roobert SemiMono', 'SF Mono', monospace",
    monoWeight: 400,
    monoWeightBold: 600,
  },
  $ = 8,
  D = 8,
  ne = [
    ["S", "O", "L", "A", "R", "S", "H", "A"],
    ["S", "D", "N", "I", "W", "U", "H", "I"],
    ["T", "R", "I", "V", "Y", "L", "U", "D"],
    ["U", "P", "P", "L", "Y", "C", "H", "A"],
    ["S", "L", "I", "T", "E", "T", "E", "I"],
    ["A", "X", "M", "L", "L", "N", "L", "N"],
    ["O", "I", "D", "E", "B", "Y", "X", "D"],
    ["S", "I", "S", "G", "U", "X", "D", "Y"],
  ],
  L = [
    {
      name: "SUPPLYCHAI",
      display: "Supply Chain",
      path: [
        [4, 0],
        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7],
        [4, 7],
        [5, 7],
      ],
      isSpangram: !0,
      card: {
        title: "Supply Chain",
        date: "Ongoing",
        artifact: "The open source supply chain",
        vector:
          "Attackers compromise trusted packages, build systems, and CI/CD pipelines to distribute malware through legitimate software channels",
        impact:
          "454,600 malicious packages discovered in 2025 alone \u2014 the attack surface grows with every dependency",
        remediation:
          "Verify provenance. Pin dependencies. Build from source. Trust nothing by default.",
      },
    },
    {
      name: "SOLARWINDS",
      display: "SolarWinds",
      path: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [1, 4],
        [1, 3],
        [1, 2],
        [1, 1],
        [1, 0],
      ],
      isSpangram: !1,
      card: {
        title: "SolarWinds",
        date: "Dec 13, 2020",
        artifact: "SolarWinds Orion update",
        vector:
          "Nation-state actor compromised build system; SUNBURST backdoor injected into signed software updates",
        impact:
          "18,000 organizations installed trojanized updates including US Treasury, Commerce, and Homeland Security; persistent access maintained for 9+ months",
        remediation:
          "Isolate and rebuild all affected Orion servers; reset all credentials system-wide",
      },
    },
    {
      name: "SHAIHULUD",
      display: "Shai-Hulud",
      path: [
        [0, 5],
        [0, 6],
        [0, 7],
        [1, 7],
        [1, 6],
        [1, 5],
        [2, 5],
        [2, 6],
        [2, 7],
      ],
      isSpangram: !1,
      card: {
        title: "Shai-Hulud",
        date: "Sep 15, 2025 & Nov 24, 2025",
        artifact: "npm packages (750+)",
        vector:
          "Maintainer bot credentials stolen and used to deploy malware running a pre-install script that works as a worm, publishing private credentials and secrets to public GitHub repos",
        impact:
          "25,000+ GitHub repositories and thousands of credentials compromised; $8.5M stolen from 2,500 Trust Wallet customers after attackers poisoned its Chrome extension",
        remediation:
          "Rotate all npm tokens; audit published package versions; verify package provenance before consumption",
      },
    },
    {
      name: "TRIVY",
      display: "Trivy",
      path: [
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
      ],
      isSpangram: !1,
      card: {
        title: "Trivy",
        date: "Mar 20, 2026",
        artifact: "GitHub Action and container image",
        vector:
          "83 versions of trivy-action and setup-trivy GitHub Actions hijacked to point to malicious commits after Trivy\u2019s GitHub credentials were compromised; poisoned Trivy container image also released",
        impact:
          "CI/CD secrets from 12,000+ repositories exfiltrated; used to publish malicious versions of downstream artifacts including LiteLLM, CanisterWorm, Checkmarx KICS, and Telnyx",
        remediation:
          "Check to ensure you are using known safe versions of Trivy artifacts",
      },
    },
    {
      name: "LITELLM",
      display: "LiteLLM",
      path: [
        [4, 1], [4, 2], [4, 3], [4, 4], [5, 4], [5, 3], [5, 2],
      ],
      isSpangram: !1,
      card: {
        title: "LiteLLM",
        date: "Mar 24, 2026",
        artifact: "PyPI package",
        vector:
          "Maintainer\u2019s PyPI account compromised following Trivy supply chain attack",
        impact:
          "Credential harvester deployed to 95M monthly downloads designed to exfiltrate SSH keys, cloud tokens, Kubernetes secrets, and API keys",
        remediation: "Rotate all secret credentials if downloaded",
      },
    },
    {
      name: "TELNYX",
      display: "Telnyx",
      path: [
        [4, 5], [4, 6], [5, 6], [5, 5], [6, 5], [6, 6],
      ],
      isSpangram: !1,
      card: {
        title: "Telnyx",
        date: "Mar 27, 2026",
        artifact: "PyPI package",
        vector:
          "Maintainer\u2019s PyPI account compromised following Trivy supply chain attack",
        impact:
          "Any developer who downloaded the malicious versions had SSH keys, cloud credentials, and Kubernetes tokens exfiltrated from their environment",
        remediation: "Rotate all secret credentials if downloaded",
      },
    },
    {
      name: "AXIOS",
      display: "Axios",
      path: [
        [5, 0],
        [5, 1],
        [6, 1],
        [6, 0],
        [7, 0],
      ],
      isSpangram: !1,
      card: {
        title: "Axios",
        date: "Mar 31, 2026",
        artifact: "npm package",
        vector:
          "Axios maintainer npm credentials hijacked following months-long social engineering campaign, leading to two backdoored versions referencing a malicious runtime dependency published to npm",
        impact:
          "Credential harvester deployed to 300M+ monthly downloads designed to exfiltrate SSH keys, cloud tokens, Kubernetes secrets, and API keys",
        remediation: "Rotate all secret credentials if downloaded",
      },
    },
    {
      name: "DEBUG",
      display: "debug",
      path: [
        [6, 2],
        [6, 3],
        [6, 4],
        [7, 4],
        [7, 3],
      ],
      isSpangram: !1,
      card: {
        title: "debug",
        date: "Sep 2025",
        artifact: "npm package",
        vector:
          "Threat actors phished a high-profile maintainer\u2019s account and published 18 malicious packages with 2.6B+ weekly downloads that injected a crypto drainer into downstream apps",
        impact:
          "Malicious packages were designed to steal cryptocurrency",
        remediation:
          "Revert to known safe versions and rebuild applications",
      },
    },
    {
      name: "DYDX",
      display: "dYdX",
      path: [
        [6, 7], [7, 7], [7, 6], [7, 5],
      ],
      isSpangram: !1,
      card: {
        title: "dYdX",
        date: "Feb 6, 2026",
        artifact: "PyPI and npm packages",
        vector:
          "Compromised dydx developer accounts led to malicious Python and JavaScript packages being released to public registries",
        impact:
          "Affected organizations had cryptocurrency stolen and relevant cloud, GitHub, and API keys exfiltrated",
        remediation:
          "Isolate affected builds and revert to known safe versions",
      },
    },
    {
      name: "IS",
      display: "is",
      path: [
        [7, 1],
        [7, 2],
      ],
      isSpangram: !1,
      card: {
        title: "is",
        date: "July 19, 2025",
        artifact: "npm package",
        vector:
          "Phished maintainer credentials used to publish backdoored versions of the popular \u2018is\u2019 package (2.8M weekly downloads), infecting developers before npm removed them hours later",
        impact:
          "Developers who downloaded affected packages had secret keys exfiltrated",
        remediation:
          "Revert to known safe versions and rebuild applications",
      },
    },
  ],
  K = (c, n) =>
    (Math.abs(c[0] - n[0]) + Math.abs(c[1] - n[1])) === 1,
  T = (c, n) => `${c},${n}`,
  E = (c) => c.map(([n, d]) => T(n, d)).join("|");
function ie({ count: c, total: n }) {
  const h = 2 * Math.PI * 15.75,
    b = h - (c / n) * h;
  return React.createElement(
    "div",
    {
      style: {
        position: "relative",
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    React.createElement(
      "svg",
      {
        width: 34,
        height: 34,
        style: { position: "absolute", transform: "rotate(-90deg)" },
      },
      React.createElement("circle", {
        cx: 34 / 2,
        cy: 34 / 2,
        r: 15.75,
        fill: "none",
        stroke: e.borderSubtle,
        strokeWidth: 2.5,
      }),
      React.createElement("circle", {
        cx: 34 / 2,
        cy: 34 / 2,
        r: 15.75,
        fill: "none",
        stroke: e.accent,
        strokeWidth: 2.5,
        strokeDasharray: h,
        strokeDashoffset: b,
        strokeLinecap: "round",
        style: {
          transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)",
        },
      }),
    ),
    React.createElement(
      "span",
      {
        style: {
          fontFamily: p.mono,
          fontSize: 11,
          fontWeight: 600,
          color: e.text,
          position: "relative",
        },
      },
      c,
    ),
  );
}
const W = ({ size: c = 12, color: n = "#FFFFFF" }) =>
  React.createElement(
    "svg",
    { width: c, height: c, viewBox: "0 0 14 14", fill: "none" },
    React.createElement("path", {
      d: "M11.2 5.6L11.2 2.8L8.4 2.8L8.4 5.6L11.2 5.6Z",
      fill: n,
    }),
    React.createElement("path", {
      d: "M11.2 11.2L11.2 8.4L8.4 8.4L8.4 11.2L11.2 11.2Z",
      fill: n,
    }),
    React.createElement("path", {
      d: "M8.4 2.8L8.4 0L5.6 0L5.6 2.8L8.4 2.8Z",
      fill: n,
    }),
    React.createElement("path", {
      d: "M8.4 14L8.4 11.2L5.6 11.2L5.6 14L8.4 14Z",
      fill: n,
    }),
    React.createElement("path", {
      d: "M8.4 8.4L8.4 5.6L5.6 5.6L5.6 8.4L8.4 8.4Z",
      fill: n,
    }),
    React.createElement("path", {
      d: "M14 8.4L14 5.6L11.2 5.6L11.2 8.4L14 8.4Z",
      fill: n,
    }),
    React.createElement("path", {
      d: "M2.8 8.4L2.8 5.6L0 5.6L0 8.4L2.8 8.4Z",
      fill: n,
    }),
  );
function ae({ word: c, onClose: n }) {
  const { card: d, isSpangram: y } = c,
    o = y ? e.spangram : e.accent,
    h = y ? e.spangramSoft : e.accentSoft,
    b = y ? e.spangramGlow : e.accentGlow,
    [f, S] = k(0);
  (z(() => {
    const r = setTimeout(() => S(1), 80),
      u = setTimeout(() => S(2), 260),
      x = setTimeout(() => S(3), 440),
      q = y ? setTimeout(() => S(4), 650) : null,
      g = y ? setTimeout(() => S(5), 900) : null;
    return () => {
      (clearTimeout(r), clearTimeout(u), clearTimeout(x));
      q && clearTimeout(q);
      g && clearTimeout(g);
    };
  }, []),
    z(() => {
      const r = (u) => u.key === "Escape" && n();
      return (
        window.addEventListener("keydown", r),
        () => window.removeEventListener("keydown", r)
      );
    }, [n]));
  const w = (r) => ({
      opacity: f >= 2 ? 1 : 0,
      transform: f >= 2 ? "none" : "translateY(10px)",
      transition: `opacity 0.4s ${r}s cubic-bezier(0.16,1,0.3,1), transform 0.4s ${r}s cubic-bezier(0.16,1,0.3,1)`,
    }),
    v = ({ children: r, highlight: u }) =>
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 5,
          },
        },
        React.createElement("div", {
          style: {
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: u ? o : e.textFaint,
            opacity: u ? 0.8 : 0.4,
            flexShrink: 0,
          },
        }),
        React.createElement(
          "span",
          {
            style: {
              fontFamily: p.mono,
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: u ? o : e.textFaint,
            },
          },
          r,
        ),
      ),
    l = ({ children: r, primary: u }) =>
      React.createElement(
        "span",
        {
          style: {
            fontFamily: p.body,
            fontWeight: 400,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: u ? e.text : "rgba(228,233,239,0.70)",
            letterSpacing: "-0.01em",
            display: "block",
            paddingLeft: 9,
          },
        },
        r,
      );
  if (y) {
    const mlw = (r) => ({
      opacity: f >= r ? 1 : 0,
      transform: f >= r ? "none" : "translateY(8px)",
      transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)`,
    });
    return React.createElement(
      "div",
      {
        style: {
          position: "fixed",
          inset: 0,
          background: f >= 1 ? "rgba(6,11,14,0.93)" : "rgba(6,11,14,0)",
          backdropFilter: f >= 1 ? "blur(32px)" : "blur(0px)",
          WebkitBackdropFilter: f >= 1 ? "blur(32px)" : "blur(0px)",
          transition: "background 0.5s ease, backdrop-filter 0.5s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20,
        },
        onClick: n,
      },
      React.createElement(
        "div",
        {
          onClick: (r) => r.stopPropagation(),
          style: {
            background: e.surface,
            border: `1px solid ${e.spangram}15`,
            borderRadius: 0,
            padding: "32px 28px 32px",
            maxWidth: 480,
            width: "100%",
            opacity: f >= 1 ? 1 : 0,
            transform: f >= 1 ? "none" : "translateY(14px) scale(0.96)",
            transition:
              "opacity 0.5s 0.05s cubic-bezier(0.16,1,0.3,1), transform 0.55s 0.05s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: `0 32px 100px -16px rgba(0,0,0,0.8), 0 0 0 1px ${e.spangram}0A, 0 0 60px -20px ${e.spangramGlow}`,
            maxHeight: "85dvh",
            overflowY: "auto",
            overscrollBehavior: "contain",
          },
        },
        React.createElement(
          "div",
          { style: mlw(2) },
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              },
            },
            React.createElement("div", {
              style: {
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: e.spangram,
                boxShadow: `0 0 10px ${e.spangramGlow}`,
                animation: f >= 2 ? "pulseOnce 1.5s ease forwards" : "none",
              },
            }),
            React.createElement(
              "span",
              {
                style: {
                  fontFamily: p.mono,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: e.spangram,
                },
              },
              "MISSING LINK",
            ),
          ),
          React.createElement(
            "h2",
            {
              style: {
                fontFamily: p.display,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.04em",
                color: e.white,
                lineHeight: 1.1,
                margin: 0,
              },
            },
            "Supply Chain",
          ),
        ),
        React.createElement("div", {
          style: {
            height: 1,
            marginTop: 22,
            marginBottom: 24,
            background: `linear-gradient(90deg, ${e.spangram}30, ${e.spangram}08 60%, transparent)`,
            transformOrigin: "left",
            animation:
              f >= 2
                ? "lineGrow 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both"
                : "none",
            opacity: f >= 2 ? 1 : 0,
          },
        }),
        React.createElement(
          "div",
          {
            style: {
              ...mlw(3),
              marginBottom: 24,
            },
          },
          React.createElement(
            "div",
            {
              style: {
                fontFamily: p.display,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "-0.02em",
                color: e.white,
                lineHeight: 1.3,
                marginBottom: 10,
              },
            },
            "The problem isn\u2019t one attack. It\u2019s the chain.",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontFamily: p.body,
                fontWeight: 400,
                fontSize: 12.5,
                lineHeight: 1.65,
                color: "rgba(228,233,239,0.70)",
                letterSpacing: "-0.01em",
              },
            },
            "Attackers don\u2019t break in. They build in. Compromised packages, poisoned pipelines, and trusted dependencies turn software delivery into an attack surface.",
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              ...mlw(4),
              marginBottom: 28,
            },
          },
          React.createElement(
            "div",
            {
              style: {
                fontFamily: p.display,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "-0.02em",
                color: e.white,
                lineHeight: 1.3,
                marginBottom: 10,
              },
            },
            "Security breaks when trust is assumed.",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontFamily: p.body,
                fontWeight: 400,
                fontSize: 12.5,
                lineHeight: 1.65,
                color: "rgba(228,233,239,0.70)",
                letterSpacing: "-0.01em",
              },
            },
            "Every dependency expands the blast radius. Every build step is a potential entry point. Left unchecked, the chain becomes the vulnerability.",
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              ...mlw(5),
              background: `${e.spangram}08`,
              border: `1px solid ${e.spangram}18`,
              borderRadius: 0,
              padding: "20px 20px",
              marginBottom: 28,
              position: "relative",
              overflow: "hidden",
            },
          },
          React.createElement("div", {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${e.spangram}50, transparent)`,
              backgroundSize: "200% 100%",
              animation: f >= 5 ? "shimmerLine 2.5s ease-in-out" : "none",
              opacity: f >= 5 ? 1 : 0,
            },
          }),
          React.createElement(
            "div",
            {
              style: {
                fontFamily: p.display,
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "-0.02em",
                color: e.spangram,
                lineHeight: 1.3,
                marginBottom: 10,
              },
            },
            "Chainguard breaks the chain.",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontFamily: p.body,
                fontWeight: 400,
                fontSize: 12.5,
                lineHeight: 1.65,
                color: e.text,
                letterSpacing: "-0.01em",
              },
            },
            "No hidden dependencies. No inherited risk. No malware.",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontFamily: p.mono,
                fontWeight: 400,
                fontSize: 10,
                color: e.textMuted,
                marginTop: 12,
                letterSpacing: "-0.01em",
              },
            },
            "The trusted source for open source.",
          ),
        ),
        React.createElement(
          "div",
          { style: mlw(5) },
          React.createElement(
            "button",
            {
              onClick: n,
              style: {
                width: "100%",
                padding: "14px 0",
                background: e.spangram,
                border: "none",
                borderRadius: 0,
                color: "#0D161C",
                fontFamily: p.display,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "-0.01em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "opacity 0.15s",
              },
            },
            "Continue",
            React.createElement(W, { size: 11, color: "#0D161C" }),
          ),
        ),
      ),
    );
  }
  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: f >= 1 ? "rgba(13,22,28,0.85)" : "rgba(13,22,28,0)",
        backdropFilter: f >= 1 ? "blur(24px)" : "blur(0px)",
        WebkitBackdropFilter: f >= 1 ? "blur(24px)" : "blur(0px)",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      },
      onClick: n,
    },
    React.createElement(
      "div",
      {
        onClick: (r) => r.stopPropagation(),
        style: {
          background: e.surface,
          border: `1px solid ${e.border}`,
          borderRadius: 0,
          padding: "26px 24px 28px",
          maxWidth: 460,
          width: "100%",
          opacity: f >= 1 ? 1 : 0,
          transform: f >= 1 ? "none" : "translateY(12px) scale(0.97)",
          transition:
            "opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 24px 80px -12px rgba(0,0,0,0.7), 0 0 0 1px ${o}0A`,
          maxHeight: "80dvh",
          overflowY: "auto",
          overscrollBehavior: "contain",
        },
      },
      React.createElement(
        "div",
        { style: { ...w(0), marginBottom: 20 } },
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            },
          },
          React.createElement("div", {
            style: {
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: o,
              boxShadow: `0 0 8px ${b}`,
              animation: f >= 2 ? "pulseOnce 1.2s ease forwards" : "none",
            },
          }),
          React.createElement(
            "span",
            {
              style: {
                fontFamily: p.mono,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: o,
              },
            },
                          "MISSING LINK",

          ),
          React.createElement("div", { style: { flex: 1 } }),
          React.createElement(
            "span",
            {
              style: {
                fontFamily: p.mono,
                fontWeight: 400,
                fontSize: 10,
                color: e.textFaint,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              },
            },
            d.date,
          ),
        ),
        React.createElement(
          "h2",
          {
            style: {
              fontFamily: p.display,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "-0.04em",
              color: e.white,
              lineHeight: 1.1,
              margin: 0,
            },
          },
          d.title,
        ),
      ),
      React.createElement("div", {
        style: {
          height: 1,
          marginBottom: 20,
          background: `linear-gradient(90deg, ${o}30, ${o}08 60%, transparent)`,
          transformOrigin: "left",
          animation:
            f >= 2
              ? "lineGrow 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both"
              : "none",
          opacity: f >= 2 ? 1 : 0,
        },
      }),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 22,
          },
        },
        React.createElement(
          "div",
          { style: w(0.05) },
          React.createElement(v, null, "ARTIFACT"),
          React.createElement(l, { primary: !0 }, d.artifact),
        ),
        React.createElement(
          "div",
          { style: w(0.1) },
          React.createElement(v, null, "ENTRY VECTOR"),
          React.createElement(l, null, d.vector),
        ),
        React.createElement(
          "div",
          { style: w(0.15) },
          React.createElement(v, null, "IMPACT"),
          React.createElement(l, null, d.impact),
        ),
      ),
      React.createElement(
        "div",
        {
          style: {
            ...w(0.22),
            background: e.surfaceRaised,
            border: `1px solid ${e.border}`,
            borderRadius: 0,
            padding: "14px 16px",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
          },
        },
        React.createElement("div", {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${o}40, transparent)`,
            backgroundSize: "200% 100%",
            animation: f >= 3 ? "shimmerLine 2s ease-in-out" : "none",
            opacity: f >= 3 ? 1 : 0,
          },
        }),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 6,
            },
          },
          React.createElement(
            "span",
            {
              style: {
                fontFamily: p.mono,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: o,
              },
            },
            "REMEDIATION",
          ),
        ),
        React.createElement(
          "span",
          {
            style: {
              fontFamily: p.body,
              fontWeight: 400,
              fontSize: 12.5,
              lineHeight: 1.6,
              color: e.text,
              letterSpacing: "-0.01em",
              display: "block",
            },
          },
          d.remediation,
        ),
      ),
      React.createElement(
        "div",
        { style: w(0.28) },
        React.createElement(
          "button",
          {
            onClick: n,
            style: {
              width: "100%",
              padding: "13px 0",
              background: e.accent,
              border: "none",
              borderRadius: 0,
              color: e.white,
              fontFamily: p.display,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "-0.01em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "opacity 0.15s",
            },
          },
          "Continue",
          React.createElement(W, { size: 11 }),
        ),
      ),
    ),
  );
}
// ============================================================
// FINAL SCREEN ANIMATION
// Drop your Lottie JSON URL below. Leave empty to use image fallback.
// Example: "https://raw.githubusercontent.com/USER/REPO/main/final.json"
const FINAL_LOTTIE_URL = "/final-malwhere.json";
const FINAL_FALLBACK_IMAGE = "/Not here.png";
// ============================================================

function oe({ onPlayAgain: c }) {
  const [lottieReady, setLottieReady] = k(!1);
  const [lottieFailed, setLottieFailed] = k(!FINAL_LOTTIE_URL);
  const lottieRef = Y(null);
  const lottieInstance = Y(null);
  z(() => {
    if (!FINAL_LOTTIE_URL) {
      setLottieFailed(!0);
      return;
    }
    let cancelled = false;
    const loadScript = () => new Promise((resolve, reject) => {
      if (window.lottie) return resolve();
      const existing = document.querySelector('script[data-lottie-web]');
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
        const animationData = await res.json();
        if (cancelled || !lottieRef.current) return;
        const anim = window.lottie.loadAnimation({
          container: lottieRef.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData,
        });
        lottieInstance.current = anim;
        setLottieReady(!0);
      })
      .catch((err) => {
        console.error("Lottie load error, using fallback image:", err);
        if (!cancelled) setLottieFailed(!0);
      });
    return () => {
      cancelled = true;
      if (lottieInstance.current) lottieInstance.current.destroy();
    };
  }, []);
  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(13,22,28,0.92)",
        backdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        animation: "fadeIn 0.4s ease",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 28,
        },
      },
      React.createElement(
        "div",
        {
          style: {
            textAlign: "center",
            maxWidth: 400,
            animation: "cardIn 0.5s cubic-bezier(0.16,1,0.3,1)",
          },
        },
        React.createElement("div", {
          ref: lottieRef,
          style: {
            width: "100%",
            maxWidth: 360,
            height: 200,
            margin: "0 auto 8px",
            display: lottieFailed ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }),
        lottieFailed && React.createElement("img", {
          src: FINAL_FALLBACK_IMAGE,
          alt: "Malwhere? Not here.",
          style: {
            width: "100%",
            maxWidth: 360,
            height: "auto",
            margin: "0 auto 8px",
            display: "block",
          },
        }),
      React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          {
            style: {
              fontFamily: p.body,
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.6,
              color: e.textMuted,
              maxWidth: 480,
              margin: "0 auto 24px",
              letterSpacing: "-0.01em",
            },
          },
          "You traced the attack. Now see how to stop it. Chainguard secures the software supply chain with minimal, trusted, and continuously verified open source.",
        ),
        React.createElement(
          "a",
          {
            href: "https://www.chainguard.dev/",
            target: "_blank",
            rel: "noopener noreferrer",
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 28px",
              background: e.accent,
              borderRadius: 0,
              color: e.white,
              fontSize: 14,
              fontFamily: p.display,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: `0 2px 20px ${e.accentGlow}`,
            },
          },
          "Explore Chainguard",
          React.createElement(W, { size: 12 }),
        ),
        React.createElement(
          "button",
          {
            onClick: c,
            style: {
              display: "block",
              margin: "16px auto 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: p.mono,
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: e.textMuted,
              padding: "8px 16px",
              transition: "color 0.2s ease",
            },
          },
          "Play again",
        ),
      ),
      ),
    ),
    React.createElement(GameFooter, null),
  );
}
function re({ w: c, found: n }) {
  const d = c.isSpangram,
    y = n ? (d ? e.spangram : e.accent) : "rgba(255,255,255,0.06)",
    o = n ? (d ? e.spangram : e.accentText) : e.textFaint,
    h = n ? (d ? e.spangram : `${e.accent}88`) : e.borderSubtle,
    b = n ? (d ? e.spangramSoft : e.accentSoft) : "transparent";
  return React.createElement(
    "div",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 0,
        border: `1.5px solid ${h}`,
        background: b,
        opacity: n ? 1 : 0.25,
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      },
    },
    React.createElement("span", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: y,
        flexShrink: 0,
        transition: "background 0.3s",
      },
    }),
    React.createElement(
      "span",
      {
        style: {
          fontFamily: p.mono,
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: o,
          transition: "color 0.3s",
        },
      },
      n ? c.display : "\u2022\u2022\u2022",
    ),
  );
}
function GameFooter() {
  return React.createElement(
    "footer",
    {
      style: {
        padding: "16px 16px 24px",
        opacity: 0.35,
        position: "relative",
        zIndex: 1,
      },
    },
    React.createElement(
      "div",
      {
        style: {
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 6,
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
          },
        },
        React.createElement(
          "span",
          {
            style: {
              fontFamily: p.mono,
              fontWeight: 400,
              fontSize: "clamp(7px, 1.8vw, 9px)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: e.text,
            },
          },
          "A word game by",
        ),
        React.createElement(
          "svg",
          {
            viewBox: "0 0 325 52",
            width: 65,
            height: 10,
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
          },
          React.createElement("path", {
            fill: "#fff",
            fillRule: "evenodd",
            d: "M44.35,28.13c.43-1.47.66-3.08.66-4.83C45.01,12.34,35.97,0,26.94,0S8.87,12.34,8.87,23.3c0,2.39.43,4.52,1.2,6.38l-5.43-.31c-2.21-.12-4.25,1.46-3.9,3.65.13.85.39,1.72.84,2.47-1.54,1.08-2.16,3.08-.92,4.64,1.25,1.57,3.08,3.01,5.6,3.01,2.73,0,4.38-.71,5.37-1.6.07.39.22.77.46,1.13,1.23,1.87,3.26,3.92,6.26,3.92,5.11,0,5.68-3.22,5.96-4.83.02-.13.04-.24.06-.35l3.41-1.71,3.41,1.71c.02.1.04.22.06.35.29,1.61.86,4.83,5.96,4.83,3,0,5.03-2.05,6.26-3.92.05-.07.09-.15.13-.22.96.42,2.24.69,3.93.69,2.52,0,4.35-1.44,5.6-3.01,1.53-1.92.23-4.49-2.11-5.22l-.77-.24c2.27-1.18,2.6-3.4,2.36-5.35-.27-2.2-2.67-3.15-4.76-2.42l-3.53,1.24ZM27.8,39.67h0,0s0,0,0,0Z",
          }),
          React.createElement("path", {
            fill: "#fff",
            d: "M85.32,41.74c-10.37,0-17-6.75-17-18.64,0-11.24,7.48-18.14,17.35-18.14,8.52,0,14.66,4.9,15.55,13.19h-6.78c-.65-4.55-3.64-7.65-8.77-7.65-6.18,0-10.62,4.75-10.62,12.59s4.39,13.09,10.47,13.09c5.18,0,8.62-3.35,9.32-8h6.53c-.85,8.1-6.68,13.54-16.05,13.54ZM106.12,40.84V5.86h6.08v11.69c0,.7-.05,1.45-.2,2.4,1.35-2.45,3.64-4.3,7.48-4.3,5.38,0,8.57,3.8,8.57,9.8v15.39h-6.08v-14.49c0-3.6-1.74-5.85-4.59-5.85-2.99,0-5.18,2.65-5.18,6.05v14.29h-6.08ZM141.14,41.74c-4.24,0-8.38-2.8-8.38-7.6,0-5.5,4.24-7.4,9.47-8.1l3.49-.45c1.99-.25,2.69-1,2.69-2.2,0-1.7-1.4-3.2-3.99-3.2-2.84,0-4.64,1.6-4.89,4.15h-6.28c.4-5.1,4.54-8.7,10.82-8.7,7.43,0,10.42,4,10.42,10.84v14.34h-5.63v-1c0-.8.1-1.55.25-2.35-1.3,2.4-3.79,4.25-7.98,4.25ZM142.79,37.25c3.24,0,5.83-2.4,5.83-5.85v-2.65c-.55.5-1.4.75-2.89,1.05l-1.99.4c-2.84.55-4.79,1.5-4.79,3.7s1.7,3.35,3.84,3.35ZM160.45,40.84v-24.39h6.08v24.39h-6.08ZM160.3,12.76v-6.4h6.33v6.4h-6.33ZM172.82,40.84v-24.39h6.08v1.1c0,.7-.05,1.45-.2,2.4,1.35-2.45,3.64-4.3,7.48-4.3,5.38,0,8.57,3.8,8.57,9.8v15.39h-6.08v-14.49c0-3.6-1.75-5.85-4.59-5.85-2.99,0-5.18,2.65-5.18,6.05v14.29h-6.08ZM211.62,51.94c-7.18,0-11.27-3.85-11.27-9.4h6.18c.1,2.9,1.94,4.6,5.23,4.6s5.88-1.9,5.88-5.55v-2.65c0-1.1.05-2.1.2-3.05-1.45,2.2-3.79,4.05-7.58,4.05-6.33,0-10.92-4.45-10.92-12.14s5.28-12.14,10.62-12.14c4.29,0,6.43,1.75,7.88,4.3-.15-.85-.2-1.5-.2-2.4v-1.1h6.08v23.64c0,8-4.94,11.84-12.11,11.84ZM211.82,35.1c3.59,0,6.18-3.05,6.18-7.3s-2.59-7.3-6.18-7.3-6.28,3.05-6.28,7.3,2.59,7.3,6.28,7.3ZM238.44,41.74c-4.89,0-8.72-3.35-8.72-9.8v-15.49h6.13v14.54c0,3.4,1.49,5.85,4.44,5.85,3.09,0,5.28-2.3,5.28-5.9v-14.49h6.08v24.39h-6.03v-1c0-.75.1-1.6.25-2.35-1.25,2.35-3.39,4.25-7.43,4.25ZM264.99,41.74c-4.24,0-8.37-2.8-8.37-7.6,0-5.5,4.24-7.4,9.47-8.1l3.49-.45c1.99-.25,2.69-1,2.69-2.2,0-1.7-1.4-3.2-3.99-3.2-2.84,0-4.64,1.6-4.89,4.15h-6.28c.4-5.1,4.54-8.7,10.82-8.7,7.43,0,10.42,4,10.42,10.84v14.34h-5.63v-1c0-.8.1-1.55.25-2.35-1.3,2.4-3.79,4.25-7.98,4.25ZM266.63,37.25c3.24,0,5.83-2.4,5.83-5.85v-2.65c-.55.5-1.4.75-2.89,1.05l-1.99.4c-2.84.55-4.79,1.5-4.79,3.7s1.7,3.35,3.84,3.35ZM284.29,40.84v-24.39h6.08v1.85c0,.9-.05,1.65-.2,2.55,1.3-2.75,3.49-5.2,7.13-5.2.5,0,.9.05,1.3.15v5.9c-.4-.1-.95-.2-1.75-.2-3.74,0-6.48,1.9-6.48,7.25v12.09h-6.08ZM311.49,41.74c-6.43,0-11.12-4.4-11.12-12.99s5.53-13.09,11.22-13.09c3.79,0,6.13,1.95,7.53,4.3-.2-.9-.2-1.65-.2-2.4V5.86h6.08v34.98h-6.08v-1c0-.85,0-1.5.2-2.35-.95,1.8-3.14,4.25-7.63,4.25ZM312.93,36.95c3.64,0,6.33-3.35,6.33-8.25s-2.69-8.2-6.33-8.2-6.38,3.35-6.38,8.2,2.74,8.25,6.38,8.25Z",
          }),
        ),
      ),
      React.createElement(
        "a",
        {
          href: "https://www.chainguard.dev/",
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            fontFamily: p.mono,
            fontWeight: 400,
            fontSize: "clamp(7px, 1.8vw, 9px)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: e.text,
            textDecoration: "none",
          },
        },
        "CHAINGUARD.DEV",
      ),
    ),
  );
}
function LoadingScreen({ onComplete: c }) {
  const [pct, setPct] = k(0);
  const [rawProgress, setRawProgress] = k(0);
  const [done, setDone] = k(!1);
  const [fadeOut, setFadeOut] = k(!1);
  z(() => {
    const duration = 2800;
    let startTime = null;
    const tick = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setRawProgress(eased);
      setPct(Math.round(eased * 100));
      if (progress < 1) requestAnimationFrame(tick);
      else {
        setDone(!0);
        setTimeout(() => setFadeOut(!0), 900);
        setTimeout(() => c(), 1400);
      }
    };
    requestAnimationFrame(tick);
  }, []);
  const rectH = 107.267;
  const rectW = 415.716;
  const fillH = rectH * rawProgress;
  const clipY = rectH - fillH;
  const notHereOpacity = done ? 1 : 0;
  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: e.bg,
        display: "flex",
        flexDirection: "column",
        zIndex: 300,
      },
    },
    React.createElement(
      "div",
      {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.5s ease",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            width: "80%",
            maxWidth: 380,
          },
        },
      React.createElement(
        "svg",
        {
          viewBox: "0 0 1036 223",
          width: "100%",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        React.createElement("defs", null,
          React.createElement(
            "clipPath",
            { id: "fillClip" },
            React.createElement("rect", {
              x: 0,
              y: clipY,
              width: rectW,
              height: fillH,
            }),
          ),
        ),
        React.createElement("path", {
          d: "M8.6265 127.6V1.79719H50.3213L81.5923 77.4588L115.379 1.79719H150.245V127.6H116.098V67.754L91.1174 127.6H66.6757L42.7731 67.754V127.6H8.6265ZM228.744 1.79719L278.706 127.6H241.684L235.933 112.145H194.058L188.307 127.6H152.184L201.786 1.79719H228.744ZM205.021 83.0301H225.329L215.265 55.8925L205.021 83.0301ZM280.585 1.79719H314.731V94.8915H368.826V127.6H280.585V1.79719ZM495.132 1.79719H530.896L489.381 127.6H462.423L440.318 60.2058L418.752 127.6H391.614L349.919 1.79719H386.223L405.812 69.012L427.199 1.79719H454.156L475.723 69.1917L495.132 1.79719ZM611.582 1.79719H645.728V127.6H611.582V79.0763H567.91V127.6H533.763V1.79719H567.91V46.3674H611.582V1.79719ZM657.545 1.79719H738.418V34.506H691.691V47.8052H733.386V80.514H691.691V94.8915H738.418V127.6H657.545V1.79719ZM748.331 127.6V1.79719H798.472C803.864 1.79719 809.016 2.8755 813.928 5.03213C818.84 7.06894 823.214 10.0043 827.048 13.8384C830.882 17.5525 833.937 21.8658 836.213 26.7781C838.49 31.5706 839.628 36.7824 839.628 42.4136C839.628 49.842 838.25 56.4317 835.494 62.1827C832.739 67.8139 828.905 72.3668 823.992 75.8413L855.623 127.6H814.288L789.486 83.0301H782.477V127.6H748.331ZM782.477 53.7359H794.878C797.634 53.7359 800.03 52.8373 802.067 51.0401C804.103 49.1231 805.122 46.8467 805.122 44.2108C805.122 41.5749 804.103 39.3584 802.067 37.5612C800.03 35.6442 797.634 34.6857 794.878 34.6857H782.477V53.7359ZM854.21 1.79719H935.084V34.506H888.357V47.8052H930.052V80.514H888.357V94.8915H935.084V127.6H854.21V1.79719ZM986.511 7.73667e-07C995.138 7.73667e-07 1002.87 1.73728 1009.7 5.21184C1016.64 8.68641 1022.16 13.419 1026.23 19.4096C1030.3 25.2804 1032.34 31.93 1032.34 39.3584C1032.34 46.1877 1031.32 51.9387 1029.28 56.6114C1027.25 61.1643 1024.67 64.9384 1021.56 67.9337C1018.56 70.8092 1015.57 73.2654 1012.57 75.3022C1009.58 77.2192 1007 78.9565 1004.84 80.514C1002.81 82.0716 1001.79 83.749 1001.79 85.5461H968.54C968.54 79.1961 969.498 74.164 971.415 70.4498C973.332 66.7356 975.728 63.7403 978.604 61.4638C981.479 59.1874 984.355 57.2704 987.23 55.7128C990.106 54.1553 992.502 52.4779 994.419 50.6807C996.336 48.7637 997.295 46.2476 997.295 43.1325C997.295 39.6579 996.216 37.1419 994.06 35.5843C991.903 34.0268 989.267 33.248 986.152 33.248C981.36 33.248 977.885 34.8055 975.728 37.9207C973.692 41.0358 972.733 44.6901 972.853 48.8835H938.527C938.167 39.7778 940.024 31.5706 944.098 24.262C948.291 16.8337 954.102 10.9628 961.531 6.6496C968.959 2.21653 977.286 7.73667e-07 986.511 7.73667e-07ZM985.613 129.398C980.102 129.398 975.429 127.54 971.595 123.826C967.761 119.992 965.844 115.379 965.844 109.988C965.844 104.596 967.761 100.043 971.595 96.3293C975.429 92.6151 980.102 90.758 985.613 90.758C991.244 90.758 995.917 92.6151 999.631 96.3293C1003.46 100.043 1005.38 104.596 1005.38 109.988C1005.38 115.379 1003.46 119.992 999.631 123.826C995.917 127.54 991.244 129.398 985.613 129.398Z",
          fill: e.white,
        }),
        React.createElement("rect", {
          width: rectW,
          height: rectH,
          transform: "translate(305.823 115.828) rotate(-5.72635)",
          fill: e.bg,
        }),

        React.createElement(
          "g",
          {
            transform: "translate(305.823 115.828) rotate(-5.72635)",
          },
          React.createElement("rect", {
            x: 0,
            y: 0,
            width: rectW,
            height: rectH,
            fill: e.accent,
            clipPath: "url(#fillClip)",
          }),
        ),
        React.createElement("path", {
          d: "M346.091 150.273L346.778 157.127C348.162 154.392 349.964 152.228 352.184 150.636C354.475 149.036 357.156 148.082 360.226 147.774C366.936 147.101 372.398 148.717 376.611 152.621C380.889 156.446 383.4 162.071 384.144 169.496L387.13 199.266L372.031 200.78L369.239 172.938C368.895 169.511 367.691 166.855 365.628 164.971C363.564 163.087 360.961 162.302 357.82 162.617C354.679 162.932 352.248 164.222 350.528 166.485C348.88 168.742 348.227 171.583 348.571 175.01L351.363 202.852L336.264 204.367L330.991 151.787L346.091 150.273ZM413.794 142.402C418.935 141.887 423.661 142.639 427.974 144.658C432.351 146.599 435.96 149.518 438.803 153.415C441.645 157.312 443.328 161.867 443.85 167.078C444.373 172.29 443.628 177.087 441.616 181.472C439.597 185.784 436.639 189.362 432.741 192.204C428.908 194.968 424.422 196.608 419.282 197.123C414.142 197.639 409.383 196.926 405.006 194.986C400.622 192.973 397.012 190.054 394.177 186.229C391.406 182.324 389.759 177.766 389.237 172.555C388.714 167.343 389.423 162.549 391.364 158.172C393.376 153.788 396.334 150.21 400.238 147.439C404.136 144.597 408.654 142.918 413.794 142.402ZM415.244 156.859C411.675 157.217 408.801 158.767 406.625 161.509C404.441 164.18 403.535 167.371 403.907 171.084C404.272 174.724 405.794 177.673 408.472 179.928C411.142 182.112 414.263 183.025 417.832 182.667C421.402 182.309 424.243 180.798 426.355 178.135C428.532 175.392 429.438 172.201 429.072 168.56C428.7 164.848 427.179 161.9 424.508 159.716C421.902 157.453 418.814 156.501 415.244 156.859ZM476.826 191.028C470.686 191.644 465.496 190.218 461.254 186.749C457.084 183.274 454.644 178.002 453.935 170.934L452.249 154.122L442.505 155.099L441.066 140.749L450.81 139.772L449.425 125.958L464.524 124.444L465.91 138.258L478.867 136.959L480.306 151.308L467.349 152.608L469.013 169.206C469.299 172.062 470.364 174.046 472.206 175.159C474.048 176.272 476.29 176.697 478.931 176.432C479.503 176.374 480.141 176.274 480.848 176.131C481.555 175.988 482.187 175.817 482.744 175.617L484.14 189.538C483.169 189.924 481.973 190.224 480.552 190.438C479.21 190.717 477.968 190.914 476.826 191.028ZM542.429 155.57C542.086 152.144 540.882 149.488 538.818 147.604C536.754 145.72 534.152 144.935 531.011 145.25C527.869 145.565 525.439 146.855 523.719 149.118C522.07 151.375 521.418 154.216 521.762 157.643L524.554 185.485L509.454 186.999L501.938 112.039L517.037 110.525L519.968 139.76C521.353 137.025 523.155 134.861 525.374 133.269C527.666 131.669 530.346 130.715 533.416 130.407C540.127 129.734 545.589 131.35 549.802 135.254C554.079 139.079 556.59 144.704 557.335 152.129L560.32 181.899L545.221 183.413L542.429 155.57ZM592.686 179.735C587.546 180.25 582.749 179.505 578.293 177.501C573.902 175.417 570.285 172.427 567.442 168.529C564.593 164.561 562.91 160.006 562.395 154.866C561.887 149.798 562.642 145.107 564.661 140.794C566.673 136.41 569.596 132.836 573.429 130.072C577.326 127.23 581.845 125.551 586.985 125.035C591.768 124.556 596.202 125.265 600.286 127.163C604.434 128.982 607.883 131.737 610.633 135.427C613.376 139.046 614.99 143.283 615.477 148.137C615.541 148.78 615.595 149.676 615.638 150.825C615.746 151.896 615.771 152.867 615.714 153.738L576.842 157.636C577.742 160.863 579.471 163.357 582.027 165.12C584.576 166.811 587.636 167.478 591.205 167.12C594.061 166.834 596.324 166.03 597.994 164.709C599.664 163.387 600.66 161.809 600.98 159.975L615.758 158.493C615.567 162.334 614.472 165.796 612.473 168.881C610.468 171.895 607.759 174.365 604.347 176.294C601 178.144 597.113 179.291 592.686 179.735ZM576.475 147.505L599.177 145.229C598.627 142.616 597.238 140.628 595.01 139.265C592.846 137.824 590.337 137.246 587.481 137.532C584.625 137.819 582.198 138.783 580.2 140.426C578.273 142.061 577.031 144.421 576.475 147.505ZM623.501 175.563L618.228 122.984L633.328 121.47L633.95 127.681C635.156 125.325 636.873 123.386 639.1 121.864C641.32 120.272 643.893 119.329 646.82 119.035C647.605 118.956 648.433 118.946 649.304 119.002C650.175 119.059 651.011 119.12 651.81 119.184L653.185 132.891C652.307 132.762 651.396 132.673 650.454 132.624C649.583 132.567 648.684 132.585 647.755 132.678C644.115 133.043 641.124 134.497 638.783 137.039C636.442 139.581 635.515 143.28 636.001 148.134L638.6 174.049L623.501 175.563ZM683.831 170.595C678.691 171.11 673.893 170.366 669.437 168.361C665.046 166.277 661.429 163.287 658.587 159.39C655.737 155.421 654.055 150.867 653.539 145.727C653.031 140.658 653.786 135.967 655.806 131.654C657.818 127.27 660.74 123.696 664.573 120.932C668.47 118.09 672.989 116.411 678.129 115.896C682.912 115.416 687.346 116.125 691.43 118.023C695.579 119.842 699.028 122.597 701.777 126.287C704.52 129.906 706.134 134.143 706.621 138.998C706.686 139.64 706.739 140.536 706.783 141.685C706.89 142.756 706.915 143.727 706.858 144.598L667.986 148.496C668.887 151.723 670.615 154.218 673.171 155.98C675.721 157.672 678.78 158.338 682.349 157.98C685.205 157.694 687.468 156.89 689.138 155.569C690.808 154.248 691.804 152.67 692.125 150.835L706.903 149.353C706.711 153.194 705.616 156.657 703.618 159.741C701.612 162.755 698.904 165.226 695.492 167.154C692.144 169.004 688.257 170.151 683.831 170.595ZM667.619 138.366L690.322 136.089C689.771 133.476 688.382 131.488 686.154 130.125C683.991 128.684 681.481 128.106 678.625 128.393C675.77 128.679 673.343 129.644 671.344 131.286C669.417 132.922 668.175 135.281 667.619 138.366Z",
          fill: e.white,
          opacity: notHereOpacity,
          style: { transition: "opacity 0.5s ease" },
        }),
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          marginTop: 32,
          fontFamily: p.mono,
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.08em",
          color: e.textMuted,
          textAlign: "center",
        },
      },
      `${pct}%`,
    ),
    ),
    React.createElement(GameFooter, null),
  );
}
function se({ onClose: c }) {
  const [n, d] = k(0);
  const h = (l, r, u, delay) => {
      const x = {
        def: {
          bg: "transparent",
          bd: "transparent",
          co: "rgba(228,233,239,0.3)",
          sh: "none",
          sc: 1,
        },
        sel: {
          bg: "rgba(98,38,251,0.08)",
          bd: `${e.accent}55`,
          co: e.text,
          sh: "none",
          sc: 1,
        },
        found: { bg: e.accent, bd: e.accent, co: e.white, sh: "none", sc: 1 },
        trace: {
          bg: `${e.spangram}55`,
          bd: `${e.spangram}44`,
          co: "#0D161C",
          sh: "none",
          sc: 1,
        },
        link: {
          bg: e.spangram,
          bd: e.spangram,
          co: "#0D161C",
          sh: "none",
          sc: 1,
        },
        glow: {
          bg: e.spangram,
          bd: e.spangram,
          co: "#0D161C",
          sh: `0 0 14px ${e.spangramGlow}`,
          sc: 1,
        },
      }[r] || {
        bg: "transparent",
        bd: "transparent",
        co: "rgba(228,233,239,0.3)",
        sh: "none",
        sc: 1,
      };
      const hasAnim = delay != null && r !== "def";
      return React.createElement(
        "div",
        {
          key: u,
          style: {
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: p.display,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.02em",
            background: x.bg,
            border: `1px ${r === "sel" ? "dashed" : "solid"} ${x.bd}`,
            color: x.co,
            boxShadow: x.sh,
            transform: `scale(${x.sc})`,
            animation: hasAnim ? `obCellIn 0.25s ${delay}s both` : "none",
          },
        },
        l,
      );
    },
    b = (l, r) =>
      React.createElement(
        "div",
        {
          style: {
            display: "inline-grid",
            gridTemplateColumns: `repeat(${l[0].length}, 30px)`,
            gap: 0,
          },
        },
        l.flatMap((u, x) =>
          u.map((M, F) => {
            const state = M ? r(x, F) : "def";
            const idx = x * l[0].length + F;
            const delay = state !== "def" ? 0.15 + idx * 0.09 : null;
            return h(M, state, `${n}-${x}-${F}`, delay);
          }),
        ),
      ),
    v = [
      {
        title: "How to play",
        sub: "Find hidden attack terms",
        grid: () =>
          b(
            [
              ["M", "E", "R", "G", "E"],
              ["B", "U", "I", "L", "D"],
            ],
            (l, r) =>
              l === 0 ? "found" : "def",
          ),
        pts: [
          "Drag or tap letters to form words",
          "Words can snake in any direction",
          "Every letter is used exactly once",
          "Stuck? Tap \u201CScan\u201D to reveal a word",
        ],
      },
      {
        title: "Find the Missing Link",
        sub: null,
        grid: () =>
          b(
            [
              ["D", "E", "P", "L", "O", "Y"],
            ],
            () => "link",
          ),
        pts: [
          "The Missing Link reveals the theme",
          "It connects opposite sides of the board",
          "It ties all the attacks together",
        ],
      },
      {
        title: null,
        sub: null,
        isThemeReveal: true,
        grid: () => null,
        pts: [],
      },
    ][n];
  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(13,22,28,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
      },
    },
    React.createElement(
      "div",
      {
        style: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        },
      },
      React.createElement(
        "div",
        {
          style: {
            background: e.surface,
            border: `1px solid ${e.border}`,
            borderRadius: 0,
            padding: "28px 28px 24px",
            maxWidth: 340,
            width: "100%",
            boxShadow: "0 24px 80px -12px rgba(0,0,0,0.7)",
            position: "relative",
          },
        },
      React.createElement(
        "button",
        {
          onClick: c,
          style: {
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: e.textFaint,
            padding: 4,
          },
        },
        React.createElement(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
          },
          React.createElement("path", { d: "M18 6L6 18M6 6l12 12" }),
        ),
      ),
      v.isThemeReveal
        ? React.createElement(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "18px 0 6px",
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  fontFamily: p.mono,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: e.textFaint,
                  marginBottom: 18,
                },
              },
              "YOUR TARGET",
            ),
            React.createElement(
              "div",
              {
                style: {
                  width: "100%",
                  padding: "20px 24px",
                  background: e.surfaceRaised,
                  border: `1px solid rgba(98,38,251,0.2)`,
                  borderRadius: 3,
                  textAlign: "center",
                  animation: "themeGlow 2.5s ease-in-out infinite",
                },
              },
              React.createElement(
                "div",
                {
                  style: {
                    fontFamily: p.display,
                    fontWeight: 700,
                    fontSize: 19,
                    letterSpacing: "-0.02em",
                    color: e.white,
                    lineHeight: 1.2,
                  },
                },
                "Supply chain attacks",
              ),
            ),
            React.createElement(
              "div",
              {
                style: {
                  fontFamily: p.body,
                  fontWeight: 400,
                  fontSize: 12,
                  color: e.textFaint,
                  marginTop: 16,
                  letterSpacing: "-0.01em",
                },
              },
              "Find the hidden attack patterns.",
            ),
          )
        : React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "div",
              {
                style: {
                  fontFamily: p.display,
                  fontWeight: 700,
                  fontSize: 20,
                  letterSpacing: "-0.03em",
                  color: e.white,
                  lineHeight: 1.1,
                  marginBottom: v.sub ? 5 : 0,
                },
              },
              v.title,
            ),
            v.sub &&
              React.createElement(
                "div",
                {
                  style: {
                    fontFamily: p.body,
                    fontWeight: 400,
                    fontSize: 12,
                    color: e.textFaint,
                    letterSpacing: "-0.01em",
                  },
                },
                v.sub,
              ),
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "22px 0 18px",
                  minHeight: 80,
                },
              },
              v.grid(),
            ),
            React.createElement("div", {
              style: {
                height: 1,
                background: e.borderSubtle,
                marginBottom: 16,
              },
            }),
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  marginBottom: 26,
                },
              },
              v.pts.map((l, r) =>
                React.createElement(
                  "div",
                  {
                    key: `${n}-${r}`,
                    style: {
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    },
                  },
                  React.createElement("div", {
                    style: {
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: e.textFaint,
                      marginTop: 7,
                      flexShrink: 0,
                    },
                  }),
                  React.createElement(
                    "span",
                    {
                      style: {
                        fontFamily: p.body,
                        fontWeight: 400,
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        color: e.textMuted,
                        letterSpacing: "-0.01em",
                      },
                    },
                    l,
                  ),
                ),
              ),
            ),
          ),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: v.isThemeReveal ? 28 : 0,
          },
        },
        React.createElement(
          "button",
          {
            onClick: () => n > 0 && d(n - 1),
            style: {
              background: "none",
              border: "none",
              cursor: n > 0 ? "pointer" : "default",
              fontFamily: p.display,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "-0.01em",
              color: n > 0 ? e.textMuted : "transparent",
              padding: "8px 0",
              minWidth: 50,
              textAlign: "left",
            },
          },
          "Back",
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 6 } },
          [0, 1, 2].map((l) =>
            React.createElement("div", {
              key: l,
              style: {
                width: l === n ? 16 : 5,
                height: 4,
                borderRadius: 0,
                background: l === n ? e.accent : e.borderSubtle,
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              },
            }),
          ),
        ),
        n < 2
          ? React.createElement(
              "button",
              {
                onClick: () => d(n + 1),
                style: {
                  background: e.surfaceRaised,
                  border: `1px solid ${e.border}`,
                  borderRadius: 0,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontFamily: p.display,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "-0.01em",
                  color: e.text,
                  minWidth: 50,
                  textAlign: "center",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                },
              },
              "Next ",
              React.createElement(W, { size: 10, color: e.text }),
            )
          : React.createElement(
              "button",
              {
                onClick: c,
                style: {
                  background: e.accent,
                  border: "none",
                  borderRadius: 0,
                  padding: "8px 20px",
                  cursor: "pointer",
                  fontFamily: p.display,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "-0.01em",
                  color: e.white,
                  minWidth: 50,
                  textAlign: "center",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: `0 2px 12px ${e.accentGlow}`,
                },
              },
              "Begin ",
              React.createElement(W, { size: 10 }),
            ),
      ),
    ),
    ),
    React.createElement(GameFooter, null),
  );
}
export default function App() {
  const [loading, setLoading] = k(!0),
    [c, n] = k(!0),
    [d, y] = k([]),
    [o, h] = k([]),
    [b, f] = k(!1),
    [S, w] = k(null),
    [v, l] = k(null),
    [r, u] = k(!1),
    [x, M] = k(!1),
    [F, Z] = k({ width: 0, height: 0 }),
    [q, G] = k(null),
    [hintCells, setHintCells] = k(new Set()),
    [scanning, setScanning] = k(!1),
    [scanNudge, setScanNudge] = k(!1),
    nudgeTimer = Y(null),
    B = Y(null);
  const resetNudge = C(() => {
    setScanNudge(!1);
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    nudgeTimer.current = setTimeout(() => setScanNudge(!0), 15000);
  }, []);
  z(() => {
    if (c) return;
    resetNudge();
    return () => { if (nudgeTimer.current) clearTimeout(nudgeTimer.current); };
  }, [d.length, c]);
  z(() => {
    const t = B.current;
    if (!t) return;
    const s = new ResizeObserver(([i]) =>
      Z({ width: i.contentRect.width, height: i.contentRect.height }),
    );
    return (s.observe(t), () => s.disconnect());
  }, []);
  const j = V(() => {
      const t = {};
      return (
        d.forEach((s, idx) => {
          const i = L.find((a) => a.name === s);
          i &&
            i.path.forEach(([a, g]) => {
              t[T(a, g)] = { type: i.isSpangram ? "sp" : "fd", wordIdx: idx };
            });
        }),
        t
      );
    }, [d]),
    J = V(() => new Set(o.map(([t, s]) => T(t, s))), [o]),
    A = C((t, s) => {
      const i = B.current;
      if (!i) return null;
      const a = i.getBoundingClientRect(),
        g = Math.floor(((t - a.left) / a.width) * D),
        m = Math.floor(((s - a.top) / a.height) * $);
      return m >= 0 && m < $ && g >= 0 && g < D ? [m, g] : null;
    }, []),
    R = C(
      (t) => {
        if (t.length < 2) return null;
        const s = E(t),
          i = E([...t].reverse());
        for (const a of L)
          if (!d.includes(a.name) && (E(a.path) === s || E(a.path) === i))
            return a;
        return null;
      },
      [d],
    ),
    H = Y(!1),
    N = C(
      (t) => {
        if (c || S || x || scanning) return;
        t.preventDefault();
        const s = t.touches ? t.touches[0] : t,
          i = A(s.clientX, s.clientY);
        if (i)
          if (((H.current = !1), f(!0), o.length === 0)) h([i]);
          else {
            const a = o[o.length - 1],
              g = o.findIndex(([m, I]) => m === i[0] && I === i[1]);
            if (g === o.length - 1) {
              const m = R(o);
              if (m) {
                (f(!1),
                  l({ path: m.path, sp: m.isSpangram }),
                  setTimeout(() => {
                    (l(null),
                      y((I) => {
                        const X = [...I, m.name];
                        return (
                          X.length === L.length && setTimeout(() => M(!0), 700),
                          X
                        );
                      }),
                      w(m));
                  }, 420),
                  h([]));
                return;
              } else if (o.length >= 2) {
                (f(!1), u(!0), setTimeout(() => u(!1), 350), h([]));
                return;
              } else {
                (f(!1), h([]));
                return;
              }
            } else if (g >= 0) {
              h(o.slice(0, g + 1));
            } else if (K(a, i)) {
              const nextPath = [...o, i];
              const matched = R(nextPath);
              if (matched) {
                (f(!1),
                  l({ path: matched.path, sp: matched.isSpangram }),
                  setTimeout(() => {
                    (l(null),
                      y((I) => {
                        const X = [...I, matched.name];
                        return (
                          X.length === L.length && setTimeout(() => M(!0), 700),
                          X
                        );
                      }),
                      w(matched));
                  }, 420),
                  h([]));
                return;
              }
              h(nextPath);
            } else {
              h([i]);
            }
          }
      },
      [A, c, S, x, o, R, scanning],
    ),
    O = C(
      (t) => {
        if (!b) return;
        t.preventDefault();
        const s = t.touches ? t.touches[0] : t,
          i = A(s.clientX, s.clientY);
        i &&
          h((a) => {
            if (!a.length) return a;
            const g = a[a.length - 1];
            return i[0] === g[0] && i[1] === g[1]
              ? a
              : ((H.current = !0),
                a.length >= 2 &&
                i[0] === a[a.length - 2][0] &&
                i[1] === a[a.length - 2][1]
                  ? a.slice(0, -1)
                  : a.some(([m, I]) => m === i[0] && I === i[1]) || !K(g, i)
                    ? a
                    : [...a, i]);
          });
      },
      [b, A],
    ),
    P = C(() => {
      if (!b) return;
      f(!1);
      if (!H.current) return;
      const t = R(o);
      (t
        ? (l({ path: t.path, sp: t.isSpangram }),
          setTimeout(() => {
            (l(null),
              y((s) => {
                const i = [...s, t.name];
                return (
                  i.length === L.length && setTimeout(() => M(!0), 700),
                  i
                );
              }),
              w(t));
          }, 420))
        : o.length >= 2 && (u(!0), setTimeout(() => u(!1), 350)),
        h([]));
    }, [b, o, R]);
  z(() => {
    const t = () => b && P();
    return (
      window.addEventListener("mouseup", t),
      window.addEventListener("touchend", t),
      () => {
        (window.removeEventListener("mouseup", t),
          window.removeEventListener("touchend", t));
      }
    );
  }, [b, P]);
  const scanTimers = Y([]);
  const handleScan = C(() => {
    if (scanning || d.length >= L.length) return;
    const nonSpangram = L.filter(
      (t) => !d.includes(t.name) && !t.isSpangram,
    );
    if (nonSpangram.length === 0) return;
    const target = nonSpangram[Math.floor(Math.random() * nonSpangram.length)];
    setScanning(!0);
    h([]);
    const timers = [];
    const sweepCount = 14;
    const sweepInterval = 90;
    const allCells = [];
    for (let row = 0; row < $; row++)
      for (let col = 0; col < D; col++) {
        const key = T(row, col);
        if (!j[key]) allCells.push([row, col]);
      }
    for (let i = 0; i < sweepCount; i++) {
      timers.push(setTimeout(() => {
        const count = 3 + Math.floor(Math.random() * 3);
        const randomCells = [];
        for (let c2 = 0; c2 < count; c2++) {
          const cell = allCells[Math.floor(Math.random() * allCells.length)];
          if (cell) randomCells.push(cell);
        }
        setHintCells(new Set(randomCells.map(([r2, c2]) => T(r2, c2))));
      }, i * sweepInterval));
    }
    const sweepEnd = sweepCount * sweepInterval;
    timers.push(setTimeout(() => setHintCells(new Set()), sweepEnd));
    const traceStart = sweepEnd + 150;
    target.path.forEach(([row, col], idx) => {
      timers.push(setTimeout(() => {
        h(prev => [...prev, [row, col]]);
      }, traceStart + idx * 120));
    });
    const traceEnd = traceStart + target.path.length * 120;
    timers.push(setTimeout(() => {
      h([]);
      l({ path: target.path, sp: target.isSpangram });
      setTimeout(() => {
        l(null);
        y((prev) => {
          const next = [...prev, target.name];
          if (next.length === L.length) setTimeout(() => M(!0), 700);
          return next;
        });
        w(target);
        setScanning(!1);
      }, 420);
    }, traceEnd + 200));
    scanTimers.current = timers;
  }, [d, scanning, j]);
  const scanAvailable = V(() => {
    const remaining = L.filter((t) => !d.includes(t.name) && !t.isSpangram);
    return remaining.length > 0 && !scanning && d.length < L.length;
  }, [d, scanning]);
  const Q = C(
      (t, s) => {
        if (!F.width) return { x: 0, y: 0 };
        const i = F.width / D,
          a = F.height / $;
        return { x: s * i + i / 2, y: t * a + a / 2 };
      },
      [F],
    ),
    U = (t, s, i, a = 2) =>
      t.length < 2
        ? null
        : React.createElement("polyline", {
            points: t
              .map(([g, m]) => {
                const I = Q(g, m);
                return `${I.x},${I.y}`;
              })
              .join(" "),
            fill: "none",
            stroke: s,
            strokeWidth: a,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            opacity: 0.4,
            filter: i ? "url(#glow)" : void 0,
          }),
    _ = (t, s) => {
      const i = T(t, s);
      if (v?.path.some(([a, g]) => a === t && g === s))
        return { state: v.sp ? "fsp" : "ffd", wordIdx: -1 };
      const cellData = j[i];
      if (cellData)
        return { state: cellData.type, wordIdx: cellData.wordIdx };
      if (J.has(i))
        return { state: "sel", wordIdx: -1 };
      if (hintCells.has(i))
        return { state: "hint", wordIdx: -1 };
      if (q === i)
        return { state: "hov", wordIdx: -1 };
      return { state: "def", wordIdx: -1 };
    },
    fdShades = ["#5520D9", "#6226FB", "#7B4AFD"],
    ee = (t, wordIdx) => {
      switch (t) {
        case "def":
          return {
            bg: "transparent",
            bd: "1px solid transparent",
            sh: "none",
            co: "rgba(228,233,239,0.70)",
          };
        case "hov":
          return {
            bg: "rgba(255,255,255,0.03)",
            bd: "1px solid rgba(255,255,255,0.08)",
            sh: "0 0 12px rgba(98,38,251,0.08)",
            co: "rgba(228,233,239,0.82)",
          };
        case "sel":
          return {
            bg: "rgba(98,38,251,0.08)",
            bd: `1px dashed ${e.accent}55`,
            sh: "none",
            co: e.text,
          };
        case "fd": {
          const shade = fdShades[wordIdx % 3];
          return {
            bg: shade,
            bd: "1px solid transparent",
            sh: "none",
            co: e.white,
          };
        }
        case "sp":
          return {
            bg: e.spangram,
            bd: "1px solid transparent",
            sh: "none",
            co: "#0D161C",
          };
        case "ffd":
          return {
            bg: e.accentMid,
            bd: `1px solid ${e.accentMid}`,
            sh: `0 0 20px ${e.accentGlow}`,
            co: e.white,
          };
        case "fsp":
          return {
            bg: `${e.spangram}dd`,
            bd: `1px solid ${e.spangram}`,
            sh: `0 0 20px ${e.spangramGlow}`,
            co: "#0D161C",
          };
        case "hint":
          return {
            bg: "rgba(98,38,251,0.12)",
            bd: `1px solid ${e.accent}40`,
            sh: `0 0 6px ${e.accentGlow}`,
            co: e.text,
          };
      }
    },
    te =
      scanning
        ? "Scanning\u2026"
        : o.length > 0 && !scanning
          ? "Tap last letter to submit"
          : d.length === 0
            ? "Tap or drag to connect letters"
            : d.length < L.length
              ? `${L.length - d.length} attack${L.length - d.length === 1 ? "" : "s"} remaining`
              : "All attacks traced";
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "style",
      null,
      `
        @font-face{font-family:'Gellix';src:url('/fonts/Gellix-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
        @font-face{font-family:'Gellix';src:url('/fonts/Gellix-Bold.woff2') format('woff2');font-weight:700;font-display:swap}
        @font-face{font-family:'Gellix';src:url('/fonts/Gellix-Black.woff2') format('woff2');font-weight:900;font-display:swap}
        @font-face{font-family:'Roobert SemiMono';src:url('/fonts/RoobertSemiMono-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
        @font-face{font-family:'Roobert SemiMono';src:url('/fonts/RoobertSemiMono-SemiBold.woff2') format('woff2');font-weight:600;font-display:swap}
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#0D161C}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes cardIn{from{opacity:0;transform:scale(0.97) translateY(4px)}to{opacity:1;transform:none}}
        @keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}
        @keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-4px)}30%{transform:translateX(4px)}45%{transform:translateX(-3px)}60%{transform:translateX(2px)}}
        @keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes pulseOnce{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.7}}
        @keyframes shimmerLine{from{background-position:-200% 0}to{background-position:200% 0}}
        @keyframes hintPulse{0%{box-shadow:none}50%{box-shadow:0 0 8px rgba(98,38,251,0.2)}100%{box-shadow:none}}
        @keyframes scanNudge{0%,100%{border-color:rgba(68,253,43,0.25);color:rgba(228,233,239,0.70)}50%{border-color:rgba(68,253,43,0.5);color:rgba(228,233,239,0.9)}}
        @keyframes obCellIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
        @keyframes themeGlow{0%,100%{border-color:rgba(98,38,251,0.2);box-shadow:0 0 8px rgba(98,38,251,0.05)}50%{border-color:rgba(98,38,251,0.5);box-shadow:0 0 16px rgba(98,38,251,0.15)}}
      `,
    ),
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          minHeight: "100vh",
          minHeight: "100dvh",
          background: e.bg,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        },
      },
      !loading && React.createElement(
        "header",
        { style: { padding: "16px 16px 0", position: "relative", zIndex: 1 } },
        React.createElement(
          "div",
          {
            style: {
              maxWidth: 480,
              margin: "0 auto",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            },
          },
          React.createElement(
            "div",
            null,
            React.createElement(
              "h1",
              {
                style: {
                  fontFamily: p.display,
                  fontWeight: 900,
                  fontSize: 22,
                  letterSpacing: "-0.04em",
                  color: e.white,
                  lineHeight: 1,
                  textTransform: "uppercase",
                },
              },
              "Malwhere?",
            ),
            React.createElement(
              "div",
              {
                style: {
                  fontFamily: p.mono,
                  fontWeight: 400,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: e.textFaint,
                  marginTop: 5,
                },
              },
              "SUPPLY CHAIN ATTACKS",
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                },
              },
              React.createElement(
                "span",
                {
                  style: {
                    fontFamily: p.display,
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: "-0.02em",
                    color: e.white,
                    lineHeight: 1,
                  },
                },
                d.length,
              ),
              React.createElement(
                "span",
                {
                  style: {
                    fontFamily: p.mono,
                    fontWeight: 400,
                    fontSize: 10,
                    color: e.textFaint,
                    letterSpacing: "0.02em",
                  },
                },
                `/ ${L.length} FOUND`,
              ),
            ),
            React.createElement(
              "div",
              {
                style: {
                  width: 100,
                  height: 2,
                  background: e.borderSubtle,
                  borderRadius: 1,
                  overflow: "hidden",
                },
              },
              React.createElement("div", {
                style: {
                  width: `${(d.length / L.length) * 100}%`,
                  height: "100%",
                  background: e.accent,
                  borderRadius: 1,
                  transition:
                    "width 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                },
              }),
            ),
            React.createElement(
              "button",
              {
                onClick: () => { handleScan(); setScanNudge(!1); if (nudgeTimer.current) clearTimeout(nudgeTimer.current); },
                disabled: !scanAvailable,
                style: {
                  background: "none",
                  border: `1px solid ${scanAvailable ? e.border : e.borderSubtle}`,
                  borderRadius: 0,
                  padding: "5px 12px",
                  cursor: scanAvailable ? "pointer" : "default",
                  fontFamily: p.mono,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: scanAvailable ? e.textMuted : e.textFaint,
                  opacity: scanAvailable ? 1 : 0.4,
                  transition: "opacity 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                  marginTop: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  animation: scanNudge && scanAvailable ? "scanNudge 2s ease-in-out infinite" : "none",
                },
              },
              React.createElement(
                "svg",
                {
                  width: 10,
                  height: 10,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 2.5,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                },
                React.createElement("circle", { cx: 11, cy: 11, r: 8 }),
                React.createElement("path", { d: "M21 21l-4.35-4.35" }),
              ),
              "Scan",
            ),
          ),
        ),
      ),
      !loading && React.createElement(
        "div",
        {
          style: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 16px 0",
            position: "relative",
            zIndex: 1,
          },
        },
        React.createElement(
          "div",
          {
            ref: B,
            style: {
              display: "grid",
              gridTemplateColumns: `repeat(${D}, 1fr)`,
              gridTemplateRows: `repeat(${$}, 1fr)`,
              gap: 0,
              width: "100%",
              maxWidth: 420,
              position: "relative",
              touchAction: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              animation: r ? "shake 0.35s ease" : "none",
            },
            onMouseDown: N,
            onMouseMove: O,
            onTouchStart: N,
            onTouchMove: O,
          },
          ne.flatMap((t, s) =>
            t.map((i, a) => {
              const cellInfo = _(s, a),
                g = cellInfo.state,
                wi = cellInfo.wordIdx,
                m = ee(g, wi),
                I = g === "ffd" || g === "fsp";
              const isHint = g === "hint";
              return React.createElement(
                "div",
                {
                  key: T(s, a),
                  onMouseEnter: () => {
                    !b && !S && !x && !scanning && G(T(s, a));
                  },
                  onMouseLeave: () => G(null),
                  style: {
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: p.display,
                    fontWeight: 700,
                    fontSize: "clamp(12px, 3.2vw, 17px)",
                    letterSpacing: "0.02em",
                    borderRadius: 0,
                    background: m.bg,
                    border: m.bd,
                    boxShadow: m.sh,
                    color: m.co,
                    position: "relative",
                    zIndex: 1,
                    cursor: "pointer",
                    animation: I ? "pop 0.32s ease" : isHint ? "hintPulse 1.5s ease-in-out" : "none",
                    transition:
                      "background 0.18s ease, border 0.18s ease, color 0.15s ease, box-shadow 0.25s ease",
                  },
                },
                i,
              );
            }),
          ),
          React.createElement(
            "svg",
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 2,
              },
              width: F.width || "100%",
              height: F.height || "100%",
            },
            React.createElement(
              "defs",
              null,
              React.createElement(
                "filter",
                { id: "glow" },
                React.createElement("feGaussianBlur", {
                  stdDeviation: "4",
                  result: "b",
                }),
                React.createElement(
                  "feMerge",
                  null,
                  React.createElement("feMergeNode", { in: "b" }),
                  React.createElement("feMergeNode", { in: "SourceGraphic" }),
                ),
              ),
            ),
            d.map((t, wordIdx) => {
              const s = L.find((i) => i.name === t);
              if (!s || !F.width) return null;
              const cellW = F.width / D, cellH = F.height / $;
              const cellSet = new Set(s.path.map(([r2,c2]) => T(r2,c2)));
              const segments = [];
              s.path.forEach(([r2, c2]) => {
                const x1 = c2 * cellW, y1 = r2 * cellH;
                const x2 = x1 + cellW, y2 = y1 + cellH;
                if (!cellSet.has(T(r2-1, c2))) segments.push(`M${x1},${y1}L${x2},${y1}`);
                if (!cellSet.has(T(r2+1, c2))) segments.push(`M${x1},${y2}L${x2},${y2}`);
                if (!cellSet.has(T(r2, c2-1))) segments.push(`M${x1},${y1}L${x1},${y2}`);
                if (!cellSet.has(T(r2, c2+1))) segments.push(`M${x2},${y1}L${x2},${y2}`);
              });
              const strokeColor = s.isSpangram ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.18)";
              return React.createElement("path", {
                key: `outline-${t}`,
                d: segments.join(""),
                fill: "none",
                stroke: strokeColor,
                strokeWidth: 1.5,
                strokeLinejoin: "round",
              });
            }),
            o.length > 1 && U(o, `${e.accent}90`, !0, 2),
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              fontFamily: p.body,
              fontWeight: 400,
              fontSize: 11,
              color: e.textFaint,
              textAlign: "center",
              marginTop: 6,
              letterSpacing: "-0.01em",
            },
          },
          te,
        ),
        React.createElement(
          "div",
          {
            style: {
              maxWidth: 480,
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              justifyContent: "center",
              marginTop: 10,
            },
          },
          L.map((t) =>
            React.createElement(re, {
              key: t.name,
              w: t,
              found: d.includes(t.name),
            }),
          ),
        ),
      ),
      !loading && React.createElement(GameFooter, null),
      c && !loading && React.createElement(se, { onClose: () => n(!1) }),
      loading && React.createElement(LoadingScreen, { onComplete: () => setLoading(!1) }),
      S && React.createElement(ae, { word: S, onClose: () => w(null) }),
      x && !S && React.createElement(oe, {
        onPlayAgain: () => {
          M(!1);
          y([]);
          h([]);
          w(null);
          l(null);
          setHintCells(new Set());
          setScanning(!1);
          setScanNudge(!1);
          resetNudge();
        },
      }),
    ),
  );
}
