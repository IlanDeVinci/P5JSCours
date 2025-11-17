function setup() {
  createCanvas(800, 800);
  noLoop();
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(0, 0, 98);

  translate(width / 2, height / 2);

  let numHelixes = 12;
  let points = 400;
  let majorRadius = 280;
  let minorRadius = 60;
  let rotations = 12;

  // Draw main helixes
  for (let h = 0; h < numHelixes; h++) {
    let offset = (h / numHelixes) * TWO_PI;

    strokeWeight(2.5);

    for (let i = 0; i < points; i++) {
      let t = (i / points) * TWO_PI * rotations;
      let nextT = ((i + 1) / points) * TWO_PI * rotations;

      let angle = (i / points) * TWO_PI;
      let nextAngle = ((i + 1) / points) * TWO_PI;

      // Double helix with phase offset
      let helixPhase = t + offset;
      let r = minorRadius * (1 + 0.3 * sin(t * 3));

      let x1 = (majorRadius + r * cos(helixPhase)) * cos(angle);
      let y1 = (majorRadius + r * cos(helixPhase)) * sin(angle);
      let z1 = r * sin(helixPhase);

      let nextHelixPhase = nextT + offset;
      let nextR = minorRadius * (1 + 0.3 * sin(nextT * 3));

      let x2 = (majorRadius + nextR * cos(nextHelixPhase)) * cos(nextAngle);
      let y2 = (majorRadius + nextR * cos(nextHelixPhase)) * sin(nextAngle);
      let z2 = nextR * sin(nextHelixPhase);

      let brightness = map(z1, -minorRadius * 1.3, minorRadius * 1.3, 70, 100);
      let hue = (h * 30 + i * 0.9) % 360;

      stroke(hue, 85, brightness);
      line(x1, y1, x2, y2);
    }
  }

  // Draw connecting bridges

  minorRadiusBridge = 150;
  majorRadiusBridge = 200;
  strokeWeight(1.5);
  for (let i = 0; i < points; i += 3) {
    let angle = (i / points) * TWO_PI;
    let t = (i / points) * TWO_PI * rotations;

    for (let h = 0; h < numHelixes; h += 2) {
      let offset1 = (h / numHelixes) * TWO_PI;
      let offset2 = ((h + 1) / numHelixes) * TWO_PI;

      let r1 = minorRadiusBridge * (1 + 0.3 * sin(t * 3));
      let helixPhase1 = t + offset1;
      let x1 = (majorRadiusBridge + r1 * cos(helixPhase1)) * cos(angle);
      let y1 = (majorRadiusBridge + r1 * cos(helixPhase1)) * sin(angle);

      let r2 = minorRadiusBridge * (1 + 0.3 * sin(t * 3));
      let helixPhase2 = t + offset2;
      let x2 = (majorRadiusBridge + r2 * cos(helixPhase2)) * cos(angle);
      let y2 = (majorRadiusBridge + r2 * cos(helixPhase2)) * sin(angle);

      let hue = (h * 30 + i * 0.9 + 180) % 360;
      stroke(hue, 70, 90);
      line(x1, y1, x2, y2);
    }
  }

  // Outer decorative ring
  noFill();
  strokeWeight(3);
  for (let i = 0; i < 360; i += 3) {
    let hue = i % 360;
    stroke(hue, 80, 95);
    arc(
      0,
      0,
      majorRadius * 2 + 160,
      majorRadius * 2 + 160,
      radians(i),
      radians(i + 3)
    );
  }
}
