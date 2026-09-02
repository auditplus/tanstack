import { constructTable } from "@tanstack/table-core";

import { features } from "./table/features.js";
import { columns } from "./table/columns.js";
import { loadUsers, findUser } from "./api/users.js";
import { renderTable } from "./ui/table.js";
import "./styles.css";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Missing #app element");
}


async function start() {

  // Get users from API
  let data = await loadUsers();
  console.log(data);

  // Create TanStack table
  const table = constructTable({
    features,
    columns,
    data,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 8,
      },
    },
  });

  table._sourceData = data;

  // Render whenever state changes
  table.store.subscribe(() => {
    renderTable(table, app);
  });

  // Initial render
  renderTable(table, app);

  // Find users
  function findUsers(searchText) {
    const search = searchText.toLowerCase();

    const filteredData = data.filter((user) => {
      return (
        String(user.id).includes(search) ||
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.gender.toLowerCase().includes(search)
      );
    });

    table.setOptions((previous) => ({
      ...previous,
      data: filteredData,
    }));

    renderTable(table, app);
  }

}

start();