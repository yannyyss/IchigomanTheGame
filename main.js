//canvas
var canvas = document.getElementById('canvas'); //linkea el canvas del html 
var ctx = canvas.getContext('2d'); //genera una variable contexto que sirve como pincel
//constants
var interval; 
var frames = 0; //la variable frames empieza en cero.
var score = Math.floor(frames/60);
var gudeTamas = []; //array de nuevos gudetamas. Empieza vacío.
var nivel1 = true;

var images = {
    ichigoRun1: '../IchigoGame/images/running2.png',
    ichigoFall: '../IchigoGame/images/fall.png',
    ichigoJump: '../IchigoGame/images/jumping.png',
    ichigoPunched: '../IchigoGame/images/punched.png',
    ichigoDown: '../IchigoGame/images/down.png',
    ichigoDownLeft: '../IchigoGame/images/downleft.PNG',
    ichigoDownRight: '../IchigoGame/images/downrigth.png',
    kick: '../IchigoGame/images/kick1.png',
    huevito: '../IchigoGame/images/huevito.png',
    gojira1: '../IchigoGame/images/gojira1.png',
    gojira2: '../IchigoGame/images/gojira2.png',
    gojira3: '../IchigoGame/images/gojiradamage.png',
    laser: '../IchigoGame/images/laser.png',
    startGame: '../IchigoGame/images/StartPortada.png',
    gameOver: '../IchigoGame/images/gameover.png',
    youWon: '../IchigoGame/images/WonPortada.png',
    bg: '../IchigoGame/images/Background.png' //Es el background del videojuego
}

var gudetamaFalling = ['../IchigoGame/images/falling1.png','../IchigoGame/images/falling2.png','../IchigoGame/images/falling3.png'];
var gudetamaIntoTheFloor = ['../IchigoGame/images/floor1.png','../IchigoGame/images/floor2.png','../IchigoGame/images/floor3.png','../IchigoGame/images/floor4.png','../IchigoGame/images/floor5.png'];
var gudetamaPushed = ['../IchigoGame/images/pushed1.png','../IchigoGame/images/pushed2.png'];

//Sounds

var inicialSound = new Audio();
inicialSound.src = "../IchigoGame/sounds/Inicio.mp3";
inicialSound.loop = true;

var startSound = new Audio();
startSound.src = '../IchigoGame/sounds/InvincibleKitty.mp3';
startSound.loop = true;

var approachingBoss = new Audio();
approachingBoss.src = '../IchigoGame/sounds/ApproachingBoss.mp3';
approachingBoss.loop = true;

var gojiraSong = new Audio();
gojiraSong.src = '../IchigoGame/sounds/Gojira.mp3';
gojiraSong.loop = true;

var itaiSound = new Audio();
itaiSound.src = '../IchigoGame/sounds/itaisound.mp3';

//class

class Board { //Es el background del canvas
    constructor() {
        this.x = 0; //se posiciona en X 0
        this.y = 0; //se posiciona en Y 0
        this.width = canvas.width; //mide el ancho del canvas
        this.height = canvas.height; //mide el alto del canvas
        this.image = new Image(); /* */
        this.image.src = images.startGame; //selecciona la imágen background que está en el arreglo de images.
        this.image.onload = function () { 
            // Cuando se carga completamente la imagen:
            this.draw(); //ejecuta la función draw.
        }.bind(this) //pone la variable dray en el mismo contexto de lo que se encuentra en el siguiente nivel del DOM
    }
    iniciobg(){
        this.x = 0;
        this.y = 0;
        this.image.src = images.startGame;
    }
    bgCasitas(){
        this.x = 0;
        this.y = 0;
        this.image.src = images.bg;
    }
    bgYouWon() {
        this.x = 0;
        this.y = 0;
        this.image.src = images.youWon;
    }
    draw() { 
        //es la función que dibuja el background
        this.x--; //cada vez que dibuja, resta uno a x.
        if (this.x === -this.width) this.x = 0; // si x es menor que el ancho de la imagen, x cambia su valor a 0
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //dibuja la imagen del background en el contexto
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height); /* */
        ctx.fillStyle = "white"; //Esto pinta el siguiente elemento marcador
        ctx.font = '40px Avenir'; //Esto define el tamaño y la letra del marcador
        //ctx.fillText("Score" + Math.floor(frames / 60), this.width - 200, 50); //es un texto que cambia con los frames. /* */ No sé que significa en su totalidad.
    }
    gameOverScreen() { //es la función que termina el juego
        this.x = 0;
        this.y = 0;
        this.image.src = images.gameOver;
    }
}

class IchigoMan {
    constructor() {
        this.x = 60; //posición x del elemento en el canvas
        this.y = 200; //posición y del elemento en el canvas
        this.width = 190; //ancho del elemento
        this.height = 250; //alto del elemento
        this.health = 10;
        //this.kicking = false;
        this.image = new Image(); /**/
        this.image.src = images.ichigoRun1; //ruta de la imagen que está en el objeto images
        this.image.onload = function () { //cuando se cargue la imagen:
            this.draw(); //ejecuta la función dibujar
        }.bind(this) //hace que la función dibujar comparta el mismo contexto que la que que se declara más adelante la clase, por lo tanto, la puede llamar.
        this.gravity = 1; //asigna una variable que se llamará gravedad, la cual se usa más adelante.
    }
    receiveDamage(damage) {
        this.image.src = images.ichigoPunched;
        this.health -= damage;
        /* */ //Borrar current gudetama
        if (this.health > 0) {
          console.log("Has received " + damage + " points of damage");
        } else {
          console.log("Has died");
          gameOver();
        }
        return;
    }

    jump() { 
        this.image.src = images.ichigoJump;
        if (this.y <= 40) return;
        this.y -= 50;
    }
    moveDown() {
        this.image.src = images.ichigoDown;
        if (this.y > 255) return;
        this.y += 50; //disminuye y, mueve abajo
    }
    moveRight(){
        this.image.src = images.ichigoDownRight;
        if (this.x > canvas.width - (this.x - 590)) return;
        this.x += 50; //aumenta x, mueve a la derecha
    }
    moveLeft(){
        this.image.src = images.ichigoDownLeft;
        if (this.x < canvas.width - (this.x + 1003.5)) return;
        this.x -= 50; //disminuye x, mueve a la izquierda
    }
    kick(){
        this.image.src = images.kick; /**/ // Sólo cambia la imagen

    }
    draw() { 
        if(this.y > canvas.height - this.y) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //dibuja la imagen en el canvas.
        } else {
            this.y += this.gravity;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //dibuja la imagen en el canvas.
        }
    }

}

class Gudetama {
    constructor(x = canvas.width/2) { //recibe el valor de x, porque se genera random en otra función, si no encuentra a x, le asigna a x el valor de la mitad del canvas.
        this.x = x; //X recibe una X del exterior
        this.y = 0; //la posición Y vale 0
        this.width = 90; // ancho del gudetama
        this.height = 100; // alto del gudetama
        this.image = new Image(); /* */
        this.image.src = randomGudetamaFalling; //recibe una imagen random de gudetama /* */
        this.image.onload = function () { //Cuando se carga la imagen completamente:
            this.draw(); //ejecuta la función dibujar
        }.bind(this) //pone el contenido de la función en el mismo contexto que el nivel arriba en el DOM
        this.gravity = 1.5; //se declara una variable gravedad, con el valor que se retoma más tarde.
        this.randomNumber = 0; //genera un número random
        this.dontChange = false; //cambia la variable a falso. Esto sirve para el if, para evitar que genere más tamas de los necesarios.
        this.getRandomNumber(); //llama la función obtener un número random
    }

    getRandomNumber(){
        this.randomNumber = Math.floor(Math.random() * gudetamaIntoTheFloor.length); //genera un número random hasta el límite del array de imágenes de gudetama
    }
    checkFloor(){
        if(this.dontChange) return; //Esto falso la primera vez que entra el loop, a partir de la siguiente, se vuelve verdadero.
        if(this.y > canvas.height - 90) { //Si Y es mayor que lo que mide el canvas de alto, menos 100, ejecuta:
            this.width = 100; // ancho del gudetama
            this.height = 70; // alto del gudetama
            this.image.src = gudetamaIntoTheFloor[this.randomNumber]; //cambia la imágen de la clase por una random
            this.dontChange = true; //hace que la variable se vuelva true y no permite que vuelva a cambiar a falso.
        }
        //console.log(this.randomNumber);
    }
    
    draw() {
        if(this.y < canvas.height-90){
            this.y += this.gravity; //suma el valor de la variable gravedad a y, de esta manera y incrementa cada vez que se dibuja.
            this.x--; //resta 1 al valor de x, de esta manera, el objeto se dibuja cada vez más hacia la izquierda
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height); //dibuja la imagen
        } else{
           // this.y = canvas.height-100;
            this.x--;
            this.checkFloor();
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

class Gojira {
  constructor() {
    this.width = 300;
    this.height = 300;
    this.health = 3;
    this.x = canvas.width + 1600;
    this.y = canvas.height - 300;
    this.switch = true;
    this.imageHuevito = new Image();
    this.imageHuevito.src = images.huevito;
    this.image1 = new Image();
    this.image1.src = images.gojira1;
    this.image2 = new Image();
    this.image2.src = images.gojira2;
    this.image3 = new Image();
    this.image3.src = images.gojira3;
    this.drawable = this.imageHuevito;
    //this.image.src = images.huevito;
    this.drawable.onload = function() {
      this.draw();
    }.bind(this);
  }
  receiveDamage(damage) {
    //this.image.src = images.ichigoPunched;
    this.health -= damage; //Borrar current gudetama
      if (this.health > 0) {
      console.log("Gojira received " + damage + " points of damage");
      ctx.fillText("Gojira Lives " + gojira.health, this.x, this.y);
      this.drawable = this.image3;
      ctx.drawImage(this.drawable, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillText("Gojira has died " + gojira.health, this.x, this.y);
      console.log("Gojira has died");
      won();
    }
    return;
  }
  draw() {
    if (this.x < canvas.width - 280) {
      if (frames % 10 === 0) {
        this.switch = !this.switch;
        this.drawable = this.switch ? this.image1 : this.image2;
      }
      approachingBoss.pause();
      approachingBoss.currentTime = 0;
      gojiraSong.play();
      ctx.drawImage(this.drawable, this.x, this.y, this.width, this.height); //dibuja la imagen
    } else {
      this.x--;
      ctx.drawImage(this.drawable, this.x, this.y, this.width, this.height);
    }
  }
}

class Laser {
    constructor(){
        this.width = 197;
        this.height = 78;
        this.x = canvas.width/2;
        this.y = canvas.height-150;
        this.image = new Image();
        this.image.src = images.laser;
        this.image.onload = function () {
            this.draw();
        }.bind(this);

    }

    draw() {
        if (Math.floor(frames/60) > 40) {
            if(Math.floor(frames/60) % 2 === 0){
                this.x--;
                console.log("aquí toy");
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                if(this.x === 150){
                    this.x = canvas.width/2;
                }
            }
        }
    }
} 
class Vidas {
    constructor() {
        this.x = 20;
        this.y = 50;
    }
    draw() {
        console.log(ichigo1.health);
        ctx.fillText("Lives " + ichigo1.health, this.x, this.y);
        ctx.fillText("Score " + Math.floor(frames / 60), canvas.width - 200, 50); //es un texto que cambia con los frames. /* */ No sé que significa en su totalidad.
    }
}

//instances

var ichigo1 = new IchigoMan();/* */
var vida = new Vidas();
var gojira = new Gojira();
var laser = new Laser();
var board = new Board(); /* */ //se crea una instancia para poder ejecutar las clases con sus constructores y funciones.
//la instancia board se crea al final para que en la pantalla de inicio, cuando se pinta el canvas no se vean las demás imágenes.


//mainFunctions

function update() { 
    frames++; //incrementa los frames
    ctx.clearRect(0, 0, canvas.width, canvas.height); //limpia el canvas
    board.draw(); //ejecuta la función draw, de la variable board, la cual contiene todo lo que está en la clase Board
    ichigo1.draw(); //ejecuta la función draw, de la variable ichigo1, la cual contiene todo lo que está en la clase IchigoMan
    gojira.draw();
    vida.draw();
    laser.draw();

    imgGudetamaFalling();
    generateGudetamaFalling(); //ejecuta la función generar gudetamas cayendo
    drawGudetamas(); //ejecuta la función dibujar gudetamas que caen
    gudeTamas.forEach(function(g){
        isTouchingGudetama(ichigo1, g);
    });
    isTouchingLaser(ichigo1,laser);
    isTouchingGojira(ichigo1,gojira);
}

function inicio(){
    //inicialSound.play(); /* */ // No funciona
    board.iniciobg();
    addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 32:
                start();
                break;
}});}

function start() {
    //inicialSound.pause(); /* */ // No funciona
    //inicialSound.currentTime = 0; /* */ // No funciona
    board.bgCasitas();
    if (interval) return; /* */
    interval = setInterval(update, 1000 / 60); //60 cuadros por segundo /* */
    startSound.play(); //ejecuta sonido
}

function restart() {
    //bliss hack
    window.location.reload();
    if (nivel1 === false) {
        inicio();
        //if (interval) return;
        // gorija.x = canvas.width + 1600;
        // gojira.image3.src = images.gojira3;
        // gojira.health = 3;
        // gudeTamas = [];
        // frames = 0;
        // ichigo1.x = 100;
        // ichigo1.y = 100;
        // ichigo1.health = 6;


    }
}
function gameOver() {
  clearInterval(interval); //detiene la función intervalo
  interval = undefined; /* */
  board.gameOverScreen();
  inicialSound.pause(); //Detiene el sonido
  inicialSound.currentTime = 0; /* */
  startSound.pause();
  startSound.currentTime = 0;
  approachingBoss.pause();
  approachingBoss.currentTime = 0;
  gojiraSong.pause();
  gojiraSong.currentTime = 0;
  nivel1 = false;
  addEventListener("keydown", function(e) {
    switch (e.keyCode) {
      case 13:
        restart();
        break;
    }
  });

    saveScore();


}
function won() {
  clearInterval(interval); //detiene la función intervalo
  interval = undefined; /* */
  board.bgYouWon();
  inicialSound.pause(); //Detiene el sonido
  inicialSound.currentTime = 0; /* */
  startSound.pause();
  startSound.currentTime = 0;
  approachingBoss.pause();
  approachingBoss.currentTime = 0;
  gojiraSong.pause();
  gojiraSong.currentTime = 0;
  nivel1 = false;
  addEventListener("keydown", function(e) {
    switch (e.keyCode) {
      case 13:
        restart();
        break;
    }
  });

  saveScore();

}


function saveScore(){
    //obtenemos los anteriores
    var scores = localStorage.getItem('scores');
    if(!scores) scores = [];
    scores = JSON.parse(scores);
    //esto guarda:
    var bliss = Math.floor(frames / 60 + ichigo1.health);
    scores.push(bliss)
    scores = JSON.stringify(scores);
    localStorage.setItem('scores', scores);
    //esto saca del navegador

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

    if (frames % 100 === 0 && (Math.floor(frames / 60) < 29)){ //Genera Gudetamas cada cierto tiempo, en este caso de 100 en 100 frames
        var x = Math.floor(Math.random() * (canvas.width + 50)); //distancia en la que se generan en el canvas
        var g = new Gudetama(x); //Se crea una nueva instancia para generar gudetamas
        gudeTamas.push(g); //Los nuevos gudetamas se guardan en un array que está declarado como vacío al principio del código.
    } 
    
    if(Math.floor(frames/60) > 25){
        startSound.pause();
        startSound.currentTime = 0;
        approachingBoss.play();
    }
}

function drawGudetamas(){ 
    gudeTamas.forEach(function(tama){ //recorre el array de los gudetamas creados por el método de instancia.
        tama.draw();//toma un elemento del array y lo dibuja.
    })
}

function isTouchingGudetama(ichigo1,tama){
    if((ichigo1.x < tama.x + tama.width) &&
    (ichigo1.x + ichigo1.width > tama.x) &&
    (ichigo1.y < tama.y + tama.height) &&
    (ichigo1.y + ichigo1.height > tama.y)){
        itaiSound.play();
        var i = gudeTamas.indexOf(tama);
        gudeTamas = gudeTamas.filter(function (tama, index) {
            return index !== i;
        });
        ichigo1.receiveDamage(1);
    }
}

function isTouchingLaser(ichigo1,laser){
    if(Math.floor(frames/60) > 40){
        if ((ichigo1.x < laser.x + laser.width) &&
            (ichigo1.x + ichigo1.width > laser.x) &&
            (ichigo1.y < laser.y + laser.height) &&
            (ichigo1.y + ichigo1.height > laser.y)) {
                ichigo1.receiveDamage(1);
                laser.x = canvas.width / 2;//se borra
                //poner sonido
        }
    }
}

function isTouchingGojira(ichigo1,gorija){
    if (Math.floor(frames / 60) > 33) {
        if ((gojira.x < ichigo1.x + ichigo1.width) &&
            (gojira.x + gojira.width > ichigo1.x) &&
            (gojira.y < ichigo1.y + ichigo1.height) &&
            (gojira.y + gojira.height > ichigo1.y)) {
                ichigo1.x = 100;
                gojira.receiveDamage(1);
        }
    }
}


//listeners
addEventListener('keydown', function (e) {
    if(!interval) return;
    switch (e.keyCode) {
        case 38:
            ichigo1.jump();
            //sound.play();
            break;
        case 37:
            ichigo1.moveLeft();
            break;
        case 39:
            ichigo1.moveRight();
            break;
        case 40:
            ichigo1.moveDown();
            break;
        case 16:
            ichigo1.kick();
            break;
        case 32:
            start();
            break;
       // case 13:
         //   restart();
           // break;
    }
});

inicio();
