//Ilan Maouchi 2025
//ilan.maouchi@gmail.com

let NP = 480;

function setup() {
  INIT();
  noLoop();
  colorMode(HSB, 360, 100, 100);
  background_(255, 255, 255);

  translate_(width / 2, height / 2);

  // Replace original main helixes with the user's helix loop
  // Parameters from the provided snippet
  let PI = Math.PI;
  let N = 1400,
    T1 = 1,
    T2 = 799, // de 600 à 799 pour avoir des formes pointues
    K1 = 1,
    K2 = 1,
    R1 = NP * 0.25;

  strokeWeight(1);

  let prevX = null,
    prevY = null;
  for (let I = 0; I < N; I++) {
    let R2 = 0.25 * NP * (0.5 + 0.5 * Math.cos((14 * PI * I) / N));
    let A1 = ((2 * PI * I) / N) * T1,
      A2 = ((2 * PI * I) / N) * T2;
    let X = R1 * Math.cos(K1 * A1) + R2 * Math.cos(A2);
    let Y = R1 * Math.sin(K2 * A1) + R2 * Math.sin(A2);
    if (I > 0) {
      // set a hue per segment so the helix appears rainbow
      let hue = (I / N) * 360;
      // optional: vary brightness slightly with R2 for depth
      let brightness = 80 + 20 * (R2 / (0.5 * NP));
      stroke_([hue % 360, 85, constrain(brightness, 50, 100)]);
      line(prevX, prevY, X, Y);
    }
    prevX = X;
    prevY = Y;
  }

  // Outer decorative ring (kept as in original)
  noFill();
  strokeWeight(3);
  for (let i = 0; i < 360; i += 3) {
    let hue = i % 360;
    stroke_([hue, 80, 95]);
    arc(0, 0, R1 * 2 + 160, R1 * 2 + 160, radians(i), radians(i + 3));
  }
}
