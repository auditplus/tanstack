// What features does our table have?
import {
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  createPaginatedRowModel,
} from "@tanstack/table-core";

import { storeReactivityBindings } from "@tanstack/table-core/store-reactivity-bindings";

export const features = tableFeatures({
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
