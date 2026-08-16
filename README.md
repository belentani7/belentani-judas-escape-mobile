# BELENTANI / JUDAS / LIGHT ROOM

Experiencia privada de escape room movil en HTML, CSS y JavaScript.

## Recorrido

1. Umbral: el primer gesto inicia el audio espacial.
2. Archivo: encontrar ESPEJO, HILO ROJO y LLAVE.
3. Caja de luz: repetir la secuencia ROJO, ORO, AZUL, BLANCO.
4. Señal: mover el dedo para desplazar la luz y el campo sonoro.
5. Cierre narrativo.

## Ejecutar

Abrir `index.html` en un navegador moderno. Para una prueba local fiable:

```powershell
python -m http.server 5520 --directory .
```

Abrir `http://127.0.0.1:5520/`.

El audio incluido es una copia privada de la demo local de Judas. No se ha subido ni publicado.

## Verificacion

- Mobile viewport: `390x844`.
- Touch targets: botones principales >= 44 px.
- Audio: `MediaElementSource` + `PannerNode` HRTF, activado tras gesto del usuario.
- Estado: reiniciable desde el wordmark o el cierre.
