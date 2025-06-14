let symbols = ['♥', '♦', '♣', '♠'];

let redSymbols = ['♥', '♦'];
let blackSymbols = ['♣', '♠'];

let redColor = '#FF0000';
let blackColor = '#000000';

// Variabili per memorizzare lo stato dei simboli
let h1Symbol = null;
let h2Symbol = null;
let m1Symbol = null;
let m2Symbol = null;

// Variabili per memorizzare le cifre precedenti
let prevH1 = null;
let prevH2 = null;
let prevM1 = null;
let prevM2 = null;

// --- Dichiarazioni variabili per dimensioni (verranno calcolate dinamicamente) ---
let cardWidth;
let cardHeight;
let spacing;
let colonExtraSpace;
let cornerOffset;
let mainTextSize;
let cornerTextSize;
let colonDotSize;
let colonDotSpacing;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  noStroke();
  calculateResponsiveDimensions(); // Calcola le dimensioni al setup

  // Inizializza le cifre precedenti per forzare il primo aggiornamento dei simboli
  prevH1 = '';
  prevH2 = '';
  prevM1 = '';
  prevM2 = '';
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  let h = hour();
  let m = minute();

  let displayH = nf(h, 2);
  let displayM = nf(m, 2);

  // --- Logica di scelta dei simboli per ogni carta (invariata rispetto all'ultima versione) ---
  if (displayH.charAt(0) !== prevH1 || h1Symbol === null) {
    h1Symbol = random(redSymbols);
    if (m1Symbol === h1Symbol || m1Symbol === null) {
      let availableForM1 = redSymbols.filter(s => s !== h1Symbol);
      m1Symbol = random(availableForM1.length > 0 ? availableForM1 : redSymbols);
    }
  } else if (displayM.charAt(0) !== prevM1 || m1Symbol === null) {
    let availableForM1 = redSymbols.filter(s => s !== h1Symbol);
    m1Symbol = random(availableForM1.length > 0 ? availableForM1 : redSymbols);
  }

  if (displayH.charAt(1) !== prevH2 || h2Symbol === null) {
    h2Symbol = random(blackSymbols);
    if (m2Symbol === h2Symbol || m2Symbol === null) {
      let availableForM2 = blackSymbols.filter(s => s !== h2Symbol);
      m2Symbol = random(availableForM2.length > 0 ? availableForM2 : blackSymbols);
    }
  } else if (displayM.charAt(1) !== prevM2 || m2Symbol === null) {
    let availableForM2 = blackSymbols.filter(s => s !== h2Symbol);
    m2Symbol = random(availableForM2.length > 0 ? availableForM2 : blackSymbols);
  }

  prevH1 = displayH.charAt(0);
  prevH2 = displayH.charAt(1);
  prevM1 = displayM.charAt(0);
  prevM2 = displayM.charAt(1);

  // --- Calcolo posizionamento carte (basato sulle dimensioni calcolate) ---
  let hoursBlockWidth = (cardWidth * 2) + spacing;
  let minutesBlockWidth = (cardWidth * 2) + spacing;
  let colonBlockWidth = colonExtraSpace;

  let totalClockWidth = hoursBlockWidth + colonBlockWidth + minutesBlockWidth;
  let startX = -totalClockWidth / 2 + (cardWidth / 2);

  drawCard(startX, 0, displayH.charAt(0), h1Symbol, redColor);
  drawCard(startX + cardWidth + spacing, 0, displayH.charAt(1), h2Symbol, blackColor);

  let colonX = (startX + cardWidth + spacing) + (cardWidth / 2) + (colonExtraSpace / 2);
  drawColon(colonX, 0);

  drawCard(colonX + colonExtraSpace / 2 + cardWidth / 2, 0, displayM.charAt(0), m1Symbol, redColor);
  drawCard(colonX + colonExtraSpace / 2 + cardWidth * 1.5 + spacing, 0, displayM.charAt(1), m2Symbol, blackColor);
}

// --- Funzione modificata per calcolare le dimensioni responsive e prevenire overflow ---
function calculateResponsiveDimensions() {
  // --- NUOVI FATTORI DI MARGINE ---
  // Lascia un margine del 10% sui lati (5% a sx, 5% a dx) e 15% in alto/basso
  let horizontalPaddingFactor = 0.10;
  let verticalPaddingFactor = 0.15;

  let usableWidth = windowWidth * (1 - horizontalPaddingFactor);
  let usableHeight = windowHeight * (1 - verticalPaddingFactor);

  // Stima la larghezza totale dell'orologio in "unità di cardWidth" + "unità di spacing" + "unità di colonExtraSpace"
  // L'orologio è composto da: 4 * cardWidth + 2 * spacing (tra cifre) + 1 * colonExtraSpace (tra ore e minuti)
  // Per mantenere proporzioni ragionevoli, definiamo spacing e colonExtraSpace come frazioni di cardWidth.
  let estimatedSpacingFactor = 0.2; // spacing = cardWidth * 0.2
  let estimatedColonExtraSpaceFactor = 0.4; // colonExtraSpace = cardWidth * 0.4

  // Quindi, la larghezza totale stimata dell'orologio è:
  // 4 * cardWidth + 2 * (cardWidth * estimatedSpacingFactor) + 1 * (cardWidth * estimatedColonExtraSpaceFactor)
  // = cardWidth * (4 + 2*0.2 + 1*0.4)
  // = cardWidth * (4 + 0.4 + 0.4)
  // = cardWidth * 4.8
  let totalWidthMultiplier = 4 + (2 * estimatedSpacingFactor) + estimatedColonExtraSpaceFactor; // 4.8

  // Calcola il cardWidth massimo che può stare nella larghezza disponibile
  let maxCardWidthFromWidth = usableWidth / totalWidthMultiplier;

  // Calcola il cardWidth massimo che può stare nell'altezza disponibile (rapporto cardHeight/cardWidth è 1.5)
  // cardHeight = cardWidth * 1.5
  // maxCardHeight = usableHeight
  // cardWidth = maxCardHeight / 1.5
  let maxCardWidthFromHeight = usableHeight / 1.5;

  // Scegli il più piccolo tra i due cardWidth per assicurarti che non esca né orizzontalmente né verticalmente
  cardWidth = min(maxCardWidthFromWidth, maxCardWidthFromHeight);

  // --- Ricalcola tutte le altre dimensioni in base al NUOVO cardWidth ---
  cardHeight = cardWidth * 1.5; // Rapporto 2:3 fisso per le carte

  // Ricalcola spacing e colonExtraSpace basandoli sul nuovo cardWidth
  spacing = cardWidth * estimatedSpacingFactor; // cardWidth * 0.2
  colonExtraSpace = cardWidth * estimatedColonExtraSpaceFactor; // cardWidth * 0.4

  cornerOffset = cardWidth * 0.07;
  mainTextSize = cardWidth * 0.8;
  cornerTextSize = cardWidth * 0.25;

  colonDotSize = cardWidth * 0.08;
  colonDotSpacing = cardWidth * 0.3;
}


function drawCard(x, y, numberChar, currentSymbol, fixedColor) {
  push();
  translate(x, y);

  fill(255);
  rectMode(CENTER);
  rect(0, 0, cardWidth, cardHeight, 10);

  fill(fixedColor);
  noStroke();

  textSize(mainTextSize);
  text(numberChar, 0, 0);

  textSize(cornerTextSize);

  textAlign(LEFT, TOP);
  text(currentSymbol, -cardWidth / 2 + cornerOffset, -cardHeight / 2 + cornerOffset);

  textAlign(RIGHT, TOP);
  text(numberChar, cardWidth / 2 - cornerOffset, -cardHeight / 2 + cornerOffset);

  push();
  translate(cardWidth / 2 - cornerOffset, cardHeight / 2 - cornerOffset);
  rotate(180);
  textAlign(LEFT, TOP);
  text(currentSymbol, 0, 0);
  pop();

  push();
  translate(-cardWidth / 2 + cornerOffset, cardHeight / 2 - cornerOffset);
  rotate(180);
  textAlign(RIGHT, TOP);
  text(numberChar, 0, 0);
  pop();

  pop();
}

function drawColon(x, y) {
  fill(255);
  noStroke();
  ellipse(x, y - colonDotSpacing, colonDotSize, colonDotSize);
  ellipse(x, y + colonDotSpacing, colonDotSize, colonDotSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateResponsiveDimensions(); // Ricalcola le dimensioni al ridimensionamento
}