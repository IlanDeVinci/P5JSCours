//Ilan Maouchi 2025
//ilan.maouchi@gmail.com

let NP = 800;
let angle = 0;
let vertices4D = [];
let edges = [];

// Interaction & camera
let rotX = 0;
let rotY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Projection controls (tweakable)
let hyperDist = 3.0; // distance for 4D -> 3D perspective
let camDist = 600; // distance for 3D -> 2D perspective
let fovScale = 1.0; // zoom / FOV multiplier
let autoRotateSpeed = 0.008;

function setup() {
  INIT();
  colorMode(HSB, 360, 100, 100);

  // Generate 4D hypercube vertices
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        for (let w = -1; w <= 1; w += 2) {
          vertices4D.push([x, y, z, w]);
        }
      }
    }
  }
  // Precompute edges (pairs of vertices that differ by exactly one coordinate)
  for (let i = 0; i < vertices4D.length; i++) {
    for (let j = i + 1; j < vertices4D.length; j++) {
      let diff = 0;
      for (let k = 0; k < 4; k++) {
        if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
      }
      if (diff === 1) edges.push([i, j]);
    }
  }
  describe(
    "Interactive 4D hypercube: drag to orbit, mouse-wheel to zoom (FOV), double-click to reset. Enhanced perspective and glow."
  );
}

function draw() {
  background_(0, 0, 6);

  // center canvas
  translate_(width / 2, height / 2);

  // subtle auto-rotation in 4D
  angle += autoRotateSpeed;

  // Rotate through several 4D planes for a richer animation
  let rotated4D = vertices4D.map((v) => {
    return rotate4D(v, angle * 1.4, angle * 0.9, angle * 0.6, angle * 0.3);
  });

  // Project from 4D to 3D using an adjustable hyper-distance
  let projected3D = rotated4D.map((v) => {
    let w = v[3];
    let factor = hyperDist / (hyperDist - w);
    return [v[0] * factor, v[1] * factor, v[2] * factor];
  });

  // Rotate the resulting 3D shape with user-controlled orbit angles
  let rotated3D = projected3D.map((p) => rotate3D(p, rotX, rotY));

  // Draw three scaled layers for depth and visual interest
  drawLayer(rotated3D, 1.0, 0);
  drawLayer(rotated3D, 0.7, 40);
  drawLayer(rotated3D, 0.45, 120);
}

// Rotate in multiple 4D planes: XY, YZ, ZW, XW (order chosen for variety)
function rotate4D(v, aXY, aYZ, aZW, aXW) {
  let [x, y, z, w] = v;

  // XY
  let c = cos(aXY),
    s = sin(aXY);
  let x1 = x * c - y * s;
  let y1 = x * s + y * c;

  // YZ
  c = cos(aYZ);
  s = sin(aYZ);
  let y2 = y1 * c - z * s;
  let z1 = y1 * s + z * c;

  // ZW
  c = cos(aZW);
  s = sin(aZW);
  let z2 = z1 * c - w * s;
  let w1 = z1 * s + w * c;

  // XW
  c = cos(aXW);
  s = sin(aXW);
  let x2 = x1 * c - w1 * s;
  let w2 = x1 * s + w1 * c;

  return [x2, y2, z2, w2];
}

// Rotate a 3D point by rotX (around X axis) and rotY (around Y axis)
function rotate3D(p, rx, ry) {
  let [x, y, z] = p;
  // X-axis rotation
  let c = cos(rx),
    s = sin(rx);
  let y1 = y * c - z * s;
  let z1 = y * s + z * c;
  // Y-axis rotation
  c = cos(ry);
  s = sin(ry);
  let x2 = x * c + z1 * s;
  let z2 = -x * s + z1 * c;
  return [x2, y1, z2];
}

// Draw a single layered pass of the shape. scaleFactor controls size, hueOffset shifts colors.
function drawLayer(points3D, scaleFactor, hueOffset) {
  let baseSize = 160 * scaleFactor * fovScale;

  // Project 3D -> 2D with simple perspective using camDist
  let projected2D = points3D.map((p) => {
    let x = p[0],
      y = p[1],
      z = p[2];
    // scale z so it's in a comfortable range
    let zScaled = z * 120;
    let perspective = camDist / (camDist - zScaled * fovScale);
    return {
      x: x * baseSize * perspective,
      y: y * baseSize * perspective,
      z: zScaled,
    };
  });

  // Draw edges using precomputed `edges`
  for (let e of edges) {
    let a = projected2D[e[0]];
    let b = projected2D[e[1]];
    let avgZ = (a.z + b.z) / 2;
    let hue = (map(avgZ, -300, 300, 0, 360) + hueOffset + angle * 80) % 360;
    let w = map(avgZ, -300, 300, 3.5, 0.6) * scaleFactor;
    let alpha = map(avgZ, -300, 300, 100, 10) * scaleFactor;

    stroke(hue, 90, 95, constrain(alpha, 8, 110));
    strokeWeight(max(0.6, w));
    line(a.x, a.y, b.x, b.y);
  }
}

// Mouse interactions: drag-to-rotate
function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (!isDragging) return;
  let dx = mouseX - lastMouseX;
  let dy = mouseY - lastMouseY;
  rotY += dx * 0.006;
  rotX += dy * 0.006;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

// Mouse wheel to zoom (adjust field of view / camera distance)
function mouseWheel(event) {
  // event.deltaY: positive down, negative up
  camDist = constrain(camDist + event.deltaY * 2, 200, 2500);
  hyperDist = constrain(hyperDist + event.deltaY * 0.004, 1.2, 8);
  // prevent page from scrolling when embedded
  return false;
}

function doubleClicked() {
  // reset view
  rotX = 0;
  rotY = 0;
  camDist = 600;
  hyperDist = 3.0;
  fovScale = 1.0;
}
