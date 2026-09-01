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

import { storeReactivityBindings } from "@tanstack/table-core/store-reactivity-bindings";

// ==================================================
// DATA
// ==================================================

const data = [
  {
    id: 1,
    name: "John",
    age: 25,
  },
  {
    id: 2,
    name: "Alice",
    age: 30,
  },
  {
    id: 3,
    name: "Bob",
    age: 22,
  },
  {
    id: 4,
    name: "Ram",
    age: 18,
  },
  {
    id: 5,
    name: "Sham",
    age: 13,
  },
  {
    id: 6,
    name: "Jam",
    age: 14,
  },
  {
    id: 7,
    name: "Dam",
    age: 13,
  },
];

// ==================================================
// FEATURES
// ==================================================

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),

  // Sorting
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),

  // Column Filtering
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },

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
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },

  {
    accessorKey: "age",
    header: "Age",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
];

// ==================================================
// CREATE TABLE
// ==================================================

const table = constructTable({
  features,
  columns,
  data,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 3,
    },
  },
});

// ==================================================
// APP
// ==================================================

const app = document.querySelector("#app");
if (!app) {
  throw new Error("Missing #app element");
}

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
    // ----------------------------------------------
    // Header row
    // ----------------------------------------------

    const headerRow = document.createElement("tr");

    // ----------------------------------------------
    // Filter row
    // ----------------------------------------------

    const filterRow = document.createElement("tr");

    headerGroup.headers.forEach((header) => {
      const headerCell = document.createElement("th");

      const filterCell = document.createElement("th");

      if (!header.isPlaceholder) {
        // ==========================================
        // COLUMN NAME
        // ==========================================

        headerCell.textContent = String(FlexRender({ header }) ?? "");

        // ==========================================
        // SORTING
        // ==========================================

        headerCell.addEventListener("click", (event) => {
          header.column.getToggleSortingHandler()?.(event);
        });

        // ==========================================
        // COLUMN SEARCH
        // ==========================================

        const input = document.createElement("input");

        input.type = "text";

        input.placeholder = "Search...";

        // Show existing filter value
        input.value = String(header.column.getFilterValue() ?? "");

        // Update column filter
        input.addEventListener("input", (event) => {
          header.column.setFilterValue(event.target.value);
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

      td.textContent = String(FlexRender({ cell }) ?? "");

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  // ==================================================
  // PAGINATION
  // ==================================================

  const pagination = document.createElement("div");

  // ----------------------------------------------
  // Previous
  // ----------------------------------------------

  const previous = document.createElement("button");

  previous.textContent = "Previous";

  previous.disabled = !table.getCanPreviousPage();

  previous.addEventListener("click", () => {
    table.previousPage();
  });

  // ----------------------------------------------
  // Page number
  // ----------------------------------------------

  const page = document.createElement("span");

  page.textContent = ` Page ${table.store.state.pagination.pageIndex + 1} `;

  // ----------------------------------------------
  // Next
  // ----------------------------------------------

  const next = document.createElement("button");

  next.textContent = "Next";

  next.disabled = !table.getCanNextPage();

  next.addEventListener("click", () => {
    table.nextPage();
  });

  pagination.append(previous, page, next);

  // ==================================================
  // PUT EVERYTHING INTO DOM
  // ==================================================

  tableElement.appendChild(thead);

  tableElement.appendChild(tbody);

  app.replaceChildren(tableElement, pagination);
}

// ==================================================
// TABLE STATE CHANGES
// ==================================================

table.store.subscribe(() => {
  renderTable();
});

// ==================================================
// INITIAL RENDER
// ==================================================

renderTable();
