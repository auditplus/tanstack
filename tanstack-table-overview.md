# TanStack Table Overview

This project uses the core TanStack Table library (`@tanstack/table-core`) rather than the React wrapper. The table setup is spread across the following files:

- `src/main.js`
- `src/table/features.js`
- `src/table/columns.js`
- `src/table/filters.js`
- `src/ui/table.js`

## 1) `constructTable`

Used in `src/main.js`.

Creates the actual table instance from:

- `columns`
- `data`
- `features`
- `initialState`

This is the main table engine that manages state and behavior.

## 2) `tableFeatures`

Defined in `src/table/features.js`.

This registers the features the table supports. In this app, it enables:

- sorting
- filtering
- pagination
- store reactivity

## 3) `storeReactivityBindings`

Imported from `@tanstack/table-core/store-reactivity-bindings`.

This keeps the table state reactive. Because of it, the app can subscribe to table-store changes and re-render the table whenever filters, sort state, or pagination changes.

## 4) `rowSortingFeature` + `createSortedRowModel`

Enabled in `src/table/features.js`.

Adds sort support for rows. When a user clicks a column header, the table toggles sorting for that column and reorders the rows.

The click handler is wired in `src/ui/table.js` using:

- `header.column.getToggleSortingHandler()`

## 5) `columnFilteringFeature` + `createFilteredRowModel`

Enabled in `src/table/features.js`.

Adds filter support to columns. Each column can have its own filter logic, and the table automatically filters rows based on the current filter values.

The UI creates filter inputs under the headers in `src/ui/table.js`.

## 6) `filterFn_includesString`

Used in `src/table/features.js`.

This is the built-in string filter function. It is assigned to most of the columns, such as:

- `id`
- `firstName`
- `lastName`
- `age`
- `email`

It checks whether the cell value contains the text typed by the user.

## 7) Custom `genderFilterFn`

Defined in `src/table/filters.js`.

This custom filter handles the `gender` column, which is not a plain text search. It supports:

- `both` → show all rows
- `male` → show only male rows
- `female` → show only female rows

This is assigned to the `gender` column in `src/table/columns.js`.

## 8) `rowPaginationFeature` + `createPaginatedRowModel`

Enabled in `src/table/features.js`.

Adds pagination support. The table keeps track of which page is active and only shows a subset of rows at a time.

The app sets:

- `pageIndex: 0`
- `pageSize: 8`

in `src/main.js`.

## 9) Column definitions

Defined in `src/table/columns.js`.

Each column includes:

- `accessorKey`: the row property to read
- `header`: visible column label
- `cell`: how the value is rendered
- `filterFn`: which filter logic to use

Example columns include:

- `id`
- `firstName`
- `lastName`
- `age`
- `gender`
- `email`

## 10) `FlexRender`

Imported from `@tanstack/table-core/flex-render`.

Used in `src/ui/table.js` to render table cells and headers cleanly. It helps TanStack output values in the DOM without hardcoded assumptions about the structure.

## 11) Direct TanStack methods used in the renderer

These are the exact TanStack API calls used inside `src/ui/table.js`:

- `table.getHeaderGroups()`
  - Returns the grouped header model from TanStack so the app can render the header row and filter row.
- `table.getRowModel().rows`
  - Returns the current filtered/sorted/paginated rows.
- `table.getCanPreviousPage()`
  - Tells the UI whether the previous-page button should be enabled.
- `table.getCanNextPage()`
  - Tells the UI whether the next-page button should be enabled.
- `table.previousPage()` / `table.nextPage()`
  - TanStack pagination actions that move the current page index.
- `table.store.subscribe(...)`
  - Subscribes to table state updates so rendering happens whenever state changes.
- `table.store.state.pagination.pageIndex`
  - Reads the current pagination state from TanStack’s internal store.

On each column, these TanStack methods are used:

- `header.column.getToggleSortingHandler()`
  - Activates the sort toggle when the header is clicked.
- `header.column.getFilterValue()`
  - Reads the current filter value for that column.
- `header.column.setFilterValue(value)`
  - Updates the filter value in TanStack state.

This is the key point: the code is not using plain DOM table logic. It is using TanStack's table state and model, then converting that into HTML in the browser.

## Summary

This app uses TanStack Table for:

- rendering rows and columns
- sorting by clicking headers
- filtering by text and custom logic
- pagination
- reactive state updates
- DOM rendering via custom UI code

In short, TanStack Table is acting as the table engine and state manager, while the project’s custom JavaScript is handling the browser rendering and controls.
