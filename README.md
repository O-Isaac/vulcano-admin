# Vulcano Admin 

> Panel de administración y gestión para el sistema Vulcano.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)

Este proyecto es el cliente web administrativo para la API de **Vulcano**, diseñado para gestionar recursos, planos, inventarios y el sistema de fundición del juego.

🔗 **Backend Repository:** [github.com/o-isaac/vulcano](https://github.com/o-isaac/vulcano)

---

## Características

*   **Gestión de Inventario**: Visualización y administración de recursos y componentes.
*   **Sistema de Fundición**: Monitorización en tiempo real de colas de fabricación.
*   **Editor de Planos**: Interfaz modular para crear y editar recetas de crafteo complejas.
*   **Seguridad**: Autenticación basada en JWT con refresco automático de tokens.
*   **UI Moderna**: Interfaz construida con TailwindCSS, Framer Motion y Lucide Icons.

## Tecnologías

*   **Core**: React 19 + TypeScript + Vite.
*   **Estado**: Zustand (Global), SWR (Data Fetching).
*   **Router**: React Router DOM.
*   **Estilos**: TailwindCSS.
*   **Animaciones**: Framer Motion.
*   **Notificaciones**: Sonner.

## Instalación y Uso

1.  **Clonar este repositorio**
    ```bash
    git clone https://github.com/tu-usuario/vulcano-admin.git
    cd vulcano-admin
    ```

2.  **Instalar dependencias**
    ```bash
    pnpm install
    # o
    npm install
    ```

3.  **Configurar entorno**
    Asegúrate de tener el backend [Vulcano](https://github.com/o-isaac/vulcano) ejecutándose localmente o configura la URL de la API si es necesario.

4.  **Iniciar servidor de desarrollo**
    ```bash
    pnpm dev
    ```

## Estructura del Proyecto

*   `/src/components`: Componentes reutilizables (formularios, UI, cards).
*   `/src/hooks`: Hooks personalizados (`usePlanoForm`, `useQueueMonitor`).
*   `/src/pages`: Vistas principales de la aplicación.
*   `/src/services`: Capa de comunicación con la API.
*   `/src/store`: Estado global con Zustand.

## Contribución

Este proyecto es parte del ecosistema Vulcano. Si deseas contribuir al backend, visita el repositorio principal: [Vulcano API](https://github.com/o-isaac/vulcano).

---
Desarrollado con ❤️ para la gestión de recursos espaciales.
