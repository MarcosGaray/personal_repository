# Juego de Memoria

1) El tablero consiste en una cuadrícula de 4x4 'tarjetas'
2) Cada tarjeta tiene una imagen diferente en el 'frente', y todas tienen la misma imagen en el 'dorso'
3) Inicialmente todas las tarjetas muestran la misma imagen (el 'dorso' de la tarjeta)
4) Cuando se hace click sobre una tarjeta, se muestra la imagen de 'frente'
5) Cuando se descubren dos tarjetas, si las imágenes son iguales se quedan mostrando el frente y ya no responden al Click
6) Si se descubren dos tarjetas diferentes, se espera unos segundos y volver a ponerlas 'boca abajo' mostrando el dorso 
7) Si quedan parejas sin descubrir, volver al punto 4

### Final del juego
Se lleva cuenta de los intentos _fallidos_. Si se llega a una cantidad determinada (15), se pierde el juego. Si se descubren todas las tarjetas antes de llegar a la cantidad de errores permitida, se gana la partida.

El acierto consecutivo de pares de tarjetas generará multiplicadores de combo para aumentar el puntaje. Los errores descuentan puntos.


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Memory game

1) The board consists of a grid of 4x4 'cards'
2) Each card has a different image on the 'front', and they all have the same image on the 'back'
3) Initially all cards show the same image (the 'back' of the card)
4) When you click on a card, the 'front' image is displayed
5) When two cards are revealed, if the images are the same, they remain showing the front and no longer respond to Click
6) If two different cards are revealed, wait a few seconds and turn them 'face down' again, showing the back.
7) If there are undiscovered pairs, return to point 4

### Game over
_Failed_ attempts are counted. If a certain amount is reached (15), the game is lost. If all the cards are revealed before reaching the allowed number of errors, the game is won.

Consecutive matching of pairs of cards will generate combo multipliers to increase the score. Errors deduct points.