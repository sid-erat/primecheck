var gdata;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function drawStuff() {
  let x = 0,
    y = 0;
  let width = canvas.width / 30;
  let pad = 2;

  for (let i = 0; i < gdata.colors.length; i++) {
    context.fillStyle = gdata.colors[i];
    context.fillRect(x, y, width, width);
    context.font = "20px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText(i + 1, x + width / 2, y + width / 2);

    x += width + pad;
    if (x > canvas.width - width) {
      y += width + pad;
      x = 0;
    }
    	
  }
}

var pending_changes = [];

var speed = 50;

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "38") {
    // up arrow
  } else if (e.keyCode == "40") {
    // down arrow
  } else if (e.keyCode == "37") {
    speed = 2 * speed;
  } else if (e.keyCode == "39") {
    speed = speed / 2;
  }
}

function display_changes() {
  var tmp = pending_changes.shift();
  context.fillStyle = tmp.color;
  context.fillRect(tmp.x, tmp.y, tmp.width, tmp.width);
  context.font = "20px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.fillText(tmp.text, tmp.txtx, tmp.txty);
  setTimeout(display_changes, speed);
}

function begin_animation() {
  let maxN = Number(document.getElementById("maxN").value) - 1;
  if (maxN >= 1000) {
    alert("Please input smaller values...");
    return;
  }
  
  gdata = { colors: Array(maxN).fill("green") };
  gdata.colors.unshift("red");
  canvas.width = window.innerWidth;
//  canvas.height = window.innerHeight;
  
  let width = canvas.width/30;
  let pad = 2;
  let numrow = Math.floor((canvas.width-pad)/(width+pad))
  let y = (Math.floor(maxN/numrow)*(width+pad))
  y += width+pad;
  canvas.height = y;

  
  drawStuff();
  start();
  setTimeout(display_changes, speed);
}

function change_color(n, ncolor) {
  let x = 0,y = 0;
  let width = canvas.width / 30;
  let pad = 2;


  n = n-1;
  let numrow = Math.floor((canvas.width-pad)/(width+pad))
  x = (n%numrow)*(width+pad)
  y = (Math.floor(n/numrow)*(width+pad))
  pending_changes.push({
        text: n + 1,
        txtx: x + width / 2,
        txty: y + width / 2,
        color: ncolor,
        x: x,
        y: y,
        width: width,
      });
}


function get_next_prime() {
  for (let i = 0; i < gdata.colors.length; i++) {
    if (gdata.colors[i] == "green") {
      return i + 1;
    }
  }
  return -1;
}

function iterate(prime) {
  gdata.colors[prime - 1] = "orange";
  change_color(prime, "orange");
  for (let i = 2 * prime; i <= gdata.colors.length; i += prime) {
    gdata.colors[i - 1] = "red";
    change_color(i, "red");
  }
}

function start() {
	start_seive1();
}

function start_seive1() {
  var prime = 2;
  while (prime > 0) {
    iterate(prime);
    prime = get_next_prime();
  }
}
function start_seive2() {
  let nmax = gdata.colors.length;
  gdata.colors[0]="green";
  for(let i=1;i<=nmax;i++) {
	  for(let j=i;j<=nmax;j++) {
		  let k=i+j+2*i*j;
		  if (k>nmax) break;
		  change_color(k,"red");
		  gdata.colors[k-1]="red"
	  }
  }
  for(let i=1;i<=nmax;i++) {
	  if (gdata.colors[i-1]=="green") {
		  let prime = 2*i+1
		  if (prime <= nmax) {
			change_color(2*i+1,"orange");
		   }
	  }
  }
  gdata.colors[1]="orange";
  change_color(2,"orange");
}
