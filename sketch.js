var canvas;
var DP05, DP02;
var totalPop, agePop, racePop;

function preload() {
  DP05 = new Array(8);
  DP02 = new Array(8);

  // Load csv files
  var index = 10;
  for (var i = 0; i < DP05.length; i++) {
    DP05[i] = loadStrings('DP05/ACS_' + index + '_5YR_DP05_with_ann.csv');
    DP02[i] = loadStrings('DP02/ACS_' + index + '_5YR_DP02_with_ann.csv');
    index++;
  }
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  // Initialize Arrays
  totalPop = new Array(8);
  agePop = new Array(8)

  // Load info into arrays
  for (var i = 0; i < DP05.length; i++) {
    DP05[i] = (DP05[i][2]).split(',');
    DP02[i] = (DP02[i][2]).split(',');

    totalPop[i] = DP05[i][3];
    agePop[i] = new Array(13);
    var i1 = 15;
    for (var i2 = 0; i2 < 13; i2++) {
      agePop[i][i2] = DP05[i][i1];
      i1 += 4;
    }

    console.log(totalPop[i]);
  }

}

function draw() {
  ellipse(width/2,height/2,100,100);
}
