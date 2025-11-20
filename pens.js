// COURBES

// ----------------------------------------------------
let DESSIN = 84;

// ----------------------------------------------------
let NP = 480,
  PI = Math.PI;
let N = 3000,
  T1 = 1,
  T2 = 150,
  K1 = 1,
  K2 = 1,
  R1 = NP * 0.25;

// ----------------------------------------------------
function setup() {
  INIT2(720);
  background_(255);
  noFill_();

  // build vertices for the parametric curve
  let verts = [];
  for (let I = 0; I < N; I++) {
    let R2 = NP * 0.25 * (0.5 + 0.5 * cos((I * PI) / N));
    let A1 = ((2 * PI * I) / N) * T1,
      A2 = ((2 * PI * I) / N) * T2;
    let X = int(NP * 0.5 + R1 * cos(K1 * A1) + R2 * cos(A2));
    let Y = int(1.3 * (NP * 0.5 + R1 * sin(K2 * A1) + R2 * sin(A2)));
    verts.push({ x: X, y: Y });
  }

  // Draw with alternating colors - switch color for each line segment
  let colorEven = [220, 20, 60];
  let colorOdd = [30, 144, 255];

  strokeWeight(1);
  beginShape_();
  for (let i = 0; i < verts.length; i++) {
    // Switch stroke color based on index
    if (i % 2 == 0) {
      stroke_(colorEven);
    } else {
      stroke_(colorOdd);
    }

    // Draw line segment from previous point to current point
    if (i > 0) {
      vertex_(verts[i - 1].x, verts[i - 1].y);
      vertex_(verts[i].x, verts[i].y);
      endShape_();
      beginShape_();
    }
  }
  endShape_();
}
