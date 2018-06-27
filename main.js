//canvas
var canvas = document.getElementById('canvas'); //linkea el canvas del html 
var ctx = canvas.getContext('2d'); //genera una variable contexto que sirve como pincel
//constants
var interval; 
var frames = 0; //la variable frames empieza en cero.

var gudeTamas = []; //array de nuevos gudetamas. Empieza vacío.

var images = {
    ichigoRun1: '../IchigoGame/images/running1.png',
    ichigoRun2: '../IchigoGame/images/running2.png',
    bg: '../IchigoGame/images/Background.png' //Es el background del videojuego
}

var gudetamaFalling = ['../IchigoGame/images/falling1.png','../IchigoGame/images/falling2.png','../IchigoGame/images/falling3.png'];
var randomGudetama = '';

var gudetamaIntoTheFloor = ['../IchigoGame/images/floor1.png','../IchigoGame/images/floor2.png','../IchigoGame/images/floor3.png','../IchigoGame/images/floor4.png','../IchigoGame/images/floor5.png'];
var gudetamaPushed = ['../IchigoGame/images/pushed1.png','../IchigoGame/images/pushed2.png'];

/* SOUND
var sound = new Audio();
sound.src = "http://66.90.93.122/ost/flappy-golf-2/wncucmil/1%20pancakes.mp3";
sound.loop = true;
var pipes = [];
*/

//class

class Board { //Es el background del canvas
    constructor() {
        this.x = 0; //se posiciona en X 0
        this.y = 0; //se posiciona en Y 0
        this.width = canvas.width; //mide el ancho del canvas
        this.height = canvas.height; //mide el alto del canvas
        this.image = new Image(); /* */
        this.image.src = images.bg; //selecciona la imágen background que está en el arreglo de images.
        this.image.onload = function () { // Cuando se carga completamente la imagen:
            this.draw(); //ejecuta la función draw.
        }.bind(this) //pone la variable dray en el mismo contexto de lo que se encuentra en el siguiente nivel del DOM
    }

    gameOver() { //es la función que termina el juego
        ctx.font = "80px Helvetica"; // asigna un tamaño y una fuente para la siguiente palabra
        ctx.fillText("Game Over", 20, 100); // muestra un string en la posición indicada
        ctx.font = "20px Serif"; // estilo del siguiente string
        ctx.fillStyle = 'red'; // color del siguiente string 
        ctx.fillText("Press 'Esc' to reset", 20, 150); // muestra un stringo en la posición indicada
    }

    draw() { //es la función que dibuja el background
        this.x--; //cada vez que dibuja, resta uno a x.
        if (this.x === -this.width) this.x = 0; // si x es menor que el ancho de la imagen, x cambia su valor a 0
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //dibuja la imagen del background en el contexto
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height); /* */
        ctx.fillStyle = "white"; //Esto pinta el siguiente elemento marcador
        ctx.font = '50px Avenir'; //Esto define el tamaño y la letra del marcador
        ctx.fillText(Math.floor(frames / 60), this.width - 100, 50) //es un texto que cambia con los frames. /* */ No sé que significa en su totalidad.
    }
}

class IchigoMan {
    constructor() {
        this.x = 60; //posición x del elemento en el canvas
        this.y = 220; //posición y del elemento en el canvas
        this.width = 220; //ancho del elemento
        this.height = 250; //alto del elemento
        this.image = new Image(); /**/
        this.image.src = images.ichigoRun1; //ruta de la imagen que está en el objeto images
        this.image.onload = function () { //cuando se cargue la imagen:
            this.draw(); //ejecuta la función dibujar
        }.bind(this) //hace que la función dibujar comparta el mismo contexto que la que que se declara más adelante la clase, por lo tanto, la puede llamar.
        //this.gravity = .5; //asigna una variable que se llamará gravedad, la cual se usa más adelante.
    }

    jump() { //arreglar el salto /* */
        this.y -= 50;
        //this.y += this.gravity; Intenté usar la gravedad para bajar el objeto después del salto, pero aún no funciona
    }

    isTouching(item) { 
        return (this.x < item.x + item.width) &&
            (this.x + this.width > item.x) &&
            (this.y < item.y + item.height) &&
            (this.y + this.height > item.y);
    }

    draw() { 
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //dibuja la imagen en el canvas.
    }

}

class Gudetama {
    constructor(x = canvas.width/2) { //recibe el valor de x, porque se genera random en otra función, si no encuentra a x, le asigna a x el valor de la mitad del canvas.
        this.x = x; //X recibe una X del exterior
        this.y = 0; //la posición Y vale 0
        this.width = 100; // ancho del gudetama
        this.height = 100; // alto del gudetama
        this.image = new Image(); /* */
        this.image.src = randomGudetamaFalling; //recibe una imagen random de gudetama /* */
        this.image.onload = function () { //Cuando se carga la imagen completamente:
            this.draw(); //ejecuta la función dibujar
        }.bind(this) //pone el contenido de la función en el mismo contexto que el nivel arriba en el DOM
        this.gravity = 1.5; //se declara una variable gravedad, con el valor que se retoma más tarde.
    }
    draw() {
        this.y += this.gravity; //suma el valor de la variable gravedad a y, de esta manera y incrementa cada vez que se dibuja.
        this.x --; //resta 1 al valor de x, de esta manera, el objeto se dibuja cada vez más hacia la izquierda
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //dibuja la imagen
    }
}

//instances

var board = new Board(); /* */ //se crea una instancia para poder ejecutar las clases con sus constructores y funciones.
var ichigo1 = new IchigoMan();/* */

//mainFunctions

function update() { 
    frames++; //incrementa los frames
    ctx.clearRect(0, 0, canvas.width, canvas.height); //limpia el canvas
    board.draw(); //ejecuta la función draw, de la variable board, la cual contiene todo lo que está en la clase Board
    ichigo1.draw(); //ejecuta la función draw, de la variable ichigo1, la cual contiene todo lo que está en la clase IchigoMan
    
    imgGudetamaFalling();
    generateGudetamaFalling(); //ejecuta la función generar gudetamas cayendo
    drawGudetamas(); //ejecuta la función dibujar gudetamas que caen
}

function start() {
    if (interval) return; /* */
    interval = setInterval(update, 1000 / 60); //60 cuadros por segundo /* */
    sound.play() //ejecuta sonido
}

//aux functions

function imgGudetamaFalling() { //imagen random para gudetama cayendo
    randomGudetamaFalling = gudetamaFalling[Math.floor(gudetamaFalling.length * Math.random())]; //genera un número random para el índice del array de las imagenes de gudetamas
}
function imgGudetamaIntoTheFloor(){ //imagen random para gudetama en el piso
    randomGudetamaIntoTheFloor = gudetamaIntoTheFloor[Math.floor(gudetamaIntoTheFloor.length * Math.random())];
}
function imgGudetamaPushed() { //imagen random para gudetama tocado en el piso
    randomGudetamaPushed = gudetamaPushed[Math.floor(gudetamaPushed.length * Math.random())];
}

function generateGudetamaFalling() {

    if(frames % 100 === 0){ //Genera Gudetamas cada cierto tiempo, en este caso de 100 en 100 frames
        var x = Math.floor(Math.random() * (canvas.width-200) + canvas.width/2 ); //genera un valor random para que aparezca el nuevo gudetama.
        //la x puede salir desde la mitad de lo que mide el canvas, hasta 100 pixeles antes de su límite de ancho
        var g = new Gudetama(x); //Se crea una nueva instancia para generar gudetamas
        gudeTamas.push(g); //Los nuevos gudetamas se guardan en un array que está declarado como vacío al principio del código.
    }

}

function drawGudetamas(){ 
    gudeTamas.forEach(function(blissTama){ //recorre el array de los gudetamas creados por el método de instancia.
        blissTama.draw();//toma un elemento del array y lo dibuja.
    })
}

function finishHim() {
    clearInterval(interval); //detiene la función intervalo
    interval = undefined; /* */
    board.gameOver(); //ejecuta la función de la variable board que contiene la clase Board
    sound.pause(); //Detiene el sonido
    sound.currentTime = 0; /* */
}

function restart() {
    if (interval) return;
    pipes = [];
    frames = 0;
    ichigo1.x = 100;
    ichigo1.y = 100;
    start();
}

//listeners
addEventListener('keydown', function (e) {
    if (e.keyCode === 32) {
        ichigo1.jump();
        sound.play();
    } else if (e.keyCode === 27) {
        restart();
    }
})

start();
