var canvas;
var DP05, DP02, DP03;
var totalPop, agePop, racePop;
var eduPop, eduAttainment;
var laborPop, femalePop, industryPop;
var year, popUSA, popWorld, popWorldArr;
var dotConversion;
var circle, circles;

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

  //Header data
  year = 2010;
  popUSA = totalPop[0];
  popWorldArr = [6.96, 7.04, 7.12, 7.21, 7.30, 7.38, 7.47, 7.55, 7.63]
  popWorld = popWorldArr[0];

  //Main graphic
  dotConversion = 3000000;
  initializeCircles();
}

function draw() {
  background(255);
  //ellipse(width/2,height/2,100,100);
  //rect(width/2, height/2, 50, 50);
  //rect(40, 120, 120, 40);
  //arc(50, 55, 50, 50, 0, HALF_PI);
  writeHeading();
  displayCircles();
}

function initializeCircles() {
  circle = {
    display: function() {
      noFill();
      stroke(this.c);
      ellipse(this.xPos, this.yPos, this.size, this.size);
      fill(0);
      textSize(12);
      textAlign(CENTER);
      text(this.label, this.xPos, this.yPos);
    }
  }
  circles = new Array(20);
  var radius = .3 * height;
  var spacing = TWO_PI / (circles.length - 1);
  var a = .5*width;
  var b = .5*height;
  var angle = HALF_PI;
  circles[0] = {label: "Start", xPos: a, yPos: b, size: 50, c: color(0)};

  for (var i = 1; i < circles.length; i++) {
    var x = a + radius * cos(angle);
    var y = b - radius * sin(angle);

    switch(i) {
      case 1:
        circles[1] = {label: "Elementary School", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 2:
        circles[2] = {label: "High School", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 3:
        circles[3] = {label: "College", xPos: x, yPos: y, size: 50, c: color(0)};
      break;
      case 4:
        circles[4] = {label: "Agriculture", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 5:
        circles[5] = {label: "Construction", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 6:
        circles[6] = {label: "Manufacturing", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 7:
        circles[7] = {label: "Wholesale Trade", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 8:
        circles[8] = {label: "Retail Trade", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 9:
        circles[9] = {label: "Utilities", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 10:
        circles[10] = {label: "Information", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 11:
        circles[11] = {label: "Finance", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 12:
        circles[12] = {label: "Science and Technology", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 13:
        circles[13] = {label: "Education and Health", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 14:
        circles[14] = {label: "Arts and Entertainment", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 15:
        circles[15] = {label: "Public Administration", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 16:
        circles[16] = {label: "Other Services", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 17:
        circles[17] = {label: "Armed Forces", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 18:
        circles[18] = {label: "Unemployed", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
      case 19:
        circles[19] = {label: "Not in Labor Force", xPos: x, yPos: y, size: 50, c: color(0)};
        break;
    }

    angle -= spacing;
  }

  circles[1] = {label: "Elementary School", xPos: x, yPos: y, size: 50, c: color(0)};
  circles[2] = {label: "High School", xPos: .5*width, yPos: .2*height, size: 50, c: color(0)};
  circles[3] = {label: "College", xPos: .62*width, yPos: .25*height, size: 50, c: color(0)};
  circles[4] = {label: "Agriculture", xPos: .69*width, yPos: .38*height, size: 50, c: color(0)};
  circles[5] = {label: "Construction", xPos: .72*width, yPos: .45*height, size: 50, c: color(0)};
  circles[6] = {label: "Manufacturing", xPos: .70*width, yPos: .58*height, size: 50, c: color(0)};
  circles[7] = {label: "Wholesale Trade", xPos: .67*width, yPos: .69*height, size: 50, c: color(0)};
  circles[8] = {label: "Retail Trade", xPos: .64*width, yPos: .78*height, size: 50, c: color(0)};
  /*circles[9] = {label: "Utilities", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[10] = {label: "Information", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[11] = {label: "Finance", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[12] = {label: "Science and Technology", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[13] = {label: "Education and Health", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[14] = {label: "Arts and Entertainment", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[15] = {label: "Public Administration", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[16] = {label: "Other Services", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[17] = {label: "Armed Forces", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[18] = {label: "Unemployed", xPos: width/2, yPos: height/2, size: 50, c: color(0)};
  circles[19] = {label: "Not in Labor Force", xPos: width/2, yPos: height/2, size: 50, c: color(0)};*/
}

function writeHeading() {
  fill(0);
  textAlign(LEFT);
  textSize(48);
  text(year, 10, 45);
  textSize(20);
  text("USA Population: " + popUSA, 10, 80);
  text("World Population: " + popWorld + " billion", 10, 105);
}

function displayCircles() {
  for (var i = 0; i < circles.length; i++) {
    circle.display.call(circles[i]);
  }
}
