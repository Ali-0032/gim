let fiocchi = [];
let caratteri = "*❄︎✳︎✺✦".split("");

function setup() {
	createCanvas(windowWidth, windowHeight);
	for (let i = 0; i < 400; i++) {
		let dim = random(10, 30);
		fiocchi[i] = {
			px: random(0, width),
			py: random(-height, height),
			dim1: dim,
			vel: map(dim, 10, 30, 4, 1),
			chr: caratteri[int(random(caratteri.length))],
			windOffset: random(TWO_PI), 
		};
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(0);
	fill(255);
	textAlign(CENTER, CENTER);

	for (let i = 0; i < fiocchi.length; i++) {
		let f = fiocchi[i];

		// Movimento verticale
		f.py += f.vel;

		// Effetto vento dolce
		let vento = sin(frameCount * 0.01 + f.windOffset) * 1.5;
		f.px += vento;

		// Interazione col mouse (repulsione)
		let dx = mouseX - f.px;
		let dy = mouseY - f.py;
		let distanza = sqrt(dx * dx + dy * dy);
		if (distanza < 150) {
			let forza = (150 - distanza) / 150;
			f.px -= dx * forza * 0.2;
			f.py -= dy * forza * 0.2;
		}

		// Reset fiocchi usciti dallo schermo
		if (f.py > height) {
			f.py = 0;
			f.px = random(width);
		}

		// Disegno del fiocco
		textSize(f.dim1);
		text(f.chr, f.px, f.py);
	}
}

