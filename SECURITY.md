# Politica de seguridad

## Que reportar

Si encuentras una vulnerabilidad en este repositorio, reportala de forma **privada**:

- GitHub: *Security -> Report a vulnerability* (pestana de advisories del repositorio)
- Email: belentani7pedro@gmail.com

Incluye: descripcion, pasos para reproducir, impacto y, si es posible, una propuesta de fix.

## Que se considera vulnerabilidad

- Ejecucion de codigo arbitrario en el navegador a partir de entrada no confiable
- Inyeccion (XSS) por datos guardados o inyectados en el DOM
- Fuga de datos personales o de sesion
- Rutas que esquiven el mismo origen

## Que NO se considera vulnerabilidad

- Uso previsto de la aplicacion (este proyecto es un sitio publico)
- Ausencia de cabeceras que solo afectan a la puntuacion de un escaner
- Problemas sin impacto demostrable

## Tiempo de respuesta

| Prioridad | Confirmacion | Estado |
|---|---|---|
| Critica | 48 h | Fix o mitigacion publicada |
| Alta | 1 semana | Fix scheduled |
| Media / Baja | 1 mes | Confirmado y listado |

## Buenas practicas para Reporting

- No incluyas secretos en el codigo, ni en ejemplos, ni en commits
- Usa `.env.example` para documentar variables, nunca con valores reales
- Reporta lo que encaje en "Que se considera vulnerabilidad"
