function setup() {
	createCanvas(windowWidth, windowHeight);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(0);

	// interazione mouse (rotazione)
	let offsetX = mouseX - width / 2;
	let maxOffset = width / 2;
	let inclinazione = map(offsetX, -maxOffset, maxOffset, -PI / 6, PI / 6); 

	for (let i = 0; i < 10; i++) {
		let gl = random(10, 150);
		let gx = random(0, width);
		let gy = random(-gl, height);

		let dx = sin(inclinazione) * gl;
		let dy = cos(inclinazione) * gl;

		strokeWeight(random(1, 3));
		stroke(255, random(50, 150));
		line(gx, gy, gx + dx, gy + dy);
	}
}
