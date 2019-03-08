var canvas;
var DP05, DP02, DP03;
var totalPop, agePop, racePop;
var eduPop, eduAttainment;
var laborPop, femalePop, industryPop;

function preload() {
  DP05 = new Array(8);
  DP02 = new Array(8);
  DP03 = new Array(8);

  // Load csv files
  var index = 10;
  for (var i = 0; i < DP05.length; i++) {
    DP05[i] = loadStrings('DP05/ACS_' + index + '_5YR_DP05_with_ann.csv');
    DP02[i] = loadStrings('DP02/ACS_' + index + '_5YR_DP02_with_ann.csv');
    DP03[i] = loadStrings('DP03/ACS_' + index + '_5YR_DP03_with_ann.csv');
    index++;
  }
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  // Initialize Arrays
  totalPop = new Array(8);
  agePop = new Array(8);
  eduPop = new Array(8);
  eduAttainment = new Array(8);
  laborPop = new Array(8);
  femalePop = new Array(8);
  industryPop = new Array(8);

  // Load info into arrays
  for (var i = 0; i < DP05.length; i++) {
    DP05[i] = (DP05[i][2]).split(',');
    DP02[i] = (DP02[i][2]).split(',');
    DP03[i] = (DP03[i][2]).split(',');

    totalPop[i] = parseFloat(DP05[i][3]);

    agePop[i] = new Array(13);
    var i1 = 17;
    for (var i2 = 0; i2 < agePop[i].length; i2++) {
      agePop[i][i2] = parseFloat(DP05[i][i1]);
      i1 += 4;
    }

    eduPop[i] = new Array(6);
    eduPop[i][0] = parseFloat(DP02[i][207]);
    i1 = 213;
    for (i2 = 1; i2 < eduPop[i].length; i2++) {
      eduPop[i][i2] = parseFloat(DP02[i][i1]);
      i1 += 4;
    }

    eduAttainment[i] = new Array(9);
    eduAttainment[i][0] = parseFloat(DP02[i][231]);
    i1 = 237;
    for (i2 = 1; i2 < eduAttainment[i].length; i2++) {
      eduAttainment[i][i2] = parseFloat(DP02[i][i1]);
      i1 += 4;
    }

    laborPop[i] = new Array(5);
    laborPop[i][0] = parseFloat(DP03[i][3]);
    laborPop[i][1] = parseFloat(DP03[i][9]);
    laborPop[i][2] = parseFloat(DP03[i][17]);
    laborPop[i][3] = parseFloat(DP03[i][21]);
    laborPop[i][4] = parseFloat(DP03[i][25]);

    femalePop[i] = new Array(2);
    femalePop[i][0] = parseFloat(DP03[i][39]);
    femalePop[i][1] = parseFloat(DP03[i][45]);

    industryPop[i] = new Array(14);
    industryPop[i][0] = parseFloat(DP03[i][127]);
    i1 = 133;
    for (i2 = 1; i2 < industryPop[i].length; i2++) {
      industryPop[i][i2] = parseFloat(DP03[i][i1]);
      i1 += 4;
    }
  }

}

function draw() {
  ellipse(width/2,height/2,100,100);
}
