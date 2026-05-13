<div align="center">

# 🤖 Agentes de Testing Playwright CLI

Agentes de IA especializados para planificación, generación y reparación de tests Playwright utilizando Playwright CLI (en lugar de Playwright MCP)

[🇺🇸 English](README.md) | Español

![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-Agents-412991?logo=openai&logoColor=white)
![OpenCode](https://img.shields.io/badge/OpenCode-AI%20Coding%20Agent-black?style=for-the-badge&logo=github)
![CLI First](https://img.shields.io/badge/CLI-First-1f6f4a)
![Status](https://img.shields.io/badge/Status-Experimental-red)
![License](https://img.shields.io/badge/License-MIT-yellow)
![GitHub](https://img.shields.io/badge/github-repo-blue?logo=github)

</div>

---

## Playwright CLI vs Playwright MCP

Los Playwright Test Agents originales están basados en MCP y dependen de herramientas del Model Context Protocol (MCP).

Cuando los agentes trabajan con Playwright MCP están consumiendo constantemente snapshots completos del árbol de accesibilidad/DOM dentro del contexto del modelo.

Con Playwright CLI, los agentes trabajan con los llamados snapshots semánticos o basados en referencias (*ref-based snapshots*), que son estructuras mucho más compactas.

**A principios de 2026, Playwright introdujo [Playwright-CLI](https://playwright.dev/agent-cli/introduction?utm_source=chatgpt.com), ***una interfaz de línea de comandos para automatización de navegadores diseñada para coding agents***.**

Playwright recomienda oficialmente su CLI para workflows de coding agents debido a un consumo de tokens significativamente menor y a sesiones agentic más largas.

Nota: Existen casos de uso en los que los agentes basados en MCP seguirían siendo probablemente preferibles al CLI (por ejemplo, sesiones avanzadas de testing exploratorio o debugging de bugs complejos de UI).

---

## Visión General

Este repositorio proporciona definiciones de agentes Playwright-CLI (archivos markdown) que pueden utilizarse para ejecutar los siguientes workflows:

- Explorar y navegar un sitio y crear un plan de pruebas de los escenarios explorados
- Generar tests Playwright (archivos `spec.ts`) para cada escenario definido en el plan
- Ejecutar los tests para verificar que todos pasan. Si existen tests fallando, depurar la causa raíz, reparar el test fallido o, si no puede hacerlo, marcar el test con la fixture `fix.me`

Cada uno de estos workflows puede ejecutarse en cualquier entorno de desarrollo asistido por IA como Codex, Claude Code, GitHub Copilot o Cursor.

El workflow completo (planificación, generación de código y debugging/reparación de tests) de estos agentes es, por la propia naturaleza de su trabajo, secuencial (en lugar de paralelo).

Todos los agentes dependen de `Playwright CLI` para realizar su trabajo y no utilizan herramientas Playwright MCP ni ningún otro MCP.

Todos los agentes son completamente autónomos y generalmente ejecutarán su tarea de una sola vez. Sin embargo, ocasionalmente pueden detenerse para solicitar permiso al usuario si encuentran una decisión para la que necesitan permisos fuera de su configuración actual (por ejemplo, peticiones de red fuera de su workspace).

Cada definición de agente, instrucciones y guardrails están en estos archivos markdown:

- `planner-playwright-cli-agent.md`
- `generator-playwight-cli-agent.md`
- `healer-playwright-cli-agent.md`

---

## Algunos Casos de Uso

Puedes utilizar solo uno de los agentes, una combinación de ellos o todos dependiendo de tus necesidades.

### Workflow del agente Planner

- Planner explorará exhaustivamente el sitio (o una página/feature) y creará un plan de pruebas en un archivo markdown.

Nota: Puedes pedirle que planifique escenarios de prueba para una página/feature específica o para el sitio completo (sin embargo, para obtener una mejor calidad de salida, si tu sitio bajo prueba es suficientemente grande recomiendo planificar una feature cada vez).

Este plan de pruebas puede servir diferentes propósitos dependiendo del usuario:

**Testers Manuales**:

- Es una suite de pruebas detallada donde cada escenario contiene pasos detallados, precondiciones y resultados esperados.

- Los testers manuales pueden utilizarlo como:
    - Instrucciones directas de ejecución.
    - Un *brainstorm* de posibles escenarios de prueba. Esta lista de casos de prueba puede posteriormente refinarse manualmente.

**Testers de Automatización**

- Contiene sugerencias de locators Playwright y assertions sugeridas para cada escenario de prueba.

- Esto puede ser útil y ahorrar tiempo a testers de automatización que estén implementando tests Playwright.

### Workflow Planner + Generator

- Planner genera un plan de pruebas.
- Generator leerá el plan e implementará cada escenario como un archivo `spec.ts`, probablemente utilizando los locators y assertions sugeridos.
- Se detendrá cuando termine de implementar el código.

Nota: Generator simplemente leerá el plan e implementará código. Sin embargo, puede utilizar Playwright CLI para inspeccionar el sitio cuando la información del plan de pruebas sea insuficiente, esté desactualizada o simplemente no sea suficiente.

- **Generator nunca ejecutará los tests que implementa, ni depurará tests que fallen (ese es el trabajo del agente healer)**.

- También puedes proporcionar a generator tu propio plan de pruebas escrito manualmente, pero para que generator pueda entenderlo mejor debería estar escrito en un archivo markdown utilizando esta plantilla:

```md
# <Feature or App Name> Test Plan

<!--Whatever is marked with (****) is optional-->

## Overview
Purpose of the plan and the explored application feature or site

## Scope

## Out of Scope

## Test Data and Setup
(Users, required inputs)

## Explored Areas (****)
(Pages, user journeys, flows, and states that should be visited)

## Test Scenarios

### 1. <Scenario Title>

**Type:** Happy path | Negative | Edge case | Validation | Navigation | Authentication | Regression

**Preconditions / Starting State:**

**Steps:**

**Expected Results:**

**Success Criteria:**

**Failure Conditions:**

**Suggested Assertions / Locator Hints:** (****)

**Notes:** (****)

## Edge Cases and Negative Coverage

## Risks and Gaps (****)
```

### Workflow Planner + Generator + Healer

- Planner genera un plan de pruebas.
- Generator genera archivos `spec.ts`, uno por cada escenario definido en el plan.
- Healer ejecuta los tests:
    - Si todos los tests pasan, healer finaliza su trabajo.
    - Si existen tests fallando, healer depura la causa raíz:
        - Si la causa raíz es un problema en el código del test (por ejemplo, un locator flaky) lo corrige y vuelve a ejecutarlo hasta que el test pase.
        - Si healer considera (tras depurar y volver a probar) que la causa raíz no es un problema del código de automatización, marca el test con la fixture Playwright `test.fixme`.
        - Cuando todos los tests fallidos hayan sido corregidos o marcados con `test.fixme`, healer se detiene.

## Workflow completamente autónomo (no recomendado)

Podrías escribir un prompt con los 3 archivos de definición de agentes en contexto describiendo un workflow autónomo secuencial sin interrupciones. Esto haría que planner escribiese un plan que generator recogería para implementar tests Playwright que finalmente serían ejecutados por healer, el cual también corregiría cualquier test fallido.

Sin embargo, los agentes cometen errores y lo más probable es que necesites iterar unas cuantas veces antes de obtener el resultado que deseas. Por eso, un workflow completamente autónomo probablemente no sea la mejor idea cuando trabajes con estos agentes. Recomendamos ejecutar cada workflow de agente por separado.

---

## Configuración Local

Necesitas disponer de alguno de estos: aplicación Codex / extensión Codex para VSC, GitHub Copilot, aplicación OpenCode, Claude Code, Cursor o cualquier otra aplicación/extensión con capacidades agentic.

Necesitas utilizar al menos Node 20 (*se recomienda Node 22*).

### Instalar dependencias:

```sh
npm -D install
```

### Instalar Playwright CLI (globalmente)

```sh
npm install -g @playwright/cli
```

### Configuración del proyecto y datos de prueba

- Por defecto, el proyecto está configurado para probar un sitio demo (`parabank.parasoft.com`) y contiene credenciales de usuario de prueba en el archivo `.env`. Debes actualizar la URL base de la siguiente forma:

- En `playwright.config.ts` establece `baseURL` con la URL del sitio objetivo:

```ts
export default defineConfig({
    ...
use: {
    baseURL: 'https://yourappundertest.com',
```

- Si el sitio requiere autenticación puedes proporcionar tus propias credenciales de usuario de prueba en el archivo `.env` o en cualquier otra ubicación (pero entonces deberás indicar al agente la ubicación de las credenciales en el prompt).

- **Importante: Incluso si los agentes no necesitan autenticarse en la aplicación bajo prueba elimina el contenido original del archivo `.env`**, de lo contrario el prompt será ruidoso y podría confundir al agente. Esto puede derivar en una salida de baja calidad.

### Permisos del agente

- Proporciona a tu agente permisos de lectura/escritura/ejecución limitados a tu proyecto/workspace (por ejemplo: si utilizas Codex, establece los permisos a `default permissions`).

### Contexto del agente

- Añade el archivo markdown de definición del agente al contexto del agente en la UI de tu asistente (por ejemplo, la UI de la extensión Codex para VSC).

- Antes de ejecutar un agente **asegúrate siempre de que el proyecto no esté contaminado** con archivos generados por agentes en ejecuciones anteriores (planes de pruebas antiguos, archivos `spec.ts` antiguos), ni con archivos generados manualmente (por ejemplo, la carpeta `test-results`) o cualquier informe generado por ejecuciones manuales.

Ejemplos:

- Si vuelves a ejecutar el agente planner deberías eliminar previamente (o guardar en otro lugar) el plan de pruebas generado en la ejecución anterior.

- Si ejecutas planner o generator deberías eliminar previamente los archivos `spec.ts` con tests implementados que puedan haber sido generados en una ejecución anterior.