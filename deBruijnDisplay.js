function change(viewContainer, s, colorOrder) {
  // document.getElementById("deBruijnSeq").firstChild.nodeValue= "Hallo";
  var digits= viewContainer.getElementsByTagName("span");
  while(digits.length>0)
    viewContainer.removeChild(digits[0]);
  
  for(var i= 0; i<s.length; i++) {
    var mySpan = document.createElement("span");
    mySpan.style.display="inline-block";
    mySpan.style.width="20px";
    mySpan.style.height="20px";
      mySpan.style.border= "thin solid gray";
    if(typeof colorOrder !== 'undefined') {
      mySpan.style.backgroundColor= colorOrder[s[i]];
    } else {
      mySpan.style.textAlign="center";
      mySpan.style.textJustify="center";
      mySpan.style.fontFamily= "monospace";

      var myText = document.createTextNode(String(s[i]));
      mySpan.appendChild(myText);
    }
    viewContainer.appendChild(mySpan);
  }
}
 
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1, g = f, b = 0; break;
        case 1: r = q, g = 1, b = 0; break;
        case 2: r = 0, g = 1, b = f; break;
        case 3: r = 0, g = q, b = 1; break;
        case 4: r = f, g = 0, b = 1; break;
        case 5: r = 1, g = 0, b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

function getColorOrder(n) {
  var colorOrder= new Array(n);
  
  switch(n) {
    case 2:
      colorOrder[0]= "white";
      colorOrder[1]= "black";
      break;
    case 5:
      colorOrder[4]= "aqua";
    case 4:
      colorOrder[3]= "orange";
    case 3:
      colorOrder[0]= "red";
      colorOrder[1]= "green";
      colorOrder[2]= "blue";
      break;
    default:
      for(var i= 0; i<n; i++)
	colorOrder[i]= rainbow(n, i);
      break;
  }
  return colorOrder;
}

function recalc() {
  var c_= parseInt(deBruijn.c.value, 10);
  var n_= parseInt(deBruijn.n.value, 10);
  var maxSeqLen= Math.pow(2, 16);
  
  if(isNaN(c_) || c_<2 || c_>8) {
    alert("The alphabet size should be between 2 and 8");
    return;
  }
  if(isNaN(n_) || n_<2|| n_>8) {
    alert("The word length should be between 2 and 16");
    return;
  }
  var seqLen= Math.pow(c_, n_);
  if(seqLen>maxSeqLen) {
    alert("The sequence length should not exceed " + String(maxSeqLen) + " (given c and n it would be " + String(seqLen) + ").\nThis limit can be lifted by editing the code.");
    return;
  }
  c= c_;
  n= n_;
  
  T= new Array(Math.pow(c, 2));
  L= new Array(n-2);
  K= new Array(n-1);
  s= decodableDeBruijn(c, n);
  // console.log("T= " + T);
  // for(var i= 0; i<L.length; i++)
   // console.log("L[" + i + "]= " + L[i]);
  // console.log("K= " + K);
}

function testDecoder(viewContainer) {
  var testTable= viewContainer.getElementsByTagName("table");
  while(testTable.length>0)
    viewContainer.removeChild(testTable[0]);

  testTable = document.createElement("table");
  var testRow;
  var testCell;
  var testStr;
  testRow= document.createElement("tr");
  
  testCell= document.createElement("th");
  testCell.appendChild(document.createTextNode("No"));
  testRow.appendChild(testCell);
  
  testCell= document.createElement("th");
  testCell.appendChild(document.createTextNode("Pattern"));
  testRow.appendChild(testCell);
  
  testCell= document.createElement("th");
  testCell.appendChild(document.createTextNode("Found at"));
  testRow.appendChild(testCell);
  
  testCell= document.createElement("th");
  testCell.appendChild(document.createTextNode("Decoded at"));
  testRow.appendChild(testCell);
  
  testCell= document.createElement("th");
  testCell.appendChild(document.createTextNode("Correct"));
  testRow.appendChild(testCell);
  
  testTable.appendChild(testRow);
  
  for(var i= 0; i<Math.pow(c, n); i++) {
    var w= new Array(n);
    var i_= i;
    for(j= n-1; j>=0; j--) {
        w[j]= i_%c;
        i_= Math.floor(i_/c);
    }
    var j_= findWord(s, w);
    var j= decodeDeBruijn(w, c);
    
    testRow= document.createElement("tr");

    testCell= document.createElement("td");
    testCell.style.textAlign= "center";
    testCell.appendChild(document.createTextNode(i));
    testRow.appendChild(testCell);
    testCell= document.createElement("td");
    testCell.style.textAlign= "center";
    // testCell.appendChild(document.createTextNode(w));
    change(testCell, w);
    testRow.appendChild(testCell);
    testCell= document.createElement("td");
    testCell.style.textAlign= "center";
    testCell.appendChild(document.createTextNode(j_));
    testRow.appendChild(testCell);
    testCell= document.createElement("td");
    testCell.style.textAlign= "center";
    testCell.appendChild(document.createTextNode(j));
    testRow.appendChild(testCell);
    testCell= document.createElement("td");
    testCell.style.textAlign= "center";
    if(j==j_)
      testCell.appendChild(document.createTextNode("\u2714"));
    else
      testCell.appendChild(document.createTextNode("\u2718"));
    testRow.appendChild(testCell);
    testTable.appendChild(testRow);
  }
  viewContainer.appendChild(testTable);
}

function update() {
  recalc();
  change(document.getElementById("deBruijnSeqDigits"), s);
  var colorOrder= getColorOrder(c);
  change(document.getElementById("deBruijnSeqColor"), s, colorOrder);
  testDecoder(document.getElementById("deBruijnDecodeTest"));
}
