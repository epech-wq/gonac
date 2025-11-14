# Agregar "Historial de Tareas" al Sidebar

Si deseas agregar la nueva vista de Historial de Tareas al menú lateral, sigue estos pasos:

## Paso 1: Abrir el archivo del Sidebar

Abre el archivo:
```
src/layout/AppSidebar.tsx
```

## Paso 2: Localizar el array de navegación

Busca el array `navItems` (aproximadamente en la línea 50-150).

## Paso 3: Agregar el nuevo item

Agrega el siguiente objeto al array `navItems`:

```typescript
{
  href: "/historial-tareas",
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  label: "Historial de Tareas",
},
```

## Ejemplo Completo

```typescript
const navItems = [
  {
    href: "/",
    icon: <HomeIcon />,
    label: "Dashboard",
  },
  // ... otros items ...
  {
    href: "/historial-tareas",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: "Historial de Tareas",
  },
  // ... otros items ...
];
```

## Alternativa: Usar un icono existente

Si prefieres usar un icono existente del proyecto:

```typescript
import { TaskIcon } from "@/icons"; // O cualquier otro icono

{
  href: "/historial-tareas",
  icon: <TaskIcon />,
  label: "Historial de Tareas",
}
```

## Paso 4: Guardar y verificar

1. Guarda el archivo
2. El sidebar se actualizará automáticamente
3. Verifica que el nuevo item aparezca en el menú
4. Haz clic para navegar a la nueva vista

---

**Nota**: Si el sidebar tiene una estructura diferente o usa un sistema de menús más complejo, adapta los pasos según la implementación específica de tu proyecto.

