# Tribu Calculator

Calculadora de porción diaria para perros, diseñada para ayudar a los tutores a estimar la cantidad recomendada de alimento según el perfil de la mascota y la etapa de vida.

## ¿Qué problema resuelve?

Muchas personas quieren alimentar bien a su perro, pero no siempre saben cuánta cantidad es adecuada. La decisión suele depender de varios factores: peso, edad, esterilización y nivel de actividad. Esta app simplifica ese cálculo y entrega una recomendación clara y práctica para elegir la porción correcta.

## ¿Por qué esta herramienta genera valor?

- Ahorra dudas y estimaciones a ojo.
- Personaliza la recomendación por cada perro.
- Ayuda a entender si la mascota está en etapa de cachorro o adulto.
- Sugiere la cantidad diaria y la presentación más útil del producto.
- Está pensada para la marca Tribu Natural de La Sabana, con enfoque en una experiencia útil y amigable.

## Funcionalidades principales

- Formulario guiado paso a paso.
- Captura del nombre del tutor y de la mascota.
- Selección de raza, edad y peso.
- Diferenciación entre cachorro y adulto.
- Ajuste según esterilización.
- Ajuste según nivel de actividad.
- Cálculo estimado de gramos diarios.
- Recomendación de porciones por comida.
- Sugerencia de presentaciones de producto disponibles.

## Cómo funciona

La calculadora usa una lógica de estimación basada en energía metabólica y en factores de ajuste según la etapa del perro:

- Cachorro temprano: mayor demanda calórica.
- Cachorro tardío: demanda elevada, pero menor que en la primera etapa.
- Adulto: ajuste por esterilización y actividad física.

El cálculo final convierte esa necesidad energética en gramos recomendados diarios y los distribuye en comidas al día.

## Flujo de uso

1. Ingresa tu nombre y el nombre de tu perro.
2. Completa la raza, edad y peso.
3. Indica si está esterilizado.
4. Selecciona el nivel de actividad.
5. La app calcula la cantidad diaria recomendada.
6. Te muestra la cantidad por comida y la presentación del producto más conveniente.

## Estructura del proyecto

- `index.html`: estructura principal de la interfaz.
- `styles.css`: estilos visuales de la aplicación.
- `script.js`: lógica del cálculo, validaciones y render del resultado.
- `images/`: recursos visuales y branding.

## Cómo ejecutar el proyecto localmente

Como es una aplicación estática, puedes abrir el archivo HTML directamente en el navegador o ejecutarlo con un servidor local.

### Opción recomendada

```bash
python -m http.server 8000
```

Luego abre en el navegador:

```text
http://localhost:8000
```

## Objetivo del proyecto

Este proyecto no solo entrega una calculadora, sino una experiencia útil para acompañar decisiones de alimentación de perros de manera más informada, clara y cercana a la marca.

## Próximos pasos posibles

- Añadir cálculo de peso ideal por raza.
- Mostrar recomendaciones más detalladas por tipo de alimento.
- Incluir historial de cálculos.
- Mejorar la segmentación por categorías de perros.
- Agregar soporte para más tipos de mascotas.

## Contribución

Si quieres colaborar:

1. Haz un fork del proyecto.
2. Crea una rama para tu mejora.
3. Realiza cambios con foco en utilidad y experiencia de usuario.
4. Envía un pull request con una descripción clara.

## Nota

Esta app está orientada a ofrecer una recomendación orientativa y no reemplaza la evaluación profesional de un veterinario ni la guía específica del fabricante del alimento.
