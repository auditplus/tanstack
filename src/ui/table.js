import { FlexRender } from
    "@tanstack/table-core/flex-render";


export function renderTable(table, app) {

    const activeElement = document.activeElement;
    const activeColumnId = activeElement?.dataset?.columnId;
    const cursorPosition = activeElement?.selectionStart;
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

                headerCell.textContent =
                    String(
                        FlexRender({ header }) ?? ""
                    );


                // ------------------------------------------
                // Sorting
                // ------------------------------------------

                headerCell.addEventListener("click", (event) => {
                        header.column.getToggleSortingHandler()?.(event);
                    }
                );

                // ------------------------------------------
                // Gender dropdown
                // ------------------------------------------

                if ( header.column.id === "gender") {
                    const select = document.createElement("select");
                    const options = [
                        {
                            value: "both",
                            label: "Both",
                        },
                        {
                            value: "male",
                            label: "Male",
                        },
                        {
                            value: "female",
                            label: "Female",
                        },
                    ];

                    options.forEach((option) => {
                            const optionElement = document.createElement("option");
                            optionElement.value = option.value;
                            optionElement.textContent = option.label;
                            select.appendChild(optionElement);
                        }
                    );

                    select.value = header.column.getFilterValue() ?? "both";
                    select.addEventListener("change",(event) => {
                            header.column.setFilterValue(event.target.value);
                        }
                    );

                    filterCell.appendChild(select);

                }


                // ------------------------------------------
                // Normal search
                // ------------------------------------------

                else {

                    const input = document.createElement("input");
                    input.type = "text";
                    input.placeholder = "Search...";
                    input.dataset.columnId = header.column.id;
                    input.value =
                        String(
                            header.column
                                .getFilterValue() ?? ""
                        );


                    input.addEventListener( "input", (event) => {
                            header.column.setFilterValue(
                                    event.target.value
                                );
                        }
                    );

                    filterCell.appendChild(input);
                }
            }
            
            headerRow.appendChild(headerCell);
            filterRow.appendChild(filterCell);

        }
        );

        thead.appendChild(headerRow);
        thead.appendChild(filterRow);
    }
    );


    // ==================================================
    // BODY
    // ==================================================

    table.getRowModel().rows.forEach( (row) => {
            const tr = document.createElement("tr");

            row.getAllCells().forEach(
                (cell) => {

                    const td = document.createElement("td");
                    td.textContent =
                        String(
                            FlexRender({ cell }) ?? ""
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


    next.addEventListener("click",() => {
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