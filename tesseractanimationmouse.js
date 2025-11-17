let angle = 0;
let vertices4D = [];

function setup() {
  createCanvas(800, 800, WEBGL);
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

  describe(
    "An interactive 4D hypercube (tesseract) visualization. Users can click and drag to rotate the view in 3D space. The hypercube rotates through 4D space with colorful edges and glowing vertices."
  );
}

function draw() {
  background(0, 0, 5);

  // Enable mouse-controlled camera orbit
  orbitControl();

  angle += 0.01;

  // Rotate in 4D space
  let rotated = vertices4D.map((v) => {
    return rotate4D(v, angle, angle * 0.7, angle * 0.5);
  });

  // Project from 4D to 3D
  let projected3D = rotated.map((v) => {
    let w = v[3];
    let distance = 2;
    let factor = distance / (distance - w);
    return [v[0] * factor, v[1] * factor, v[2] * factor, w];
  });

  // Draw fractal iterations at different scales
  for (let scale = 1; scale >= 0.3; scale -= 0.23) {
    drawTesseract(projected3D, scale, scale * 360);
  }
}

function rotate4D(v, angleXY, angleZW, angleXW) {
  let [x, y, z, w] = v;

  // Rotate in XY plane
  let cosXY = cos(angleXY);
  let sinXY = sin(angleXY);
  let newX = x * cosXY - y * sinXY;
  let newY = x * sinXY + y * cosXY;

  // Rotate in ZW plane
  let cosZW = cos(angleZW);
  let sinZW = sin(angleZW);
  let newZ = z * cosZW - w * sinZW;
  let newW = z * sinZW + w * cosZW;

  // Rotate in XW plane
  let cosXW = cos(angleXW);
  let sinXW = sin(angleXW);
  let finalX = newX * cosXW - newW * sinXW;
  let finalW = newX * sinXW + newW * cosXW;

  return [finalX, newY, newZ, finalW];
}

function drawTesseract(projected3D, scale, hueOffset) {
  let size = 150 * scale;

  // Define edges of hypercube
  let edges = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      let diff = 0;
      for (let k = 0; k < 4; k++) {
        if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
      }
      if (diff === 1) edges.push([i, j]);
    }
  }

  // Draw edges
  for (let edge of edges) {
    let v1 = projected3D[edge[0]];
    let v2 = projected3D[edge[1]];

    let depth1 = v1[3];
    let depth2 = v2[3];
    let avgDepth = (depth1 + depth2) / 2;

    let hue = (map(avgDepth, -2, 2, 0, 360) + hueOffset + angle * 100) % 360;
    let weight = map(scale, 0.3, 1, 1, 4);
    let alpha = map(avgDepth, -2, 2, 40, 100) * scale;

    stroke(hue, 90, 90, alpha);
    strokeWeight(weight);

    line(
      v1[0] * size,
      v1[1] * size,
      v1[2] * size,
      v2[0] * size,
      v2[1] * size,
      v2[2] * size
    );
  }

  // Draw vertices as glowing spheres
  noStroke();
  for (let i = 0; i < projected3D.length; i++) {
    let v = projected3D[i];
    let depth = v[3];

    let hue = (map(depth, -2, 2, 0, 360) + hueOffset + angle * 100) % 360;
    let sphereSize = map(depth, -2, 2, 3, 12) * scale;

    push();
    translate(v[0] * size, v[1] * size, v[2] * size);
    fill(hue, 80, 100, 80 * scale);
    sphere(sphereSize);
    pop();
  }
}
