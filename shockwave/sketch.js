// sketch.js
// Surface animée inspirée du dessin 190
//Ilan Maouchi 2025
//ilan.maouchi@gmail.com

let NP = 600; // taille du canevas utilisée comme référence NP d'après l'original
let N = 80; // résolution de la grille (grille 80x80)
let phase = 0; // phase pour le terme cosinus
let theta = 0; // pilote la modulation de l'amplitude (variable croissante/décroissante)

function setup() {
  createCanvas(NP, NP);
  colorMode(HSB, 360, 100, 100);
  strokeWeight(1);
  noFill();
}

function draw() {
  background_(255, 255, 255);
  // Animer : la phase augmente régulièrement, theta oscille, utilisé pour moduler l'amplitude
  phase += 0.03; // rotation douce de l'onde
  theta += 0.02; // oscillation plus lente pour l'amplitude
  let amp = 1 + 0.3 * sin(theta); // augmente/diminue doucement entre 0.7 et 1.3

  // Dessiner des bandes horizontales (Y constant) pour représenter le maillage de la surface
  for (let i = 0; i <= N; i++) {
    beginShape();
    for (let j = 0; j <= N; j++) {
      let X = j / N;
      let Y = i / N;

      // Z = NP*5/12 * cos(4*DI) * exp(-DI)
      // On ajoute 'phase' et 'amp' pour l'animation : cos(4*DI + phase) * amp
      let DI = 16 * ((X - 0.5) * (X - 0.5) + (Y - 0.5) * (Y - 0.5));
      let Z = ((NP * 5) / 12) * cos(4 * DI + phase) * Math.exp(-DI) * amp;

      // Projection simple : mapper X,Y à l'écran et soustraire Z pour montrer la hauteur
      let sx = X * width;
      let sy = Y * height - Z;

      // La couleur dépend de la hauteur pour donner des indices de profondeur
      let hue = map(Z, -NP / 2, NP / 2, 200, 360);
      stroke(hue, 80, 95);
      vertex(sx, sy);
    }
    endShape();
  }

  // Ppour un effet de maillage plus dense (trait plus clair)
  stroke(210, 20, 90);
  for (let j = 0; j <= N; j++) {
    beginShape();
    for (let i = 0; i <= N; i++) {
      let X = j / N;
      let Y = i / N;
      let DI = 16 * ((X - 0.5) * (X - 0.5) + (Y - 0.5) * (Y - 0.5));
      let Z = ((NP * 5) / 12) * cos(4 * DI + phase) * Math.exp(-DI) * amp;
      let sx = X * width;
      let sy = Y * height - Z;
      vertex(sx, sy);
    }
    endShape();
  }

  push();
  noStroke();
  fill(0, 0, 95);
  circle(width / 2, height / 2, 4);
  pop();
}
