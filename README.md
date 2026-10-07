# 🍕 QuickPizza Performance Testing Suite

A code-based performance engineering framework developed in **Java** utilizing **JMeter Java DSL (`jmeter-java-dsl`)**, **JUnit 5**, and **AssertJ** targeting the [Grafana QuickPizza](https://quickpizza.grafana.com/) demonstration platform.

This suite replaces cumbersome XML test plans with version-controlled, strongly typed Java code, supporting automated load profiling, runtime SLA assertions, and HTML dashboard report generation.

---

## 🎯 Architecture & Features

- **JMeter as Code:** Entire test plans, transactions, timers, assertions, and reporting mechanisms are written directly in standard Java without opening the JMeter GUI.
- **Realistic User Journey:** Models complete business workflows (landing page $\to$ fetch recommendations $\to$ customize pizza $\to$ place order).
- **Phased Load Profiles:** Structured ramp-up (warm-up), steady-state holding, and ramp-down phases to evaluate system elasticity and stability.
- **Strict SLA Gatekeeping:** Automated threshold assertions on **p95/p99 response times** and **error percentages** to enforce performance standards in CI/CD pipelines.
- **HTML Dashboard Reporting:** Generates interactive JMeter APDEX reports, throughput charts, response time percentiles, and transaction breakdowns.

---

## 🧰 Tech Stack

| Component | Technology | Version |
| :--- | :--- | :--- |
| **Language** | Java | 17+ |
| **Performance Framework** | JMeter Java DSL | 1.29.1+ |
| **Assertion & Runner** | JUnit 5 & AssertJ | 5.10.2 / 3.25.3 |
| **Build & Dependency Management** | Apache Maven | 3.9+ |
| **Target Application** | Grafana QuickPizza | Public Demo |

---

## 📁 Project Structure

```text
quickpizza-performance-testing-suite/
├── src/
│   └── test/
│       └── java/
│           └── com/perf/
│               └── QuickPizzaLoadTest.java     # User journey test plan with SLA assertions
├── target/
│   └── reports/
│       └── quickpizza-report/                 # Generated JMeter HTML dashboard
├── pom.xml                                     # Maven build file with dependencies
├── .gitignore                                  # Ignores target/, IDE files, and logs
└── README.md
