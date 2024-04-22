/*
gdata stores a list of colors representing whether or not a number is prime
specifically, if gdata.colors[i] == "green" then i+1 has not been classified yet
if gdata.colors[i] == "red" then i+1 is a composite number
if gdata.colors[i] == "orange" then i+1 is a prime number
*/

var gdata;

/*
canvas and context are (constant) variables initialized to draw 
to the canvas
*/
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//drawStuff uses gdata.colors to render the canvas
function drawStuff() {
   let x = 0,
      y = 0;
   // sets width of squares
   let width = canvas.width / 30;
   let pad = 2;
   // fills the canvas with rows of evenly spaced squares labelled with numbers
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

/*
 every time a color change is needed, it is appended to pending_changes
 */
var pending_changes = [];

/*
the variable speed controls the rate at which pending_changes are applied
*/
var speed = 50;

// callback function checkKey is set up when any key is pressed
document.onkeydown = checkKey;

/*
checkKey speeds up the rate at which pending_changes are applied if 
right arrow is pressed, and slows down the rate if left arrow is pressed
*/

function checkKey(e) {
   e = e || window.event;

   if (e.keyCode == "37") {
      // left arrow
      speed = 2 * speed;
   } else if (e.keyCode == "39") {
      // right arrow
      speed = speed / 2;
   }
}

/* 
display_changes applies the first element of pending_changes and 
sets a timeout between changes
*/

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

/* 
  begin_animation initializes the animation by:
 (1) retrieving the maximum value of the sieve
 (2) initializing gdata.colors to all green except the first element 
     (since 1 is not prime)
 (3) calculating the height needed for the canvas
 (4) calling drawStuff to create the grid, starting the sieve, and 
     setting the initial timeout period before pending_updates are applied
*/

function begin_animation() {
   let maxN = Number(document.getElementById("maxN").value) - 1;
   if (maxN >= 1000) {
      alert("Please input smaller values...");
      return;
   }

   gdata = {
      colors: Array(maxN).fill("green")
   };
   gdata.colors.unshift("red");
   canvas.width = window.innerWidth;
   //  canvas.height = window.innerHeight;

   let width = canvas.width / 30;
   let pad = 2;
   let numrow = Math.floor((canvas.width - pad) / (width + pad))
   let y = (Math.floor(maxN / numrow) * (width + pad))
   y += width + pad;
   canvas.height = y;


   drawStuff();
   start();
   setTimeout(display_changes, speed);
}

/*
changes the color of n by calculating the position of n in the grid and 
adding it to pending_updates
*/
function change_color(n, ncolor) {
   let x = 0,
      y = 0;
   let width = canvas.width / 30;
   let pad = 2;


   n = n - 1;
   let numrow = Math.floor((canvas.width - pad) / (width + pad))
   x = (n % numrow) * (width + pad)
   y = (Math.floor(n / numrow) * (width + pad))
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

//BEGINNING OF SIEVE IMPLEMENTATION

/*
checks for the next smallest number that has not been proven composite 
(i.e., marked green)
*/

function get_next_prime() {
   for (let i = 0; i < gdata.colors.length; i++) {
      if (gdata.colors[i] == "green") {
         return i + 1;
      }
   }
   return -1;
}

/*
marks primes as orange and composites as red. Composites are marked red 
by iterating through multiples of primes (sieve of Eratosthenes)
*/
function iterate(prime) {
   gdata.colors[prime - 1] = "orange";
   change_color(prime, "orange");
   for (let i = 2 * prime; i <= gdata.colors.length; i += prime) {
      gdata.colors[i - 1] = "red";
      change_color(i, "red");
   }
}

/*
this function allows for generalization to a simulation for multiple 
sieves. It is not important to this code and may be ignored.
*/
function start() {
   start_sieve1();
}

/*
this function implements the sieve by repeatedly getting the next prime 
and marking its multiples as composite through get_next_prime() and 
iterate().
*/
function start_sieve1() {
   var prime = 2;
   while (prime > 0) {
      iterate(prime);
      prime = get_next_prime();
   }
}
