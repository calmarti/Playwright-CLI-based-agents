<div align="center">

# 🤖 Playwright CLI Testing Agents

Specialized AI agents for Playwright test planning, generation, and healing using Playwright CLI (as opposed to Playwright MCP)

English | [🇪🇸 Español](README.es.md)

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

The original Playwright Test Agents are MCP-based and rely on the Model Context Protocol (MCP) tools. 

When agents work with Playwright MCP 
they are constantly consuming  full accessibility/DOM tree snapshots inside the model context.  

With Playwright CLI, agents work with so-called semantic or ref-based snapshots, which are more compact structures. 

**In early 2026, Playwright introduced [Playwright-CLI](https://playwright.dev/agent-cli/introduction?utm_source=chatgpt.com), ***a  command-line interface for browser automation designed for coding agents***.**

Playwright officially recommends its CLI for coding-agent workflows due to significantly lower token consumption and longer agentic testing sessions.


Note: There are use cases where MCP-based agents would still be arguably prefered over CLI (e.g. rich exploratory testing sessions,  debugging complex UI bugs). 

--- 

## Overview

This repository provides Playwright-CLI agent definitions (markdown files) that can be used to execute these workflows:

- Explore and browse a site and create a test plan of the explored test scenarios 
- Generate playwright tests (spec.ts files) for each scenario in the plan
- Run the tests to verify all tests passed. If there are failing tests it debugs the root cause, repairs the failing test or, if it can't,  marks the test  with the `fix.me` fixture

Each of these workflows can be run in any AI-assisted development environment such as Codex, Claude Code, GitHub Copilot or Cursor.

The full workflow (planning, code generation and debugging/fixing tests) of these agents is, by the nature of their work, sequential (as opposed to parallel).

All the agents rely on `Playwright CLI` to do their job and do not use Playwright MCP tools nor any other MCP. 

All agents are fully autonomous and will generally execute their task in one go. However, they may ocassionally stop to ask user's permission if they encounter a decision for which they need permissions out of their their current settings (e.g. network requests outside their workspace) 

Each agent definition, instructions and guardrails are in these markdown files:

- `planner-playwright-cli-agent.md`
- `generator-playwight-cli-agent.md` 
- `healer-playwright-cli-agent.md`

---

## Some use cases

You can use just one of the agents, a combination of them, or all of them depending on your needs 

### Planner agent workflow

- Planner will thoroughly explore the site (or a page/feature) and create a test plan in a markdown file. 

Note: You can prompt it to plan test scenarios for a specific page/feature or for the entire site (however, for better quality of output if your site under testing is large enough I recommend to plan one feature at a time)

This test plan can serve different purposes, depending on the user:

 **Manual testers**:

- It is a detailed test suite where each test scenario has detailed steps, preconditions and expected results. 

- Manual testers can use it as:
    - Straightforward instructions for execution.  
    - A *brainstorm* of possible test scenarios. These test case list can then be refined manually.  

**Automation testers**

- It contains playwright locator hints and suggested assertions for each test scenario. 

- This can be useful and a time-saver for automation testers that are implementing playwright tests


### Planner + Generator workflow

- Planner outputs a test plan.
- Generator will read the plan and implement each test scenario as a `spec.ts` file, probably using the suggested locators and assertions.
- It will stop when it finishes implementing the code. 

Note: Generator will just read the plan and implement code. However, it may use Playwright CLI to inspect the site when test plan info is missing, outdated or just not enough.

- **Generator will never run the tests it implements, not will it debug them if they don't pass (that's healer agent's job)**.

- You can also provide generator with your own human-written test plan, but for generator to better understand the plan it should be written in a markdown file using this template:

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



### Planner + Generator + Healer workflow
- Planner outputs a test plan.
- Generator outputs `spec.ts` files, one per test scenario defined in the plan.
- Healer runs the tests
    - If all test pass, healer finishes its work.
    - If there are failing tests, healer debugs the root cause:
        - If root cause is an issue in the test code (e.g., an flaky locator) it fixes it and rerun it until the test passes
        - If healer believes (after debugging and retesting) root cause is not an automation code issue, it marks the test with playwright fixture `test.fixme`
        - When all failed tests are either fixed or marked with `test.fixme` healer stops.

## Full autonomous workflow (not recommended)

You could write a prompt with all 3 agent definition files in context describing a sequential autonomous non-stop worflow. This would trigger planner to write a plan that generator would pick up and implement Playwright tests that eventually would be run by healer, which would also fix any failing test. 

However, agents make mistakes and you will most likely need to iterate a few times before you get the output you want. This is why a fully autonomous workflow is not probably the best idea when working with these agents. We recommend running each agent workflow separately. 


---

## Local setup

You need to have any of these: Codex app / Codex VSC extension, GitHub Copilot, OpenCode app, Claude Code, Cursor or any other app/extension with agentic capabilities.

You need to use at least Node 20 (*Node 22 is recommended)*  


### Install dependencies:

```sh
npm -D install
```
### Install Playwright CLI (globally)

```sh
npm install -g @playwright/cli
```
### Project configuration and test data

- Out of the box the project is configured to test a demo site (`parabank.parasoft.com`) and has a test user credentials in .env file. You should update the base URL as follows:

- In `playwright.config.ts` set baseUrl to the that of the target site:

```ts
export default defineConfig({
    ...
use: {
    baseURL: 'https://yourappundertest.com',
```
- If the site requires authentication you can provide your own test user credentials in the .env file or in a place of your choice (but then you should tell the agent the location of credentials at prompt time)

- **Important: Even if agents do not need to authenticate in the app under test delete the original contents of .env file**, otherwise the prompt will be noisy and it may confuse the agent. This in turn may result in low quality output.

### Agent permissions

- Provide your agent with read/write/run permissions limited to your project/workspace (for example: if you are using Codex, set permissions to `default permissions`)

### Agent context

- Add the agent definition markdown file to the agent context in your agent UI (e.g. Codex VSC extenstion UI)

- Before running an agent **always make sure their the project is not polluted** with agent-generated output files from previous runs (old test plans, old `spec.ts` files), nor with human generated files (e.g. `test-results` folder) or any reports your manual runs may have created. 

Examples: 

- If you rerun planner agent you should previously delete (or save somewhere else) the test plan it generated in the previous run

- If you run planner or generator agent you should previously delete `spec.ts` files with implemented tests that may have been generated in the previous run


## Example prompts 

### Planner

![Planner](./.github/assets/sample_prompt_planner.png)

### Generator

![Generator](./.github/assets/sample_prompt_generator.png)

### Healer

![Healer](./.github/assets/sample_prompt_healer.png)

