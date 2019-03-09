/*class Square {
  /*var label;
  var xPos, yPos, size;
  var c;

  constructor(label, xPos, yPos, size, c) {
    this.label = label;
    this.xPos = xPos;
    this.yPos = yPos;
    this.size = size;
    this.c = c;
  }

  display() {
    //noFill();
    //stroke(c);
    console.log("hello");
    square(xPos, yPos, size);

  }
}*/

var square = {
  display: function() {
    console.log("hello");
    rect(xPos, yPos, size, size);
  }
}
