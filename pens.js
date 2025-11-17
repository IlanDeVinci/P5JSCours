function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  // Pen 1 (Blue): Golden spiral with triangles
  stroke(30, 144, 255);
  strokeWeight(2);
  noFill();

  let a = 4;
  let b = 0.25;
  let bluePoints = [];

  // Generate all points first
  for (let theta = 0; theta < 6 * PI; theta += 0.15) {
    let r = a * exp(b * theta);
    let x = r * cos(theta);
    let y = r * sin(theta);
    bluePoints.push({ x: x, y: y });
  }

  // Draw triangles with perfectly aligned vertices
  for (let i = 0; i < bluePoints.length - 1; i++) {
    let p1 = bluePoints[i];
    let p2 = bluePoints[i + 1];

    let angle = atan2(p2.y - p1.y, p2.x - p1.x);
    let edgeLength = dist(p1.x, p1.y, p2.x, p2.y);

    // Third vertex perpendicular to the spiral edge
    let x3 = p2.x + cos(angle + HALF_PI) * edgeLength * 0.8;
    let y3 = p2.y + sin(angle + HALF_PI) * edgeLength * 0.8;

    triangle(p1.x, p1.y, p2.x, p2.y, x3, y3);
  }

  // Pen 2 (Red): Opposing golden spiral with triangles
  stroke(220, 20, 60);
  strokeWeight(2);
  noFill();

  let redPoints = [];

  // Generate all points first
  for (let theta = 0; theta < 6 * PI; theta += 0.15) {
    let r = a * exp(b * theta);
    let x = r * cos(-theta + PI);
    let y = r * sin(-theta + PI);
    redPoints.push({ x: x, y: y });
  }

  // Draw triangles with perfectly aligned vertices
  for (let i = 0; i < redPoints.length - 1; i++) {
    let p1 = redPoints[i];
    let p2 = redPoints[i + 1];

    let angle = atan2(p2.y - p1.y, p2.x - p1.x);
    let edgeLength = dist(p1.x, p1.y, p2.x, p2.y);

    // Third vertex perpendicular to the spiral edge
    let x3 = p2.x + cos(angle - HALF_PI) * edgeLength * 0.8;
    let y3 = p2.y + sin(angle - HALF_PI) * edgeLength * 0.8;

    triangle(p1.x, p1.y, p2.x, p2.y, x3, y3);
  }

  // Pen 1 (Blue): Center marker
  stroke(30, 144, 255);
  fill(30, 144, 255);
  circle(0, 0, 8);
}
