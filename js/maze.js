
$(document).ready(function () {
    const rows = 25; // Número de filas del laberinto
    const cols = 25; // Número de columnas del laberinto
    var audio = $("#musica-fondo")[0];//Sonido se va el bus
    var tiempo = 60;// Duración inicial en segundos 

    // Función para iniciar el contador regresivo
    function iniciarContador() {
        tiempo = 60;
        var intervalo = setInterval(function() {
            // Calcula minutos y segundos
            var minutos = Math.floor(tiempo / 60);
            var segundos = tiempo % 60;

            // Actualiza los elementos HTML con jQuery
            $('#minutos').text(minutos < 10 ? '0' + minutos : minutos);
            $('#segundos').text(segundos < 10 ? '0' + segundos : segundos);

            // Detener el temporizador cuando llegue a 0
            if (tiempo <= 0) {
                clearInterval(intervalo);
                audio.play();
                alert("¡El bus se ha ido!");
                
                generateMaze();
                iniciarContador();
                
            }

            // Resta un segundo
            tiempo--;
        }, 1000);
    }


    // Función para generar el laberinto
    function generateMaze() {
        // Limpiar el laberinto existente
        $("#maze").empty();

        // Establecer el tamaño del grid
        $("#maze").css({
            "grid-template-columns": `repeat(${cols}, 20px)`,
            "grid-template-rows": `repeat(${rows}, 20px)`
        });

        // Crear una matriz para representar el laberinto
        let maze = [];
        for (let i = 0; i < rows; i++) {
            maze[i] = [];
            for (let j = 0; j < cols; j++) {
                maze[i][j] = "wall"; // Inicialmente, todas las celdas son paredes
            }
        }

        // DFS para generar un camino en el laberinto
        function createPath(x, y) {
            maze[x][y] = "path"; // Marcar la celda actual como camino

            // Direcciones posibles: arriba, abajo, izquierda, derecha
            const directions = [
                [0, 1],  // derecha
                [1, 0],  // abajo
                [0, -1], // izquierda
                [-1, 0]  // arriba
            ];

            // Mezclar aleatoriamente las direcciones
            directions.sort(() => Math.random() - 0.5);

            // Intentar moverse en cada dirección
            for (let [dx, dy] of directions) {
                const newX = x + dx * 2;
                const newY = y + dy * 2;

                // Verificar que la nueva posición está dentro de los límites
                if (newX >= 1 && newX < rows && newY >= 1 && newY < cols) {
                    // Si la nueva posición es una pared, conectar las celdas
                    if (maze[newX][newY] === "wall") {
                        maze[x + dx][y + dy] = "path"; // Conectar las celdas
                        createPath(newX, newY); // Continuar el camino desde la nueva posición
                    }
                }
            }
        }



        // Iniciar DFS desde la celda (0, 0)
        createPath(1, 1);

        // Colocar la entrada y la salida
        maze[1][1] = "start";
        maze[rows - 2][cols - 2] = "end";

        // Generar el HTML del laberinto
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cell = $("<div>").addClass("cell");

                if (maze[i][j] === "start") {
                    cell.addClass("start active");
                } else if (maze[i][j] === "end") {
                    cell.addClass("end");
                } else if (maze[i][j] === "wall") {
                    cell.addClass("wall");
                }

                // Añadir la celda al contenedor del laberinto
                $("#maze").append(cell);
            }
        }
    }

    // Función para mover al jugador
    function movePlayer(newPosition) {
        if (!newPosition.hasClass("wall")) {
            $(".active").removeClass("active");
            newPosition.addClass("active");

            // Verificar si llegó a la salida
            if (newPosition.hasClass("end")) {
                audio.play();
                alert("¡Felicidades! Has alcanzado al bus del SETP."); 
                generateMaze();
                iniciarContador()
                
            }
        }
    }

    // Control del teclado para mover al jugador
    $(document).keydown(function (e) {
        let currentPosition = $(".active");
        let currentIndex = currentPosition.index();
        let newPosition;

        switch (e.which) {
            case 37: // Izquierda
                newPosition = currentPosition.prev();
                break;
            case 38: // Arriba
                newPosition = $("#maze .cell").eq(currentIndex - cols);
                break;
            case 39: // Derecha
                newPosition = currentPosition.next();
                break;
            case 40: // Abajo
                newPosition = $("#maze .cell").eq(currentIndex + cols);
                break;
            default:
                return; // Ignorar otras teclas
        }

        // Mover al jugador si la nueva posición no es una pared
        if (newPosition && newPosition.length) {
            movePlayer(newPosition);
        }

        e.preventDefault(); // Prevenir desplazamiento de página
    });

    // Iniciar el contador al cargar la página
    iniciarContador();
    // Generar el laberinto al cargar la página
    generateMaze();

    // Generar un nuevo laberinto al hacer clic en el botón
    $("#generateMaze").click(function () {
        generateMaze();
        iniciarContador();
    });
});
