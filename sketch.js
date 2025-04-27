let distancia;
let alturaObservador;
let alturaObjeto;
let escalaVisual = 1;
// Ya no escalamos la altura directamente para el dibujo de las figuras,
// usamos tamaños visuales fijos o condicionales.
// escalaAlturaVisual = 20; // Comentamos o eliminamos esta línea si no se usa más para el dibujo directo

let objetoOculto = false;
let mensajeVisibilidad = ''; // Se usará para mostrar el resultado o mensajes de error
let radioVisualTierra = 400; // Representa el radio de la Tierra escalado en píxeles
const RADIO_REAL_TIERRA_KM = 6371; // Radio real de la Tierra en km
let centroX, centroY;

let inputDistancia, inputAlturaObservador, inputAlturaObjeto, botonCalcular;

function setup() {
  // Aumentamos el tamaño del lienzo para dar espacio a los controles y el dibujo
  createCanvas(windowWidth, windowHeight);

  // Posición del centro de la circunferencia de la Tierra en el lienzo
  centroX = width / 2;
  // Ajustamos centroY para que el arco de la Tierra esté por debajo de los controles.
  centroY = 600;

  // Creamos elementos de entrada y botón DOM
  // Los posicionamos explícitamente dentro del área del lienzo (relativo al body)
  // Usamos position() para colocarlos en la esquina superior izquierda del lienzo

  // Posición para la etiqueta dibujada y el campo de entrada de Distancia
  let inputDistanciaY = 20;
  inputDistancia = createInput('');
  inputDistancia.position(200, inputDistanciaY); // Posicionamos a la derecha de la etiqueta
  inputDistancia.attribute('placeholder', 'km');
  inputDistancia.size(100); // Ajustar tamaño

  // Posición para la etiqueta dibujada y el campo de entrada de Altura Observador
  let inputAlturaObservadorY = 50;
  inputAlturaObservador = createInput('');
  inputAlturaObservador.position(200, inputAlturaObservadorY); // Posicionamos a la derecha de la etiqueta
  inputAlturaObservador.attribute('placeholder', 'm');
  inputAlturaObservador.size(100); // Ajustar tamaño

  // Posición para la etiqueta dibujada y el campo de entrada de Altura Objeto
  let inputAlturaObjetoY = 80;
  inputAlturaObjeto = createInput('');
  inputAlturaObjeto.position(200, inputAlturaObjetoY); // Posicionamos a la derecha de la etiqueta
  inputAlturaObjeto.attribute('placeholder', 'm');
  inputAlturaObjeto.size(100); // Ajustar tamaño

  // Posición para el botón
  let botonCalcularY = 110;
  botonCalcular = createButton('Calcular Visibilidad');
  botonCalcular.position(200, botonCalcularY); // Posicionamos debajo de los campos
  botonCalcular.mousePressed(calcularVisibilidadVisual);
  botonCalcular.size(150); // Ajustar tamaño

  // Configuración de texto global para el canvas
  textSize(12);

  // Detenemos el bucle draw() inicialmente.
  noLoop();
}

function draw() {
  background(220); // Dibuja el fondo en cada frame

  // --- Dibujar elementos estáticos (siempre visibles) ---

  // Dibujar etiquetas para los campos de entrada en el canvas
  fill(0);
  textAlign(RIGHT, CENTER); // Alineamos el texto a la derecha y centrado verticalmente
  let labelX = 190; // Posición X para el final de las etiquetas
  let estimatedInputHeight = 25; // Usamos una altura estimada para los inputs

  text("Distancia (km):", labelX, inputDistancia.y + estimatedInputHeight / 2);
  text("Altura Observador (m):", labelX, inputAlturaObservador.y + estimatedInputHeight / 2);
  text("Altura Objeto (m):", labelX, inputAlturaObjeto.y + estimatedInputHeight / 2);

  // Restaurar alineación de texto por defecto
  textAlign(LEFT, TOP);
  fill(0); // Restaurar color de relleno para texto

  // Dibujar la media circunferencia de la Tierra (parte superior)
  stroke(0);
  noFill();
  // Dibujamos el arco de -PI a 0 (la parte superior del círculo).
  arc(centroX, centroY, radioVisualTierra * 2, radioVisualTierra * 2, -PI, 0);

  // --- Dibujar elementos dinámicos (solo después de un cálculo válido) ---

  // Guardamos el estado inicial de las variables numéricas antes del cálculo
  // para saber si se actualizaron con valores válidos.
  let distanciaValida = !isNaN(distancia);
  let alturaObservadorValida = !isNaN(alturaObservador);
  let alturaObjetoValida = !isNaN(alturaObjeto);

  // Solo dibujamos las figuras, líneas y textos adicionales si los valores son válidos
  if (distanciaValida && alturaObservadorValida && alturaObjetoValida) {

    // --- Calcular Posiciones VISUALES para el Dibujo ---
    // NOTA: Estas posiciones son para el diseño visual y no están estrictamente
    // escaladas a la 'distancia' de entrada. La 'distancia' de entrada SÓLO
    // se usa para el cálculo de visibilidad.

    // Posición horizontal fija para el observador (a la izquierda del centro)
    let observadorBaseX = centroX - 80; // Ajusta este valor para mover al observador
    // Calcular la posición vertical (Y) en la curva del arco para este X
    let observadorBaseY = centroY - sqrt(max(0, radioVisualTierra * radioVisualTierra - (observadorBaseX - centroX) * (observadorBaseX - centroX)));
    // Calcular el ángulo radial en la base del observador (necesario para la orientación del objeto si está rotado)
    let observadorAngulo = atan2(observadorBaseY - centroY, observadorBaseX - centroX);


    // Posición horizontal fija para el objeto (a la derecha del centro)
    let objetoBaseX = centroX + 150; // Ajusta este valor para mover el objeto
     // Calcular la posición vertical (Y) en la curva del arco para este X
    let objetoBaseY = centroY - sqrt(max(0, radioVisualTierra * radioVisualTierra - (objetoBaseX - centroX) * (objetoBaseX - centroX)));
     // Calcular el ángulo radial en la base del objeto (necesario para la orientación del objeto)
    let anguloObjeto = atan2(objetoBaseY - centroY, objetoBaseX - centroX);


    // --- Dibujar las figuras y elementos ---

    // Dibujar al observador (rectángulo negro de tamaño fijo) y obtener la posición de su "ojo"
    let obsEyeCoords = drawObserver(observadorBaseX, observadorBaseY); // Ya no pasamos alturaObservador para el tamaño visual

    // Dibujar el objeto (rectángulo rojo inclinado con altura visual condicional)
    // drawObject rota para estar de pie sobre la curva y AJUSTA SU ALTURA VISUAL
    // según si está oculto o visible.
    drawObject(objetoBaseX, objetoBaseY, anguloObjeto, objetoOculto); // Ya no pasamos alturaObjeto para el tamaño visual

    // Dibujar la línea visual del observador (horizontal azul) - empieza desde las coordenadas del ojo
    // Esta línea es SÓLO la horizontal local del observador para referencia.
    // No representa la línea de visión real al objeto.
    drawObserverLineOfSight(obsEyeCoords.x, obsEyeCoords.y);

    // Dibujar las etiquetas principales "Observador" y "Objeto observado"
    fill(0); // Texto negro
    textSize(12);
    textAlign(CENTER, TOP); // Alinear el centro horizontal del texto con el punto base, y la parte superior del texto con la Y
    text("Observador", observadorBaseX, observadorBaseY + 10); // Posicionado debajo de la base del observador
    text("Objeto observado", objetoBaseX, objetoBaseY + 10); // Posicionado debajo de la base del objeto


    // Mostrar información de texto adicional (Distancia Input y Caída)
    fill(0);
    textAlign(LEFT, TOP); // Restaurar alineación para esta área
    let infoTextY = 150; // Posición Y para la primera línea de info
    text(`Distancia (input): ${distancia.toFixed(2)} km`, 20, infoTextY);
    text(`Caída (aprox): ${0.0785 * pow(distancia, 2).toFixed(2)} m`, 20, infoTextY + 20); // Segunda línea 20px más abajo

    // **NUEVA POSICIÓN:** Mostrar el mensaje de visibilidad justo debajo de la caída
    if (mensajeVisibilidad !== '') { // Solo dibujar si hay un mensaje establecido
        if (objetoOculto) {
            fill(255, 0, 0); // Rojo para oculto
        } else {
            fill(0, 100, 0); // Verde para visible
        }
        textSize(20); // Tamaño de texto más grande para el resultado principal
        textAlign(LEFT, TOP); // Alineación LEFT, TOP
        text(mensajeVisibilidad, 20, infoTextY + 40); // 40px debajo de la primera línea de info (20px debajo de la caída)
        textSize(12); // Restaurar tamaño de texto
    }

  } else if (mensajeVisibilidad !== '') {
      // **POSICIÓN PARA MENSAJE DE ERROR:** Si los datos NO son válidos pero hay un mensaje (de error)
      fill(255, 0, 0); // Rojo para errores
      textSize(20); // Tamaño de texto más grande para el error
      textAlign(LEFT, BOTTOM); // Alinear a la parte inferior izquierda
      text(mensajeVisibilidad, 20, height - 10); // Mostrar en la parte inferior
      textSize(12); // Restaurar tamaño de texto
      textAlign(LEFT, TOP); // Restaurar alineación
  }
   // Si no hay datos válidos Y no hay mensaje (estado inicial), no se dibuja nada dinámico.
}

// Función para dibujar el observador (rectángulo negro vertical de tamaño fijo)
// baseX, baseY: Coordenadas en la superficie de la Tierra escalada donde están los pies
// Devuelve las coordenadas (x, y) del "ojo" del observador (parte superior central)
function drawObserver(baseX, baseY) {
  push(); // Guardar la configuración de estilo de dibujo actual

  let fixedVisualHeight = 50; // Altura visual fija del observador en píxeles
  let obsWidth = 15; // Ancho del rectángulo del observador en píxeles
  let topY = baseY - fixedVisualHeight; // La parte superior está verticalmente encima de la base en coords de pantalla

  // Dibujar el rectángulo del observador
  fill(0); // Negro
  noStroke();
  // rect(x, y, width, height) - y es la esquina superior izquierda
  rect(baseX - obsWidth / 2, topY, obsWidth, fixedVisualHeight);

  pop(); // Restaura la configuración de estilo de dibujo anterior

  // Devolver las coordenadas de la parte superior central (ojo) para la línea de visión
  return { x: baseX, y: topY };
}

// Función para dibujar el objeto (rectángulo rojo inclinado)
// Ajusta su altura visual según si está oculto o visible.
// baseX, baseY: Coordenadas en la superficie de la Tierra escalada donde está la base
// angle: Ángulo radial (en radianes) desde el centro de la Tierra al punto base
// isHidden: Booleano que indica si el objeto está oculto según el cálculo
function drawObject(baseX, baseY, angle, isHidden) {
  push(); // Guardar la configuración de estilo de dibujo actual

  let objectWidth = 25; // Ancho del rectángulo del objeto en píxeles
  let visualHeight; // La altura que realmente vamos a dibujar

  if (isHidden) {
      // Si está oculto, dibujamos un objeto corto
      visualHeight = 20; // Altura visual fija cuando está oculto (en píxeles)
  } else {
      // Si está visible, dibujamos un objeto más alto que debería
      // interceptar o superar la línea horizontal del observador
      visualHeight = 70; // Altura visual fija cuando está visible (en píxeles)
      // Ajustar visualHeight si 70px no parece suficiente para cruzar la horizontal
      // en las posiciones fijas actuales. Puede ser necesario un valor mayor.
      // O si queremos que sea justo por encima, quizás ~60px dependiendo de la escala general.
      // Experimenta con este valor:
      // visualHeight = 60; // O prueba con este valor
  }


  // Para que el objeto esté "de pie" sobre la curva, debemos rotarlo
  // de modo que su eje vertical coincida con la línea radial desde el centro de la Tierra.
  // El ángulo radial es 'angle'. El ángulo perpendicular a la superficie (para la orientación "arriba") es angle + HALF_PI.
  // Vamos a rotar el lienzo en torno a la base del objeto.
  translate(baseX, baseY); // Mover el origen al punto base del objeto
  rotate(angle + HALF_PI); // Rotar el lienzo para alinear el eje Y local con la línea radial

  // Dibujar el rectángulo del objeto. Ahora, el eje Y local apunta radialmente hacia afuera.
  // Dibujamos el rectángulo con su base en (0,0) y extendiéndose hacia arriba (en el eje Y local).
  // rect(x, y, width, height) - y es la esquina superior izquierda.
  // Queremos que la base central esté en (0,0), así que la esquina superior izquierda será (-objectWidth/2, -visualHeight).
  fill(255, 0, 0); // Rojo
  noStroke();
  rect(-objectWidth / 2, -visualHeight, objectWidth, visualHeight);

  pop(); // Restaura la configuración de estilo de dibujo anterior
}

// Función para dibujar la línea visual horizontal del observador
// startX, startY: Coordenadas de inicio de la línea (ojo del observador)
function drawObserverLineOfSight(startX, startY) {
    push();
    stroke(0, 0, 255); // Línea azul
    strokeWeight(1);
    let lineLength = 300; // Longitud de la línea horizontal en píxeles
    line(startX, startY, startX + lineLength, startY); // Línea recta horizontal hacia la derecha

    // Dibujar la etiqueta para la línea
    fill(0, 0, 255); // Texto azul
    textSize(12);
    textAlign(LEFT, BOTTOM); // Alinear el texto para que su esquina inferior izquierda esté en el punto
    text("Línea visual del observador", startX, startY - 5); // Posicionar ligeramente encima de la línea
    pop();
}


function calcularVisibilidadVisual() {
  // Obtenemos los valores de los campos de entrada
  distancia = parseFloat(inputDistancia.value());
  alturaObservador = parseFloat(inputAlturaObservador.value());
  alturaObjeto = parseFloat(inputAlturaObjeto.value());

  // Validamos las entradas
  if (isNaN(distancia) || isNaN(alturaObservador) || isNaN(alturaObjeto) || distancia < 0 || alturaObservador < 0 || alturaObjeto < 0) {
    mensajeVisibilidad = 'Error: Ingrese valores numéricos válidos y no negativos.';
    objetoOculto = true; // Considerar como oculto en caso de error (para el color del mensaje)
    // Reiniciamos las variables numéricas a undefined
    // para que el bloque de dibujo de figuras en draw() no se ejecute.
    distancia = undefined; // Reset these to make the drawing condition false
    alturaObservador = undefined;
    alturaObjeto = undefined;

    // No llamamos a redraw aquí, draw() se llamará después por el loop (aunque noLoop() esté activado)
    // o en la siguiente llamada a redraw() causada por un input válido.
    // La lógica en draw ahora maneja el mensaje de error cuando los inputs son NaN.

  } else {
     // Si los inputs son válidos, procedemos con el cálculo
     // Determinamos si el objeto está oculto basado en la distancia combinada al horizonte.
     // La distancia al horizonte para una altura h (en metros) es aprox d = 3.57 * sqrt(h) km.
     // La distancia combinada al horizonte para observador y objeto es d_obs + d_obj.
     // Si la distancia entre ellos es mayor que esta suma, están ocultos.

     let distHorizonteObservador = 3.57 * sqrt(alturaObservador); // Distancia al horizonte para el observador en km
     let distHorizonteObjeto = 3.57 * sqrt(alturaObjeto); // Distancia al horizonte para el objeto en km

     if (distancia > (distHorizonteObservador + distHorizonteObjeto)) {
       objetoOculto = true;
       mensajeVisibilidad = '¡Objeto OCULTO!';
     } else {
       objetoOculto = false;
       mensajeVisibilidad = '¡Objeto VISIBLE!';
     }
     // Los valores de distancia, alturaObservador, alturaObjeto son válidos y se mantienen.
     // Esto permitirá que el bloque de dibujo de figuras en draw() se ejecute.
  }

  // Llamamos a redraw() al final de la función de cálculo.
  // Esto fuerza a draw() a ejecutarse una vez para actualizar la pantalla
  // con las nuevas variables de estado (mensajeVisibilidad, objetoOculto,
  // y las variables numéricas que controlan el dibujo de figuras).
  redraw();
}

// Se llama automáticamente cuando la ventana se redimensiona
function windowResized() {
  // Redimensiona el canvas para que coincida con el nuevo tamaño de la ventana
  resizeCanvas(windowWidth, windowHeight);
  // Recalcula el centro horizontal del canvas
  centroX = width / 2;
  // centroY se mantiene fijo en 600px desde arriba
  // Forzar un redibujo para actualizar los elementos en las nuevas dimensiones
  redraw();
}