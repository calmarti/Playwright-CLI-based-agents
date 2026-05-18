<div align="center">

# 🤖 Agentes de Testing basados en Playwright CLI

Agentes de IA especializados en explorar y crear planes de prueba, generar, depurar y reparar tests de Playwright utilizando Playwright CLI (en lugar de Playwright MCP)

Español | [🇬🇧 English](README.en.md) 

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

Los agentes de Playwright originales están basados en MCP y dependen por tanto de las herramientas (tools) del MCP (Model Context Protocol) de Playwright.

Estos agentes basados en Playwright MCP consumen constantemente capturas (snapshots) completas del llamado árbol de accesibilidad (*accessibility tree*) ó bien del DOM (*Document Object Model*) dentro del contexto del agente. Por tanto, se trata de agentes con un consumo de tokens elevado.

Sin embargo, si el agente trabaja con Playwright CLI, lo que utiliza como referencia de la página bajo prueba son los llamados snapshots semánticos o basados en referencias (*ref-based snapshots*), que son estructuras mucho más compactas.

**A principios de 2026, Playwright introdujo [Playwright-CLI](https://playwright.dev/agent-cli/introduction?utm_source=chatgpt.com), ***una interfaz de línea de comandos para automatización de navegadores diseñada para agentes de código***.**

Playwright recomienda oficialmente utilizar Playwright CLI para flujos de trabajo agénticos debido a que supone un consumo de tokens significativamente menor y sesiones de trabajo agéntico más largas.

Nota: Existen casos de uso en los que los agentes basados en MCP siguen siendo probablemente preferibles a Playwright CLI (por ejemplo, sesiones de testing exploratorio o depuración de defectos complejos relacionados con la interfaz de usuario).

---

## Visión General

Este repositorio proporciona definiciones de tres agentes Playwright-CLI (ficheros markdown) que pueden utilizarse para ejecutar los siguientes flujos de trabajo:

- Explorar y navegar un sitio y crear un plan de pruebas con las casuísticas explorados
- Generar tests de Playwright (archivos `spec.ts`) para cada caso de prueba definido en el plan
- Ejecutar los tests para verificar que todos pasan. Si existen tests que fallan, depurar hasta encontrar la causa del fallo, luego reparar el test fallido; o si no es posible, marcar el test con la fixture `fix.me`

Cada uno de estos flujos puede ejecutarse en cualquier entorno de desarrollo asistido por IA como Codex, Claude Code, GitHub Copilot o Cursor.

El flujo completo (planificación, generación de código y depuración/reparación de tests) de estos agentes es, por la propia naturaleza de su trabajo, secuencial (en lugar de paralelo).

Todos los agentes se sirven de `Playwright CLI` para realizar su trabajo y no utilizan *tools* de Playwright MCP ni ningún otro MCP.

Se trata de agentes autónomos que generalmente ejecutarán su tarea de una sola vez. Sin embargo, ocasionalmente pueden detenerse para solicitar permiso al usuario si encuentran alguna tarea que requiere permisos adicionale a los que ya les fueron otorgados (por ejemplo, peticiones de red fuera de su workspace).

Cada definición de agente, instrucciones y limitaciones de comportamiento (*guardrails*) están en estos archivos markdown:

- `planner-playwright-cli-agent.md`
- `generator-playwight-cli-agent.md`
- `healer-playwright-cli-agent.md`

---

## Algunos Casos de Uso

Puedes utilizar solo uno de los agentes, una combinación de ellos o todos dependiendo de tus necesidades.

### Agente Planner

- Planner explorará exhaustivamente el sitio (o una página/historia de usuario) y creará un plan o lista de casos de pruebas en un archivo markdown. 

Nota: Puedes pedirle que cree un plan de pruebas  para una página/historia de usuario específica o para el sitio completo (sin embargo, si tu sitio bajo prueba es suficientemente grande/complejo es recomendable pedirle que cree un plan de prueba por historia de usuario).

Este plan de pruebas puede tener distinta utilidad  según quien lo consuma:

**Testers Manuales**:

- El plan es una suite de pruebas detallada donde cada caso de prueba contiene pasos detallados, precondiciones y resultados esperados.

- Los testers manuales pueden utilizarlo como:
    - Instrucciones de ejecución.
    - Como una *lluvia de ideas* de posibles escenarios de prueba. Esta lista de casos de prueba puede luego refinarse manualmente.

**Testers de Automatización**

- El plan contiene sugerencias de *locators* y *assertions* de Playwright para cada caso de prueba.Esto puede ahorrar tiempo a testers de automatización que estén implementando tests de Playwright.

### Agente Planner + Generator

- Planner genera un plan de pruebas.
- Generator leerá el plan e implementará cada caso de prueba como un archivo `spec.ts`, utilizando los *locators* y *assertions* sugeridos en el plan.
- Se detendrá cuando termine de implementar el código.

Nota: Si bien la tarea de Generator es leer los casos del plan e implementarlos, podría utilizar Playwright CLI para inspeccionar el sitio por sí mismo si nota que la información del plan de pruebas es insuficiente o está desactualizada.

**Generator nunca ejecutará los tests que implementa, ni depurará tests "rotos" (ese es el trabajo del agente healer)**.

También puedes proporcionar a Generator tu propio plan de pruebas escrito manualmente, pero para que generator pueda entenderlo debe estar escrito en inglés siguiendo esta plantilla (y en formato markdown):

```md
# <Feature or App Name> Test Plan

<!--Todo lo marcado con (****) es opcional-->

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
- Generator genera archivos `spec.ts`, uno por cada caso definido en el plan.
- Healer ejecuta los tests:
    - Si todos los tests pasan, healer finaliza su trabajo.
    - Si existen tests fallando, healer depura la causa del fallo:
        - Si la causa es un problema en el código del test (por ejemplo, un locator inestable, o "*flaky*) lo corrige y vuelve a ejecutarlo hasta que el test pase.
        - Si healer considera (tras depurar y volver a probar) que la causa del fallo no es un problema del código de automatización, marca el test con la fixture Playwright `test.fixme`.
        - Cuando todos los tests fallidos hayan sido corregidos o marcados con `test.fixme`, healer termina su trabajo.

## Workflow completamente autónomo (no recomendado)

Podrías escribir un prompt (con los 3 archivos de definición de agentes en contexto) describiendo un workflow autónomo secuencial y sin interrupciones. Tras esto planner escribirá un plan que generator luego leerá para implementar tests Playwright que finalmente serían ejecutados por healer, quién también corregiría cualquier test fallido.

Sin embargo, los agentes cometen errores y lo más probable es que necesites iterar unas cuantas veces antes de obtener el resultado que deseas. 

Por eso, un workflow completamente autónomo probablemente no sea el más adecuado para estos agentes.

---

## Instalación local

Necesitas disponer de alguno de estos: Codex / extensión de Codex para VSC, GitHub Copilot, OpenCode, Claude Code, Cursor o cualquier otra aplicación/extensión con capacidad agéntica.

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

- Por defecto, el proyecto está configurado para probar un sitio demo (`parabank.parasoft.com`) y contiene las credenciales de un usuario de prueba en el archivo `.env`. 

- Por tanto, debes actualizar la URL base de la siguiente forma:
    - En `playwright.config.ts`:

```ts
export default defineConfig({
    ...
use: {
    baseURL: 'https://miaplicacionbajoprueba.com',
```

- Por otra parte, si tu aplicación requiere autenticación puedes proporcionar tus propias credenciales de usuario de prueba en el archivo `.env` o en cualquier otra ubicación (pero entonces deberás indicar al agente dicha ubicación en el prompt).

- **Importante: Incluso si los agentes no necesitan autenticarse en tu aplicación bajo prueba elimina el contenido original del archivo `.env`**. De lo contrario el prompt contendrá ruido innecesario y podría confundir al agente. 

### Permisos del agente

- Proporciona a tu agente permisos de lectura/escritura/ejecución limitados a tu proyecto/workspace (por ejemplo: si utilizas Codex, establece los permisos a `default permissions`).

### Contexto del agente

- Añade el archivo markdown de definición del agente al contexto del agente en la interfaz que estes utilizando (por ejemplo, la interfaz de la extensión de Codex para VSC ofrece la opción de agregar ficheros al contexto).


#### Matén el contexto limpio

- Antes de ejecutar un agente **asegúrate siempre de que el proyecto no esté contaminado** con archivos generados por agentes en ejecuciones anteriores (planes de pruebas antiguos, archivos `spec.ts` antiguos), ni con archivos generados manualmente (por ejemplo, la carpeta `test-results`) o cualquier informe que hayas generado en ejecuciones anteriores.

Ejemplos:

- Si vuelves a ejecutar el agente planner debes eliminar previamente (o guardar fuera del proyecto) el plan de pruebas generado en la ejecución anterior.

- Si ejecutas planner o generator debes eliminar previamente los archivos `spec.ts` con tests implementados que puedan haber sido generados en una ejecución anterior.

## Ejemplo de prompts 

### Planner

![Planner](./.github/assets/sample_prompt_planner.png)

### Generator

![Generator](./.github/assets/sample_prompt_generator.png)

### Healer

![Healer](./.github/assets/sample_prompt_healer.png)