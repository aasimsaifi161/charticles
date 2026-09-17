export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_CONTENT_TYPE = "image/png";

export function renderOgImageElement() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#07080a",
        padding: "36px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Main Framed Studio Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0d13",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "44px 50px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Subtle Precision Dot Grid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Brand Logo & Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#141721" stroke="rgba(47,240,214,0.3)" strokeWidth="1" />
              <path
                d="M 22 10 A 8.5 8.5 0 1 0 22 22"
                stroke="#2ff0d6"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx="22" cy="16" r="2.2" fill="#2ff0d6" />
              <circle cx="16.5" cy="16" r="1.4" fill="#2ff0d6" opacity="0.8" />
            </svg>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              Charticles
            </span>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "rgba(47, 240, 214, 0.08)",
                border: "1px solid rgba(47, 240, 214, 0.25)",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "9999px",
                  backgroundColor: "#2ff0d6",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2ff0d6",
                  letterSpacing: "0.01em",
                }}
              >
                100% Free & Open Source
              </span>
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "13px",
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              Zero Watermarks
            </div>
          </div>
        </div>

        {/* Center Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            position: "relative",
            zIndex: 2,
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          {/* Left Text Block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "560px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                color: "#2ff0d6",
                marginBottom: "12px",
              }}
            >
              Free 60 FPS Particle Studio
            </div>

            <h1
              style={{
                fontSize: "46px",
                lineHeight: "1.12",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                margin: 0,
                marginBottom: "16px",
              }}
            >
              Data visualization,
              <br />
              <span style={{ color: "#2ff0d6" }}>made of living light.</span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.5",
                color: "#94a3b8",
                margin: 0,
                maxWidth: "500px",
              }}
            >
              Transform numbers, spreadsheets, and chart screenshots into mesmerizing 60 FPS particle animations.
            </p>

            {/* Feature Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                marginTop: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ color: "#2ff0d6", fontSize: "14px" }}>✦</span>
                <span style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 500 }}>
                  120,000 GPU Particles
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ color: "#2ff0d6", fontSize: "14px" }}>✦</span>
                <span style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 500 }}>
                  4K Ultra HD Export
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ color: "#2ff0d6", fontSize: "14px" }}>✦</span>
                <span style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 500 }}>
                  60 FPS Video Loops
                </span>
              </div>
            </div>
          </div>

          {/* Right Vector Visual: Technical Particle Constellation Chart */}
          <div
            style={{
              width: "440px",
              height: "280px",
              display: "flex",
              position: "relative",
              backgroundColor: "#07080a",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              overflow: "hidden",
              boxSizing: "border-box",
              padding: "20px",
            }}
          >
            <svg width="400" height="240" viewBox="0 0 400 240" fill="none">
              {/* Technical axes & dashed grid */}
              <line x1="30" y1="35" x2="380" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="30" y1="85" x2="380" y2="85" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="30" y1="135" x2="380" y2="135" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="30" y1="185" x2="380" y2="185" stroke="rgba(255,255,255,0.08)" />

              {/* Axis markers */}
              <text x="10" y="39" fill="#475569" fontSize="10" fontFamily="sans-serif">100k</text>
              <text x="16" y="89" fill="#475569" fontSize="10" fontFamily="sans-serif">50k</text>
              <text x="21" y="139" fill="#475569" fontSize="10" fontFamily="sans-serif">10k</text>
              <text x="25" y="189" fill="#475569" fontSize="10" fontFamily="sans-serif">0</text>

              {/* Secondary trajectory */}
              <path
                d="M 40 175 C 90 170, 140 155, 190 145 C 240 135, 290 125, 370 95"
                stroke="rgba(148, 163, 184, 0.22)"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Main Particle Curve (Luminous Cyan Stream) */}
              <path
                d="M 40 165 C 80 160, 120 125, 160 115 C 200 105, 240 70, 280 55 C 320 40, 350 35, 370 25"
                stroke="rgba(47, 240, 214, 0.45)"
                strokeWidth="2"
                fill="none"
              />

              {/* Main Particle Nodes */}
              <circle cx="40" cy="165" r="3.5" fill="#2ff0d6" />
              <circle cx="95" cy="145" r="3" fill="#2ff0d6" />
              <circle cx="135" cy="123" r="3.5" fill="#2ff0d6" />
              <circle cx="160" cy="115" r="4.5" fill="#ffffff" stroke="#2ff0d6" strokeWidth="2" />
              <circle cx="205" cy="95" r="3" fill="#2ff0d6" />
              <circle cx="245" cy="69" r="3.5" fill="#2ff0d6" />
              <circle cx="280" cy="55" r="5" fill="#ffffff" stroke="#2ff0d6" strokeWidth="2.5" />
              <circle cx="325" cy="43" r="3.5" fill="#2ff0d6" />
              <circle cx="370" cy="25" r="5.5" fill="#2ff0d6" />

              {/* Ambient Micro-Particles (Simulation of 60fps particle swarm) */}
              <circle cx="60" cy="125" r="1.5" fill="#2ff0d6" opacity="0.6" />
              <circle cx="80" cy="85" r="1.2" fill="#ffffff" opacity="0.5" />
              <circle cx="110" cy="160" r="1.5" fill="#2ff0d6" opacity="0.4" />
              <circle cx="150" cy="80" r="2" fill="#2ff0d6" opacity="0.7" />
              <circle cx="180" cy="135" r="1.2" fill="#ffffff" opacity="0.4" />
              <circle cx="220" cy="50" r="1.5" fill="#2ff0d6" opacity="0.6" />
              <circle cx="260" cy="110" r="1.8" fill="#2ff0d6" opacity="0.5" />
              <circle cx="300" cy="85" r="1.5" fill="#ffffff" opacity="0.6" />
              <circle cx="340" cy="65" r="2" fill="#2ff0d6" opacity="0.7" />
              <circle cx="360" cy="105" r="1.2" fill="#ffffff" opacity="0.4" />
              <circle cx="385" cy="45" r="1.5" fill="#2ff0d6" opacity="0.5" />

              {/* Thin Connection Filaments */}
              <line x1="160" y1="115" x2="150" y2="80" stroke="rgba(47,240,214,0.3)" strokeWidth="0.8" />
              <line x1="280" y1="55" x2="260" y2="110" stroke="rgba(47,240,214,0.25)" strokeWidth="0.8" />
              <line x1="280" y1="55" x2="300" y2="85" stroke="rgba(47,240,214,0.25)" strokeWidth="0.8" />
              <line x1="370" y1="25" x2="340" y2="65" stroke="rgba(47,240,214,0.3)" strokeWidth="0.8" />

              {/* Data Callout Metric Badge */}
              <rect x="230" y="10" width="130" height="30" rx="6" fill="#141721" stroke="rgba(47,240,214,0.4)" strokeWidth="1" />
              <circle cx="244" cy="25" r="3" fill="#2ff0d6" />
              <text x="254" y="29" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                +142.8% • 60 FPS
              </text>
            </svg>
          </div>
        </div>

        {/* Bottom Attribution Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "18px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#cad2e0",
                letterSpacing: "0.01em",
              }}
            >
              charticles.vercel.app
            </span>
            <span style={{ color: "#475569", fontSize: "14px" }}>•</span>
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              Interactive WebGL & Particle Canvas
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Built by</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                padding: "3px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              @aasimtwt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
