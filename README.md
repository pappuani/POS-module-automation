# 🍽️ Cafe QR POS - Playwright E2E Automation Suite

A robust end-to-end (E2E) automated testing suite built with **Playwright** and **TypeScript** to verify the critical path workflows of the Cafe QR Point of Sale (POS) application.

## 🚀 Key Features Automated
- 🛒 **Checkout Flows**: Complete test coverage for three core order fulfillment types:
  - **Dine-in Order**: Add items to the cart, send them to the kitchen, and complete cash settlement on tables.
  - **Takeaway Order**: Guest checkouts with cash payment processed through the kitchen.
  - **Delivery Order**: End-to-end checkout with delivery address processing.
- 🔧 **Self-Healing Table Lock Handling**: Automatically detects if table `WA` is occupied from previous runs, completes the active order on the Kitchen Display System (KDS), and resets the table state before beginning new tests.
- 📷 **Test Artifacts**: Capture browser screenshots and video recordings of all test flows, as well as trace logs for failure investigations.

---

## 🛠️ Technology Stack
- **Framework**: Playwright (v1.44+)
- **Language**: TypeScript
- **Design Pattern**: Page Object Model (POM)
- **CI/CD Compatibility**: Configured to capture tracing, screenshots, and videos on both local and headful environments.

---

## 🐛 Bugs & UX Limitations Discovered
During the automation process, the following critical issues were identified in the Cafe QR application:
1. **Sales History Redirection Bug**: The "Sales History" button on the POS page incorrectly redirects users to the KDS page (`/owner/orders`) instead of showing past sales logs.
2. **Occupied Table Locking**: When a table is occupied, it is completely disabled on the sales screen. A cashier cannot add new items or settle the bill from the POS screen; they must navigate to the KDS page to manage active orders.
3. **No Direct Order Recall**: Active Takeaway or Delivery orders cannot be recalled on the sales screen after being sent to the kitchen. Cashiers must open the KDS to manage and settle them.

---

## 💻 Quick Start & Running Tests

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Test Suite
- **Run all tests (headless)**:
  ```bash
  npx playwright test
  ```
- **Run in Interactive UI Mode (Visual dashboard)**:
  ```bash
  npx playwright test --ui
  ```
- **View HTML Test Report**:
  ```bash
  npx playwright show-report
  ```

---

## 📬 Contact & Portfolio
Developed by **pappuani**
- **Email**: pappuani8@gmail.com
- **GitHub**: [pappuani](https://github.com/pappuani)
