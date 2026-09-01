// What columns does my table have?
import { genderFilterFn } from "./filters.js";

export const columns = [
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
    filterFn: genderFilterFn,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
];
