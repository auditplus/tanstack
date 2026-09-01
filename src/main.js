import {
  constructTable,
  tableFeatures,

  // Sorting
  rowSortingFeature,
  createSortedRowModel,

  // Column filtering
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,

  // Pagination
  rowPaginationFeature,
  createPaginatedRowModel,
} from "@tanstack/table-core";

import { FlexRender } from "@tanstack/table-core/flex-render";

import { storeReactivityBindings } from
  "@tanstack/table-core/store-reactivity-bindings";


// ==================================================
// FEATURES
// ==================================================

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),

  // Sorting
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),

  // Filtering
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),

  filterFns: {
    includesString: filterFn_includesString,
  },

  // Pagination
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});


// ==================================================
// COLUMNS
// ==================================================

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },

  {
    accessorKey: "firstName",
    header: "First Name",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },

  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },

  {
    accessorKey: "age",
    header: "Age",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },

  {
    accessorKey: "gender",
    header: "Gender",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
];


// ==================================================
// APP
// ==================================================

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Missing #app element");
}


// ==================================================
// LOAD DATA
// ==================================================

async function loadUsers() {

  const response = await fetch(
    "https://dummyjson.com/users"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const result = await response.json();

  return result.users;
}


// ==================================================
// START APPLICATION
// ==================================================

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
        pageSize: 8,
      },
    },
  });


  // ==================================================
  // RENDER TABLE
  // ==================================================

  function renderTable() {

    const tableElement = document.createElement("table");

    const thead = document.createElement("thead");

    const tbody = document.createElement("tbody");


    // ==================================================
    // HEADER
    // ==================================================

    table.getHeaderGroups().forEach((headerGroup) => {

      const headerRow = document.createElement("tr");

      const filterRow = document.createElement("tr");


      headerGroup.headers.forEach((header) => {

        const headerCell = document.createElement("th");

        const filterCell = document.createElement("th");


        if (!header.isPlaceholder) {

          // ------------------------------------------
          // Header
          // ------------------------------------------

          headerCell.textContent = String(
            FlexRender({ header }) ?? ""
          );


          // ------------------------------------------
          // Sorting
          // ------------------------------------------

          headerCell.addEventListener("click", (event) => {

            header.column
              .getToggleSortingHandler()
              ?. (event);

          });


          // ------------------------------------------
          // Column search
          // ------------------------------------------

          const input = document.createElement("input");

          input.type = "text";

          input.placeholder = "Search...";


          input.value = String(
            header.column.getFilterValue() ?? ""
          );


          input.addEventListener("input", (event) => {

            header.column.setFilterValue(
              event.target.value
            );

          });


          filterCell.appendChild(input);
        }


        headerRow.appendChild(headerCell);

        filterRow.appendChild(filterCell);

      });


      thead.appendChild(headerRow);

      thead.appendChild(filterRow);

    });


    // ==================================================
    // BODY
    // ==================================================

    table.getRowModel().rows.forEach((row) => {

      const tr = document.createElement("tr");


      row.getAllCells().forEach((cell) => {

        const td = document.createElement("td");


        td.textContent = String(
          FlexRender({ cell }) ?? ""
        );


        tr.appendChild(td);

      });


      tbody.appendChild(tr);

    });


    // ==================================================
    // PAGINATION
    // ==================================================

    const pagination = document.createElement("div");


    // Previous
    const previous = document.createElement("button");

    previous.textContent = "Previous";

    previous.disabled =
      !table.getCanPreviousPage();


    previous.addEventListener("click", () => {

      table.previousPage();

    });


    // Page number
    const page = document.createElement("span");

    page.textContent =
      ` Page ${
        table.store.state.pagination.pageIndex + 1
      } `;


    // Next
    const next = document.createElement("button");

    next.textContent = "Next";

    next.disabled =
      !table.getCanNextPage();


    next.addEventListener("click", () => {

      table.nextPage();

    });


    pagination.append(
      previous,
      page,
      next
    );


    // ==================================================
    // DISPLAY
    // ==================================================

    tableElement.appendChild(thead);

    tableElement.appendChild(tbody);


    app.replaceChildren(
      tableElement,
      pagination
    );
  }


  // ==================================================
  // LISTEN FOR TABLE CHANGES
  // ==================================================

  table.store.subscribe(() => {

    renderTable();

  });


  // ==================================================
  // FIRST RENDER
  // ==================================================

  renderTable();
}


// ==================================================
// RUN
// ==================================================

start();