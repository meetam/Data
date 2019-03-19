var canvas;
var DP05, DP02, DP03;
var totalPop, agePop, racePop;
var eduPop, eduAttainment;
var laborPop, femalePop, industryPop;
var earnings, maleEarning, femaleEarning, minWage;
var year, popUSA, previousPop, popWorld, popWorldArr, popGrowthUSA, popGrowthWorld;
var dotConversion;
var circle, circles;
var dot, dots, numDots, robotDot, robotDots;
var pCollege, pHighSchool, pGradSchool, pUnemployed, pArmedForces, pIndustry, pTotal;
var lifeExpectancy;
var numFemales, numMales; //number of males/females in labor force
var robotWord, robotMode, popRobots, numRobots, robotEarning, robotColor;
var popGrowthRobot, previousRobotPop;
var nextArticle, xArticle, news, newsSet, topNews, tArticle;
var warMode, warDuration, warStart;
var femaleMode, nuclearMode;
var femaleArticles, robotArticles;

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

  //Load news
  var keyWords = ["future, artificial, technology, robot, women"];
  var randWord = Math.floor(random(keyWords.length));
  var url = "https://newsapi.org/v2/everything?q=" + keyWords[randWord];
  url += "&apiKey=d35b0088a38e45f1ad33040603272634";
  news = new Array(1);
  fetch(url).then(response => {
    return response.json();
  }).then(data => {
    // Work with JSON data here
    news = data;
  }).catch(err => {
    // Do something for an error here
  });
}

function setup() {
  canvas = createCanvas(window.innerWidth - 150, window.innerHeight);

  // Initialize Arrays
  totalPop = new Array(8);
  agePop = new Array(8);
  eduPop = new Array(8);
  eduAttainment = new Array(8);
  laborPop = new Array(8);
  femalePop = new Array(8);
  industryPop = new Array(8);
  earnings = new Array(8);

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

    earnings[i] = new Array(2);
    earnings[i][0] = parseFloat(DP03[i][371]);
    earnings[i][1] = parseFloat(DP03[i][375]);
  }

  //Header data
  year = 2010;
  popUSA = totalPop[0];
  popWorldArr = [6.96, 7.04, 7.12, 7.21, 7.30, 7.38, 7.47, 7.55, 7.63];
  minWage = 7.25;
  popWorld = popWorldArr[0];
  lifeExpectancy = 78.6;
  popGrowthUSA = 0.7;
  popGrowthWorld = 1.07;
  numFemales = Math.round(femalePop[0][0] * femalePop[0][1] * .01);
  numMales = Math.round(laborPop[0][0] * laborPop[0][1] * .01) - numFemales;
  robotDots = new Array();

  //Probabilities
  pHighSchool = eduAttainment[0][3];
  pCollege = eduAttainment[0][6];
  pGradSchool = eduAttainment[0][7];

  //News data
  topNews = new Array();
  nextArticle = "";
  tArticle = -1;
  femaleArticles = ["first female president of the united states",
                    "50% of google engineers are women",
                    "50% of fortune 500 ceo's are women"];
  robotArticles = ["ai is able to complete complex human jobs",
                   "robots are able to function fully as human beings",
                   "ai takes over chief engineer's job at nasa",
                   "google has a new ceo: a robot"];

  //Robot Data
  numRobots = 0;
  robotEarning = 0;
  robotMode = false;
  popRobots = 0;
  popGrowthRobot = 10;
  previousRobotPop = 0;

  //Modes
  warMode = false;
  femaleMode = false;
  nuclearMode = false;

  //Make circles and dots
  initializeCircles();
  initializeDots();
}

function draw() {
  background(255);
  var time = millis();
  if (time % 1000 < 20) {
    incrementYear();
    updateProbabilities();
    updateMode();
    updateDots();
    updateRobotDots();
    createDots();
  }

  writeNews();
  writeTopNews();
  writeHeading();
  displayDots();
  displayCircles();
  displayMinWage();
  displayMF();
}

function incrementYear() {
  year++;
  lifeExpectancy -= 0.01
  previousPop = popUSA;
  previousRobotPop = popRobots;
  var i = year % 2010;
  if (i < totalPop.length) {
    popUSA = totalPop[year % 2010];
    popWorld = popWorldArr[year % 2010];
  }

  else {
    popUSA += Math.round(popGrowthUSA * popUSA * .01);
    popWorld = +((popWorld + +((popGrowthWorld * popWorld * .01).toFixed(2))).toFixed(2));
    popRobots += Math.round(popGrowthRobot * popRobots * .01);
    numRobots = popRobots;

    if (popUSA < dotConversion * 50) {
      popUSA = 0;
      numFemales = 0;
      numMales = 0;
    }
    if (popWorld < 1) {
      popWorld = 0;
    }
  }
}

function writeHeading() {
  fill(255);
  noStroke();
  rect(0, 0, 130, 100);

  fill(0);
  textAlign(LEFT);
  textSize(48);
  text(year, 10, 45);
  textSize(20);
  text("USA Population: " + popUSA, 10, 80);
  text("World Population: " + popWorld + " billion", 10, 105);
  if (robotMode) {
    text("AI Population: " + popRobots, 10, 130);
  }
}

function writeNews() {
  var time = millis();
  if ((nextArticle == "" && millis() >= 3000) ||
      (tArticle != -1 && time - tArticle > 20000)) {
    nextArticle = "";
    xArticle = width;
    tArticle = -1;
    var rIndex = Math.floor(random(news.articles.length));
    for (var k = rIndex; k < news.articles.length; k++) {
      nextArticle = nextArticle + " // " + news.articles[k].title;
    }

    for (k = 0; k < rIndex; k++) {
      nextArticle = nextArticle + " // " + news.articles[k].title;
    }
  }

  textSize(35);
  fill(200, 200, 200);
  noStroke();
  text(nextArticle.toUpperCase(), xArticle, 40);
  xArticle -= 2;
}

function writeNextArticle(title) {
  var titleExists = false;
  for (var i = 0; i < topNews.length; i++) {
    if (topNews[i].toUpperCase() === title.toUpperCase()) {
      titleExists = true;
    }
  }
  if (!titleExists) {
    topNews[topNews.length] = title;
    nextArticle = title;
    xArticle = width;
    tArticle = millis();
  }
}

function writeTopNews() {
  var diameter = 150;
  var xPos = width - 2.5 * diameter;
  var yPos = 100;

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT);
  text("Top News:", xPos, yPos);

  var str = "";
  for (var i = 0; i < topNews.length; i++) {
    str = str + topNews[i].toUpperCase() + "\n";
  }
  yPos += 20;
  textSize(9);
  fill(200, 200, 200);
  text(str, xPos, yPos);
}

function displayCircles() {
  for (var i = 0; i < circles.length; i++) {
    circle.display.call(circles[i]);
  }
}

function displayDots() {
  for (var i = 0; i < dots.length; i++) {
    if (dots[i].age < lifeExpectancy)
      dot.display.call(dots[i]);
  }

  for (var i = 0; i < robotDots.length; i++) {
    robotDot.display.call(robotDots[i]);
  }
}

function displayMinWage() {
  var diameter = 150;
  var xPos = width - 2.5 * diameter;
  var yPos = height / 2 - 70;

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT);
  text("Educational Attainment", xPos, yPos - 20);
  text("Federal Minimum Wage", xPos + diameter + 30, yPos - 20);

  var col1 = color(65, 105, 225);
  var col2 = color(0, 0, 205);
  var col3 = color(0, 0, 105);
  drawBarGraph(pHighSchool, pCollege, pGradSchool,
               col1, col2, col3, xPos, yPos, diameter);

  //Key
  noStroke();
  textAlign(LEFT);
  var xKey = xPos - diameter / 2 + 40;
  var yKey = yPos + 160;
  fill(col1);
  rect(xKey, yKey, 20, 20);
  fill(0);
  xKey += 20;
  text("High School", xKey, yKey + 15);
  xKey += 80;
  fill(col2);
  rect(xKey, yKey, 20, 20);
  fill(0);
  xKey += 20;
  text("Undergrad", xKey, yKey + 15);
  xKey += 70;
  fill(col3);
  rect(xKey, yKey, 20, 20);
  xKey += 20;
  fill(0);
  text("Graduate", xKey, yKey + 15);

  //min wage
  xPos += (3 * diameter / 2) + 25;
  yPos += diameter / 2;
  fill(143, 40, 194);
  var di = minWage * 13;
  if (di > diameter) {
    di = diameter;
  }
  ellipse(xPos, yPos, di, di);
  fill(255);
  textAlign(CENTER);
  text("$" + minWage.toFixed(2), xPos, yPos);
}

function drawBarGraph(var1, var2, var3, c1, c2, c3, xPos, yPos, diameter) {
  stroke(0);
  line(xPos, yPos, xPos, yPos + diameter);
  line(xPos, yPos + diameter, xPos + diameter, yPos + diameter);
  if (var1 <= 0 && var2 <= 0 && var3 <= 0) {
    return;
  }

  var numBars = 3;
  if (var3 == 0) {
    numBars = 2;
  }
  yPos += diameter;
  xPos += diameter / (numBars + 1) - 10;

  var max = Math.max(var1, var2);
  max = Math.max(max, var3);

  var h1 = (diameter - 10) * var1 / max;
  var h2 = (diameter - 10) * var2 / max;
  var h3 = (diameter - 10) * var3 / max;
  if (max == var1)
    h1 = diameter - 10;
  else if (max == var2)
    h2 = diameter - 10;
  else if (max == var3)
    var h3 = diameter - 10;

  noStroke();
  fill(c1);
  rect(xPos, yPos - h1, 20, h1);
  xPos += diameter / (numBars + 1);
  fill(c2);
  rect(xPos, yPos - h2, 20, h2);
  if (var3 > 0) {
    xPos += diameter / (numBars + 1);
    fill(c3);
    rect(xPos, yPos - h3, 20, h3);
  }
}

//source for pi chart: https://processing.org/examples/piechart.html
function displayMF() {
  var i = year % 2010;
  if (i < DP05.length) {
    maleEarning = earnings[i][0];
    femaleEarning = earnings[i][1];
  }

  var maleColor = color(154, 205, 50);
  var femaleColor = color(250, 128, 114);
  robotColor = color(50, 50, 50);

  //Pi chart
  var total = numFemales + numMales + numRobots;
  var fAngle = TWO_PI * numFemales / total;
  var mAngle = TWO_PI * numMales / total;
  var rAngle = TWO_PI - fAngle - mAngle;
  var angle = -1 * HALF_PI;
  var diameter = 150;
  var xPos = width - 2 * diameter;
  var yPos = height - 130;
  fill(0);
  noStroke();
  textSize(14);
  text("Labor Force", xPos, yPos - 90);
  text("Median Wage", xPos + diameter + 25, yPos - 90);
  fill(femaleColor);
  arc(xPos, yPos, diameter, diameter, angle, angle + fAngle);
  angle += fAngle;
  fill(maleColor);
  arc(xPos, yPos, diameter, diameter, angle, angle + mAngle);
  angle += mAngle;
  fill(robotColor);
  arc(xPos, yPos, diameter, diameter, angle, angle + rAngle);

  //Key
  textAlign(LEFT);
  var xKey = xPos - diameter / 2 + 40;
  var yKey = yPos + diameter / 2 + 20;
  fill(maleColor);
  rect(xKey, yKey, 20, 20);
  fill(0);
  xKey += 30;
  text("Male", xKey, yKey + 15);
  xKey += 60;
  fill(femaleColor);
  rect(xKey, yKey, 20, 20);
  fill(0);
  xKey += 30;
  text("Female", xKey, yKey + 15);
  if (robotMode) {
    xKey += 70;
    fill(robotColor);
    rect(xKey, yKey, 20, 20);
    xKey += 30;
    text("AI", xKey, yKey + 15);
  }

  //Bar graph
  xPos = xPos + (diameter / 2) + 30;
  yPos = yPos - (diameter / 2);
  drawBarGraph(maleEarning, femaleEarning, robotEarning, maleColor, femaleColor,
               robotColor, xPos, yPos, diameter);
}

function updateProbabilities() {
  var i = year % 2010;
  if (i < DP05.length) {
    numFemales = Math.round(femalePop[i][0] * femalePop[i][1] * .01);
    numMales = Math.round(laborPop[i][0] * laborPop[i][1] * .01) - numFemales;

    pCollege = eduAttainment[i][6];
    pHighSchool = eduAttainment[i][3];
    pGradSchool = eduAttainment[i][7];
    pUnemployed = laborPop[i][3];
    pArmedForces = laborPop[i][4];
    pIndustry = new Array(13);
    pTotal = pCollege + pUnemployed + pArmedForces;
    for (var j = 0; j < pIndustry.length; j++) {
      pIndustry[j] = industryPop[i][j + 1];
      pTotal += pIndustry[j];
    }
  }
}

function updateMode() {
  if (warMode && year >= warStart + warDuration) {
    endWar();
  }

  if (year >= 2080 && !femaleMode) {
    femaleMode = true;
    writeNextArticle(femaleArticles[Math.floor(random(femaleArticles.length))]);
  }

  if (year >= 2130 && !robotMode) {
    makeRobots();
    writeNextArticle(robotArticles[Math.floor(random(robotArticles.length))]);
  }

  if (femaleMode) {
    if (femaleEarning < maleEarning) {
      femaleEarning += 1000;
      if (femaleEarning > maleEarning) {
        femaleEarning = maleEarning;
      }
    }
    if (numFemales < numMales) {
      numFemales += 1000000;
      if (numFemales > numMales) {
        numFemales = numMales;
      }
    }
  }

  if (nuclearMode) {
    lifeExpectancy--;
    pIndustry[8] += 10;
    popGrowthUSA -= 0.1;
    popGrowthWorld -= 0.1;
  }

  if (robotMode) {
    pHighSchool -= 0.01;
    pCollege -= 0.05;
    pGradSchool -= 0.1;
    robotEarning += 1000;
    if (popRobots > popUSA) {
      if (!circles[15].label.includes("AI")) {
        circles[15].label = circles[15].label + "\n(AI Slaves)";
        pIndustry[11] += 100;
        writeNextArticle("ai employs humans without pay");
      }
      pHighSchool = 0;
      pCollege = 0;
      pGradSchool = 0;
      popGrowthWorld -= 0.01;
      popGrowthUSA -= 0.01;
      minWage -= 0.01;
    }
  }
}

function updateDots() {
  //Update dots
  for (var i = 0; i < dots.length; i++) {
    dots[i].age++;
    if (dots[i].label === "Birth" && dots[i].age >= 4) { //go to elementary
      if (!robotMode || popRobots < popUSA) {
        dots[i].label = "Elementary School";
      }

      else if (popRobots > popUSA) {
        dots[i].label = "College";
        dots[i].age = 25;
      }

      dots[i].pos = 2; //means moving
    }

    if (dots[i].label === "Elementary School" && dots[i].age >= 14) { //go to high
      dots[i].label = "High School";
      dots[i].pos = 2;
    }

    var num = random(0, 100);
    if (dots[i].label === "High School" && dots[i].age >= 18 && num <= pCollege) { //college
      dots[i].label = "College";
      dots[i].pos = 2;
    }

    else if ((dots[i].label === "High School" && dots[i].age >= 18) ||
             (dots[i].label === "College" && dots[i].age >= 24)) { //job
      num = random(0, pTotal);
      var prob = pUnemployed + pArmedForces;
      if (num < pUnemployed)
        dots[i].label = "Unemployed";
      else if ((num >= pUnemployed && num < prob) || circles[17].countDots == 0)
        dots[i].label = "Armed Forces";
      else {
        for (var j = 0; j < pIndustry.length; j++) {
          if ((num >= prob && num < prob + pIndustry[j]) || circles[j + 4].countDots == 0) {
            dots[i].label = circles[j + 4].label;
            break;
          }
          prob += pIndustry[length];
        }
      }
      dots[i].pos = 2;
    }
  }
}

function createDots() {
  var newDots = Math.round((popUSA - previousPop) / dotConversion);
  for (var i = 0; i < newDots; i++) {
    dots[dots.length] = {label: "Birth", age: 0, pos: 0};
  }
}

function initializeCircles() {
  circle = {
    display: function() {
      var nDots = 0;
      var rDots = 0;
      for (var i = 0; i < dots.length; i++) {
        if (dots[i].age < lifeExpectancy && dots[i].label === this.label)
          nDots++;
      }
      for (i = 0; i < robotDots.length; i++) {
        if (robotDots[i].label === this.label) {
          rDots++;
        }
      }

      var impIndustries = ["Science and Technology", "Education and Health",
                           "Construction", "Manufacturing"];
      if (rDots > nDots && impIndustries.includes(this.label)) {
        writeNextArticle("AI has taken over " + this.label + " industry");
      }

      this.countDots = nDots + rDots;
      this.size = 8 * this.countDots + 5;
      if (this.size > 100) {
        this.size = 100;
      }
      noFill();
      stroke(this.c);
      strokeWeight(2);
      ellipse(this.xPos, this.yPos, this.size, this.size);

      fill(this.c);
      noStroke();
      textSize(14);
      textAlign(CENTER);
      text(this.label, this.xPos, this.yPos);
    }
  }
  circles = new Array(19);
  var radius = .3 * height;
  var spacing = TWO_PI / (circles.length - 1);
  var a = .35*width;
  var b = .55*height;
  var angle = HALF_PI;
  circles[0] = {label: "Birth", xPos: a, yPos: b, c: color(0)};

  for (var i = 1; i < circles.length; i++) {
    if (i % 2 == 0)
      radius = .4 * height;
    else
      radius = .25 * height;

    var x = a + radius * cos(angle);
    var y = b - radius * sin(angle);

    switch(i) {
      case 1:
        circles[1] = {label: "Elementary School", xPos: x, yPos: y, c: color(30, 144, 255)};
        break;
      case 2:
        circles[2] = {label: "High School", xPos: x, yPos: y, c: color(65, 105, 225)};
        break;
      case 3:
        circles[3] = {label: "College", xPos: x, yPos: y, c: color(0, 0, 205)};
      break;
      case 4:
        circles[4] = {label: "Agriculture", xPos: x, yPos: y, c: color(34, 139, 34)};
        break;
      case 5:
        circles[5] = {label: "Construction", xPos: x, yPos: y, c: color(139, 69, 19)};
        break;
      case 6:
        circles[6] = {label: "Manufacturing", xPos: x, yPos: y, c: color(210, 105, 30)};
        break;
      case 7:
        circles[7] = {label: "Wholesale Trade", xPos: x, yPos: y, c: color(106, 90, 205)};
        break;
      case 8:
        circles[8] = {label: "Retail Trade", xPos: x, yPos: y, c: color(153, 50, 204)};
        break;
      case 9:
        circles[9] = {label: "Utilities", xPos: x, yPos: y, c: color(49, 79, 79)};
        break;
      case 10:
        circles[10] = {label: "Information", xPos: x, yPos: y, c: color(105, 105, 105)};
        break;
      case 11:
        circles[11] = {label: "Finance", xPos: x, yPos: y, c: color(10, 130, 180)};
        break;
      case 12:
        circles[12] = {label: "Science and Technology", xPos: x, yPos: y, c: color(32, 178, 170)};
        break;
      case 13:
        circles[13] = {label: "Education and Health", xPos: x, yPos: y, c: color(255, 99, 71)};
        break;
      case 14:
        circles[14] = {label: "Arts and Entertainment", xPos: x, yPos: y, c: color(255, 0, 0)};
        break;
      case 15:
        circles[15] = {label: "Other Services", xPos: x, yPos: y, c: color(139, 139, 131)};
        break;
      case 16:
        circles[16] = {label: "Public Administration", xPos: x, yPos: y, c: color(184, 134, 11)};
        break;
      case 17:
        circles[17] = {label: "Armed Forces", xPos: x, yPos: y, c: color(85, 107, 47)};
        break;
      case 18:
        circles[18] = {label: "Unemployed", xPos: x, yPos: y, c: color(255, 99, 71)};
        break;
    }

    angle -= spacing;
  }
}

//Robot dots
function updateRobotDots() {
  robotDot = {
    display: function() {
      for (var i = 0; i < circles.length; i++) {
        if (circles[i].label.includes(this.label)) {
          break;
        }
      }

      if (this.pos == 0) { //set initial position
        var radius = circles[i].size / 2;
        this.xPos = circles[i].xPos + random(-radius, radius);
        this.yPos = circles[i].yPos + random(-radius, radius);
        this.origX = this.xPos;
        this.origY = this.yPos;
        this.dir = "r";
      }

      else if (this.pos == 1) {
        if (this.dir == "r") {
          this.xPos += 1;
          if (this.xPos >= this.origX + 10)
            this.dir = "d";
        }
        else if (this.dir === "d") {
          this.yPos += 1;
          if (this.yPos >= this.origY + 10)
            this.dir = "l";
        }
        else if (this.dir === "l") {
          this.xPos -= 1;
          if (this.xPos <= this.origX) {
            this.dir = "u";
            this.xPos = this.origX;
          }
        }
        else {
          this.yPos -= 1;
          if (this.yPos <= this.origY) {
            this.dir = "r";
            this.yPos = this.origY;
          }
        }
      }

      fill(robotColor);
      noStroke();
      rect(this.xPos, this.yPos, 10, 10);
      this.pos = 1; //position set
    }
  }

  var numNewDots = Math.round((popRobots - previousRobotPop) / dotConversion);
  var index = robotDots.length;
  for (var i = 0; i < numNewDots; i++) {
    robotDots[index] = {pos: 0, label: "Science and Technology"}; //initialize dot

    var total = pTotal - pUnemployed - pCollege - pIndustry[11];
    num = random(0, total);
    var prob = pArmedForces;
    if (num < prob) //|| circles[17].countDots == 0)
      robotDots[index].label = "Armed Forces";
    else {
      for (var j = 0; j < pIndustry.length; j++) {
        if (j != 11) {
          if ((num >= prob && num < prob + pIndustry[j]) || circles[j + 4].countDots == 0) {
            robotDots[index].label = circles[j + 4].label;
            break;
          }
          prob += pIndustry[length];
        }
      }
    }

    if (popRobots > popUSA && robotDots[index].label === "Armed Forces") {
      robotDots[index].label = "Science and Technology";
    }

    index++;
  }
}

//Create initial dots
function initializeDots() {
  dot = {
    display: function() {
      for (var i = 0; i < circles.length; i++) { //find corresponding circle
        if (circles[i].label.includes(this.label)) {
          break;
        }
      }
      var limit = circles[i].size/4;

      if (this.pos == 0) { //set initial position
        this.xPos = circles[i].xPos + random(-15, 15);
        this.yPos = circles[i].yPos + random(-15, 15);
        this.pos = 1; //position set
      }

      else if (this.pos == 1) { //random movement in place
        if (this.xPos >= circles[i].xPos + limit)
          this.xPos--
        else if (this.xPos <= circles[i].xPos - limit)
          this.xPos++;
        else
          this.xPos = this.xPos + random(-0.8, 0.8);

        if (this.yPos >= circles[i].yPos + limit)
          this.yPos--;
        else if (this.yPos <= circles[i].yPos - limit)
          this.yPos++;
        else
          this.yPos = this.yPos + random(-0.8, 0.8);
      }

      else if (this.pos == 2) { //moving towards circle
        //check if dot is in circle
        if ((this.xPos >= circles[i].xPos - limit &&
             this.xPos <= circles[i].xPos + limit) &&
            (this.yPos >= circles[i].yPos - limit &&
             this.yPos <= circles[i].yPos + limit)) {
          this.pos = 1; // position set
        }

        else { //move dot
          if (this.label == "Elementary School") {
            this.yPos--;
          }
          else {
            var yDiff = circles[i].yPos - this.yPos;
            var xDiff = circles[i].xPos - this.xPos;
            if (xDiff == 0) {
              xDiff = .1;
            }
            var slope = Math.abs(yDiff / xDiff);

            if (yDiff < 0) {
              this.yPos -= slope;
            }
            else {
              this.yPos += slope;
            }
            if (xDiff < 0) {
              this.xPos -= 1;
            }
            else {
              this.xPos += 1;
            }
          }
        }
      }

      var col = circles[i].c;
      for (i = 0; i < this.age; i++) {
        col = color(red(col), green(col), blue(col), alpha(col) - 2);
      }

      fill(col);
      noStroke();
      ellipse(this.xPos, this.yPos, 10, 10);
    }
  }

  dotConversion = 3000000;
  dots = new Array(1);

  numDots = Math.round(popUSA / dotConversion);
  var num = Math.round(numDots * agePop[0][0] * .01); //start
  for (var i = 0; i < num; i++) {
    dots[i] = {label: "Birth", age: Math.round(random(6)), pos: 0};
  }

  var numEdu = Math.round(eduPop[0][0] / dotConversion);
  num = Math.round(numEdu * (eduPop[0][1] + eduPop[0][2] + eduPop[0][3]) * .01) //elementary
  var index = dots.length;
  for (i = index; i < index + num; i++) {
    dots[i] = {label: "Elementary School", age: Math.round(random(6, 14)), pos: 0};
  }

  index = dots.length;
  num = Math.round(numEdu * eduPop[0][4] * .01); //high
  for (i = index; i < index + num; i++) {
    dots[i] = {label: "High School", age: Math.round(random(14, 19)), pos: 0};
  }

  index = dots.length;
  num = Math.round(numEdu * eduPop[0][5] * .01); //college
  for (i = index; i < index + num; i++) {
    dots[i] = {label: "College", age: Math.round(random(19, 24)), pos: 0};
  }

  var numLabor = Math.round(industryPop[0][0] / dotConversion);
  for (var j = 4; j < 17; j++) { //industries
    index = dots.length;
    num = Math.round(numLabor * industryPop[0][j - 3] * .01);
    for (i = index; i < index + num; i++) {
      dots[i] = {label: circles[j].label, age: Math.round(random(25, 70)), pos: 0};
    }
  }

  index = dots.length;
  numLabor = Math.round(laborPop[0][0] / dotConversion);
  num = Math.round(numLabor * laborPop[0][3] * .01); //unemployed
  for (i = index; i < index + num; i++) {
    dots[i] = {label: "Unemployed", age: Math.round(random(19, 40)), pos: 0};
  }

  index = dots.length;
  num = Math.round(numLabor * laborPop[0][4] * .01); //armed forces
  if (num == 0) {
    num = 1;
  }
  for (i = index; i < index + num; i++) {
    dots[i] = {label: "Armed Forces", age: Math.round(random(19, 40)), pos: 0};
  }
}

//Choose what happens based on article title
function newArticle() {
  var title = document.getElementById("article").value;
  writeNextArticle(title);

  title = title.toLowerCase();
  var pos = false;
  var neg = false;
  var positives = ["more", "up", "increase", "high"];
  var negatives = ["less", "down", "decrease", "low"];
  for (i = 0; i < positives.length; i++) {
    if (title.includes(positives[i])) {
      pos = true;
      break;
    }
    if (title.includes(negatives[i])) {
      neg = true;
      break;
    }
  }

  var robot = ["robot", "artificial intelligence", "technology"];
  for (i = 0; i < robot.length; i++) {
    if (title.includes(robot[i])) {
      makeRobots();
      break;
    }
  }

  var health = ["cured", "cancer", "life", "health"];
  for (i = 0; i < health.length; i++) {
    if (title.includes(health[i])) {
      changeHealth(pos, neg, health[i]);
      break;
    }
  }

  var war = ["war", "battle", "fight", "bomb"];
  for (i = 0; i < war.length; i++) {
    if (title.includes(war[i])) {
      startWar();
      break;
    }
  }

  var environment = ["nuclear", "co2", "carbon dioxide", "fossil fuels", "environment"];
  for (i = 0; i < environment.length; i++) {
    if (title.includes(environment[i])) {
      env(pos, neg, environment[i]);
      break;
    }
  }

  var education = ["education", "school", "college", "universit"];
  for (i = 0; i < education.length; i++) {
    if (title.includes(education[i])) {
      school(pos, neg, education[i]);
      break;
    }
  }

  var female = ["women", "woman", "female", "girl"];
  for (i = 0; i < female.length; i++) {
    if (title.includes(female[i])) {
      genderEquality();
      break;
    }
  }

  var wage = ["wage", "pay", "inflation"];
  for (i = 0; i < wage.length; i++) {
    if (title.includes(wage[i])) {
      changeWage(pos, neg, wage[i]);
      break;
    }
  }
}

function makeRobots() {
  if (!robotMode && femaleMode) {
    robotMode = true;
    popRobots = 3000000;
    robotEarning = 10000;
    numRobots = popRobots; //number of robots in labor is same as population
    pUnemployed += 20;
  }
}

function changeHealth(pos, neg, word) {
  if (neg == true) {
    lifeExpectancy--;
    popGrowthUSA -= 0.1;
    pIndustry[9] -= 5;
  }

  else {
    lifeExpectancy++;
    popGrowthUSA += 0.1;
    pIndustry[9] += 5;
  }
}

function startWar() {
  warMode = true;
  pArmedForces += 30;
  lifeExpectancy -= 10;
  warDuration = random(5, 20);
  warStart = year;
}

function endWar() {
  warMode = false;
  pArmedForces -= 30;
  lifeExpectancy += 10;
  var title = "members of united nations sign peace treaty";
  if (nuclearMode) {
    title += ", but nuclear residue remains"
  }

  writeNextArticle(title);
}

function env(pos, neg, word) {
  if (pos == true) {
    lifeExpectancy += 5;
  }
  else {
    lifeExpectancy -= 5;
    if (word.toLowerCase() === "nuclear")
      nuclearMode = true;
  }
}

function school(pos, neg, word) {
  if (pos == true) {
    pHighSchool++;
    pCollege += 5;
    if (pCollege >= pHighSchool) {
      pCollege = pHighSchool;
    }
    pGradSchool += 3;
    if (pGradSchool >= pCollege) {
      pGradSchool = pCollege;
    }
  }
  else {
    pHighSchool--;
    pCollege -= 3;
    pGradSchool -= 5;
  }
}

function genderEquality() {
  femaleMode = true;
}

function changeWage(pos, neg, word) {
  if (pos == true || word.toLowerCase() === "inflation") {
    minWage += 0.25;
  }

  else {
    minWage -= 0.25;
  }
}
