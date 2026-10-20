# Motor GRC Nexus v1.19.1

Nexus usa un catálogo interno de frameworks, requisitos y controles. Los requisitos se conectan con capacidades unificadas mediante mappings. La organización evalúa la capacidad una sola vez y el resultado se reutiliza para los requisitos relacionados.

## Cadena
Empresa → contexto → marcos → requisitos → controles → madurez → cobertura → gaps → acciones.

## Madurez
0 No existe · 1 Inicial · 2 Gestionado · 3 Definido · 4 Medido · 5 Optimizado.

## Cobertura
Cada requisito se apoya en una o varias capacidades (relación N:M, `r.maps`) con un peso: 1 equivalencia plena, 0,5 cobertura parcial. Una capacidad aporta 1 si alcanza el nivel objetivo, 0,5 si tiene madurez inferior y 0 si no existe. La puntuación del requisito es la media ponderada multiplicada por el mayor peso de sus correspondencias, por lo que un requisito con solo correspondencias parciales nunca pasa de «parcial» salvo que se marque «Complemento específico implantado». Un requisito queda **cubierto** con puntuación 1, **parcial** si es mayor que 0 y **gap** si es 0.

## ENS
La categoría efectiva es la mayor entre la declarada y la que exigen los niveles por dimensión (C, I, D, A, T). Cada medida usa el nivel de sus dimensiones para decidir si se exige (`ensReqLevel`); si no se exige, se marca «no aplica».

## Equivalencias
La equivalencia es una relación funcional interna: varias necesidades de distintos marcos pueden representarse mediante una misma capacidad de gestión. No reproduce texto protegido de las normas.

## Validación
`node tools/check.js` comprueba coherencia del catálogo y renderiza todas las vistas.
