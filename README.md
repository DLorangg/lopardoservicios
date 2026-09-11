# Lopardo Servicios — Plataforma Web & Sistema de Gestión

Solución integral desarrollada a medida para **Lopardo Servicios** (empresa especializada en climatización comercial e industrial). El proyecto combina una **landing institucional pública** de alto impacto para captación y posicionamiento de marca con un **sistema de gestión interna (ERP/Panel Admin)** para la administración operativa, técnica y comercial.

---

## 📌 Ecosistema del Proyecto

La plataforma está estructurada en tres componentes principales que trabajan de forma sincronizada:

### 1. Landing Web Institucional (`landing_web`)
Sitio público orientado a la conversión y presentación de la empresa:
* **Catálogo de Servicios:** Detalle de trabajos de instalación, mantenimiento y refrigeración comercial/industrial.
* **Carrusel Dinámico de Trabajos:** Galería interactiva administrable en tiempo real desde el panel de control.
* **Clientes & Alianzas:** Sección de marcas corporativas que confían en el servicio.
* **Social Proof & Reseñas:** Formulario público para que los clientes califiquen el servicio y visualización de testimonios aprobados.

### 2. Panel de Administración / ERP (`frontend`)
Sistema privado de gestión operativa diaria con control de acceso según roles:
* **Gestión de Visitas & Servicios:** Registro de visitas técnicas, asignación de técnicos y carga/descarga directa de adjuntos y órdenes de servicio.
* **Directorio de Clientes & Equipamiento:** Trazabilidad de equipamiento instalado por cliente con historial de intervenciones.
* **Personal:** Control de técnicos y operadores del sistema.
* **Módulo de Caja:** Registro de ingresos, egresos y balances de movimientos operativos.
* **Gestión Web (CMS Liviano):** Módulo centralizado para:
  * Moderar, editar y normalizar reseñas enviadas por usuarios antes de publicarlas.
  * Subir, reordenar y eliminar fotografías de la galería pública.

### 3. API & Backend (`backend`)
API RESTful que centraliza la lógica de negocio y persistencia de datos:
* Arquitectura basada en endpoints modulares (`/routes/`) comunicados vía PDO con MySQL.
* Manejo y sanitización de archivos multimedia (imágenes del carrusel y adjuntos de visitas).

---

## 🛡️ Seguridad e Infraestructura

El sistema fue testeado mediante pruebas de penetración (black-box) y endurecido tanto a nivel de código como en el perímetro:

* **Autenticación & Autorización:** Sesiones basadas en JSON Web Tokens (JWT) con validación estricta de roles y contexto de usuario para prevenir accesos no autorizados e IDOR.
* **Protección contra Fuerza Bruta:** Rate limiting por IP en endpoints críticos (control de intentos fallidos y bloqueo temporal HTTP 429).
* **Escudo Perimetral:** Dominio y subdominio protegidos por la red de Cloudflare (WAF, mitigación de ataques volumétricos, Bot Fight Mode y SSL/TLS Full).

---

## 🛠️ Stack Tecnológico

* **Landing Web:** Next.js (App Router), React, Tailwind CSS, TypeScript.
* **Panel de Gestión:** React, Vite, React Router, Bootstrap.
* **Backend:** PHP, MySQL (PDO), JWT.
* **Infraestructura:** Hostinger, Cloudflare.
