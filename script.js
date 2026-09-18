// ========================================
// DOM ELEMENTS
// ========================================

const calendarGrid =
    document.getElementById("calendarGrid");

const monthTitle =
    document.getElementById("monthTitle");

const prevMonthButton =
    document.getElementById("prevMonth");

const nextMonthButton =
    document.getElementById("nextMonth");

const todayButton =
    document.getElementById("todayButton");

const newTaskButton =
    document.getElementById("newTaskButton");

const searchButton =
    document.getElementById("searchButton");

const searchBox =
    document.getElementById("searchBox");

const searchInput =
    document.getElementById("searchInput");

const taskModal =
    document.getElementById("taskModal");

const closeModal =
    document.getElementById("closeModal");

const saveTaskButton =
    document.getElementById("saveTaskButton");

const taskDetailModal =
    document.getElementById("taskDetailModal");

const closeDetailModal =
    document.getElementById("closeDetailModal");

const editTaskButton =
    document.getElementById("editTaskButton");

const deleteTaskButton =
    document.getElementById("deleteTaskButton");

const completeTaskButton =
    document.getElementById("completeTaskButton");

const detailTaskName =
    document.getElementById("detailTaskName");

const detailTaskCategory =
    document.getElementById("detailTaskCategory");

const detailTaskDate =
    document.getElementById("detailTaskDate");

const detailTaskStart =
    document.getElementById("detailTaskStart");

const detailTaskEnd =
    document.getElementById("detailTaskEnd");

const detailTaskLocation =
    document.getElementById("detailTaskLocation");

const detailTaskDetails =
    document.getElementById("detailTaskDetails");

const upcomingTasks =
    document.getElementById("upcomingTasks");

const taskCount =
    document.getElementById("taskCount");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const upcomingTaskCount =
    document.getElementById("upcomingTaskCount");


// ========================================
// STATE
// ========================================

let selectedTaskId = null;

let editingTaskId = null;


// ========================================
// DATE
// ========================================

const today =
    new Date();

let currentMonth =
    today.getMonth();

let currentYear =
    today.getFullYear();

const todayString =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


// ========================================
// MONTH NAMES
// ========================================

const monthNames = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

];


// ========================================
// TASK DATA
// ========================================

let tasks =
    JSON.parse(
        localStorage.getItem("myTasks")
    ) || [];


// ========================================
// CROSS-DAY EVENT STYLE
// ========================================

const crossDayStyle =
    document.createElement("style");

crossDayStyle.textContent = `

    #calendarGrid {
        position: relative;
        column-gap: 0 !important;
        row-gap: 0 !important;
    }

    #calendarGrid .day {
        position: relative;
        z-index: 1;
        overflow: visible;
        box-sizing: border-box;
    }

    #calendarGrid .multi-day-event {
        position: relative;
        align-self: start;
        min-width: 0;
        height: 24px;
        box-sizing: border-box;

        padding: 3px 8px;

        margin-left: 0;
        margin-right: 0;

        border-radius: 7px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 6px;

        cursor: pointer;

        overflow: hidden;
        white-space: nowrap;

        color: #ffffff;

        font-size: 12px;
        font-weight: 600;

        box-shadow:
            0 1px 3px rgba(0,0,0,.12);

    }

    #calendarGrid .multi-day-event-label {

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        min-width: 0;

    }

    #calendarGrid .multi-day-event-end {

        flex-shrink: 0;

        font-size: 11px;
        font-weight: 700;

    }

    #calendarGrid .multi-day-event.completed {

        text-decoration: line-through;
        opacity: .6;

    }

`;

document.head.appendChild(
    crossDayStyle
);


// ========================================
// RENDER CALENDAR
// ========================================

function renderCalendar() {

    calendarGrid.innerHTML = "";

    calendarGrid.style.position =
        "relative";

    calendarGrid.style.columnGap =
        "0";

    calendarGrid.style.rowGap =
        "0";

    calendarGrid.style.gridTemplateColumns =
        "repeat(7, minmax(0, 1fr))";


    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        );


    const lastDay =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        );


    const totalDays =
        lastDay.getDate();


    const startDay =
        firstDay.getDay();


    const totalWeeks =
        Math.ceil(
            (startDay + totalDays) / 7
        );


    monthTitle.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;


    // ====================================
    // CREATE DAY CELLS
    // ====================================

    for (
        let cellIndex = 0;
        cellIndex < totalWeeks * 7;
        cellIndex++
    ) {

        const dayNumber =
            cellIndex - startDay + 1;


        const dayElement =
            document.createElement("div");


        dayElement.classList.add(
            "day"
        );


        dayElement.style.gridColumn =
            `${(cellIndex % 7) + 1}`;


        dayElement.style.gridRow =
            `${Math.floor(cellIndex / 7) + 1}`;


        // =================================
        // EMPTY CELL
        // =================================

        if (
            dayNumber < 1 ||
            dayNumber > totalDays
        ) {

            dayElement.classList.add(
                "empty"
            );

            calendarGrid.appendChild(
                dayElement
            );

            continue;

        }


        // =================================
        // DATE
        // =================================

        const dateString =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;


        // =================================
        // DAY NUMBER
        // =================================

        const number =
            document.createElement("span");


        number.textContent =
            dayNumber;


        dayElement.appendChild(
            number
        );


        // =================================
        // TODAY
        // =================================

        if (

            dayNumber === today.getDate() &&

            currentMonth ===
                today.getMonth() &&

            currentYear ===
                today.getFullYear()

        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // =================================
        // CLICK DAY
        // =================================

        dayElement.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".day.selected"
                    )
                    .forEach(
                        function (
                            selectedDay
                        ) {

                            selectedDay.classList.remove(
                                "selected"
                            );

                        }
                    );


                dayElement.classList.add(
                    "selected"
                );

            }
        );


        calendarGrid.appendChild(
            dayElement
        );

    }


    // ====================================
    // CREATE MULTI-DAY TASK BARS
    // ====================================

    const monthStart =
        new Date(
            currentYear,
            currentMonth,
            1
        );


    const monthEnd =
        new Date(
            currentYear,
            currentMonth,
            totalDays
        );


    const segments = [];


    tasks.forEach(
        function (task) {

            if (!task.date) {
                return;
            }


            const startDate =
                new Date(
                    task.date +
                    "T00:00:00"
                );


            const endDate =
                new Date(
                    (task.endDate ||
                        task.date) +
                    "T00:00:00"
                );


            // =================================
            // INVALID RANGE
            // =================================

            if (
                endDate < startDate
            ) {

                return;

            }


            // =================================
            // NOT IN CURRENT MONTH
            // =================================

            if (
                endDate < monthStart ||
                startDate > monthEnd
            ) {

                return;

            }


            const visibleStart =
                startDate > monthStart
                    ? startDate
                    : monthStart;


            const visibleEnd =
                endDate < monthEnd
                    ? endDate
                    : monthEnd;


            let segmentStart =
                new Date(
                    visibleStart
                );


            // =================================
            // SPLIT AT WEEK BOUNDARIES
            // =================================

            while (
                segmentStart <=
                visibleEnd
            ) {

                const dayOffset =
                    Math.floor(
                        (
                            segmentStart -
                            firstDay
                        ) /
                        86400000
                    );


                const cellIndex =
                    startDay +
                    dayOffset;


                const row =
                    Math.floor(
                        cellIndex / 7
                    ) + 1;


                const startColumn =
                    (
                        cellIndex % 7
                    ) + 1;


                const daysUntilSaturday =
                    6 -
                    segmentStart.getDay();


                let segmentEnd =
                    new Date(
                        segmentStart
                    );


                segmentEnd.setDate(
                    segmentEnd.getDate() +
                    daysUntilSaturday
                );


                if (
                    segmentEnd >
                    visibleEnd
                ) {

                    segmentEnd =
                        new Date(
                            visibleEnd
                        );

                }


                const endDayOffset =
                    Math.floor(
                        (
                            segmentEnd -
                            firstDay
                        ) /
                        86400000
                    );


                const endCellIndex =
                    startDay +
                    endDayOffset;


                const endColumn =
                    (
                        endCellIndex % 7
                    ) + 1;


                segments.push({

                    task: task,

                    row: row,

                    startColumn:
                        startColumn,

                    endColumn:
                        endColumn + 1,

                    startDate:
                        new Date(
                            segmentStart
                        ),

                    endDate:
                        new Date(
                            segmentEnd
                        )

                });


                segmentStart =
                    new Date(
                        segmentEnd
                    );


                segmentStart.setDate(
                    segmentStart.getDate() +
                    1
                );

            }

        }
    );


    // ====================================
    // FIND LANES
    // ====================================

    const lanesByRow = {};


    segments.forEach(
        function (segment) {

            if (
                !lanesByRow[
                    segment.row
                ]
            ) {

                lanesByRow[
                    segment.row
                ] = [];

            }


            let lane = 0;


            while (true) {

                const overlap =
                    lanesByRow[
                        segment.row
                    ].some(
                        function (existing) {

                            return (

                                existing.lane ===
                                    lane &&

                                !(
                                    segment.endColumn <=
                                        existing.startColumn ||

                                    segment.startColumn >=
                                        existing.endColumn
                                )

                            );

                        }
                    );


                if (!overlap) {
                    break;
                }


                lane++;

            }


            segment.lane =
                lane;


            lanesByRow[
                segment.row
            ].push(
                segment
            );

        }
    );


    // ====================================
    // DRAW TASK BARS
    // ====================================

    segments.forEach(
        function (segment) {

            const task =
                segment.task;


            const event =
                document.createElement(
                    "div"
                );


            event.classList.add(
                "event",
                "multi-day-event",
                getCategoryClass(
                    task.category
                )
            );


            if (
                task.completed
            ) {

                event.classList.add(
                    "completed"
                );

            }


            event.style.gridColumn =
                `${segment.startColumn} / ${segment.endColumn}`;


            event.style.gridRow =
                `${segment.row}`;


            event.style.zIndex =
                `${20 + segment.lane}`;


            event.style.marginTop =
                `${34 + (
                    segment.lane * 28
                )}px`;


            // =================================
            // LABEL
            // =================================

            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "multi-day-event-label";


            const taskStartsHere =
                segment.startDate.getTime() ===
                new Date(
                    task.date +
                    "T00:00:00"
                ).getTime();


            if (
                taskStartsHere
            ) {

                label.textContent =
                    task.start
                        ? `${task.start} ${task.name}`
                        : task.name;

            } else {

                label.textContent =
                    task.name;

            }


            event.appendChild(
                label
            );


            // =================================
            // END TIME
            // =================================

            const taskEndDate =
                new Date(
                    (task.endDate ||
                        task.date) +
                    "T00:00:00"
                );


            const endsHere =
                segment.endDate.getTime() ===
                taskEndDate.getTime();


            if (
                endsHere &&
                task.end
            ) {

                const endTime =
                    document.createElement(
                        "span"
                    );


                endTime.className =
                    "multi-day-event-end";


                endTime.textContent =
                    task.end;


                event.appendChild(
                    endTime
                );

            }


            // =================================
            // CLICK
            // =================================

            event.addEventListener(
                "click",
                function (e) {

                    e.stopPropagation();

                    openTaskDetail(
                        task
                    );

                }
            );


            calendarGrid.appendChild(
                event
            );

        }
    );


    // ====================================
    // SIDEBAR
    // ====================================

    renderUpcomingTasks();


    taskCount.textContent =
        tasks.length;


    totalTasks.textContent =
        tasks.length;


    completedTasks.textContent =
        tasks.filter(
            task =>
                task.completed
        ).length;


    upcomingTaskCount.textContent =
        tasks.filter(
            task =>
                (
                    task.endDate ||
                    task.date
                ) >= todayString &&
                !task.completed
        ).length;

}


// ========================================
// CATEGORY COLOR
// ========================================

function getCategoryClass(
    category
) {

    if (
        category === "video"
    ) {

        return "blue";

    }


    if (
        category === "design"
    ) {

        return "green";

    }


    if (
        category === "website"
    ) {

        return "purple";

    }


    return "blue";

}


// ========================================
// CATEGORY ICON
// ========================================

function getCategoryIcon(
    category
) {

    if (
        category === "video"
    ) {

        return "🎥";

    }


    if (
        category === "design"
    ) {

        return "🎨";

    }


    if (
        category === "website"
    ) {

        return "💻";

    }


    return "📋";

}


// ========================================
// TASK TIME
// ========================================

function taskStartText(
    task
) {

    if (!task.start) {

        return "";

    }


    return task.end
        ? `${task.start} - ${task.end} ·`
        : `${task.start} ·`;

}


// ========================================
// UPCOMING TASKS
// ========================================

function renderUpcomingTasks() {

    if (!upcomingTasks) {

        return;

    }


    upcomingTasks.innerHTML =
        "";


    const upcoming =
        tasks
            .filter(
                task =>
                    (
                        task.endDate ||
                        task.date
                    ) >= todayString
            )
            .sort(
                function (a, b) {

                    const dateA =
                        `${a.date} ${a.start || "23:59"}`;

                    const dateB =
                        `${b.date} ${b.start || "23:59"}`;

                    return dateA.localeCompare(
                        dateB
                    );

                }
            )
            .slice(
                0,
                5
            );


    if (
        upcoming.length === 0
    ) {

        upcomingTasks.innerHTML = `
            <div class="no-upcoming">
                ไม่มีงานที่กำลังจะมาถึง
            </div>
        `;

        return;

    }


    upcoming.forEach(
        function (task) {

            const taskElement =
                document.createElement(
                    "div"
                );


            taskElement.classList.add(
                "task"
            );


            const icon =
                document.createElement(
                    "div"
                );


            icon.classList.add(
                "task-icon",
                getCategoryClass(
                    task.category
                )
            );


            icon.textContent =
                getCategoryIcon(
                    task.category
                );


            const info =
                document.createElement(
                    "div"
                );


            info.classList.add(
                "task-info"
            );


            const title =
                document.createElement(
                    "h4"
                );


            title.textContent =
                task.name;


            const time =
                document.createElement(
                    "p"
                );


            const endDateText =
                task.endDate &&
                task.endDate !==
                    task.date
                    ? ` → ${formatUpcomingDate(task.endDate)}`
                    : "";


            time.textContent =
                `${formatUpcomingDate(task.date)}${endDateText} · ${task.start || "--:--"}${task.end ? ` - ${task.end}` : ""}`;


            info.appendChild(
                title
            );


            info.appendChild(
                time
            );


            taskElement.appendChild(
                icon
            );


            taskElement.appendChild(
                info
            );


            taskElement.addEventListener(
                "click",
                function () {

                    openTaskDetail(
                        task
                    );

                }
            );


            upcomingTasks.appendChild(
                taskElement
            );

        }
    );

}


// ========================================
// FORMAT UPCOMING DATE
// ========================================

function formatUpcomingDate(
    dateString
) {

    const currentTodayString =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


    if (
        dateString ===
        currentTodayString
    ) {

        return "Today";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short"
        }
    );

}


// ========================================
// NEW TASK
// ========================================

newTaskButton.addEventListener(
    "click",
    function () {

        editingTaskId =
            null;


        taskModal.style.display =
            "flex";

    }
);


// ========================================
// CLOSE MODAL
// ========================================

closeModal.addEventListener(
    "click",
    function () {

        taskModal.style.display =
            "none";

    }
);


taskModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            taskModal
        ) {

            taskModal.style.display =
                "none";

        }

    }
);


// ========================================
// SAVE / UPDATE TASK
// ========================================

saveTaskButton.addEventListener(
    "click",
    function () {

        const taskName =
            document
                .getElementById(
                    "taskName"
                )
                .value
                .trim();


        const taskDate =
            document
                .getElementById(
                    "taskDate"
                )
                .value;


        const taskEndDate =
            document
                .getElementById(
                    "taskEndDate"
                )
                .value;


        const taskCategory =
            document
                .getElementById(
                    "taskCategory"
                )
                .value;


        const taskStart =
            document
                .getElementById(
                    "taskStart"
                )
                .value;


        const taskEnd =
            document
                .getElementById(
                    "taskEnd"
                )
                .value;


        const taskLocation =
            document
                .getElementById(
                    "taskLocation"
                )
                .value
                .trim();


        const taskDetails =
            document
                .getElementById(
                    "taskDetails"
                )
                .value
                .trim();


        // =================================
        // REQUIRED
        // =================================

        if (
            !taskName ||
            !taskDate
        ) {

            alert(
                "กรุณากรอกชื่องานและ Start Date"
            );

            return;

        }


        // =================================
        // END DATE
        // =================================

        const finalEndDate =
            taskEndDate ||
            taskDate;


        if (
            finalEndDate <
            taskDate
        ) {

            alert(
                "End Date ต้องไม่ก่อน Start Date"
            );

            return;

        }


        // =================================
        // EDIT / NEW
        // =================================

        const isEditing =
            editingTaskId !== null;


        if (
            isEditing
        ) {

            const taskIndex =
                tasks.findIndex(
                    task =>
                        task.id ===
                        editingTaskId
                );


            if (
                taskIndex !== -1
            ) {

                tasks[taskIndex] = {

                    ...tasks[taskIndex],

                    name:
                        taskName,

                    date:
                        taskDate,

                    endDate:
                        finalEndDate,

                    category:
                        taskCategory,

                    start:
                        taskStart,

                    end:
                        taskEnd,

                    location:
                        taskLocation,

                    details:
                        taskDetails

                };

            }


            editingTaskId =
                null;

        } else {

            const newTask = {

                id:
                    Date.now(),

                name:
                    taskName,

                date:
                    taskDate,

                endDate:
                    finalEndDate,

                category:
                    taskCategory,

                start:
                    taskStart,

                end:
                    taskEnd,

                location:
                    taskLocation,

                details:
                    taskDetails

            };


            tasks.push(
                newTask
            );

        }


        // =================================
        // LOCAL STORAGE
        // =================================

        localStorage.setItem(
            "myTasks",
            JSON.stringify(
                tasks
            )
        );


        // =================================
        // RENDER
        // =================================

        renderCalendar();


        // =================================
        // CLOSE
        // =================================

        taskModal.style.display =
            "none";


        // =================================
        // CLEAR FORM
        // =================================

        document.getElementById(
            "taskName"
        ).value = "";


        document.getElementById(
            "taskDate"
        ).value = "";


        document.getElementById(
            "taskEndDate"
        ).value = "";


        document.getElementById(
            "taskStart"
        ).value = "";


        document.getElementById(
            "taskEnd"
        ).value = "";


        document.getElementById(
            "taskLocation"
        ).value = "";


        document.getElementById(
            "taskDetails"
        ).value = "";


        if (
            isEditing
        ) {

            alert(
                "แก้ไขงานเรียบร้อยแล้ว ✅"
            );

        } else {

            alert(
                "เพิ่มงานเรียบร้อยแล้ว ✅"
            );

        }

    }
);


// ========================================
// MONTH NAVIGATION
// ========================================

prevMonthButton.addEventListener(
    "click",
    function () {

        currentMonth--;


        if (
            currentMonth < 0
        ) {

            currentMonth =
                11;

            currentYear--;

        }


        renderCalendar();

    }
);


nextMonthButton.addEventListener(
    "click",
    function () {

        currentMonth++;


        if (
            currentMonth > 11
        ) {

            currentMonth =
                0;

            currentYear++;

        }


        renderCalendar();

    }
);


todayButton.addEventListener(
    "click",
    function () {

        currentMonth =
            today.getMonth();

        currentYear =
            today.getFullYear();


        renderCalendar();

    }
);


// ========================================
// TASK DETAIL
// ========================================

function openTaskDetail(
    task
) {

    selectedTaskId =
        task.id;


    detailTaskName.textContent =
        task.name;


    detailTaskCategory.textContent =
        task.category;


    detailTaskDate.textContent =
        task.endDate &&
        task.endDate !==
            task.date

            ? `${formatTaskDate(task.date)} - ${formatTaskDate(task.endDate)}`

            : formatTaskDate(
                task.date
            );


    detailTaskStart.textContent =
        task.start ||
        "ไม่ได้ระบุ";


    detailTaskEnd.textContent =
        task.end ||
        "ไม่ได้ระบุ";


    detailTaskLocation.textContent =
        task.location ||
        "ไม่ได้ระบุ";


    detailTaskDetails.textContent =
        task.details ||
        "ไม่มีรายละเอียดเพิ่มเติม";


    updateCompleteButton(
        task
    );


    taskDetailModal.style.display =
        "flex";

}


// ========================================
// FORMAT TASK DATE
// ========================================

function formatTaskDate(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ========================================
// CLOSE DETAIL
// ========================================

closeDetailModal.addEventListener(
    "click",
    function () {

        taskDetailModal.style.display =
            "none";

    }
);


taskDetailModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            taskDetailModal
        ) {

            taskDetailModal.style.display =
                "none";

        }

    }
);


// ========================================
// EDIT TASK
// ========================================

editTaskButton.addEventListener(
    "click",
    function () {

        const task =
            tasks.find(
                task =>
                    task.id ===
                    selectedTaskId
            );


        if (!task) {

            return;

        }


        editingTaskId =
            task.id;


        document.getElementById(
            "taskName"
        ).value =
            task.name;


        document.getElementById(
            "taskDate"
        ).value =
            task.date;


        document.getElementById(
            "taskEndDate"
        ).value =
            task.endDate ||
            task.date;


        document.getElementById(
            "taskStart"
        ).value =
            task.start ||
            "";


        document.getElementById(
            "taskEnd"
        ).value =
            task.end ||
            "";


        document.getElementById(
            "taskCategory"
        ).value =
            task.category;


        document.getElementById(
            "taskLocation"
        ).value =
            task.location ||
            "";


        document.getElementById(
            "taskDetails"
        ).value =
            task.details ||
            "";


        taskDetailModal.style.display =
            "none";


        taskModal.style.display =
            "flex";

    }
);


// ========================================
// DELETE TASK
// ========================================

deleteTaskButton.addEventListener(
    "click",
    function () {

        const confirmDelete =
            confirm(
                "ต้องการลบงานนี้ใช่ไหม?"
            );


        if (
            !confirmDelete
        ) {

            return;

        }


        tasks =
            tasks.filter(
                task =>
                    task.id !==
                    selectedTaskId
            );


        localStorage.setItem(
            "myTasks",
            JSON.stringify(
                tasks
            )
        );


        taskDetailModal.style.display =
            "none";


        renderCalendar();


        selectedTaskId =
            null;

    }
);
// ========================================
// SEARCH
// ========================================

searchButton.addEventListener(
    "click",
    function () {

        if (!searchBox) {
            return;
        }

        searchBox.classList.toggle(
            "active"
        );

        if (
            searchBox.classList.contains(
                "active"
            )
        ) {

            searchInput.focus();

        }

    }
);


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            // ไม่มีคำค้น
            if (!keyword) {

                renderCalendar();

                return;

            }


            // =================================
            // FILTER TASKS
            // =================================

            const originalTasks =
                tasks;


            const filteredTasks =
                originalTasks.filter(
                    function (task) {

                        return (

                            (task.name || "")
                                .toLowerCase()
                                .includes(
                                    keyword
                                ) ||

                            (task.category || "")
                                .toLowerCase()
                                .includes(
                                    keyword
                                ) ||

                            (task.location || "")
                                .toLowerCase()
                                .includes(
                                    keyword
                                ) ||

                            (task.details || "")
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                        );

                    }
                );


            // =================================
            // TEMPORARY RENDER
            // =================================

            tasks =
                filteredTasks;


            renderCalendar();


            tasks =
                originalTasks;

        }
    );

}


// ========================================
// COMPLETE TASK
// ========================================

completeTaskButton.addEventListener(
    "click",
    function () {

        const task =
            tasks.find(
                function (task) {

                    return (
                        task.id ===
                        selectedTaskId
                    );

                }
            );


        if (!task) {

            return;

        }


        task.completed =
            !task.completed;


        localStorage.setItem(
            "myTasks",
            JSON.stringify(
                tasks
            )
        );


        updateCompleteButton(
            task
        );


        renderCalendar();


        if (
            task.completed
        ) {

            alert(
                "ทำงานเสร็จแล้ว ✅"
            );

        } else {

            alert(
                "ยกเลิกสถานะเสร็จแล้ว"
            );

        }

    }
);


// ========================================
// COMPLETE BUTTON TEXT
// ========================================

function updateCompleteButton(
    task
) {

    if (!completeTaskButton) {

        return;

    }


    if (
        task.completed
    ) {

        completeTaskButton.textContent =
            "↩️ Mark Incomplete";

        completeTaskButton.classList.add(
            "completed"
        );

    } else {

        completeTaskButton.textContent =
            "✓ Complete";

        completeTaskButton.classList.remove(
            "completed"
        );

    }

}


// ========================================
// DARK MODE
// ========================================

const themeButton =
    document.getElementById(
        "themeButton"
    );


function updateThemeIcon() {

    if (!themeButton) {

        return;

    }


    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        themeButton.textContent =
            "🌙";

    } else {

        themeButton.textContent =
            "☀️";

    }

}


const savedTheme =
    localStorage.getItem(
        "calendarTheme"
    );


if (
    savedTheme ===
    "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

}


updateThemeIcon();


if (themeButton) {

    themeButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            localStorage.setItem(
                "calendarTheme",
                isDark
                    ? "dark"
                    : "light"
            );


            updateThemeIcon();

        }
    );

}


// ========================================
// ESC KEY
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            taskModal &&
            taskModal.style.display ===
                "flex"
        ) {

            taskModal.style.display =
                "none";

        }


        if (
            taskDetailModal &&
            taskDetailModal.style.display ===
                "flex"
        ) {

            taskDetailModal.style.display =
                "none";

        }

    }
);


// ========================================
// CLICK OUTSIDE SEARCH
// ========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            !searchBox ||
            !searchButton
        ) {

            return;

        }


        if (

            !searchBox.contains(
                event.target
            ) &&

            !searchButton.contains(
                event.target
            )

        ) {

            searchBox.classList.remove(
                "active"
            );

        }

    }
);


// ========================================
// NOTIFICATION PERMISSION
// ========================================

if (
    "Notification" in window
) {

    if (
        Notification.permission ===
        "default"
    ) {

        setTimeout(
            function () {

                Notification.requestPermission()
                    .catch(
                        function () {

                            // Browser อาจบล็อก
                            // permission request

                        }
                    );

            },
            1500
        );

    }

}


// ========================================
// SHOW NOTIFICATION
// ========================================

function showNotification(
    task
) {

    if (

        !(
            "Notification" in window
        ) ||

        Notification.permission !==
            "granted"

    ) {

        return;

    }


    new Notification(
        "Task Reminder 🔔",
        {
            body:
                task.name
        }
    );

}


// ========================================
// CHECK TASK NOTIFICATIONS
// ========================================

function checkTaskNotifications() {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return;

    }


    const now =
        new Date();


    const currentDate =
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;


    const currentTime =
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;


    tasks.forEach(
        function (task) {

            if (
                task.completed
            ) {

                return;

            }


            if (
                task.date !==
                currentDate
            ) {

                return;

            }


            if (
                !task.start
            ) {

                return;

            }


            if (
                task.start !==
                currentTime
            ) {

                return;

            }


            if (
                task.notified
            ) {

                return;

            }


            showNotification(
                task
            );


            task.notified =
                true;

        }
    );


    localStorage.setItem(
        "myTasks",
        JSON.stringify(
            tasks
        )
    );

}


// ========================================
// CHECK EVERY MINUTE
// ========================================

setInterval(
    checkTaskNotifications,
    60000
);


// เช็กทันทีตอนเปิดเว็บ
checkTaskNotifications();


// ========================================
// INITIAL RENDER
// ========================================

renderCalendar();


// ========================================
// FIX OLD TASK DATA
// ========================================

// งานเก่าที่สร้างก่อนมี End Date
// จะถือว่าสิ้นสุดวันเดียวกับ Start Date

let changedOldTask =
    false;


tasks.forEach(
    function (task) {

        if (
            !task.endDate &&
            task.date
        ) {

            task.endDate =
                task.date;

            changedOldTask =
                true;

        }

    }
);


if (
    changedOldTask
) {

    localStorage.setItem(
        "myTasks",
        JSON.stringify(
            tasks
        )
    );


    renderCalendar();

}


// ========================================
// DEFAULT END DATE
// ========================================

const taskDateInput =
    document.getElementById(
        "taskDate"
    );

const taskEndDateInput =
    document.getElementById(
        "taskEndDate"
    );


if (
    taskDateInput &&
    taskEndDateInput
) {

    taskDateInput.addEventListener(
        "change",
        function () {

            if (
                !taskEndDateInput.value
            ) {

                taskEndDateInput.value =
                    taskDateInput.value;

            }

        }
    );

}
