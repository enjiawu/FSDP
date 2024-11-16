# Full Stack Development Project

<br/>

<p align="center">
  <a href="https://github.com/enjiawu/FSDP">
    <img src="/cobalt-test/front-end/src/images/logo/logo.png" alt="CobaltTest Logo" width="400" height="auto"/>
  </a>
</p>

## The Team

| **Team Member**        | **Role**                 |
|------------------------|--------------------------|
| **Wu Enjia**            | Project Lead / Front-End Developer  |
| **Jayme Chua**          | Project Manager / Automation Engineer |
| **Timothy Chai**        | Automation Engineer |
| **Joseph Wan**          | Back-End Developer |
| **Shin Thant Aung**     | Back-End Developer  |

## About CobaltTest

CobaltTest is a full-stack application designed to streamline cross-browser regression testing. It supports the automation of up to 500 Selenium test cases, ensuring reliable performance across browsers such as Chrome, Firefox, and Edge. CobaltTest is tailored for testing critical applications, including consumer internet banking and internal HR systems.

### Key Features

1. **Application-Specific Dashboard**:
   - **Main Dashboard**: Displays real-time metrics and test results for individual applications.
   - **Test Cases Page**: Manage test cases—add, modify, or delete specific test cases for each application.
   - **History Page**: Track performance trends with detailed historical data.

2. **Centralized Test Management**:
   - **All Test Case Page**: Unified interface to upload, modify, and delete all test cases.
   - **All Applications Page**: Track and manage test results across multiple applications.
   - **All History Page**: Insights into pass/fail rates, execution frequency, and historical performance trends.

### Future Enhancements

| **Enhancement**                | **Description**                                                                                      |
|---------------------------------|------------------------------------------------------------------------------------------------------|
| **No-Code Test Case Creation**  | AI-driven script generation from simple text prompts, compatible with tools like TestCafe for complex scenarios. |
| **AI-Powered Optimization**     | AI predicts potential bug areas based on past failures, correlates with code changes, and dynamically schedules tests to optimize performance. |
| **Real-Time Notifications**     | Instant updates via email/SMS on test completions and failures, with customizable preferences.        |
| **Enhanced Security Layer**     | 3-tier account management system (Admins, Application Owners, Users) for role-based permissions and secure data access. |
| **Real-Time Dashboard Updates** | Automatic dashboard updates with instant test status, improving workflow efficiency.                 |
| **Jira & GitHub Integration**   | Test failures logged as tasks in Jira and GitHub with error details, syncing with OCBC's cloud for centralized access and data consistency. |

## Built With

- **React.js**: Front-end library for building dynamic user interfaces.
- **Node.js**: JavaScript runtime for server-side development.
- **MongoDB**: NoSQL database for storing test data and results.
- **Jenkins**: CI/CD tool for automating test execution and integration.

## Getting Started

To set up and run CobaltTest locally, follow these steps.

### Prerequisites

- **npm**: Make sure npm is installed on your machine.
  ```sh
  npm install
  ```

- **Jenkins** (for CI/CD integration)
  - Follow the Jenkins [installation guide](https://www.jenkins.io/doc/book/installing/).

### Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/enjiawu/FSDP.git
   ```
2. **Project Setup**
    - Install dependencies:
     ```sh
     npm install
     ```
   - Navigate to the frontend folder:
     ```sh
     cd cobalt-test/frontend
     ```
   - Install front-end dependencies:
     ```sh
     npm install
     ```
   - Start the React application:
     ```sh
     npm start
     ```

## Acknowledgments

- **TailAdmin React Dashboard Template**: The UI for this application was built using the help of [TailAdmin React Dashboard Template](https://tailadmin.com/react).
- **TestCafe**: For automated browser testing.
- **Jenkins**: For CI/CD integration.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
