"""Composite the Fenyx platform screenshot into the blank laptop screen.

- Detects the blank screen quad in laptop-base.png (reuses detection logic).
- Cover-crops the platform screenshot to the screen's aspect ratio.
- Warps it perspectivically into the screen quad with a small inset.
- Applies rounded corners + a soft feathered edge so nothing bleeds over the
  bezel, then writes the result to fenyx-laptop-mix.png.
"""
import sys
import numpy as np
import cv2

SRC_DIR = "/Users/isabel/website-migration/fenyx-next/public/assets/timeline/_src"
BASE = SRC_DIR + "/laptop-base.png"
SHOT = SRC_DIR + "/platform-screenshot.png"
OUT = "/Users/isabel/website-migration/fenyx-next/public/assets/timeline/fenyx-laptop-mix.png"
DEBUG = SRC_DIR + "/_debug-composite.png"

INSET_PX = 3         # inset from the detected screen edge, inside the bezel
CORNER_R = 14        # rounded-corner radius (px, in source-shot space)
FEATHER_PX = 2       # soft edge feather

def detect_screen(img):
    H, W = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    best = None
    for t in range(20, 75, 5):
        _, th = cv2.threshold(gray, t, 255, cv2.THRESH_BINARY_INV)
        k = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
        th = cv2.morphologyEx(th, cv2.MORPH_CLOSE, k)
        n, labels, stats, cent = cv2.connectedComponentsWithStats(th, connectivity=8)
        cands = []
        for i in range(1, n):
            x, y, w, h, area = stats[i]
            cx, cy = cent[i]
            if (area > 4000 and W*0.30 < cx < W*0.70 and w > 180
                    and 1.1 < w/max(h,1) < 2.4 and y < H*0.80):
                cands.append((area, i, labels, stats))
        cands.sort(key=lambda c: -c[0])
        if cands and (best is None or cands[0][0] > best[0]):
            best = cands[0]
    if best is None:
        print("ERROR: screen not found", file=sys.stderr); sys.exit(2)
    _, i, labels, stats = best
    mask = (labels == i).astype(np.uint8) * 255
    cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnt = max(cnts, key=cv2.contourArea)
    peri = cv2.arcLength(cnt, True)
    corners = None
    for eps in np.linspace(0.005, 0.10, 20):
        approx = cv2.approxPolyDP(cnt, eps * peri, True)
        if len(approx) == 4:
            corners = approx.reshape(4, 2); break
    if corners is None:
        corners = cv2.boxPoints(cv2.minAreaRect(cnt))
    def order(pts):
        pts = np.array(pts, dtype=np.float32)
        s = pts.sum(axis=1); diff = np.diff(pts, axis=1).ravel()
        tl = pts[np.argmin(s)]; br = pts[np.argmax(s)]
        tr = pts[np.argmin(diff)]; bl = pts[np.argmax(diff)]
        return np.array([tl, tr, br, bl], dtype=np.float32)
    return order(corners)

def inset_quad(quad, px):
    c = quad.mean(axis=0)
    out = []
    for p in quad:
        v = c - p
        n = np.linalg.norm(v)
        if n < 1e-6:
            out.append(p); continue
        step = min(px, n)
        out.append(p + v / n * step)
    return np.array(out, dtype=np.float32)

def rounded_rect_mask(w, h, r):
    m = np.zeros((h, w), dtype=np.uint8)
    cv2.rectangle(m, (0, 0), (w, h), 0, -1)
    # draw filled white with rounded corners via 4 circles + rects
    cv2.rectangle(m, (r, 0), (w - r, h), 255, -1)
    cv2.rectangle(m, (0, r), (w, h - r), 255, -1)
    cv2.circle(m, (r, r), r, 255, -1)
    cv2.circle(m, (w - r, r), r, 255, -1)
    cv2.circle(m, (r, h - r), r, 255, -1)
    cv2.circle(m, (w - r, h - r), r, 255, -1)
    return m

def cover_crop(img, aspect):
    H, W = img.shape[:2]
    cur = W / H
    if cur > aspect:  # too wide -> crop sides
        nw = int(H * aspect)
        x0 = (W - nw) // 2
        return img[:, x0:x0 + nw]
    else:  # too tall -> crop top/bottom
        nh = int(W / aspect)
        y0 = (H - nh) // 2
        return img[y0:y0 + nh, :]

def main():
    base = cv2.imread(BASE)
    shot = cv2.imread(SHOT)
    H, W = base.shape[:2]

    quad = detect_screen(base)
    print("Screen quad:", quad.tolist())

    # sizes of the quad (use top width and left height)
    top_w = np.linalg.norm(quad[1] - quad[0])
    left_h = np.linalg.norm(quad[3] - quad[0])
    aspect = top_w / left_h
    print("Screen aspect %.3f (top_w=%.1f left_h=%.1f)" % (aspect, top_w, left_h))

    quad_in = inset_quad(quad, INSET_PX)
    # source rect dims (integer) for the warped screenshot
    sw = int(round(top_w - 2 * INSET_PX))
    sh = int(round(left_h - 2 * INSET_PX))
    if sw < 40 or sh < 40:
        print("ERROR: screen too small", file=sys.stderr); sys.exit(3)

    # cover-crop + resize screenshot to (sw, sh)
    cropped = cover_crop(shot, sw / sh)
    shot_rs = cv2.resize(cropped, (sw, sh), interpolation=cv2.INTER_AREA)

    # source points = rect corners
    src = np.array([[0, 0], [sw, 0], [sw, sh], [0, sh]], dtype=np.float32)
    dst = quad_in

    M = cv2.getPerspectiveTransform(src, dst)

    # warp screenshot onto a full-size canvas
    warped = cv2.warpPerspective(shot_rs, M, (W, H), borderMode=cv2.BORDER_CONSTANT, borderValue=0)

    # build rounded-corner mask in source space, warp it, feather
    src_mask = rounded_rect_mask(sw, sh, CORNER_R)
    mask = cv2.warpPerspective(src_mask, M, (W, H), borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    if FEATHER_PX > 0:
        mask = cv2.GaussianBlur(mask, (FEATHER_PX * 2 + 1, FEATHER_PX * 2 + 1), 0)

    mask_f = (mask.astype(np.float32) / 255.0)[..., None]
    out = base.astype(np.float32) * (1 - mask_f) + warped.astype(np.float32) * mask_f
    out = np.clip(out, 0, 255).astype(np.uint8)

    cv2.imwrite(OUT, out)
    # also write a debug overlay showing the quad on the composite
    dbg = out.copy()
    cv2.polylines(dbg, [quad_in.reshape(-1, 1, 2).astype(np.int32)], True, (0, 255, 0), 2)
    cv2.imwrite(DEBUG, dbg)
    print("Wrote composite:", OUT)
    print("Wrote debug:", DEBUG)

if __name__ == "__main__":
    main()
