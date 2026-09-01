import {
  constructTable,
  tableFeatures,

  // sorting
  rowSortingFeature,
  createSortedRowModel,

  // filtering
  columnFilteringFeature,
  globalFilteringFeature,
  createFilteredRowModel,

  // pagination
  rowPaginationFeature,
  createPaginatedRowModel,
} from "@tanstack/table-core";

import { FlexRender } from "@tanstack/table-core/flex-render";

import { storeReactivityBindings } from "@tanstack/table-core/store-reactivity-bindings";

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

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),

  // sorting
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),

  // filtering
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),

  // pagination
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: (info) => info.getValue(),
  },
];

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

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Missing #app element");
}

function renderTable() {
  const search = document.createElement("input");

  search.placeholder = "Search...";

  search.value = table.store.state.globalFilter ?? "";

  search.addEventListener("input", (event) => {
    table.setGlobalFilter(event.target.value);
  });

  const tableElement = document.createElement("table");

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // HEADER
  table.getHeaderGroups().forEach((headerGroup) => {
    const tr = document.createElement("tr");

    headerGroup.headers.forEach((header) => {
      const th = document.createElement("th");

      if (!header.isPlaceholder) {
        th.textContent = String(FlexRender({ header }) ?? "");

        // Click header to sort
        th.addEventListener("click", (event) => {
          header.column.getToggleSortingHandler()?.(event);
        });
      }

      tr.appendChild(th);
    });

    thead.appendChild(tr);
  });

  // BODY
  table.getRowModel().rows.forEach((row) => {
    const tr = document.createElement("tr");

    row.getAllCells().forEach((cell) => {
      const td = document.createElement("td");

      td.innerHTML = String(FlexRender({ cell }) ?? "");

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  // ------------------------------------------------
  // PAGINATION
  // ------------------------------------------------

  const pagination = document.createElement("div");

  // Previous
  const previous = document.createElement("button");

  previous.textContent = "Previous";

  previous.disabled = !table.getCanPreviousPage();

  previous.addEventListener("click", () => {
    table.previousPage();
  });

  // Page number
  const page = document.createElement("span");

  page.textContent = ` Page ${table.store.state.pagination.pageIndex + 1} `;

  // Next
  const next = document.createElement("button");

  next.textContent = "Next";

  next.disabled = !table.getCanNextPage();

  next.addEventListener("click", () => {
    table.nextPage();
  });

  pagination.append(previous, page, next);

  tableElement.appendChild(thead);
  tableElement.appendChild(tbody);

  app.replaceChildren(search, tableElement, pagination);
}

table.store.subscribe(() => {
  renderTable();
});

renderTable();
