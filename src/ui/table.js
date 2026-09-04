import { FlexRender } from "@tanstack/table-core/flex-render";
import { findUser } from "../api/users.js";


export function renderTable(table, app) {

    const activeElement = document.activeElement;
    const activeColumnId = activeElement?.dataset?.columnId;
    const cursorPosition = activeElement?.selectionStart;
    const tableElement = document.createElement("table");
    tableElement.className = "data-table";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // ==================================================
    // HEADER
    // ==================================================
    table.getHeaderGroups().forEach((headerGroup) => {
        const headerRow = document.createElement("tr");

        headerGroup.headers.forEach((header) => {
            const headerCell = document.createElement("th");

            if (!header.isPlaceholder) {
                const headerText = String(FlexRender({ header }) ?? "");
                const sorted = header.column.getIsSorted();

                let arrow = "";

                if (sorted === "asc") {
                    arrow = " ↑";
                } else if (sorted === "desc") {
                    arrow = " ↓";
                }

                headerCell.textContent = headerText + arrow;

                headerCell.addEventListener("click", (event) => {
                    header.column.getToggleSortingHandler()?.(event);
                });
            }

            headerRow.appendChild(headerCell);
        });

        thead.appendChild(headerRow);
    });


    // ==================================================
    // BODY
    // ==================================================

    table.getRowModel().rows.forEach((row) => {
        const tr = document.createElement("tr");

        row.getAllCells().forEach(
            (cell) => {

                const td = document.createElement("td");
                let x = { cell: cell };
                console.log(x);
                td.textContent =
                    String(
                        FlexRender(x) ?? ""
                    );

                tr.appendChild(td);
            }
        );

        tbody.appendChild(tr);
    }
    );


    // ==================================================
    // PAGINATION
    // ==================================================

    const pagination = document.createElement("div");
    pagination.className = "pagination";

    const previous = document.createElement("button");
    previous.textContent = "Previous";
    previous.disabled = !table.getCanPreviousPage();


    previous.addEventListener("click", () => {
        table.previousPage();
    }
    );

    const page = document.createElement("span");
    page.textContent = `Page ${table.store.state.pagination.pageIndex + 1} `;

    const next = document.createElement("button");
    next.textContent = "Next";
    next.disabled = !table.getCanNextPage();


    next.addEventListener("click", () => {
        table.nextPage();
    }
    );


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


    // ==================================================
    // RESTORE SEARCH FOCUS
    // ==================================================

    if (activeColumnId) {

        const newInput = document.querySelector(`[data-column-id="${activeColumnId}"]`);

        if (newInput) {
            newInput.focus();
            if (
                cursorPosition !== null &&
                cursorPosition !== undefined
            ) {
                newInput.setSelectionRange(
                    cursorPosition,
                    cursorPosition
                );
            }
        }
    }
}