"""Detect the blank laptop screen in laptop-base.png (improved).

Strategy: scan thresholds, find dark blobs whose centroid is in the central
horizontal band, with a wide-ish aspect ratio and reasonable size — that is
the laptop lid/screen, not the background or table.
"""
import sys
import numpy as np
import cv2

BASE = "/Users/isabel/website-migration/fenyx-next/public/assets/timeline/_src/laptop-base.png"
DEBUG = "/Users/isabel/website-migration/fenyx-next/public/assets/timeline/_src/_debug-screen.png"

img = cv2.imread(BASE)
H, W = img.shape[:2]
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

def blobs_for_thresh(t):
    _, th = cv2.threshold(gray, t, 255, cv2.THRESH_BINARY_INV)
    k = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
    th = cv2.morphologyEx(th, cv2.MORPH_CLOSE, k)
    n, labels, stats, cent = cv2.connectedComponentsWithStats(th, connectivity=8)
    out = []
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        cx, cy = cent[i]
        out.append(dict(i=i, x=x, y=y, w=w, h=h, area=area, cx=cx, cy=cy, ar=w/max(h,1)))
    return out, labels

best = None
for t in range(20, 75, 5):
    cs, _ = blobs_for_thresh(t)
    # filter: central, wide, sizable
    cands = [c for c in cs
             if c["area"] > 4000
             and W*0.30 < c["cx"] < W*0.70
             and c["w"] > 180
             and 1.1 < c["ar"] < 2.4
             and c["y"] < H*0.80]
    cands.sort(key=lambda c: (-c["area"]))
    if cands:
        if best is None or cands[0]["area"] > best[1]["area"]:
            best = (t, cands[0])
        print("t=%d  top cand: area=%d x=%d y=%d w=%d h=%d ar=%.2f cx=%.0f cy=%.0f"
              % (t, cands[0]["area"], cands[0]["x"], cands[0]["y"],
                 cands[0]["w"], cands[0]["h"], cands[0]["ar"],
                 cands[0]["cx"], cands[0]["cy"]))

if best is None:
    print("ERROR: no screen candidate found", file=sys.stderr)
    sys.exit(2)

t, c = best
print("\nChosen threshold:", t)
print("Chosen blob:", c)

# Rebuild mask for chosen threshold and blob
_, th = cv2.threshold(gray, t, 255, cv2.THRESH_BINARY_INV)
k = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
th = cv2.morphologyEx(th, cv2.MORPH_CLOSE, k)
n, labels, stats, cent = cv2.connectedComponentsWithStats(th, connectivity=8)

# match blob by closest centroid to chosen
target = None
for i in range(1, n):
    if abs(stats[i][0] - c["x"]) < 5 and abs(stats[i][1] - c["y"]) < 5 and abs(stats[i][4] - c["area"]) < 50:
        target = i
        break
if target is None:
    # fallback: largest central blob
    target = max(range(1, n), key=lambda i: stats[i][4])
mask = (labels == target).astype(np.uint8) * 255

cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnt = max(cnts, key=cv2.contourArea)

peri = cv2.arcLength(cnt, True)
corners = None
for eps in np.linspace(0.005, 0.10, 20):
    approx = cv2.approxPolyDP(cnt, eps * peri, True)
    if len(approx) == 4:
        corners = approx.reshape(4, 2)
        break
if corners is None:
    rect = cv2.minAreaRect(cnt)
    corners = cv2.boxPoints(rect)

def order(pts):
    pts = np.array(pts, dtype=np.float32)
    s = pts.sum(axis=1)
    diff = np.diff(pts, axis=1).ravel()
    tl = pts[np.argmin(s)]; br = pts[np.argmax(s)]
    tr = pts[np.argmin(diff)]; bl = pts[np.argmax(diff)]
    return np.array([tl, tr, br, bl], dtype=np.float32)

corners = order(corners)
print("\nScreen corners (tl, tr, br, bl):")
for name, p in zip(["tl", "tr", "br", "bl"], corners):
    print("  %s = [%.1f, %.1f]" % (name, p[0], p[1]))

dbg = img.copy()
poly = corners.reshape(-1, 1, 2).astype(np.int32)
cv2.polylines(dbg, [poly], True, (0, 255, 0), 3)
for p in corners:
    cv2.circle(dbg, (int(p[0]), int(p[1])), 8, (0, 0, 255), -1)
    cv2.putText(dbg, "(%.0f,%.0f)" % (p[0], p[1]), (int(p[0]) + 10, int(p[1]) - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
cv2.imwrite(DEBUG, dbg)
print("\nDebug image:", DEBUG)
