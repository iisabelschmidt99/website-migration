"use client";

import { useEffect, useRef } from "react";
import CtaButton from "@/components/CtaButton";

/**
 * V3 Hero – Canvas-Wireframe-Animation (Schreibtisch-Szene) als interaktiver
 * Hintergrund. Drag-to-rotate, sanftes Idle-Float, rotierende Scan-Arcs.
 */
export default function DesignV3HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LG = "rgb(200,255,0)";
    const SC = 170;
    const FOV = 950;
    let W = 0,
      H = 0;

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Camera state ──────────────────────────────────────────────────────────
    let baseRotY = 0.3,
      baseRotX = 0.28;
    let dragDY = 0,
      dragDX = 0;
    let isDragging = false,
      lastMX = 0,
      lastMY = 0;
    let rotY = baseRotY,
      rotX = baseRotX;
    let camZ = 0,
      camY = 0,
      targetCamZ = 0,
      targetCamY = 0;

    const onMD = (e: MouseEvent) => {
      isDragging = true;
      lastMX = e.clientX;
      lastMY = e.clientY;
    };
    const onMM = (e: MouseEvent) => {
      if (!isDragging) return;
      dragDY += (e.clientX - lastMX) * 0.007;
      dragDX += (e.clientY - lastMY) * 0.004;
      lastMX = e.clientX;
      lastMY = e.clientY;
    };
    const onMU = () => {
      isDragging = false;
    };
    canvas.addEventListener("mousedown", onMD);
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);

    // ── Scroll → Keyframe-Kamera ──────────────────────────────────────────────
    const KF = [
      { p: 0.00, ry:  0.30, rx: 0.28, z:   0, cy:   0 },
      { p: 0.15, ry:  0.50, rx: 0.22, z:  60, cy:  20 },
      { p: 0.30, ry:  0.10, rx: 0.32, z: 120, cy:  40 },
      { p: 0.50, ry: -0.20, rx: 0.18, z: 200, cy:  80 },
      { p: 0.70, ry:  0.40, rx: 0.35, z: 260, cy: 120 },
      { p: 0.85, ry:  0.00, rx: 0.45, z: 320, cy: 160 },
      { p: 1.00, ry:  0.30, rx: 0.28, z: 380, cy: 200 },
    ];
    function kfLerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function smoothstep(t: number) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
    function getCameraFromScroll(p: number) {
      let i = 0;
      for (let k = 0; k < KF.length - 1; k++) {
        if (p >= KF[k].p && p <= KF[k + 1].p) { i = k; break; }
        if (p > KF[KF.length - 1].p) i = KF.length - 2;
      }
      const a = KF[i], b = KF[i + 1] ?? KF[i];
      const range = b.p - a.p;
      const t = range === 0 ? 0 : smoothstep((p - a.p) / range);
      return { ry: kfLerp(a.ry, b.ry, t), rx: kfLerp(a.rx, b.rx, t), z: kfLerp(a.z, b.z, t), cy: kfLerp(a.cy, b.cy, t) };
    }
    function onScroll() {
      const max = document.body.scrollHeight - window.innerHeight;
      const scrollP = Math.max(0, Math.min(1, window.scrollY / max));
      const cam = getCameraFromScroll(scrollP);
      baseRotY   = cam.ry;
      baseRotX   = cam.rx;
      targetCamZ = cam.z;
      targetCamY = cam.cy;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── 3-D Projektion ────────────────────────────────────────────────────────
    function project(x: number, y: number, z: number) {
      const cy = Math.cos(rotX),
        sy = Math.sin(rotX);
      const cz = Math.cos(rotY),
        sz = Math.sin(rotY);
      const x1 = x * cz + z * sz;
      const z1 = -x * sz + z * cz;
      const y1 = y * cy - z1 * sy;
      const z2 = y * sy + z1 * cy;
      const d = FOV / (FOV + z2 + camZ + 600);
      return { x: W * 0.52 + x1 * d, y: H * 0.5 + (y1 - camY) * d };
    }

    function L(
      x1: number, y1: number, z1: number,
      x2: number, y2: number, z2: number,
      a = 1, w = 1,
    ) {
      const A = project(x1, y1, z1),
        B = project(x2, y2, z2);
      ctx!.beginPath();
      ctx!.moveTo(A.x, A.y);
      ctx!.lineTo(B.x, B.y);
      ctx!.globalAlpha = a;
      ctx!.lineWidth = w;
      ctx!.stroke();
      ctx!.globalAlpha = 1;
    }

    function ringXZ(
      ox: number, oy: number, oz: number,
      r: number, segs = 32, a = 1, w = 1,
    ) {
      ctx!.beginPath();
      for (let i = 0; i <= segs; i++) {
        const ang = (i / segs) * Math.PI * 2;
        const p = project(ox + Math.cos(ang) * r, oy, oz + Math.sin(ang) * r);
        i === 0 ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y);
      }
      ctx!.globalAlpha = a;
      ctx!.lineWidth = w;
      ctx!.stroke();
      ctx!.globalAlpha = 1;
    }

    // ── Floor grid ────────────────────────────────────────────────────────────
    function drawFloor() {
      ctx!.strokeStyle = LG;
      const fy = SC * 1.55, size = SC * 4, steps = 16;
      for (let i = -steps; i <= steps; i++) {
        const t = i / steps;
        L(t * size, fy, -size, t * size, fy, size, 0.032, 0.5);
        L(-size, fy, t * size, size, fy, t * size, 0.032, 0.5);
      }
      L(-size, fy, 0, size, fy, 0, 0.07, 0.8);
      L(0, fy, -size, 0, fy, size, 0.07, 0.8);
    }

    // ── Desk ──────────────────────────────────────────────────────────────────
    function drawDesk() {
      ctx!.strokeStyle = LG;
      ctx!.lineCap = "round";
      const dy = SC * 0.55, dW = SC * 3.0, dD = SC * 1.35, thick = SC * 0.065;
      L(-dW, dy, -dD, dW, dy, -dD, 0.5, 1.8);
      L(dW, dy, -dD, dW, dy, dD, 0.5, 1.8);
      L(dW, dy, dD, -dW, dy, dD, 0.5, 1.8);
      L(-dW, dy, dD, -dW, dy, -dD, 0.5, 1.8);
      for (let i = 1; i < 12; i++) {
        const x = -dW + (i / 12) * dW * 2;
        L(x, dy, -dD, x, dy, dD, 0.07, 0.5);
      }
      for (let j = 1; j < 6; j++) {
        const z = -dD + (j / 6) * dD * 2;
        L(-dW, dy, z, dW, dy, z, 0.07, 0.5);
      }
      L(-dW, dy + thick, dD, dW, dy + thick, dD, 0.22, 0.9);
      L(-dW, dy, dD, -dW, dy + thick, dD, 0.22, 0.9);
      L(dW, dy, dD, dW, dy + thick, dD, 0.22, 0.9);
      const legY2 = SC * 1.55;
      ([ [-dW + SC * 0.18, -dD + SC * 0.18], [dW - SC * 0.18, -dD + SC * 0.18],
         [dW - SC * 0.18, dD - SC * 0.18],  [-dW + SC * 0.18, dD - SC * 0.18] ] as [number, number][])
        .forEach(([lx, lz]) => {
          L(lx, dy + thick, lz, lx, legY2, lz, 0.28, 1.1);
          ringXZ(lx, legY2, lz, SC * 0.045, 8, 0.18, 0.7);
        });
      L(-dW + SC * 0.18, SC * 1.1, -dD + SC * 0.18, dW - SC * 0.18, SC * 1.1, -dD + SC * 0.18, 0.18, 0.8);
    }

    // ── Monitor ───────────────────────────────────────────────────────────────
    function drawMonitor() {
      ctx!.strokeStyle = LG;
      ctx!.lineCap = "round";
      const dy = SC * 0.55, dD = SC * 1.35;
      const mz = -dD * 0.52, mx = SC * 0.2, mW = SC * 1.05, mH = SC * 0.65;
      const mD = SC * 0.055, mY1 = dy - mH * 2 + SC * 0.05, mY2 = dy - SC * 0.02, bz = SC * 0.055;
      L(mx - mW, mY1, mz, mx + mW, mY1, mz, 0.65, 2.0);
      L(mx + mW, mY1, mz, mx + mW, mY2, mz, 0.65, 2.0);
      L(mx + mW, mY2, mz, mx - mW, mY2, mz, 0.65, 2.0);
      L(mx - mW, mY2, mz, mx - mW, mY1, mz, 0.65, 2.0);
      const mz2 = mz + mD;
      L(mx - mW, mY1, mz, mx - mW, mY1, mz2, 0.25, 0.8);
      L(mx + mW, mY1, mz, mx + mW, mY1, mz2, 0.25, 0.8);
      L(mx + mW, mY2, mz, mx + mW, mY2, mz2, 0.25, 0.8);
      L(mx - mW, mY2, mz, mx - mW, mY2, mz2, 0.25, 0.8);
      L(mx - mW, mY1, mz2, mx + mW, mY1, mz2, 0.18, 0.6);
      L(mx + mW, mY1, mz2, mx + mW, mY2, mz2, 0.18, 0.6);
      L(mx + mW, mY2, mz2, mx - mW, mY2, mz2, 0.18, 0.6);
      L(mx - mW, mY2, mz2, mx - mW, mY1, mz2, 0.18, 0.6);
      const sx1 = mx - mW + bz, sx2 = mx + mW - bz, sy1 = mY1 + bz, sy2 = mY2 - bz;
      L(sx1, sy1, mz, sx2, sy1, mz, 0.4, 1.2);
      L(sx2, sy1, mz, sx2, sy2, mz, 0.4, 1.2);
      L(sx2, sy2, mz, sx1, sy2, mz, 0.4, 1.2);
      L(sx1, sy2, mz, sx1, sy1, mz, 0.4, 1.2);
      const sw = sx2 - sx1, sh = sy2 - sy1;
      for (let r = 1; r < 6; r++) L(sx1, sy1 + (r / 6) * sh, mz, sx2, sy1 + (r / 6) * sh, mz, 0.1, 0.5);
      for (let c = 1; c < 5; c++) L(sx1 + (c / 5) * sw, sy1, mz, sx1 + (c / 5) * sw, sy2, mz, 0.08, 0.5);
      const pts = [0.1, 0.55, 0.3, 0.2, 0.6, 0.45, 0.75, 0.15, 0.9];
      for (let i = 0; i < pts.length - 1; i++) {
        const px1 = sx1 + (i / (pts.length - 1)) * sw;
        const px2 = sx1 + ((i + 1) / (pts.length - 1)) * sw;
        const py1 = sy1 + (1 - pts[i]) * sh;
        const py2 = sy1 + (1 - pts[i + 1]) * sh;
        L(px1, py1, mz, px2, py2, mz, 0.35, 1.0);
      }
      L(mx, mY2, mz, mx, dy, mz, 0.35, 1.1);
      ringXZ(mx, dy, mz, SC * 0.24, 20, 0.3, 1.1);
      ringXZ(mx, dy, mz, SC * 0.12, 12, 0.18, 0.7);
    }

    // ── Keyboard ──────────────────────────────────────────────────────────────
    function drawKeyboard() {
      ctx!.strokeStyle = LG;
      ctx!.lineCap = "round";
      const dy = SC * 0.55, dD = SC * 1.35;
      const kx = SC * 0.15, kz = dD * 0.42, kW = SC * 0.8, kD2 = SC * 0.26;
      L(kx - kW, dy, kz - kD2, kx + kW, dy, kz - kD2, 0.38, 1.2);
      L(kx + kW, dy, kz - kD2, kx + kW, dy, kz + kD2, 0.38, 1.2);
      L(kx + kW, dy, kz + kD2, kx - kW, dy, kz + kD2, 0.38, 1.2);
      L(kx - kW, dy, kz + kD2, kx - kW, dy, kz - kD2, 0.38, 1.2);
      const rows = [kz - kD2 * 0.65, kz - kD2 * 0.25, kz + kD2 * 0.15, kz + kD2 * 0.6];
      rows.forEach((rz) => {
        for (let k = -6; k <= 6; k++) {
          const kx2 = kx + (k / 6.5) * kW * 0.92;
          const hw = kW * 0.062, hd = kD2 * 0.1;
          L(kx2 - hw, dy, rz - hd, kx2 + hw, dy, rz - hd, 0.22, 0.6);
          L(kx2 + hw, dy, rz - hd, kx2 + hw, dy, rz + hd, 0.22, 0.6);
          L(kx2 + hw, dy, rz + hd, kx2 - hw, dy, rz + hd, 0.22, 0.6);
          L(kx2 - hw, dy, rz + hd, kx2 - hw, dy, rz - hd, 0.22, 0.6);
        }
      });
      const sz = kz + kD2 * 0.88, sw2 = kW * 0.38, sd = kD2 * 0.1;
      L(kx - sw2, dy, sz - sd, kx + sw2, dy, sz - sd, 0.32, 1.0);
      L(kx + sw2, dy, sz - sd, kx + sw2, dy, sz + sd, 0.32, 1.0);
      L(kx + sw2, dy, sz + sd, kx - sw2, dy, sz + sd, 0.32, 1.0);
      L(kx - sw2, dy, sz + sd, kx - sw2, dy, sz - sd, 0.32, 1.0);
    }

    // ── Mouse ─────────────────────────────────────────────────────────────────
    function drawMouse() {
      ctx!.strokeStyle = LG;
      const dy = SC * 0.55, mx2 = SC * 1.35, mz2 = SC * 0.5;
      const mR = SC * 0.115, mH = SC * 0.22;
      ringXZ(mx2, dy, mz2, mR, 20, 0.35, 1.1);
      ringXZ(mx2, dy, mz2, mR * 0.5, 10, 0.18, 0.7);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        L(mx2 + Math.cos(a) * mR, dy, mz2 + Math.sin(a) * mR,
          mx2 + Math.cos(a) * mR, dy - mH, mz2 + Math.sin(a) * mR * 0.85, 0.2, 0.6);
      }
      ringXZ(mx2, dy - mH, mz2, mR * 0.85, 16, 0.2, 0.7);
      L(mx2, dy, mz2 - mR, mx2, dy, mz2 + mR, 0.2, 0.6);
    }

    // ── Lamp ──────────────────────────────────────────────────────────────────
    function drawLamp() {
      ctx!.strokeStyle = LG;
      ctx!.lineCap = "round";
      const dy = SC * 0.55, dD = SC * 1.35;
      const bx = -SC * 2.2, bz = -dD * 0.55, baseR = SC * 0.18;
      ringXZ(bx, dy, bz, baseR, 20, 0.5, 1.4);
      ringXZ(bx, dy, bz, baseR * 0.5, 12, 0.28, 0.8);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        L(bx + Math.cos(a) * baseR, dy, bz + Math.sin(a) * baseR,
          bx + Math.cos(a) * baseR, dy - SC * 0.07, bz + Math.sin(a) * baseR, 0.25, 0.8);
      }
      ringXZ(bx, dy - SC * 0.07, bz, baseR, 16, 0.25, 0.8);
      const topY = dy - SC * 1.05;
      L(bx, dy - SC * 0.07, bz, bx, topY, bz, 0.6, 1.8);
      ringXZ(bx, topY, bz, SC * 0.06, 12, 0.45, 1.2);
      const a2x = bx + SC * 0.75, a2z = bz + SC * 0.3, a2y = topY + SC * 0.12;
      L(bx, topY, bz, a2x, a2y, a2z, 0.6, 1.8);
      ringXZ(a2x, a2y, a2z, SC * 0.055, 10, 0.4, 1.1);
      const hx = a2x + SC * 0.06, hz = a2z, hy = a2y - SC * 0.05;
      const rTop = SC * 0.24, rBot = SC * 0.09, hH = SC * 0.2;
      ringXZ(hx, hy, hz, rTop, 24, 0.6, 1.7);
      ringXZ(hx, hy - hH, hz, rBot, 14, 0.55, 1.5);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        L(hx + Math.cos(a) * rTop, hy, hz + Math.sin(a) * rTop,
          hx + Math.cos(a) * rBot, hy - hH, hz + Math.sin(a) * rBot, 0.3, 0.8);
      }
      ringXZ(hx, hy - hH * 0.5, hz, (rTop + rBot) * 0.5, 14, 0.18, 0.6);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        L(hx + Math.cos(a) * rTop * 0.4, hy, hz + Math.sin(a) * rTop * 0.4,
          hx + Math.cos(a) * rTop * 2.2, dy, hz + Math.sin(a) * rTop * 2.2, 0.05, 0.5);
      }
      ringXZ(hx, dy, hz, rTop * 1.8, 24, 0.06, 0.6);
    }

    // ── Cup ───────────────────────────────────────────────────────────────────
    function drawCup() {
      ctx!.strokeStyle = LG;
      const dy = SC * 0.55, dW = SC * 3.0;
      const cx2 = dW - SC * 0.5, cz = SC * 0.3, cR = SC * 0.115, cH = SC * 0.21;
      ringXZ(cx2, dy, cz, cR, 18, 0.42, 1.2);
      ringXZ(cx2, dy - cH, cz, cR * 0.9, 14, 0.42, 1.2);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        L(cx2 + Math.cos(a) * cR, dy, cz + Math.sin(a) * cR,
          cx2 + Math.cos(a) * cR * 0.9, dy - cH, cz + Math.sin(a) * cR * 0.9, 0.22, 0.7);
      }
      for (let i = 0; i < 8; i++) {
        const a = -0.4 + (i / 8) * Math.PI * 0.9;
        const a2 = -0.4 + ((i + 1) / 8) * Math.PI * 0.9;
        if (i < 8)
          L(cx2 + Math.cos(a) * cR * 1.8, dy - cH * 0.28, cz + Math.sin(a) * cR * 1.8,
            cx2 + Math.cos(a2) * cR * 1.8, dy - cH * 0.28, cz + Math.sin(a2) * cR * 1.8, 0.3, 0.9);
      }
      ringXZ(cx2, dy + SC * 0.01, cz, cR * 1.45, 16, 0.2, 0.8);
    }

    // ── Notebook ──────────────────────────────────────────────────────────────
    function drawNotebook() {
      ctx!.strokeStyle = LG;
      const dy = SC * 0.55, dW = SC * 3.0, dD = SC * 1.35;
      const nx = -dW + SC * 0.55, nz = dD * 0.38, nW = SC * 0.42, nD = SC * 0.32;
      L(nx - nW, dy, nz - nD, nx + nW, dy, nz - nD, 0.38, 1.2);
      L(nx + nW, dy, nz - nD, nx + nW, dy, nz + nD, 0.38, 1.2);
      L(nx + nW, dy, nz + nD, nx - nW, dy, nz + nD, 0.38, 1.2);
      L(nx - nW, dy, nz + nD, nx - nW, dy, nz - nD, 0.38, 1.2);
      L(nx - nW, dy, nz - nD, nx - nW, dy, nz + nD, 0.5, 1.5);
      for (let i = 1; i < 7; i++) {
        const lz = nz - nD + (i / 7) * nD * 2;
        L(nx - nW + SC * 0.06, dy, lz, nx + nW - SC * 0.04, dy, lz, 0.12, 0.5);
      }
    }

    // ── Cabinet ───────────────────────────────────────────────────────────────
    function drawCabinet() {
      ctx!.strokeStyle = LG;
      ctx!.lineCap = "round";
      const cx = SC * 3.5, cz = -SC * 1.1, cW = SC * 0.85, cD = SC * 0.45;
      const cH = SC * 2.8, floorY = SC * 1.55, topY = floorY - cH;
      L(cx - cW, topY, cz - cD, cx - cW, floorY, cz - cD, 0.55, 1.7);
      L(cx + cW, topY, cz - cD, cx + cW, floorY, cz - cD, 0.55, 1.7);
      L(cx + cW, topY, cz + cD, cx + cW, floorY, cz + cD, 0.55, 1.7);
      L(cx - cW, topY, cz + cD, cx - cW, floorY, cz + cD, 0.55, 1.7);
      L(cx - cW, topY, cz - cD, cx + cW, topY, cz - cD, 0.55, 1.7);
      L(cx + cW, topY, cz - cD, cx + cW, topY, cz + cD, 0.55, 1.7);
      L(cx + cW, topY, cz + cD, cx - cW, topY, cz + cD, 0.55, 1.7);
      L(cx - cW, topY, cz + cD, cx - cW, topY, cz - cD, 0.55, 1.7);
      L(cx - cW, topY, cz - cD, cx + cW, topY, cz + cD, 0.14, 0.6);
      L(cx + cW, topY, cz - cD, cx - cW, topY, cz + cD, 0.14, 0.6);
      L(cx - cW, floorY, cz - cD, cx + cW, floorY, cz - cD, 0.28, 0.9);
      L(cx + cW, floorY, cz - cD, cx + cW, floorY, cz + cD, 0.28, 0.9);
      L(cx + cW, floorY, cz + cD, cx - cW, floorY, cz + cD, 0.28, 0.9);
      L(cx - cW, floorY, cz + cD, cx - cW, floorY, cz - cD, 0.28, 0.9);
      const drawers = 4, drawerH = cH / drawers;
      for (let d = 0; d < drawers; d++) {
        const dTop = floorY - drawerH * (d + 1) + SC * 0.03;
        const dBot = floorY - drawerH * d - SC * 0.03;
        const inset = SC * 0.06;
        L(cx - cW, dTop, cz - cD, cx + cW, dTop, cz - cD, 0.35, 1.1);
        const px1 = cx - cW + inset, px2 = cx + cW - inset;
        const py1 = dTop + SC * 0.04, py2 = dBot - SC * 0.04;
        L(px1, py1, cz - cD, px2, py1, cz - cD, 0.3, 0.9);
        L(px2, py1, cz - cD, px2, py2, cz - cD, 0.3, 0.9);
        L(px2, py2, cz - cD, px1, py2, cz - cD, 0.3, 0.9);
        L(px1, py2, cz - cD, px1, py1, cz - cD, 0.3, 0.9);
        const midX = cx, midY = (py1 + py2) / 2, hw = cW * 0.3;
        L(midX - hw, midY, cz - cD, midX + hw, midY, cz - cD, 0.55, 1.4);
        L(midX - hw, midY - SC * 0.015, cz - cD, midX - hw, midY + SC * 0.015, cz - cD, 0.45, 1.2);
        L(midX + hw, midY - SC * 0.015, cz - cD, midX + hw, midY + SC * 0.015, cz - cD, 0.45, 1.2);
        L(cx + cW, dTop, cz - cD, cx + cW, dTop, cz + cD, 0.22, 0.7);
      }
      // Plant on top
      const px = cx + cW * 0.5, pz = cz, pR = SC * 0.13, pH2 = SC * 0.18;
      ringXZ(px, topY, pz, pR, 16, 0.4, 1.2);
      ringXZ(px, topY - pH2, pz, pR * 0.8, 12, 0.4, 1.2);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        L(px + Math.cos(a) * pR, topY, pz + Math.sin(a) * pR,
          px + Math.cos(a) * pR * 0.8, topY - pH2, pz + Math.sin(a) * pR * 0.8, 0.22, 0.7);
      }
      for (let l = 0; l < 3; l++) {
        const la = (l / 3) * Math.PI * 2, lR = pR * 1.8, lH = SC * 0.38;
        for (let i = 0; i < 8; i++) {
          const t = i / 7, t2 = (i + 1) / 7;
          const lx1 = px + Math.cos(la) * pR * 0.3 + Math.cos(la + Math.PI / 2) * lR * Math.sin(t * Math.PI) * 0.5;
          const lz1 = pz + Math.sin(la) * pR * 0.3 + Math.sin(la + Math.PI / 2) * lR * Math.sin(t * Math.PI) * 0.5;
          const ly1 = topY - pH2 - lH * t;
          const lx2 = px + Math.cos(la) * pR * 0.3 + Math.cos(la + Math.PI / 2) * lR * Math.sin(t2 * Math.PI) * 0.5;
          const lz2 = pz + Math.sin(la) * pR * 0.3 + Math.sin(la + Math.PI / 2) * lR * Math.sin(t2 * Math.PI) * 0.5;
          const ly2 = topY - pH2 - lH * t2;
          L(lx1, ly1, lz1, lx2, ly2, lz2, 0.3, 0.9);
        }
      }
    }

    // ── Chair ─────────────────────────────────────────────────────────────────
    function drawChair() {
      ctx!.strokeStyle = LG;
      ctx!.lineCap = "round";
      const offX = 0, offZ = SC * 1.1, baseY = SC * 1.55, baseR = SC * 0.82;
      const wheelR = SC * 0.058, arms = 5;
      for (let i = 0; i < arms; i++) {
        const a = (i / arms) * Math.PI * 2;
        const bx = offX + Math.cos(a) * baseR, bz = offZ + Math.sin(a) * baseR;
        L(offX, baseY, offZ, bx, baseY, bz, 0.55, 1.5);
        const wa = a + Math.PI / 2;
        L(bx + Math.cos(wa) * wheelR * 1.4, baseY, bz + Math.sin(wa) * wheelR * 1.4,
          bx - Math.cos(wa) * wheelR * 1.4, baseY, bz - Math.sin(wa) * wheelR * 1.4, 0.55, 1.5);
        ringXZ(bx, baseY, bz, wheelR, 10, 0.4, 0.8);
      }
      ringXZ(offX, baseY, offZ, SC * 0.09, 14, 0.65, 1.6);
      const cylBot = baseY, cylTop = SC * 0.5, cylR = SC * 0.068;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        L(offX + Math.cos(a) * cylR, cylBot, offZ + Math.sin(a) * cylR,
          offX + Math.cos(a) * cylR, cylTop, offZ + Math.sin(a) * cylR, 0.4, 0.7);
      }
      ringXZ(offX, cylBot, offZ, cylR, 18, 0.55, 1.4);
      ringXZ(offX, cylTop, offZ, cylR, 18, 0.55, 1.4);
      const seatY = SC * 0.45, seatR = SC * 0.68;
      ringXZ(offX, seatY, offZ, seatR, 48, 0.65, 2.0);
      ringXZ(offX, seatY, offZ, seatR * 0.82, 36, 0.28, 0.7);
      ringXZ(offX, seatY, offZ, SC * 0.11, 14, 0.45, 1.2);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        L(offX + Math.cos(a) * SC * 0.11, seatY, offZ + Math.sin(a) * SC * 0.11,
          offX + Math.cos(a) * seatR, seatY, offZ + Math.sin(a) * seatR, 0.15, 0.5);
      }
      const sD = SC * 0.11;
      ringXZ(offX, seatY + sD, offZ, seatR * 0.88, 36, 0.22, 0.7);
      const aY1 = seatY - SC * 0.44, aX = seatR * 0.74, aW = SC * 0.11, aD = SC * 0.23;
      ([-1, 1] as number[]).forEach((side) => {
        const ax = offX + side * aX;
        L(ax, seatY, offZ, ax, aY1, offZ, 0.55, 1.4);
        const corn: [number, number, number][] = [
          [ax - aW, aY1, offZ - aD / 2], [ax + aW, aY1, offZ - aD / 2],
          [ax + aW, aY1, offZ + aD / 2], [ax - aW, aY1, offZ + aD / 2],
        ];
        for (let i = 0; i < 4; i++) {
          const [x1, y1, z1] = corn[i], [x2, y2, z2] = corn[(i + 1) % 4];
          L(x1, y1, z1, x2, y2, z2, 0.5, 1.4);
        }
      });
      const bkW = SC * 0.62, bkBot = seatY - SC * 0.04, bkTop = seatY - SC * 1.55;
      const bkD = SC * 0.075, bkBow = SC * 0.09;
      L(offX, seatY, offZ - SC * 0.09, offX, bkBot, offZ - bkD, 0.6, 1.6);
      const slices = 14;
      for (let s = 0; s <= slices; s++) {
        const t = s / slices;
        const by = bkBot + (bkTop - bkBot) * t;
        const bw = bkW * (1 - t * 0.14);
        const bb = bkBow * t * 0.5;
        const al = s === 0 || s === slices ? 0.55 : 0.16;
        const lw = s === 0 || s === slices ? 1.8 : 0.6;
        L(offX - bw, by, offZ - bkD + bb, offX + bw, by, offZ - bkD + bb, al, lw);
        if (s < slices) {
          const ny = bkBot + (bkTop - bkBot) * ((s + 1) / slices);
          const nbw = bkW * (1 - ((s + 1) / slices) * 0.14);
          const nbb = bkBow * ((s + 1) / slices) * 0.5;
          L(offX - bw, by, offZ - bkD + bb, offX - nbw, ny, offZ - bkD + nbb, 0.22, 0.7);
          L(offX + bw, by, offZ - bkD + bb, offX + nbw, ny, offZ - bkD + nbb, 0.22, 0.7);
        }
      }
      L(offX, bkBot, offZ - bkD, offX, bkTop, offZ - bkD + bkBow, 0.32, 0.8);
      const hrY = bkTop + SC * 0.07, hrW = SC * 0.33, hrH = SC * 0.19;
      ctx!.beginPath();
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const p = project(offX + Math.cos(a) * hrW, hrY + Math.sin(a) * hrH, offZ - bkD + bkBow * 0.5);
        i === 0 ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y);
      }
      ctx!.globalAlpha = 0.55; ctx!.lineWidth = 1.8; ctx!.stroke(); ctx!.globalAlpha = 1;
      L(offX, bkTop, offZ - bkD + bkBow, offX, hrY + hrH, offZ - bkD + bkBow * 0.5, 0.4, 1.1);
    }

    // ── Scan-Arcs (2-D Atmosphäre) ─────────────────────────────────────────────
    let scanA = 0;
    function drawScanArc() {
      const r1 = SC * 2.6, r2 = SC * 2.9, r3 = SC * 3.2;
      const pulse = 0.05 + Math.sin(Date.now() * 0.001) * 0.025;
      ctx!.strokeStyle = LG;
      [r1, r2, r3].forEach((r, i) => {
        ctx!.beginPath();
        ctx!.arc(W * 0.52, H * 0.54, r, scanA + i * 0.25, scanA + i * 0.25 + Math.PI * (1.1 - i * 0.1));
        ctx!.globalAlpha = pulse * (1 - i * 0.25);
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      });
    }

    // ── Render-Loop ───────────────────────────────────────────────────────────
    let rafId = 0, floatT = 0;

    function render() {
      floatT += 0.008;
      scanA += 0.004;

      const tRY = baseRotY + dragDY;
      const tRX = baseRotX + dragDX;
      if (!isDragging) { dragDY *= 0.985; dragDX *= 0.985; }

      const lf = 0.045;
      rotY  += (tRY        - rotY)  * lf;
      rotX  += (tRX        - rotX)  * lf;
      camZ  += (targetCamZ - camZ)  * lf;
      camY  += (targetCamY - camY)  * lf;

      const savedX = rotX;
      rotX = rotX + Math.cos(floatT * 0.4) * 0.004;

      ctx!.clearRect(0, 0, W, H);

      // Hintergrund-Farbverlauf auf Canvas
      const grad = ctx!.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0.0,  "rgb(18, 22, 28)");
      grad.addColorStop(0.45, "rgb(12, 14, 16)");
      grad.addColorStop(1.0,  "rgb(0,  0,  0)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, W, H);
      // Vignette
      const vig = ctx!.createRadialGradient(W * 0.5, H * 0.42, H * 0.1, W * 0.5, H * 0.5, H * 0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx!.fillStyle = vig;
      ctx!.fillRect(0, 0, W, H);

      ctx!.strokeStyle = LG;

      drawScanArc();
      drawFloor();
      drawCabinet();
      drawDesk();
      drawLamp();
      drawMonitor();
      drawKeyboard();
      drawMouse();
      drawCup();
      drawNotebook();
      drawChair();

      rotX = savedX;
      rafId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousedown", onMD);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", onMU);
    };
  }, []);

  return (
    <section className="dv3-canvas-hero" aria-labelledby="dv3-ch-heading">
      <canvas ref={canvasRef} className="dv3-canvas-hero__canvas" aria-hidden="true" />
      <div className="dv3-canvas-hero__overlay" aria-hidden="true" />

      {/* Haupt-Copy – linke Seite, nahe am Visual */}
      <div className="dv3-canvas-hero__copy">
        <h1 id="dv3-ch-heading" className="dv3-canvas-hero__heading">
          <span className="dv3-canvas-hero__line">Nachhaltige</span>
          <span className="dv3-canvas-hero__line">Bürotransformationen</span>
          <span className="dv3-canvas-hero__line">aus einer Hand.</span>
        </h1>
        <div className="dv3-canvas-hero__sub-row">
          <p className="dv3-canvas-hero__sub">
            Von digitalem Bestandsmanagement über die nachhaltige Verwertung zur schlüsselfertigen Einrichtung.
          </p>
          <div style={{ display: "inline-flex" }}>
            <CtaButton href="/design/v3#kontakt">Kontakt aufnehmen</CtaButton>
          </div>
        </div>
      </div>

    </section>
  );
}
