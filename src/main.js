import { constructTable } from "@tanstack/table-core";
import { features } from "./table/features.js";
import { columns } from "./table/columns.js";
import { loadUsers } from "./api/users.js";
import { renderTable } from "./ui/table.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Missing #app element");
}


async function start() {

  // Get users from API
  const data = await loadUsers();

  // Create TanStack table
  const table = constructTable({
      features,
      columns,
      data,
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 5,
        },
      },
    });

  // Render whenever state changes
  table.store.subscribe(() => {
    renderTable(
      table,
      app
    );
  });

  // Initial render
  renderTable(
    table,
    app
  );
}

start();