// What columns does my table have?
import { genderFilterFn } from "./filters.js";

// export const columns = [
//   {
//     accessorKey: "id",
//     header: "ID",
//     cell: (info) => info.getValue(),
//     filterFn: "includesString",
//   },
//   {
//     accessorKey: "firstName",
//     header: "First Name",
//     cell: (info) => info.getValue(),
//     filterFn: "includesString",
//   },
//   {
//     accessorKey: "lastName",
//     header: "Last Name",
//     cell: (info) => info.getValue(),
//     filterFn: "includesString",
//   },
//   {
//     accessorKey: "age",
//     header: "Age",
//     cell: (info) => info.getValue(),
//     filterFn: "includesString",
//   },
//   // {
//   //   accessorKey: "email",
//   //   header: "Email",
//   //   cell: (info) => info.getValue(),
//   //   filterFn: "includesString",
//   // },
//   {
//     accessorKey: "birthDate",
//     header: "Birth Date",
//     cell: (info) => info.getValue(),
//     filterFn: "includesString",
//   },
//   {
//     accessorKey: "gender",
//     header: "Gender",
//     cell: (info) => info.getValue(),
//     filterFn: genderFilterFn,
//   },
// ];

export const columns = [
  {
    accessorKey: "name",
    header: "Particulars",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
  {
    accessorKey: "assetValue",
    header: "Asset Value",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
  {
    accessorKey: "sold",
    header: "Sold",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
  {
    accessorKey: "saleValue",
    header: "Sale Value",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
  {
    accessorKey: "profitValue",
    header: "Profit",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
  {
    accessorKey: "profitPercentage",
    header: "Profit %",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  },
];
