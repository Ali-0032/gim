let posX, velX;
let posY, velY;
let trail = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  posX = width / 2;
  velX = 5;
  posY = height / 2;
  velY = 3;
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  posX = constrain(posX, 0, width);
  posY = constrain(posY, 0, height);
}

function draw() {
  background(0);

  // Movimento
  posX += velX;
  posY += velY;

  let r = 20; // raggio della pallina
  if (posX >= width - r || posX <= r) velX *= -1;
  if (posY >= height - r || posY <= r) velY *= -1;
  

  
  trail.push({ x: posX, y: posY, time: frameCount });

  if (trail.length > 40) trail.shift();

  // Disegna scia con colori sfumati
  colorMode(HSB, 360, 100, 100, 255);

  for (let i = 0; i < trail.length; i++) {
    let p = trail[i];
    let alpha = map(i, 0, trail.length, 0, 180);
    let size = map(i, 0, trail.length, 5, 50);

    let hue = (p.time * 4) % 360;
    fill(hue, 100, 100, alpha);
    ellipse(p.x, p.y, size, size);

    // scintille a forma di stelle
    if (i % 6 === 0) {
      push();
      let angle = random(TWO_PI);
      let dist = random(5, 15);
      let sx = p.x + cos(angle) * dist;
      let sy = p.y + sin(angle) * dist;
      translate(sx, sy);
      rotate(frameCount * 0.1 + i);
      fill((hue + 50) % 360, 100, 100, alpha + 50);
      drawStar(0, 0, 2, 5, 5);
      pop();
    }
  }

  // pallina centrale
  let headHue = (frameCount * 4) % 360;
  fill(headHue, 100, 100);
  ellipse(posX, posY, 40, 40);

  colorMode(RGB); // reset per sicurezza
}

// Funzione per disegnare una stellina
function drawStar(x, y, r1, r2, n) {
  let angle = TWO_PI / n;
  let halfAngle = angle / 2;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * r2;
    let sy = y + sin(a) * r2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * r1;
    sy = y + sin(a + halfAngle) * r1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
