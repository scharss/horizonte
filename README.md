# Calculadora de Alcance Visualde de la Curvatura de la Tierra

Esta es una aplicación web interactiva creada con la biblioteca [p5.js](https://p5js.org/) que simula y visualiza si un objeto distante es visible para un observador, teniendo en cuenta el efecto de la curvatura de la Tierra.

## ¿Qué hace la aplicación?

La aplicación permite al usuario ingresar:

1.  La distancia horizontal entre el observador y el objeto (en kilómetros).
2.  La altura del observador (en metros).
3.  La altura del objeto observado (en metros).

Al hacer clic en un botón, la aplicación calcula si, dada la curvatura de la Tierra, el objeto debería ser visible o estar oculto por el horizonte. El resultado del cálculo se muestra como un mensaje de texto claro ("¡Objeto VISIBLE!" o "¡Objeto OCULTO!") y se visualiza de forma simplificada en un diagrama.

## Características

*   Campos de entrada para distancia y alturas.
*   Botón para ejecutar el cálculo.
*   Diagrama visual que muestra una sección de la Tierra, un observador y un objeto.
*   La altura visual del objeto en el diagrama cambia para indicar si está oculto o visible según el cálculo.
*   Muestra la distancia de entrada y la "caída" aproximada de la curvatura a esa distancia.
*   Mensajes claros de resultado y de error en caso de entradas inválidas.
*   Diseño básico adaptable al tamaño de la ventana.

## Cómo usar

1.  Guarda el código P5.js en un archivo (por ejemplo, `sketch.js`).
2.  Crea un archivo `index.html` simple para cargar el script (asegúrate de incluir las bibliotecas p5.js y p5.dom.js). Puedes usar una plantilla básica de p5.js.
3.  Abre el archivo `index.html` en tu navegador web.
4.  Introduce los valores deseados en los campos de "Distancia (km)", "Altura Observador (m)" y "Altura Objeto (m)".
5.  Haz clic en el botón "Calcular Visibilidad".
6.  Observa el mensaje de resultado y cómo cambia la representación visual del objeto.

## Lógica del Cálculo Matemático

El cálculo se basa en el concepto de la "distancia al horizonte". La distancia al horizonte es la distancia máxima a la que un observador a una cierta altura puede ver la superficie de la Tierra antes de que la curvatura oculte lo que hay más allá.

La fórmula aproximada utilizada en este código para la distancia al horizonte (`d`) en kilómetros, dada una altura (`h`) en metros, es:

`d = 3.57 * sqrt(h)`

Este factor `3.57` deriva de usar el radio de la Tierra (aproximadamente 6371 km) y a menudo incluye una corrección estándar para tener en cuenta la refracción atmosférica, que hace que los objetos parezcan ligeramente más altos o más lejanos de lo que estarían en el vacío.

Para que un objeto sea visible sobre la curvatura de la Tierra, la distancia total entre el observador y el objeto (`distancia_ingresada`) debe ser menor o igual a la suma de la distancia al horizonte del observador (`d_observador`) y la distancia al horizonte del objeto (`d_objeto`).

**Condición de Visibilidad:**

`distancia_ingresada <= d_observador + d_objeto`

Donde:
*   `distancia_ingresada` es el valor que el usuario pone en el campo "Distancia (km)".
*   `d_observador = 3.57 * sqrt(altura_observador)` (con `altura_observador` en metros).
*   `d_objeto = 3.57 * sqrt(altura_objeto)` (con `altura_objeto` en metros).

Si la `distancia_ingresada` es mayor que la suma `d_observador + d_objeto`, el objeto se considera **OCULTO**.
Si la `distancia_ingresada` es menor o igual a la suma `d_observador + d_objeto`, el objeto se considera **VISIBLE**.

### Paso a Paso con Ejemplos

Vamos a usar ejemplos reales para ilustrar el cálculo.

**Ejemplo 1: Objeto Oculto (Persona mirando una colina baja lejana)**

*   **Inputs:**
    *   Distancia (km): `60`
    *   Altura Observador (m): `2` (Altura de los ojos)
    *   Altura Objeto (m): `200` (Altura de la colina por encima del terreno circundante)

*   **Cálculo:**
    1.  Calcular distancia al horizonte del observador (`d_observador`):
        `d_observador = 3.57 * sqrt(2)`
        `d_observador ≈ 3.57 * 1.414`
        `d_observador ≈ 5.05 km`

    2.  Calcular distancia al horizonte del objeto (`d_objeto`):
        `d_objeto = 3.57 * sqrt(200)`
        `d_objeto ≈ 3.57 * 14.142`
        `d_objeto ≈ 50.5 km`

    3.  Calcular la suma de las distancias al horizonte:
        `Suma_horizontes = d_observador + d_objeto`
        `Suma_horizontes ≈ 5.05 km + 50.5 km`
        `Suma_horizontes ≈ 55.55 km`

    4.  Comparar la distancia ingresada con la suma de los horizontes:
        `distancia_ingresada (60 km) > Suma_horizontes (55.55 km)`

*   **Resultado:** Como `60 > 55.55`, la condición de visibilidad (`<=`) es falsa. El objeto está **OCULTO**. El código mostrará "¡Objeto OCULTO!" y dibujará el objeto con su altura visual reducida.

**Ejemplo 2: Objeto Visible (Persona mirando un faro lejano)**

*   **Inputs:**
    *   Distancia (km): `18`
    *   Altura Observador (m): `2` (Altura de los ojos)
    *   Altura Objeto (m): `30` (Altura del faro)

*   **Cálculo:**
    1.  Calcular distancia al horizonte del observador (`d_observador`):
        `d_observador = 3.57 * sqrt(2)`
        `d_observador ≈ 5.05 km`

    2.  Calcular distancia al horizonte del objeto (`d_objeto`):
        `d_objeto = 3.57 * sqrt(30)`
        `d_objeto ≈ 3.57 * 5.477`
        `d_objeto ≈ 19.55 km`

    3.  Calcular la suma de las distancias al horizonte:
        `Suma_horizontes = d_observador + d_objeto`
        `Suma_horizontes ≈ 5.05 km + 19.55 km`
        `Suma_horizontes ≈ 24.6 km`

    4.  Comparar la distancia ingresada con la suma de los horizontes:
        `distancia_ingresada (18 km) <= Suma_horizontes (24.6 km)`

*   **Resultado:** Como `18 <= 24.6`, la condición de visibilidad (`<=`) es verdadera. El objeto es **VISIBLE**. El código mostrará "¡Objeto VISIBLE!" y dibujará el objeto con su altura visual completa.

## Consideraciones

*   La representación visual es simplificada y no escala linealmente la distancia de entrada. La distancia de entrada solo se utiliza para el *cálculo*.
*   El cálculo utiliza una fórmula aproximada y un valor estándar para la refracción atmosférica. Las condiciones reales pueden variar.
*   El código maneja entradas no numéricas o negativas mostrando un mensaje de error.

---

Este README explica qué hace tu aplicación, cómo funciona a alto nivel y detalla la lógica matemática detrás del cálculo de visibilidad, incluyendo ejemplos claros.
Use code with caution.
Markdown
