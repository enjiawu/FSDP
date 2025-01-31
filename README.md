# Full Stack Development Project

<br/>

<p align="center">
  <a href="https://github.com/enjiawu/FSDP">
    <img src="/cobalt-test/front-end/src/images/logo/logo.png" alt="CobaltTest Logo" width="400" height="auto"/>
  </a>
</p>

## The Team

| **Team Member**        | **Role**                              | **Additional Features**    |
|------------------------|---------------------------------------|----------------------------|
| **Wu Enjia**           | Project Lead / Front-End Developer    | No-code test case creation |   
| **Jayme Chua**         | Project Manager / Automation Engineer | AI-powered Chatbot         |
| **Timothy Chai**       | Automation Engineer                   | Real-time dashboard updates|
| **Joseph Wan**         | Back-End Developer                    | Enhanced security layer    |
| **Shin Thant Aung**    | Back-End Developer                    | Real-time notifications    |

## About CobaltTest

CobaltTest is a full-stack application designed to streamline cross-browser regression testing. It supports the automation of up to 500 Selenium test cases, ensuring reliable performance across browsers such as Chrome, Firefox, and Edge. CobaltTest is tailored for testing critical applications, including consumer internet banking and internal HR systems.

---

## Stage 1 Features

1. **Application-Specific Dashboard**:
   - **Main Dashboard**: Displays real-time metrics and test results for individual applications.
   - **Test Cases Page**: Manage test cases—add, modify, or delete specific test cases for each application.
   - **History Page**: Track performance trends with detailed historical data.

2. **Centralized Test Management**:
   - **All Test Case Page**: Unified interface to upload, modify, and delete all test cases.
   - **All Applications Page**: Track and manage test results across multiple applications.
   - **All History Page**: Insights into pass/fail rates, execution frequency, and historical performance trends.

---

## Stage 2 Features

### Improvement
- Completed Stage 1 Dashboard (fully functioning with actual data).
- Added error logging (images, code, etc.).
- Implemented a quick view of test cases, including descriptions, expected outputs, and steps taken.
- Set up source control to track edits to test cases and created a public repository to manage test cases.

### New Features
- **No-Code Test Case Creation**: Enabled test case creation without writing code, simplifying the process for non-technical users.
- **Real-Time Notifications**: Implemented instant notifications (email/SMS) for test completions and failures.
- **Real-Time Dashboard Updates**: Enhanced the dashboard to provide real-time updates on test statuses.
- **AI-Powered Optimization**: Integrated AI to predict potential bug areas and dynamically schedule tests for optimal performance.
- **Enhanced Security Layer**: Added a 3-tier account management system (Admins, Application Owners, Users) for role-based permissions and secure data access.

---

## Future Enhancements

| **Enhancement**                | **Description**                                                                                      |
|---------------------------------|------------------------------------------------------------------------------------------------------|
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
