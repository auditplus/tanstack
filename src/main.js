import { constructTable } from "@tanstack/table-core";

import { features } from "./table/features.js";
import { columns } from "./table/columns.js";
import { renderTable } from "./ui/table.js";
import "./styles.css";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Missing #app element");
}

const tableRoot = document.createElement("div");
tableRoot.className = "table-root";
app.appendChild(tableRoot);

const requestPanel = document.createElement("section");
requestPanel.className = "request-panel";
requestPanel.innerHTML = `
  <div class="request-header">
    <h3>API Request</h3>
  </div>

  <div class="request-grid">
    <label>
      <span>URL</span>
      <input id="request-url" type="text" value="http://192.168.1.73:9000/api/execute" />
    </label>

    <label>
      <span>Auth Token</span>
      <input id="request-token" type="text" value="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInNjb3BlIjoibWVtYmVyIn0.eyJpZCI6eyIkb2lkIjoiNjc3NDg1ODAwMDAwMDAwMDAwMDAwMDAwIn0sIm5hbWUiOiJhZG1pbiIsImlzUm9vdCI6dHJ1ZSwicmVtb3RlQWNjZXNzIjp0cnVlLCJwZXJtcyI6bnVsbCwiaXN1IjoxNzg4MzQwNzkyLCJleHAiOjE3ODg0MjcxOTIsInNlc3Npb24iOiIwMWEwNjE2YS1lYjQzLTcwNTAtYTU2My0zNjcyZGM1Yzc1OWIiLCJjbGllbnQiOm51bGx9.8LQB7RqpC9WQ2DNR97O4C3sR81jJkkMYsksP48NMW8w" />
    </label>
  </div>

  <label>
    <span>Body</span>
    <textarea id="request-body" rows="10">{
  "name": "sale_analysis",
  "args": [
    {
      "groupBy": "Inventory",
      "fromDate": {
        "$dt": "2026-09-02T00:00:00+00:00"
      },
      "toDate": {
        "$dt": "2026-09-02T00:00:00+00:00"
      },
      "branchId": [],
      "inventoryId": [],
      "warehouseId": [],
      "customerId": [],
      "sectionId": [],
      "manufacturerId": [],
      "salesPersonId": [],
      "categoryId": [],
      "subCategoryId": [],
      "profitCalculationBasedOn": null,
      "sort": null
    }
  ]
}</textarea>
  </label>

  <div class="request-actions">
    <button id="send-request" type="button">Send Request</button>
  </div>

  <div class="response-box">
    <h4>Response Count</h4>
    <div id="request-response">0 records</div>
  </div>
`;
app.appendChild(requestPanel);

const requestUrlInput = requestPanel.querySelector("#request-url");
const requestTokenInput = requestPanel.querySelector("#request-token");
const requestBodyInput = requestPanel.querySelector("#request-body");
const requestResponse = requestPanel.querySelector("#request-response");
const sendRequestButton = requestPanel.querySelector("#send-request");

let activeTable = null;

function buildColumnsFromRows(rows) {
  if (!rows.length) {
    return columns;
  }

  const orderedKeys = [
    "name",
    "assetValue",
    "sold",
    "saleValue",
    "profitValue",
    "profitPercentage",
  ];

  return orderedKeys
    .filter((key) => key in rows[0])
    .map((key) => ({
      accessorKey: key,
      header: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (value) => value.toUpperCase())
        .replace(/\s+/g, " ")
        .trim(),
      cell: (info) => {
        const value = info.getValue();

        if (value && typeof value === "object" && value.$oid) {
          return value.$oid;
        }

        return value ?? "";
      },
      filterFn: "includesString",
    }));
}

async function start() {
  const initialData = [
    {
      sold: 0,
      saleValue: 0,
      assetValue: 0,
      profitValue: 0,
      name: "No data yet",
      profitPercentage: 0,
    },
  ];

  const table = constructTable({
    features,
    columns,
    data: initialData,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 8,
      },
    },
  });

  activeTable = table;

  table.store.subscribe(() => {
    renderTable(table, tableRoot);
  });

  renderTable(table, tableRoot);

  sendRequestButton.addEventListener("click", async () => {
    try {
      const url = requestUrlInput.value.trim();
      const token = requestTokenInput.value.trim();
      const bodyText = requestBodyInput.value.trim();

      const parsedBody = JSON.parse(bodyText);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(parsedBody),
      });

      const payload = await response.json();
      const rows = Array.isArray(payload?.data) ? payload.data : [];

      requestResponse.textContent = `${rows.length} records`;

      if (activeTable) {
        const responseColumns = buildColumnsFromRows(rows.length ? rows : initialData);

        activeTable.setOptions((previous) => ({
          ...previous,
          data: rows.length ? rows : initialData,
          columns: responseColumns,
        }));

        renderTable(activeTable, tableRoot);
      }
    } catch (error) {
      requestResponse.textContent = `Request failed:\n${error.message}`;
    }
  });
}

start();