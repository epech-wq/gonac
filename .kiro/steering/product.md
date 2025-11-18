# 🧠 Lógica del Producto — Caso Piloto Gonac (Supercito)

## 1. Definición del Problema Central

El problema no es la falta de datos, sino la **fricción operativa** causada por la **falta de automatización** en la ejecución comercial.

**Problema principal:**  
El Director Comercial (Israel Vargas) actúa como KAM de la cuenta crítica _Supercito_, pero su gestión manual basada en BI reactivo provoca:

- Pérdida de rentabilidad por **caducidades inminentes**.
- **Oportunidades de venta perdidas** (productos secos).
- Falta de un **mecanismo de seguimiento efectivo** para el equipo de campo.

---

## 2. Contexto Operativo y Fricción Actual

**Cuenta crítica:** Lanzamiento de 9 SKUs en 127 tiendas Supercito.

**Proceso actual:**

1. Israel filtra manualmente datos de Sell-In, Sell-Out e Inventario en el BI.
2. Identifica problemas por experiencia (sin venta, lento movimiento, quiebre).
3. Envía instrucciones vagas a su equipo (“visitar tiendas que no venden”).
4. No hay seguimiento; las correcciones son **reactivas e inefectivas**.

---

## 3. Datos Clave

| Atributo                | Dato                                                               | Impacto                                                |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| **Fuente**              | Plataforma BI (Sell-In, Sell-Out, Inventario)                      | Fuente principal de datos para VEMIO                   |
| **Escala**              | 127 tiendas, 9 SKUs, $1.3MM MXN inversión                          | Escenario manejable para piloto                        |
| **Venta (Sell-Out)**    | $120,619 MXN (9.3% del total al 22/oct)                            | Base para proyecciones                                 |
| **Caducidad (CRÍTICO)** | Producción en octubre, vence primera semana de febrero (~100 días) | La métrica clave es **VAR (Vida de Anaquel Restante)** |

---

## 4. Job to be Done

**Objetivo de Israel Vargas:**  
Asegurar la rentabilidad del lanzamiento **sin consumir su tiempo personal**.

**Job Story:**

> “Cuando un lanzamiento ocurre sin un KAM asignado, necesito un sistema que me alerte de riesgos de stock y caducidad, genere tareas específicas para mi equipo y me permita monitorear resultados sin entrar al BI.”

**KPIs:**

1. Maximizar Sell-Out
2. Minimizar “Secos” (OOS)
3. Minimizar caducados

---

## 5. Solución Propuesta — VEMIO

**VEMIO = KAM Virtual + Motor de Inteligencia y Ejecución**

Transforma el BI reactivo en un sistema de **acción estratégica**:

- 🔍 **Análisis profundo:** Detecta problemas y oportunidades SKU/categoría.
- 🧠 **Detección inteligente:** Monitoreo 24/7 de tiendas vs. VAR y rotación.
- 🧾 **Traducción a tareas:** Cada alerta se convierte en tarea con instrucciones precisas.
- ✅ **Cierre de ciclo:** Panel de tareas para medir ejecución e impacto.

---

## 6. Generación de Insights Estratégicos (VEMIO Discovery)

VEMIO utiliza datos históricos + exógenos para generar aprendizaje estratégico.

- **Correlación Venta–Contexto:** Cruza Sell-Out con datos demográficos y de ubicación.
- **Análisis de Ejecución:** Evalúa impacto de variables de campo (anaquel, caras, exhibición).
- **Patrones de Categoría:** Alerta desviaciones de venta por SKU vs. histórico.

---

## 7. Plan Táctico y Estratégico

### A. Detección Inteligente y Generación de Acciones

| Condición                              | Acción Generada                              |
| -------------------------------------- | -------------------------------------------- |
| SKU con performance < 80% del promedio | Impulso de categoría de bajo rendimiento     |
| Tienda sin ventas (<5% en 10 días)     | Visita y validación de exhibición            |
| Inventario < 10 días y rotación alta   | Reorden sugerido al CEDI                     |
| VAR < 70 días y rotación insuficiente  | Tarea de mitigación + análisis de causa raíz |

---

### B. Ejecución y Asignación

1. Cada acción genera una **tarea automática**.
2. La tarea incluye:
   - Diagnóstico probable de causa raíz (ej. ubicación deficiente, precio incorrecto, sin promoción).
   - Instrucciones detalladas de ejecución (negociar cabecera, revisar señalética, impulsar degustación).
3. **Cierre con evidencia fotográfica** o confirmación de campo.

---

### C. Recomendaciones Estratégicas de Inventario

**1. Correctivo inmediato:**  
Reubicar inventario de tiendas lentas a tiendas “hot” para optimizar días de inventario.

**2. Predictivo (futuro):**  
VEMIO usará históricos de ventas por categoría y demografía para generar **surtidos iniciales personalizados**.

---

## 8. Métricas de Éxito (ROI)

| Métrica                        | Meta                                   | Valor Esperado               |
| ------------------------------ | -------------------------------------- | ---------------------------- |
| **Productividad del Director** | Reducir monitoreo diario de 60 → 5 min | Ahorro de horas hombre       |
| **Pérdida por Caducidad**      | <2% del inventario total               | Protección de $1.3MM MXN     |
| **Ejecución (TCT)**            | ≥95% cierre de tareas                  | Validación efectiva de campo |

---

## 🎯 Conclusión

La página debe estar en español.

> “VEMIO le da control total de su cuenta sin robarle tiempo.  
> Automatiza el análisis, diagnóstico y asignación de tareas precisas,  
> garantizando la rentabilidad del lanzamiento y estableciendo  
> una metodología superior de ejecución comercial.”

---
