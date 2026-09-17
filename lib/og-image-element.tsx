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
        backgroundColor: "#060709",
        padding: "32px",
      }}
    >
      {/* Main Studio Frame */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0c0e14",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "40px 48px",
          position: "relative",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#141824" stroke="rgba(47,240,214,0.4)" strokeWidth="1" />
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
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              Charticles
            </span>
          </div>

          {/* Top Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(47, 240, 214, 0.1)",
                border: "1px solid rgba(47, 240, 214, 0.3)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  backgroundColor: "#2ff0d6",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2ff0d6",
                }}
              >
                100% Free & Open Source
              </span>
            </div>
            <div
              style={{
                display: "flex",
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  fontWeight: 500,
                }}
              >
                Zero Watermarks
              </span>
            </div>
          </div>
        </div>

        {/* Center Content Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          {/* Left: Typography & Highlights */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "560px",
            }}
          >
            <div style={{ display: "flex", marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#2ff0d6",
                }}
              >
                PARTICLE DATA VISUALIZATION STUDIO
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "46px",
                  lineHeight: "1.12",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
              >
                Data visualization,
              </span>
              <span
                style={{
                  fontSize: "46px",
                  lineHeight: "1.12",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#2ff0d6",
                }}
              >
                made of living light.
              </span>
            </div>

            <div style={{ display: "flex", marginBottom: "26px" }}>
              <span
                style={{
                  fontSize: "17px",
                  lineHeight: "1.5",
                  color: "#94a3b8",
                }}
              >
                Transform numbers, spreadsheets, and chart screenshots into mesmerizing 60 FPS particle animations.
              </span>
            </div>

            {/* Feature Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: "#2ff0d6",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 500 }}>
                  120,000 Particles
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: "#2ff0d6",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 500 }}>
                  4K Ultra HD
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: "#2ff0d6",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 500 }}>
                  60 FPS Loops
                </span>
              </div>
            </div>
          </div>

          {/* Right: Authentic Vector Particle Chart Visual */}
          <div
            style={{
              width: "440px",
              height: "280px",
              display: "flex",
              position: "relative",
              backgroundColor: "#060709",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "20px",
            }}
          >
            {/* Live Data Callout Metric Badge (HTML flexbox, NO SVG text) */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#141824",
                border: "1px solid rgba(47, 240, 214, 0.4)",
                borderRadius: "6px",
                padding: "4px 10px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "9999px",
                  backgroundColor: "#2ff0d6",
                }}
              />
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                +142.8% • 60 FPS
              </span>
            </div>

            <svg width="400" height="240" viewBox="0 0 400 240" fill="none">
              {/* Technical axes & dashed grid */}
              <line x1="30" y1="35" x2="380" y2="35" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="30" y1="85" x2="380" y2="85" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="30" y1="135" x2="380" y2="135" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="30" y1="185" x2="380" y2="185" stroke="rgba(255,255,255,0.12)" />

              {/* Secondary trend curve */}
              <path
                d="M 40 175 C 90 170, 140 155, 190 145 C 240 135, 290 125, 370 95"
                stroke="rgba(148, 163, 184, 0.25)"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Main Particle Stream (Luminous Cyan) */}
              <path
                d="M 40 165 C 80 160, 120 125, 160 115 C 200 105, 240 70, 280 55 C 320 40, 350 35, 370 25"
                stroke="rgba(47, 240, 214, 0.5)"
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

              {/* Constellation Particle Dust */}
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

              {/* Filaments */}
              <line x1="160" y1="115" x2="150" y2="80" stroke="rgba(47,240,214,0.3)" strokeWidth="0.8" />
              <line x1="280" y1="55" x2="260" y2="110" stroke="rgba(47,240,214,0.25)" strokeWidth="0.8" />
              <line x1="280" y1="55" x2="300" y2="85" stroke="rgba(47,240,214,0.25)" strokeWidth="0.8" />
              <line x1="370" y1="25" x2="340" y2="65" stroke="rgba(47,240,214,0.3)" strokeWidth="0.8" />
            </svg>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#cad2e0",
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
