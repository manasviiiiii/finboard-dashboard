# FinBoard – Dynamic Dashboard Application

FinBoard is a dynamic, widget-based dashboard built using **Next.js** and **React**.  
It allows users to create customizable dashboards by adding widgets that fetch and display real-time data from external APIs.

---

## 🚀 Features

### Widget Types
- **Card Widget** – Displays a single numeric value (e.g., Bitcoin price)
- **Table Widget** – Displays structured key–value data
- **Chart Widget** – Displays time-series data using charts

### Widget Management
- Add widgets via modal
- Remove widgets individually
- Widgets persist across page refresh

### API Integration
- Fetches real-time data from public APIs (e.g., CoinGecko)
- Configurable refresh interval per widget
- Graceful error handling for failed API requests

### Auto Refresh
- Each widget refreshes independently based on its configured interval

### Light / Dark Mode
- Toggle between light and dark themes
- Theme preference persists using `localStorage`
- Implemented using CSS variables and class-based toggling

---

## 🛠 Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Zustand (Global State Management)
- Recharts (Chart Visualization)
- Tailwind CSS
- CSS Variables (Theme Management)

---


---

## ⚙️ How the Application Works

### Global State Management
Zustand is used to manage widgets globally.  
The store handles:
- Adding widgets
- Removing widgets
- Loading widgets from `localStorage`

### Widget Rendering
The Dashboard component reads widgets from the global store.  
Each widget is rendered using a reusable `WidgetCard` component.  
The widget type determines whether a **card**, **table**, or **chart** is displayed.

### Data Fetching
Each widget independently fetches data from its configured API endpoint.  
Data refreshes automatically using `setInterval`.  
Errors during fetch are displayed gracefully in the UI.

### Theme Handling
Light/Dark mode is implemented using CSS variables.  
A `dark` class is toggled on the root HTML element.  
The selected theme is persisted in `localStorage`.

---

## 🔌 Sample API Endpoints Used

### Card Widget
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd

### Table Widget
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd

### Chart Widget
https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7

---

## ▶️ How to Run the Project

Install dependencies:
```bash
npm install
npm run dev
http://localhost:3000


