# Politica de seguridad

## Como reportar

Si encuentras una vulnerabilidad, reportala de forma **privada**:

- GitHub: *Security -> Report a vulnerability* en la pestana de advisories del repositorio
- Email: belentani7pedro@gmail.com

Incluye: descripcion, pasos para reproducir, impacto y, si es posible, una propuesta de fix.

## Que cuenta como vulnerabilidad

- Ejecucion de codigo arbitrario en el navegador a partir de entrada no confiable
- Inyeccion (XSS) por datos guardados o inyectados en el DOM
- Fuga de datos personales o de sesion
- Rutas que esquiven el mismo origen

## Que NO cuenta

- Uso previsto del sitio: es un proyecto publico por definicion
- Cabeceras ausentes que solo afectan a la puntuacion de un escaner
- Problemas sin impacto demostrable

## Plazos

| Prioridad | Confirmacion | Estado |
|---|---|---|
| Critica | 48 h | Fix o mitigacion publicada |
| Alta | 1 semana | Fix programado |
| Media / Baja | 1 mes | Confirmado y listado |

## Para quien contribuye

- No incluyas secretos en el codigo, los ejemplos ni los commits
- Documenta las variables con `.env.example`, nunca con valores reales
