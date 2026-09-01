// Tell TanStack how Gender filtering works.
export const genderFilterFn = (row, columnId, filterValue) => {
  // Both = show everyone
  if (!filterValue || filterValue === "both") {
    return true;
  }

  return row.getValue(columnId) === filterValue;
};
