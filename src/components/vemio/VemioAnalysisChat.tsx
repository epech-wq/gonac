"use client";

import { useState, useRef, useEffect } from "react";
import { CopyButton } from "@/components/ai/TextGeneratorContent";

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
}

export default function VemioAnalysisChat({
  isOpen,
  onClose,
  cardData,
}: VemioAnalysisChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate initial analysis when chat opens
  useEffect(() => {
    if (isOpen && cardData && messages.length === 0) {
      const initialMessage = generateInitialAnalysis(cardData);
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: initialMessage,
          timestamp: new Date(),
        },
      ]);
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
    const query = userQuery.toLowerCase();
    
    if (query.includes("tienda") || query.includes("store")) {
      return `Basándome en los datos de ${data?.title || "la métrica"}, puedo informarte que:\n\n` +
        `- **Total de Tiendas:** ${data?.storeMetrics?.totalTiendas || "N/A"} tiendas están siendo monitoreadas\n` +
        `- Las tiendas están segmentadas en: Hot (alto volumen), Balanceadas, Slow (bajo volumen), y Críticas\n` +
        `- Cada segmento tiene diferentes características de rotación y requiere estrategias específicas\n\n` +
        `¿Te gustaría conocer más detalles sobre algún segmento específico?`;
    }
    
    if (query.includes("sku") || query.includes("producto") || query.includes("product")) {
      return `Respecto a los SKUs y productos relacionados con ${data?.title || "esta métrica"}:\n\n` +
        `- Los datos consideran todos los SKUs activos en el inventario\n` +
        `- Los productos se monitorean por su rotación, días de inventario, y riesgo de caducidad\n` +
        `- Los SKUs con mayor impacto son aquellos en tiendas Hot y Balanceadas debido a su alta rotación\n\n` +
        `¿Hay algún producto o categoría específica que te interese analizar?`;
    }
    
    if (query.includes("dato") || query.includes("fuente") || query.includes("source")) {
      return `La información de ${data?.title || "esta métrica"} proviene de:\n\n` +
        `- **Sistema de Segmentación:** Clasificación de tiendas por performance\n` +
        `- **Métricas Consolidadas:** Agregación de datos de todas las tiendas\n` +
        `- **Valorización:** Análisis de inventario y oportunidades\n` +
        `- **Actualización:** Los datos se actualizan en tiempo real desde las fuentes operativas\n\n` +
        `Todos los datos son consolidados y validados antes de ser presentados.`;
    }
    
    return `Entiendo tu pregunta sobre ${data?.title || "esta métrica"}. ` +
      `Basándome en los datos disponibles, puedo ayudarte a profundizar en cualquier aspecto específico. ` +
      `¿Podrías ser más específico sobre qué información necesitas? Por ejemplo:\n\n` +
      `- Detalles sobre tiendas específicas\n` +
      `- Información de SKUs o productos\n` +
      `- Fuentes de datos y metodología\n` +
      `- Recomendaciones y acciones sugeridas`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 dark:bg-black/80 transition-opacity"
        onClick={onClose}
      />

      {/* Chat Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
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
          <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
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
                        const elements: JSX.Element[] = [];
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
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
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
        </div>
      </div>
    </>
  );
}

