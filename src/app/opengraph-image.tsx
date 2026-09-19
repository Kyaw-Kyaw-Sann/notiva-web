import { ImageResponse } from "next/og";

export const alt = "Notiva — Notes, writing, and ideas in one workspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f7f7fb",
        color: "#17172a",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "64px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "white",
          border: "1px solid #dedee8",
          borderRadius: "28px",
          display: "flex",
          gap: "56px",
          height: "100%",
          padding: "64px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
            <div style={{ background: "#5b55e7", borderRadius: "14px", height: "52px", width: "52px" }} />
            <span style={{ fontSize: "36px", fontWeight: 700 }}>Notiva</span>
          </div>
          <h1 style={{ fontSize: "58px", letterSpacing: "-2px", lineHeight: 1.08, margin: "48px 0 24px" }}>
            Keep ideas organized and writing in focus.
          </h1>
          <p style={{ color: "#69697a", fontSize: "25px", lineHeight: 1.45, margin: 0 }}>
            Notes, rich-text writing, and thoughtful AI assistance in one dependable workspace.
          </p>
        </div>
        <div style={{ background: "#f5f4ff", border: "1px solid #dedcfb", borderRadius: "22px", display: "flex", flexDirection: "column", gap: "18px", height: "390px", padding: "28px", width: "390px" }}>
          <div style={{ background: "#5b55e7", borderRadius: "8px", height: "16px", width: "42%" }} />
          <div style={{ background: "white", border: "1px solid #e0e0e8", borderRadius: "14px", display: "flex", flex: 1, flexDirection: "column", gap: "18px", padding: "24px" }}>
            <div style={{ background: "#20202d", borderRadius: "5px", height: "15px", width: "72%" }} />
            <div style={{ background: "#d8d8e2", borderRadius: "5px", height: "11px", width: "100%" }} />
            <div style={{ background: "#d8d8e2", borderRadius: "5px", height: "11px", width: "88%" }} />
            <div style={{ background: "#d8d8e2", borderRadius: "5px", height: "11px", width: "64%" }} />
            <div style={{ display: "flex", flex: 1 }} />
            <div style={{ alignItems: "center", display: "flex", gap: "10px" }}>
              <div style={{ background: "#5b55e7", borderRadius: "50%", height: "12px", width: "12px" }} />
              <div style={{ background: "#b7b7c5", borderRadius: "4px", height: "10px", width: "100px" }} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
