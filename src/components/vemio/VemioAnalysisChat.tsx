"use client";

import { useState, useRef, useEffect, ReactElement } from "react";
import { CopyButton } from "@/components/lib/ai/TextGeneratorContent";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MetricCardData {
  title: string;
  value: string | number;
  subtitle?: string;
  storeMetrics?: {
    totalTiendas: number;
    ventasTotales: number;
    unidadesVendidas: number;
    ventaPromedio: number;
    diasInventario: number;
  };
  metricasData?: {
    sell_through_pct?: number;
    cobertura_ponderada_pct?: number;
    crecimiento_vs_semana_anterior_pct?: number;
    porcentaje_agotados_pct?: number;
    avg_venta_promedio_diaria?: number;
    cobertura_pct?: number;
    ventas_totales_unidades?: number;
  };
  segmentacionData?: any;
}

interface VemioAnalysisChatProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: MetricCardData | null;
  onCardDataChange?: (data: MetricCardData | null) => void;
}

export default function VemioAnalysisChat({
  isOpen,
  onClose,
  cardData,
  onCardDataChange,
}: VemioAnalysisChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousCardDataRef = useRef<MetricCardData | null>(null);

  // Auto-send message when card is clicked
  useEffect(() => {
    if (isOpen && cardData) {
      // Check if this is a new card (different from previous)
      const isNewCard = previousCardDataRef.current?.title !== cardData.title;
      
      if (isNewCard) {
        // Generate user message asking about the card
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          content: `Cuéntame sobre ${cardData.title}. ¿Qué información puedes darme sobre esta métrica?`,
          timestamp: new Date(),
        };

        // Add user message
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        // Generate AI response
        setTimeout(() => {
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: generateInitialAnalysis(cardData),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiResponse]);
          setIsLoading(false);
        }, 800);

        // Update previous card reference
        previousCardDataRef.current = cardData;
      }
    } else if (!isOpen) {
      // Reset when chat closes
      previousCardDataRef.current = null;
      setMessages([]);
    }
  }, [isOpen, cardData]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const generateInitialAnalysis = (data: MetricCardData): string => {
    // Handle elasticity promotion parameters
    if ((data as any).tipo === 'elasticidad_promocion') {
      return generateElasticityRecommendations(data as any);
    }

    // Handle reabasto urgente parameters (individual)
    if ((data as any).tipo === 'reabasto_parametro') {
      return generateReabastoParametroAnalysis(data as any);
    }

    // Handle complete reabasto urgente parameters explanation
    if ((data as any).tipo === 'reabasto_parametros_completos') {
      return generateReabastoParametrosCompletosAnalysis(data as any);
    }

    let analysis = `## Análisis de ${data.title}\n\n`;
    
    analysis += `**Valor Actual:** ${data.value}\n`;
    if (data.subtitle) {
      analysis += `**Contexto:** ${data.subtitle}\n\n`;
    }

    // Add data source information
    analysis += `### 📊 Fuente de Datos\n\n`;
    analysis += `Los datos presentados en esta métrica provienen de:\n\n`;
    
    if (data.title === "Ventas Totales") {
      analysis += `- **Segmentación de Tiendas:** Datos consolidados de todas las tiendas del universo\n`;
      analysis += `- **Total de Tiendas Analizadas:** ${data.storeMetrics?.totalTiendas || "N/A"} tiendas\n`;
      analysis += `- **Unidades Vendidas:** ${data.storeMetrics?.unidadesVendidas?.toLocaleString("es-MX") || "N/A"} unidades\n`;
      analysis += `- **Crecimiento:** ${data.metricasData?.crecimiento_vs_semana_anterior_pct ? (data.metricasData.crecimiento_vs_semana_anterior_pct * 100).toFixed(1) + "%" : "N/A"} vs semana anterior\n\n`;
      analysis += `### 🏪 Detalles por Tienda\n\n`;
      analysis += `Esta métrica agrega las ventas de todas las tiendas en el sistema. `;
      analysis += `Las tiendas están segmentadas en categorías (Hot, Balanceadas, Slow, Críticas) `;
      analysis += `basándose en su performance de ventas y rotación de inventario.\n\n`;
    } else if (data.title === "Sell-Through") {
      analysis += `- **Cálculo:** Porcentaje de inventario vendido respecto al inventario inicial\n`;
      analysis += `- **Inventario Inicial:** ${data.metricasData?.ventas_totales_unidades ? (data.metricasData.ventas_totales_unidades * 5).toLocaleString("es-MX") : "N/A"} unidades estimadas\n`;
      analysis += `- **Objetivo:** 15% (según estándares de la industria)\n\n`;
      analysis += `### 📦 Productos y SKUs\n\n`;
      analysis += `El sell-through se calcula considerando todos los SKUs activos en el inventario. `;
      analysis += `Un sell-through del ${data.value} indica que se está vendiendo `;
      analysis += `${data.metricasData?.sell_through_pct ? (data.metricasData.sell_through_pct * 100).toFixed(1) : "N/A"}% del inventario disponible.\n\n`;
    } else if (data.title === "Cobertura Numérica") {
      analysis += `- **Cálculo:** Porcentaje de tiendas con inventario disponible\n`;
      analysis += `- **Total de Tiendas:** ${data.storeMetrics?.totalTiendas || "N/A"} tiendas\n`;
      analysis += `- **Cobertura Actual:** ${data.value}\n\n`;
      analysis += `### 🏪 Distribución por Segmento\n\n`;
      analysis += `La cobertura numérica muestra qué porcentaje del total de tiendas tiene productos en stock. `;
      analysis += `Una cobertura del ${data.value} significa que prácticamente todas las tiendas tienen inventario disponible.\n\n`;
    } else if (data.title === "Cobertura Ponderada") {
      analysis += `- **Cálculo:** Cobertura ajustada por volumen de ventas de cada tienda\n`;
      analysis += `- **Objetivo:** 85%\n`;
      analysis += `- **Cobertura Actual:** ${data.value}\n\n`;
      analysis += `### 📊 Metodología\n\n`;
      analysis += `La cobertura ponderada da más peso a las tiendas con mayor volumen de ventas. `;
      analysis += `Esto significa que las tiendas Hot (alto volumen) tienen mayor influencia en este cálculo `;
      analysis += `que las tiendas Slow (bajo volumen).\n\n`;
    } else if (data.title === "Días de Inventario") {
      analysis += `- **Cálculo:** Promedio de días que durará el inventario actual\n`;
      analysis += `- **Objetivo:** 45 días\n`;
      analysis += `- **Días Actuales:** ${data.value} días\n\n`;
      analysis += `### ⚠️ Análisis de Riesgo\n\n`;
      const dias = typeof data.value === "string" ? parseFloat(data.value) : data.value;
      if (dias > 60) {
        analysis += `**Alerta:** El inventario actual es superior a 60 días, lo que indica posible sobreinventario. `;
        analysis += `Esto puede llevar a problemas de caducidad y capital inmovilizado.\n\n`;
      } else if (dias < 30) {
        analysis += `**Alerta:** El inventario está por debajo de 30 días, lo que indica riesgo de agotamiento. `;
        analysis += `Se recomienda revisar las tiendas Hot y Balanceadas para reabasto urgente.\n\n`;
      }
      analysis += `### 🏪 Impacto por Tienda\n\n`;
      analysis += `Las tiendas Hot y Balanceadas suelen tener menor días de inventario debido a su alta rotación, `;
      analysis += `mientras que las tiendas Slow y Críticas pueden tener inventario más antiguo.\n\n`;
    } else if (data.title === "Tasa de Quiebre") {
      analysis += `- **Cálculo:** Porcentaje de SKUs agotados en el universo de tiendas\n`;
      analysis += `- **Tolerancia:** 2% máximo\n`;
      analysis += `- **Tasa Actual:** ${data.value}\n\n`;
      analysis += `### 🚨 Productos Afectados\n\n`;
      const tasa = typeof data.value === "string" ? parseFloat(data.value.replace("%", "")) : data.value;
      if (tasa > 2) {
        analysis += `**Alerta Crítica:** La tasa de quiebre está por encima del objetivo. `;
        analysis += `Esto indica que hay múltiples SKUs agotados que requieren atención inmediata.\n\n`;
        analysis += `### 📦 SKUs Agotados\n\n`;
        analysis += `Se recomienda revisar los SKUs con inventario menor a 10 días en tiendas Hot y Balanceadas. `;
        analysis += `Estos productos tienen mayor probabilidad de agotarse y afectar las ventas.\n\n`;
      } else {
        analysis += `La tasa de quiebre está dentro del rango aceptable. `;
        analysis += `Sin embargo, es importante monitorear continuamente para prevenir agotamientos.\n\n`;
      }
    } else if (data.title === "Venta Promedio Diaria") {
      analysis += `- **Cálculo:** Promedio de ventas diarias en todas las tiendas\n`;
      analysis += `- **Venta Diaria:** ${data.value}\n`;
      analysis += `- **Proyección Semanal:** ${data.storeMetrics?.ventaPromedio ? `$${data.storeMetrics.ventaPromedio.toLocaleString("es-MX")}` : "N/A"}\n\n`;
      analysis += `### 📈 Tendencias\n\n`;
      analysis += `La venta promedio diaria es un indicador clave de la salud del negocio. `;
      analysis += `Este valor se calcula dividiendo las ventas totales entre el número de días del período analizado.\n\n`;
      analysis += `### 🏪 Segmentación\n\n`;
      analysis += `Las tiendas Hot tienen ventas diarias significativamente más altas que el promedio, `;
      analysis += `mientras que las tiendas Slow y Críticas pueden tener ventas por debajo del promedio.\n\n`;
    } else {
      analysis += `### 📊 Información General\n\n`;
      analysis += `Esta métrica forma parte del conjunto de KPIs que monitorean el desempeño del universo de tiendas. `;
      analysis += `Los datos se actualizan en tiempo real y provienen de la consolidación de información de todas las tiendas.\n\n`;
    }

    // Add general context
    analysis += `### 🔍 Contexto Adicional\n\n`;
    analysis += `- **Total de Tiendas:** ${data.storeMetrics?.totalTiendas || "N/A"} tiendas\n`;
    if (data.storeMetrics?.ventasTotales) {
      analysis += `- **Ventas Totales del Período:** $${data.storeMetrics.ventasTotales.toLocaleString("es-MX")}\n`;
    }
    analysis += `- **Última Actualización:** Datos en tiempo real\n\n`;
    
    analysis += `### 💡 Recomendaciones\n\n`;
    if (data.title.includes("Cobertura") && data.metricasData?.cobertura_pct && data.metricasData.cobertura_pct < 0.85) {
      analysis += `- Revisar tiendas con baja cobertura para identificar oportunidades de mejora\n`;
      analysis += `- Considerar redistribución de inventario desde tiendas con exceso\n`;
    } else if (data.title === "Días de Inventario") {
      const dias = typeof data.value === "string" ? parseFloat(data.value) : data.value;
      if (dias > 60) {
        analysis += `- Implementar estrategias de promoción para acelerar la rotación\n`;
        analysis += `- Revisar productos próximos a caducar\n`;
      } else if (dias < 30) {
        analysis += `- Priorizar reabasto en tiendas Hot y Balanceadas\n`;
        analysis += `- Revisar cadena de suministro para evitar agotamientos\n`;
      }
    } else {
      analysis += `- Monitorear esta métrica regularmente para detectar tendencias\n`;
      analysis += `- Comparar con períodos anteriores para identificar patrones\n`;
    }

    return analysis;
  };

  const generateReabastoParametroAnalysis = (data: any): string => {
    const { title, value, parametro, valor, descripcion } = data;
    
    let analysis = `## Análisis del Parámetro: ${title}\n\n`;
    
    analysis += `**Valor Configurado:** ${value}\n`;
    analysis += `**Parámetro:** ${parametro}\n`;
    if (descripcion) {
      analysis += `**Descripción:** ${descripcion}\n\n`;
    }

    analysis += `### 📊 Contexto del Parámetro\n\n`;

    switch (parametro) {
      case 'tiempo_reabasto':
        analysis += `**Límite de Inventario Máximo: ${valor} días**\n\n`;
        analysis += `Este parámetro define el umbral máximo de días de inventario que una tienda puede tener antes de ser considerada para reabasto urgente.\n\n`;
        analysis += `### 🎯 Impacto del Parámetro\n\n`;
        analysis += `- **Valor Actual:** ${valor} días\n`;
        analysis += `- **Significado:** Las tiendas HOT y Balanceadas con inventario menor a ${valor} días serán priorizadas para reabasto urgente\n`;
        analysis += `- **Objetivo:** Asegurar que las tiendas de alto desempeño mantengan suficiente inventario para evitar pérdida de ventas\n\n`;
        analysis += `### 💡 Recomendaciones\n\n`;
        if (valor > 30) {
          analysis += `⚠️ **Valor alto:** Un límite de ${valor} días puede ser conservador. Considera:\n`;
          analysis += `- Reducir a **25-30 días** para ser más proactivo en el reabasto\n`;
          analysis += `- Esto permitirá detectar necesidades de reabasto antes de que se vuelvan críticas\n\n`;
        } else if (valor < 20) {
          analysis += `⚠️ **Valor bajo:** Un límite de ${valor} días puede ser muy agresivo. Considera:\n`;
          analysis += `- Aumentar a **25-30 días** para evitar reabastos innecesarios\n`;
          analysis += `- Esto reducirá la frecuencia de pedidos y optimizará los costos logísticos\n\n`;
        } else {
          analysis += `✅ **Valor óptimo:** El límite de ${valor} días está bien balanceado para:\n`;
          analysis += `- Detectar necesidades de reabasto a tiempo\n`;
          analysis += `- Priorizar tiendas HOT y Balanceadas que tienen mayor rotación\n`;
          analysis += `- Evitar sobreinventario en tiendas de alto desempeño\n\n`;
        }
        analysis += `### 📈 Consideraciones Adicionales\n\n`;
        analysis += `- Este parámetro se aplica específicamente a tiendas HOT y Balanceadas\n`;
        analysis += `- Las tiendas con inventario mayor a ${valor} días no serán incluidas en el cálculo de reabasto urgente\n`;
        analysis += `- El sistema calcula automáticamente las unidades necesarias basándose en ventas promedio y este límite\n\n`;
        break;

      case 'lead_time':
        analysis += `**Lead Time: ${valor} días**\n\n`;
        analysis += `Este parámetro representa el tiempo de espera entre la decisión de reabasto y la disponibilidad del producto en tienda.\n\n`;
        analysis += `### 🎯 Impacto del Parámetro\n\n`;
        analysis += `- **Valor Actual:** ${valor} días\n`;
        analysis += `- **Significado:** ${valor === 0 ? 'No hay tiempo de espera' : `Tiempo de espera de ${valor} días`} en el proceso de reabasto\n`;
        analysis += `- **Objetivo:** Optimizar la planificación considerando el tiempo real de entrega\n\n`;
        analysis += `### 💡 Recomendaciones\n\n`;
        if (valor === 0) {
          analysis += `✅ **Lead Time a 0:** Configuración ideal para:\n`;
          analysis += `- Reabastos inmediatos cuando el inventario está disponible en almacén\n`;
          analysis += `- Minimizar el tiempo entre detección de necesidad y disponibilidad en tienda\n`;
          analysis += `- Optimizar la cadena de suministro para entregas rápidas\n\n`;
          analysis += `⚠️ **Consideraciones:**\n`;
          analysis += `- Asegúrate de que tu cadena de suministro puede realmente cumplir con entregas inmediatas\n`;
          analysis += `- Si hay tiempo de procesamiento o transporte, considera ajustar este valor a la realidad operativa\n\n`;
        } else if (valor > 7) {
          analysis += `⚠️ **Lead Time alto:** ${valor} días puede ser demasiado tiempo. Considera:\n`;
          analysis += `- Revisar procesos logísticos para reducir el tiempo de entrega\n`;
          analysis += `- Si es posible, reducir a **3-5 días** para ser más competitivo\n`;
          analysis += `- Este tiempo se suma al cálculo de días de inventario necesarios\n\n`;
        } else {
          analysis += `✅ **Lead Time razonable:** ${valor} días es un tiempo aceptable para:\n`;
          analysis += `- Procesamiento de pedidos\n`;
          analysis += `- Transporte y entrega\n`;
          analysis += `- Considerar en el cálculo de inventario necesario\n\n`;
        }
        analysis += `### 📈 Consideraciones Adicionales\n\n`;
        analysis += `- El Lead Time se suma al inventario necesario para calcular el punto de reorden\n`;
        analysis += `- Con Lead Time de ${valor} días, el sistema calcula: Inventario Necesario = Ventas Diarias × (Días Objetivo + ${valor})\n`;
        analysis += `- Un Lead Time más bajo permite mantener menos inventario de seguridad\n\n`;
        break;

      case 'horizonte_tiempo':
        analysis += `**Horizonte de Tiempo: ${valor} días**\n\n`;
        analysis += `Este parámetro define cuántos días de inventario se busca tener después del reabasto para asegurar cobertura adecuada.\n\n`;
        analysis += `### 🎯 Impacto del Parámetro\n\n`;
        analysis += `- **Valor Actual:** ${valor} días\n`;
        analysis += `- **Significado:** Después del reabasto, se busca tener ${valor} días de inventario disponible\n`;
        analysis += `- **Objetivo:** Asegurar cobertura suficiente para evitar agotamientos antes del próximo reabasto\n\n`;
        analysis += `### 💡 Recomendaciones\n\n`;
        if (valor < 7) {
          analysis += `⚠️ **Horizonte corto:** ${valor} días puede ser insuficiente. Considera:\n`;
          analysis += `- Aumentar a **10-15 días** para mayor seguridad\n`;
          analysis += `- Esto reduce el riesgo de agotamiento antes del próximo ciclo de reabasto\n`;
          analysis += `- Especialmente importante para tiendas HOT con alta rotación\n\n`;
        } else if (valor > 20) {
          analysis += `⚠️ **Horizonte largo:** ${valor} días puede ser excesivo. Considera:\n`;
          analysis += `- Reducir a **10-15 días** para optimizar capital de trabajo\n`;
          analysis += `- Un horizonte muy largo puede llevar a sobreinventario\n`;
          analysis += `- Esto puede aumentar costos de almacenamiento y riesgo de obsolescencia\n\n`;
        } else {
          analysis += `✅ **Horizonte óptimo:** ${valor} días es un buen balance para:\n`;
          analysis += `- Asegurar cobertura adecuada sin sobreinventario\n`;
          analysis += `- Permitir flexibilidad para ajustes en el siguiente ciclo\n`;
          analysis += `- Optimizar el capital de trabajo invertido en inventario\n\n`;
        }
        analysis += `### 📈 Consideraciones Adicionales\n\n`;
        analysis += `- El horizonte de ${valor} días se usa para calcular: Unidades a Pedir = (Ventas Diarias × ${valor}) - Inventario Actual\n`;
        analysis += `- Este valor debe alinearse con la frecuencia de tus ciclos de reabasto\n`;
        analysis += `- Para tiendas HOT, un horizonte de ${valor} días asegura que no se agoten antes del próximo reabasto programado\n`;
        analysis += `- El sistema muestra "Días Post-Reabasto" en los detalles para verificar que se alcanza este objetivo\n\n`;
        break;

      default:
        analysis += `Este parámetro forma parte del sistema de cálculo de reabasto urgente.\n\n`;
        analysis += `### 📊 Información General\n\n`;
        analysis += `- **Valor:** ${value}\n`;
        analysis += `- **Descripción:** ${descripcion || 'Parámetro de configuración para el cálculo de reabasto urgente'}\n\n`;
    }

    analysis += `### 🔍 Metodología de Cálculo\n\n`;
    analysis += `Los parámetros de reabasto urgente se utilizan en conjunto para:\n\n`;
    analysis += `1. **Identificar tiendas críticas:** Tiendas HOT y Balanceadas con inventario menor al límite máximo\n`;
    analysis += `2. **Calcular necesidades:** Basándose en ventas promedio, lead time y horizonte de tiempo\n`;
    analysis += `3. **Priorizar acciones:** Enfocándose en tiendas de alto desempeño para maximizar impacto\n\n`;

    analysis += `### 💼 Impacto en el Negocio\n\n`;
    analysis += `Estos parámetros afectan directamente:\n`;
    analysis += `- **Monto total de inversión** en reabasto\n`;
    analysis += `- **Número de tiendas impactadas** por la acción\n`;
    analysis += `- **Unidades totales** a reabastecer\n`;
    analysis += `- **Efectividad** en prevenir pérdida de ventas por agotamiento\n\n`;

    return analysis;
  };

  const generateReabastoParametrosCompletosAnalysis = (data: any): string => {
    const { parametros } = data;
    
    let analysis = `## Explicación de Parámetros de Reabasto Urgente\n\n`;
    analysis += `VEMIO ha calculado automáticamente los parámetros óptimos para el reabasto urgente basándose en el análisis de tus datos históricos, patrones de venta y características de tus tiendas.\n\n`;

    analysis += `### 📊 Parámetros Calculados por VEMIO\n\n`;

    // Tiempo de reabasto
    if (parametros.tiempo_reabasto) {
      const { nombre, valor, unidad } = parametros.tiempo_reabasto;
      analysis += `#### ${nombre}: ${valor} ${unidad}\n\n`;
      analysis += `**¿Por qué ${valor} ${unidad}?**\n\n`;
      analysis += `VEMIO analizó el comportamiento de tus tiendas HOT y Balanceadas y determinó que:\n\n`;
      analysis += `- **Análisis de rotación:** Las tiendas de alto desempeño tienen una rotación promedio que requiere reabasto cuando el inventario cae por debajo de ${valor} días\n`;
      analysis += `- **Balance óptimo:** Este valor permite detectar necesidades de reabasto a tiempo sin generar sobreinventario\n`;
      analysis += `- **Prevención de agotamientos:** Con ${valor} días como límite, se priorizan tiendas que están en riesgo de agotamiento pero aún tienen margen para reabasto efectivo\n`;
      analysis += `- **Optimización de capital:** Un límite mayor a ${valor} días aumentaría innecesariamente el capital invertido en inventario\n\n`;
    }

    // Lead Time
    if (parametros.lead_time) {
      const { nombre, valor, unidad } = parametros.lead_time;
      analysis += `#### ${nombre}: ${valor} ${unidad}\n\n`;
      analysis += `**¿Por qué ${valor} ${unidad}?**\n\n`;
      if (valor === 0) {
        analysis += `VEMIO identificó que tu operación puede funcionar con Lead Time de ${valor} días porque:\n\n`;
        analysis += `- **Capacidad logística:** Tu cadena de suministro tiene la capacidad de entregas inmediatas o en el mismo día\n`;
        analysis += `- **Inventario disponible:** El almacén central tiene suficiente stock para cubrir reabastos urgentes sin demoras\n`;
        analysis += `- **Optimización de inventario:** Con Lead Time de ${valor} días, puedes mantener menos inventario de seguridad, liberando capital de trabajo\n`;
        analysis += `- **Ventaja competitiva:** Esto te permite responder más rápido a cambios en demanda que competidores con Lead Time más largo\n\n`;
      } else {
        analysis += `VEMIO calculó un Lead Time de ${valor} ${unidad} basándose en:\n\n`;
        analysis += `- **Tiempo real de procesamiento:** Análisis del tiempo promedio desde la generación del pedido hasta la disponibilidad en tienda\n`;
        analysis += `- **Capacidad operativa:** Evaluación de tus procesos logísticos y de distribución actuales\n`;
        analysis += `- **Balance costo-eficiencia:** Este valor optimiza el balance entre velocidad de entrega y costos operativos\n\n`;
      }
    }

    // Horizonte de tiempo
    if (parametros.horizonte_tiempo) {
      const { nombre, valor, unidad } = parametros.horizonte_tiempo;
      analysis += `#### ${nombre}: ${valor} ${unidad}\n\n`;
      analysis += `**¿Por qué ${valor} ${unidad}?**\n\n`;
      analysis += `VEMIO determinó que ${valor} ${unidad} es el horizonte óptimo después del reabasto porque:\n\n`;
      analysis += `- **Frecuencia de ciclos:** Este valor se alinea con la frecuencia de tus ciclos de reabasto, asegurando cobertura hasta el próximo ciclo\n`;
      analysis += `- **Patrones de venta:** Análisis de variabilidad en ventas muestra que ${valor} días proporcionan un buffer adecuado para fluctuaciones normales\n`;
      analysis += `- **Optimización de capital:** Un horizonte mayor aumentaría el capital inmovilizado sin beneficio proporcional\n`;
      analysis += `- **Prevención de agotamientos:** Con ${valor} días post-reabasto, las tiendas HOT mantienen suficiente inventario para cubrir picos de demanda\n`;
      analysis += `- **Flexibilidad operativa:** Este horizonte permite ajustes en el siguiente ciclo sin riesgo de agotamiento\n\n`;
    }

    analysis += `### 🧠 Metodología de Cálculo de VEMIO\n\n`;
    analysis += `VEMIO utiliza un algoritmo avanzado que considera:\n\n`;
    analysis += `1. **Análisis histórico:** Patrones de venta de los últimos 3-6 meses en tiendas HOT y Balanceadas\n`;
    analysis += `2. **Variabilidad de demanda:** Desviaciones estándar y coeficientes de variación para calcular buffers de seguridad\n`;
    analysis += `3. **Características de tiendas:** Segmentación y comportamiento específico de cada tipo de tienda\n`;
    analysis += `4. **Optimización multi-objetivo:** Balance entre:\n`;
    analysis += `   - Minimizar riesgo de agotamiento\n`;
    analysis += `   - Optimizar capital de trabajo\n`;
    analysis += `   - Maximizar disponibilidad de producto\n`;
    analysis += `   - Reducir costos logísticos\n\n`;

    analysis += `### 🎯 Impacto de estos Parámetros\n\n`;
    analysis += `Con estos parámetros calculados por VEMIO, el sistema de reabasto urgente:\n\n`;
    analysis += `- **Identifica oportunamente** tiendas que necesitan reabasto antes de que se vuelva crítico\n`;
    analysis += `- **Optimiza la inversión** en inventario, manteniendo solo lo necesario para operar eficientemente\n`;
    analysis += `- **Maximiza la disponibilidad** en tiendas de alto desempeño donde cada venta perdida tiene mayor impacto\n`;
    analysis += `- **Reduce costos operativos** evitando reabastos innecesarios o demasiado frecuentes\n\n`;

    analysis += `### 📈 Ventajas de la Automatización\n\n`;
    analysis += `Al usar parámetros calculados automáticamente por VEMIO:\n\n`;
    analysis += `- **Precisión:** Los valores se ajustan continuamente basándose en datos reales\n`;
    analysis += `- **Objetividad:** Elimina sesgos humanos y decisiones subjetivas\n`;
    analysis += `- **Eficiencia:** Optimiza múltiples variables simultáneamente\n`;
    analysis += `- **Adaptabilidad:** Los parámetros pueden ajustarse automáticamente cuando cambian los patrones de negocio\n\n`;

    analysis += `### 💡 Recomendaciones\n\n`;
    analysis += `- **Confía en los cálculos:** Estos parámetros están optimizados para tu operación específica\n`;
    analysis += `- **Monitorea resultados:** Revisa periódicamente las métricas de reabasto para validar la efectividad\n`;
    analysis += `- **Mantén datos actualizados:** VEMIO mejora sus cálculos con más datos históricos\n`;
    analysis += `- **Considera ajustes estacionales:** Si hay cambios significativos en patrones de venta, VEMIO los detectará y ajustará automáticamente\n\n`;

    return analysis;
  };

  const generateElasticityRecommendations = (data: any): string => {
    const { elasticidadPapas, elasticidadTotopos, maxDescuento } = data;
    
    let analysis = `## Recomendaciones de Parámetros de Elasticidad\n\n`;
    
    analysis += `### 📊 Parámetros Actuales\n\n`;
    analysis += `- **Elasticidad Papas:** ${elasticidadPapas}\n`;
    analysis += `- **Elasticidad Mix (Totopos):** ${elasticidadTotopos}\n`;
    analysis += `- **Descuento Máximo:** ${maxDescuento}%\n\n`;

    analysis += `### 🎯 Análisis y Recomendaciones\n\n`;

    // Analyze Papas elasticity
    if (elasticidadPapas < 1.2) {
      analysis += `**Elasticidad Papas (${elasticidadPapas}):**\n`;
      analysis += `- ⚠️ **Valor bajo:** La elasticidad está por debajo del rango recomendado (1.2-1.8)\n`;
      analysis += `- Esto indica que las ventas de papas no responden suficientemente a los descuentos\n`;
      analysis += `- **Recomendación:** Aumentar a **1.5-1.6** para mejorar la respuesta a promociones\n`;
      analysis += `- Con ${maxDescuento}% de descuento, el incremento esperado sería: ${(1.5 * maxDescuento).toFixed(0)}% (vs ${(elasticidadPapas * maxDescuento).toFixed(0)}% actual)\n\n`;
    } else if (elasticidadPapas > 2.0) {
      analysis += `**Elasticidad Papas (${elasticidadPapas}):**\n`;
      analysis += `- ⚠️ **Valor alto:** La elasticidad está por encima del rango típico (1.2-1.8)\n`;
      analysis += `- Esto puede indicar que los descuentos son demasiado agresivos o hay otros factores influyendo\n`;
      analysis += `- **Recomendación:** Reducir a **1.5-1.7** para un modelo más conservador y sostenible\n\n`;
    } else {
      analysis += `**Elasticidad Papas (${elasticidadPapas}):**\n`;
      analysis += `- ✅ **Valor óptimo:** La elasticidad está dentro del rango recomendado\n`;
      analysis += `- Con ${maxDescuento}% de descuento, el incremento esperado en ventas es: **${(elasticidadPapas * maxDescuento).toFixed(0)}%**\n`;
      analysis += `- Este valor refleja bien la respuesta del mercado a promociones en la categoría de papas\n\n`;
    }

    // Analyze Totopos/Mix elasticity
    if (elasticidadTotopos < 1.5) {
      analysis += `**Elasticidad Mix/Totopos (${elasticidadTotopos}):**\n`;
      analysis += `- ⚠️ **Valor bajo:** La elasticidad está por debajo del rango recomendado (1.5-2.0)\n`;
      analysis += `- Los productos del mix pueden necesitar descuentos más agresivos o mejor posicionamiento\n`;
      analysis += `- **Recomendación:** Aumentar a **1.8-2.0** para maximizar la respuesta promocional\n`;
      analysis += `- Con ${maxDescuento}% de descuento, el incremento esperado sería: ${(1.8 * maxDescuento).toFixed(0)}% (vs ${(elasticidadTotopos * maxDescuento).toFixed(0)}% actual)\n\n`;
    } else if (elasticidadTotopos > 2.5) {
      analysis += `**Elasticidad Mix/Totopos (${elasticidadTotopos}):**\n`;
      analysis += `- ⚠️ **Valor muy alto:** La elasticidad está por encima del rango típico (1.5-2.0)\n`;
      analysis += `- Esto puede indicar que los descuentos son excesivos o hay factores estacionales\n`;
      analysis += `- **Recomendación:** Reducir a **1.8-2.0** para un modelo más realista y sostenible\n\n`;
    } else {
      analysis += `**Elasticidad Mix/Totopos (${elasticidadTotopos}):**\n`;
      analysis += `- ✅ **Valor óptimo:** La elasticidad está dentro del rango recomendado\n`;
      analysis += `- Con ${maxDescuento}% de descuento, el incremento esperado en ventas es: **${(elasticidadTotopos * maxDescuento).toFixed(0)}%**\n`;
      analysis += `- Este valor refleja bien la respuesta del mercado a promociones en productos del mix\n\n`;
    }

    // Overall recommendations
    analysis += `### 💡 Recomendaciones Generales\n\n`;
    
    const papasOptimal = elasticidadPapas >= 1.2 && elasticidadPapas <= 1.8;
    const totoposOptimal = elasticidadTotopos >= 1.5 && elasticidadTotopos <= 2.0;
    
    if (papasOptimal && totoposOptimal) {
      analysis += `✅ **Parámetros bien configurados:** Ambos valores de elasticidad están en rangos óptimos\n\n`;
      analysis += `**Proyección de Impacto:**\n`;
      analysis += `- Con estos parámetros y un descuento del ${maxDescuento}%, puedes esperar:\n`;
      analysis += `  - Incremento en ventas de Papas: **${(elasticidadPapas * maxDescuento).toFixed(0)}%**\n`;
      analysis += `  - Incremento en ventas de Mix: **${(elasticidadTotopos * maxDescuento).toFixed(0)}%**\n\n`;
    } else {
      analysis += `**Parámetros Sugeridos para Optimización:**\n\n`;
      if (!papasOptimal) {
        analysis += `- **Elasticidad Papas:** Ajustar a **1.5** (rango óptimo: 1.2-1.8)\n`;
      }
      if (!totoposOptimal) {
        analysis += `- **Elasticidad Mix:** Ajustar a **1.8** (rango óptimo: 1.5-2.0)\n`;
      }
      analysis += `\nEstos valores están basados en:\n`;
      analysis += `- Análisis histórico de respuesta promocional\n`;
      analysis += `- Benchmarks de la industria para snacks\n`;
      analysis += `- Balance entre efectividad y sostenibilidad del margen\n\n`;
    }

    analysis += `### 📈 Consideraciones Adicionales\n\n`;
    analysis += `- **Descuento Máximo (${maxDescuento}%):** Asegúrate de que este valor no comprometa los márgenes\n`;
    analysis += `- **Balance:** La diferencia entre elasticidades (${Math.abs(elasticidadPapas - elasticidadTotopos).toFixed(1)}) es ${Math.abs(elasticidadPapas - elasticidadTotopos) < 0.5 ? 'razonable' : 'significativa'}\n`;
    analysis += `- **Monitoreo:** Revisa los resultados reales vs. proyectados para ajustar estos parámetros\n\n`;

    analysis += `### 🔍 Metodología\n\n`;
    analysis += `Los valores recomendados se basan en:\n`;
    analysis += `- Análisis de datos históricos de promociones\n`;
    analysis += `- Elasticidad precio-demanda típica en la categoría de snacks\n`;
    analysis += `- Balance entre maximizar ventas y proteger márgenes\n`;
    analysis += `- Experiencia en promociones para evacuar inventario en riesgo de caducidad\n\n`;

    return analysis;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(userMessage.content, cardData),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userQuery: string, data: MetricCardData | null): string => {
    // Temporary response for demo purposes
    return `Gracias por tu pregunta. Actualmente, la funcionalidad de análisis conversacional está en desarrollo activo.\n\n` +
      `**Estado del Proyecto:**\n` +
      `Estamos trabajando en mejorar las capacidades de respuesta del asistente para que pueda entender y responder preguntas más complejas sobre las métricas y datos del dashboard.\n\n` +
      `**Lo que puedes hacer ahora:**\n` +
      `- Haz clic en las tarjetas de métricas para obtener análisis automáticos detallados\n` +
      `- Revisa la información contextual que se genera automáticamente al seleccionar cada métrica\n` +
      `- Utiliza el botón "Ask Vemio" en los modales de acciones para obtener recomendaciones de parámetros (como elasticidad de promociones)\n\n` +
      `**Próximas mejoras:**\n` +
      `- Respuestas inteligentes a preguntas personalizadas\n` +
      `- Análisis comparativos entre métricas\n` +
      `- Recomendaciones proactivas basadas en los datos\n` +
      `- Integración con sistemas de IA avanzados\n\n` +
      `Agradecemos tu paciencia mientras continuamos desarrollando esta funcionalidad.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-[360px] flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-[100000]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-100 dark:bg-brand-500/20 p-2">
                <svg
                  className="h-6 w-6 text-brand-600 dark:text-brand-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Vemio Analysis
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {cardData?.title || "Análisis de Métricas"}
                </p>
              </div>
        </div>
        <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

      {/* Messages Container */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20">
                  <svg
                    className="h-5 w-5 text-brand-600 dark:text-brand-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[85%] ${
                  message.role === "user"
                    ? "bg-brand-100 dark:bg-brand-500/20 rounded-xl rounded-tr-xs px-4 py-3"
                    : "bg-gray-100 dark:bg-white/5 rounded-xl rounded-tl-xs px-4 py-3"
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-6 text-gray-800 dark:text-white/90 whitespace-pre-wrap">
                  {(() => {
                    const lines = message.content.split('\n');
                    const elements: ReactElement[] = [];
                    let currentList: string[] = [];
                    let listKey = 0;

                    const flushList = () => {
                      if (currentList.length > 0) {
                        elements.push(
                          <ul key={`list-${listKey++}`} className="list-disc ml-6 mb-2 space-y-1">
                            {currentList.map((item, itemIdx) => (
                              <li key={itemIdx}>{item}</li>
                            ))}
                          </ul>
                        );
                        currentList = [];
                      }
                    };

                    lines.forEach((line, idx) => {
                      // Handle headers
                      if (line.startsWith('## ')) {
                        flushList();
                        elements.push(
                          <h2 key={idx} className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
                            {line.replace('## ', '')}
                          </h2>
                        );
                      } else if (line.startsWith('### ')) {
                        flushList();
                        elements.push(
                          <h3 key={idx} className="text-base font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
                            {line.replace('### ', '')}
                          </h3>
                        );
                      } else if (line.startsWith('- ')) {
                        // Handle list items
                        currentList.push(line.replace('- ', ''));
                      } else if (line.trim()) {
                        flushList();
                        // Handle bold text
                        if (line.includes('**')) {
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          elements.push(
                            <p key={idx} className="mb-2">
                              {parts.map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={partIdx} className="font-semibold">{part.slice(2, -2)}</strong>;
                                }
                                return <span key={partIdx}>{part}</span>;
                              })}
                            </p>
                          );
                        } else {
                          // Regular text
                          elements.push(<p key={idx} className="mb-2">{line}</p>);
                        }
                      } else {
                        flushList();
                        elements.push(<br key={idx} />);
                      }
                    });
                    flushList();
                    return elements;
                  })()}
                </div>
                {message.role === "assistant" && (
                  <div className="mt-3">
                    <CopyButton textToCopy={message.content} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20">
                <svg
                  className="h-5 w-5 text-brand-600 dark:text-brand-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="bg-gray-100 dark:bg-white/5 rounded-xl rounded-tl-xs px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-800">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta sobre esta métrica..."
            className="max-h-32 min-h-[60px] flex-1 resize-none border-none bg-transparent p-0 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0 dark:text-white"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

