var rankingdiv:any = document.getElementById("ranking");
var menu:any = document.getElementById("menu");
var juegodiv:any = document.getElementById("juego");
var tablero:any = document.getElementById("tablero");
var tabla:any = document.getElementById("ranking");
var nombre:any = document.getElementById("name");
var over:any = document.getElementById("over");
var win:any = document.getElementById("win");
var countdown:any = document.getElementById("countdown");
var intentos:any = document.getElementById("intentos");
var tabla:any = document.getElementById("tabla");
var local:number = 0;
var intentosRestantes = 0;
var bomba:number = 0;
var counter:number = 0;
var counter2:number = 0;

const buscaminas:any = {
    numMinasTotales: 0,
    numMinasEncontradas: 0,
    numFilas: 12,
    numColumnas: 12,
    aCampoMinas: []
}

function juego(){
    juegodiv.style.display = "block";
    menu.style.display = "none";
    over.style.display = "none";
    win.style.display = "none";
    buscaminas.numMinasTotales = numMinas();

    // Borramos campo antiguo
    while (tablero.firstChild) {
        tablero.removeChild(tablero.firstChild);
    }

    bomba = buscaminas.numMinasTotales;

    //Iniciamos contador a 30 segundos 
    var timeleft = buscaminas.numMinasTotales * 30;
    var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
        clearInterval(downloadTimer);
        countdown.innerHTML = "Tiempo agotado";
        over.style.display = "block";
        juegodiv.style.display = "none";
    }
    else {
        countdown.innerHTML = timeleft + " segundos restantes";
    }
    timeleft -= 1;
    }, 1000);

    //Mostramos intentos restantes
    intentosRestantes = buscaminas.numMinasTotales * 3;
    intentos.innerHTML = "Intentos restantes: " + intentosRestantes;

    pintarTablero();
    generarCampoMinasVacio();
    esparcirMinas();
}


function generarCampoMinasVacio(){
    //generamos el campo de minas en el objeto buscaminas
    for (let i = 0; i < buscaminas.numFilas; i++) {
        buscaminas.aCampoMinas[i] = [];
        for (let j = 0; j < buscaminas.numColumnas; j++) {
            buscaminas.aCampoMinas[i][j] = 0;
        }
    }
}

function pintarTablero(){
    for(let i = 0; i < buscaminas.numFilas; i++){
        for(let j = 0; j < buscaminas.numColumnas; j++){
            //Creamos un div para cada celda con onclick="comprovar()"
            var celda = document.createElement("div");
            celda.setAttribute("id", i + "-" + j);
            celda.setAttribute("onclick", "comprovar(this)");
            celda.setAttribute("class", "celda");
            tablero.appendChild(celda);
        }
    }
}

function esparcirMinas(){
    //repartimos de forma aleatoria las minas
    let numMinasEsparcidas = 0;
    
    while (numMinasEsparcidas<buscaminas.numMinasTotales){
        //numero aleatorio en el intervalo [0,numFilas-1]
        let fila = Math.floor(Math.random() * buscaminas.numFilas);
        
        //numero aleatorio en el intervalo [0,numColumnas-1]
        let columna = Math.floor(Math.random() * buscaminas.numColumnas);
        
        //si no hay bomba en esa posicion
        if (buscaminas.aCampoMinas[fila][columna] != "B"){
            //la ponemos
            buscaminas.aCampoMinas[fila][columna] = "B";
 
            //y sumamos 1 a las bombas esparcidas
            numMinasEsparcidas++;
        }
    }
}

//Cojemos value del select y lo retornamos para meter en una variable
function numMinas(){
    var select:any = document.getElementById("bombas");
    var cant = select.options[select.selectedIndex].value;
    return cant;
}

// Funcion para ver si hay bomba en la posicion clickada
function verSiHayBomba(fila:any, columna:any){
    if (buscaminas.aCampoMinas[fila][columna] == "B"){
        return true;
    }else{
        return false;
    }
}

// Funcion para comprobar si hay bomba en la posicion clickada
function comprovar(celda:any){
    //Cogemos id de la celda clickada
    var id = celda.id;
    //Separamos fila y columna
    var fila = id.split("-")[0];
    var columna = id.split("-")[1];
    var localstorage = 0;
    //Se suma 1 al contador
    counter++;
    intentosRestantes--;
    intentos.innerHTML = "Intentos restantes: " + intentosRestantes;
    if (bomba > 0) {
        
        if (intentosRestantes > 0){
            //Comprobamos si hay bomba
            if (verSiHayBomba(fila, columna)){
                //Si hay bomba, se acaba el juego
                celda.setAttribute("class", "celda-roja");
                bomba--;
                // alert("Has perdido"); 
            }else{
                //Si no, se pone la celda en verde
                
                celda.setAttribute("class", "celda-verde");
            }
        }else{
            //Mostramos game over
            over.style.display = "block";
            juegodiv.style.display = "none";

            if (nombre.value == "") {
                nombre.value = "Anonimo";
            }
                
            var puntuacion = {
                nombre: nombre.value,
                bombas: buscaminas.numMinasTotales,
                intentos: counter,
                victoria: "No"
            }
            localStorage.setItem("puntuacion" + local, JSON.stringify(puntuacion));
            localstorage++;
            local = localstorage;
        }
    }
    else{
        //Mostramos Win
        win.style.display = "block";
        juegodiv.style.display = "none";
        //Guardamos la puntuacion en localstorage
        if (nombre.value == "") {
            nombre.value = "Anonimo";
        }
            
        var puntuacion = {
            nombre: nombre.value,
            bombas: buscaminas.numMinasTotales,
            intentos: counter,
            victoria: "Si"
        }
        localStorage.setItem("puntuacion" + local, JSON.stringify(puntuacion));
        localstorage++;
        local = localstorage;
    }
}

function reiniciar(){
    //Recargamos la pagina
    location.reload();
    juegodiv.style.display = "none";
    rankingdiv.style.display = "none";
    menu.style.display = "block";
}

function verRankings() {
    juegodiv.style.display = "none";
    rankingdiv.style.display = "block";
    menu.style.display = "none";
    over.style.display = "none";
    win.style.display = "none";

    // Mostramos los datos del localstorage
    for (let i = 0; i < local; i++) {
        
        let puente:any = localStorage.getItem("puntuacion" + i);
        var puntuacion:any = JSON.parse(puente); 
        var nombre = puntuacion.nombre;
        var bombas = puntuacion.bombas;
        var intentos = puntuacion.intentos;
        var victoria = puntuacion.victoria;
    
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
    
        td1.innerHTML = "Nombre: " + nombre;
        td2.innerHTML = "Bombas: " + bombas;
        td3.innerHTML = "Numero Intentos: " + intentos;
        td4.innerHTML = "Victoria: " + victoria;
    
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
    
        tabla.appendChild(tr);
    }
}