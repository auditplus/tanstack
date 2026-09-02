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

Current active columns include:

- `id`
- `firstName`
- `lastName`
- `age`
- `birthDate`
- `gender`

The `email` column is currently commented out in `src/table/columns.js` and is not active in the table.

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

## Complete TanStack Table API used in this project

These are all the TanStack table pieces actually used in the app:

### Core construction and state

- `constructTable(...)`
  - Creates the table instance from columns, data, features, and initial state.
- `table.store.subscribe(...)`
  - Reacts to updates in the table store.
- `table.store.state.pagination.pageIndex`
  - Reads the current page index from TanStack state.

### Feature registration

- `tableFeatures(...)`
  - Registers enabled features.
- `storeReactivityBindings()`
  - Makes table state reactive.
- `rowSortingFeature`
  - Enables row sorting.
- `columnFilteringFeature`
  - Enables column filtering.
- `rowPaginationFeature`
  - Enables pagination.

### Models

- `createSortedRowModel()`
  - Produces the sorted row model.
- `createFilteredRowModel()`
  - Produces the filtered row model.
- `createPaginatedRowModel()`
  - Produces the paginated row model.

### Filter functions

- `filterFn_includesString`
  - Built-in string match filter used by most text columns.
- `genderFilterFn`
  - Custom custom filter for the gender column.
- `filterFns: { includesString: ... }`
  - Registers the custom filter name used in column definitions.

### Column definitions

- `accessorKey`
  - Tells TanStack which field to read from each row.
- `header`
  - Display title for the column.
- `cell`
  - Renderer for each value.
- `cell: (info) => info.getValue()`
  - Common pattern used to output the underlying value from a cell.
- `filterFn`
  - Which filter behavior should apply to that column.

### Header and row accessors

- `table.getHeaderGroups()`
  - Gets the grouped header model.
- `header.isPlaceholder`
  - Indicates whether a header cell is a placeholder.
- `header.column.id`
  - Column id used to identify the column.
- `header.column.getToggleSortingHandler()`
  - Sort toggle handler for header clicks.
- `header.column.getIsSorted()`
  - Returns the current sort direction for the column (`asc`, `desc`, or false).
- `header.column.getFilterValue()`
  - Reads the active filter value for that column.
- `header.column.setFilterValue(value)`
  - Updates the filter value in TanStack state.
- `table.getRowModel().rows`
  - Gets the visible rows after sorting/filtering/pagination.
- `row.getAllCells()`
  - Gets all cells in a given row.
- `cell.getValue()` / `info.getValue()`
  - Reads the raw value from the current cell or column cell context.
- `row.getValue(columnId)`
  - Reads a value from a row by column id, used in the custom gender filter.

### Pagination actions

- `table.getCanPreviousPage()`
  - Checks whether previous page is available.
- `table.getCanNextPage()`
  - Checks whether next page is available.
- `table.previousPage()`
  - Moves to the previous page.
- `table.nextPage()`
  - Moves to the next page.

### Initial state

- `initialState: { pagination: { pageIndex, pageSize } }`
  - Sets the starting pagination state.

## Summary

This app uses TanStack Table for:

- rendering rows and columns
- sorting by clicking headers
- filtering by text and custom logic
- pagination
- reactive state updates
- DOM rendering via custom UI code

The current active columns are `id`, `firstName`, `lastName`, `age`, `birthDate`, and `gender`.
The `email` column is present in the code as a commented-out example and is not currently used by the rendered table.

In short, TanStack Table is acting as the table engine and state manager, while the project’s custom JavaScript is handling the browser rendering and controls.
