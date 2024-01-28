const lifeVariablesContainer = document.getElementById(
  "life-variables-container"
);

const submitButton = document.getElementById("submit-button");
const downloadButton = document.getElementById("download-button");
const hiddenMenuButton = document.getElementById("hidden-menu-button");
const calendarSubcontainer = document.getElementById("calendar-subcontainer");
const buttonSwitchMonthLeft = document.getElementById("button-switch-month-left");
const buttonSwitchMonthRight = document.getElementById("button-switch-month-right");

const dataOutput = {};
let displayYear = 2024;
let displayMonth = 01;

let resultsLinkedToDate =
  JSON.parse(localStorage.getItem("dataRecorderData")) === null
    ? {}
    : JSON.parse(localStorage.getItem("dataRecorderData"));






const lifeVariables = [
  {
    dataText: "Bed Time",
    description: "When you went to bed",
    dataType: "time",
    dataTypeOptions: "",
    defaultValue: "23:00",
    optNumMinMax: "",
    inputHelp: "Select the appropriate time"
  },
  {
    dataText: "Mood",
    description: "How you've felt during the day",
    dataType: "numberRange",
    dataTypeOptions: "",
    defaultValue: 6,
    optNumMinMax: [0, 10],
    inputHelp: "Choose a number between 0 and 10"
  },
  {
    dataText: "Exercise",
    description: "How hard you trained today",
    dataType: "textRange",
    dataTypeOptions: [
      "No training",
      "Just a bit",
      "Honest training",
      "Heroic training"
    ],
    defaultValue: 0,
    optNumMinMax: [0, 3],
    inputHelp: "Drag to the appropriate feeling"
  },
  {
    dataText: "Reading",
    description: "How long you read today",
    dataType: "minutes",
    dataTypeOptions: "",
    defaultValue: "0",
    optNumMinMax: "",
    inputHelp: "Estimates in minutes"
  },
  {
    dataText: "Side Project",
    description: "How long you did work towards freedom today",
    dataType: "minutes",
    dataTypeOptions: "",
    defaultValue: "0",
    optNumMinMax: "",
    inputHelp: "Estimates in minutes"
  },
  {
    dataText: "Journal",
    description: "Record events and emotions",
    dataType: "text",
    dataTypeOptions: "",
    defaultValue: "",
    optNumMinMax: "",
    inputHelp: " Write about your day man"
  }
];

const displayVariables = () => {
  lifeVariables.forEach((lifeVariable, index) => {
    const currentVariable = lifeVariable;
    const {
      dataText,
      description,
      dataType,
      dataTypeOptions,
      defaultValue,
      optNumMinMax,
      inputHelp
    } = currentVariable;

    console.log(index);

    switch (currentVariable["dataType"]) {
      case "numberRange":
        lifeVariablesContainer.innerHTML += `
          <div class="life-variable addShadow">
      <div class="life-variable-info">
        <p class="variable-title">${dataText}</p>
        <p class="variable-description">${description}</p>
      </div>
      <hr class="life-variable-separator"/>

      <div class="life-variable-select">
      <i class="gg-close"></i>
        <label for="${dataText.toLowerCase()}-input" class="input-label">${inputHelp}</label>
        <div class="range-container">

          <input type="range" id="${dataText.toLowerCase()}-input" name="${dataText.toLowerCase()}-input" min="${
          optNumMinMax[0]
        }" max="${
          optNumMinMax[1]
        }" value="${defaultValue}" oninput="updateValue(value, '${dataText.toLowerCase()}input-value')">
          <span id="${dataText.toLowerCase()}input-value">${defaultValue}</span>
          </div

      </div>
    </div>
     `;
        break;

      case "text":
        lifeVariablesContainer.innerHTML += `
           <div class="life-variable addShadow">
      <div class="life-variable-info">
        <p class="variable-title">${dataText}</p>
        <p class="variable-description">${description}</p>
      </div>
      <hr class="life-variable-separator"/>
      <div class="life-variable-select">
      <i class="gg-close"></i>

          <textarea id="${dataText.toLowerCase()}-input" rows="4" cols="50" class="input-text">${inputHelp}
        </textarea>

      </div>
    </div>



          `;
        break;

      case "textRange":
        lifeVariablesContainer.innerHTML += `
          <div class="life-variable addShadow">
      <div class="life-variable-info">
        <p class="variable-title">${dataText}</p>
        <p class="variable-description">${description}</p>
      </div>
      <hr class="life-variable-separator"/>
      <div class="life-variable-select">
      <i class="gg-close"></i>
        <label for="${dataText.toLowerCase()}-input" class="input-label">${inputHelp}</label>
        <div class="range-container">
          <input type="range" id="${dataText.toLowerCase()}-input" name="${dataText.toLowerCase()}-input" min="${
          optNumMinMax[0]
        }" max="${
          optNumMinMax[1]
        }" value="${defaultValue}" oninput="updateValueText(value, '${dataText.toLowerCase()}input-value', ${index})">
          <span id="${dataText.toLowerCase()}input-value">${defaultValue}</span>
          </div>
      </div>
    </div>
     `;
        break;

      case "time":
        lifeVariablesContainer.innerHTML += `
        <div class="life-variable addShadow">
      <div class="life-variable-info">
        <p class="variable-title">${dataText}</p>
        <p class="variable-description">${description}</p>
      </div>

      <hr class="life-variable-separator"/>

      <div class="life-variable-select">
        <i class="gg-close"></i>
        <label for="${dataText.toLowerCase()}-input" class="input-label">${inputHelp}</label>
        <input type="time" id="${dataText.toLowerCase()}-input" class="input-time" value="${defaultValue}">


      </div>
    </div>

     `;
        break;

      case "minutes":
        lifeVariablesContainer.innerHTML += `

        <div class="life-variable addShadow">
      <div class="life-variable-info">
        <p class="variable-title">${dataText}</p>
        <p class="variable-description">${description}</p>
      </div>

      <hr class="life-variable-separator"/>

      <div class="life-variable-select">
        <i class="gg-close"></i>
        <label for="${dataText.toLowerCase()}-input" class="input-label">${inputHelp}</label>
        <input type="number" id="${dataText.toLowerCase()}-input" class="input-number" value="${defaultValue}">


      </div>
    </div>






        `;
        break;
    }
  });
};

displayVariables();

function updateValue(val, elementId) {
  document.getElementById(elementId).textContent = val;
}

function updateValueText(val, elementId, index) {
  if (val >= 0 && val < lifeVariables[index]["dataTypeOptions"].length) {
    document.getElementById(elementId).textContent =
      lifeVariables[index]["dataTypeOptions"][val];
  }
}

function getResults() {
  const resultList = {};

  lifeVariables.forEach((lifeVariable) => {
    const currentVariable = lifeVariable;
    const {
      dataText,
      description,
      dataType,
      dataTypeOptions,
      defaultValue,
      optNumMinMax
    } = currentVariable;

    switch (currentVariable["dataType"]) {
      case "numberRange":
        resultList[`${dataText.toLowerCase()}`] = document.getElementById(
          `${dataText.toLowerCase()}-input`
        ).value;

        break;
      case "text":
        resultList[`${dataText.toLowerCase()}`] = document.getElementById(
          `${dataText.toLowerCase()}-input`
        ).value;

        break;
      case "textRange":
        resultList[`${dataText.toLowerCase()}`] = document.getElementById(
          `${dataText.toLowerCase()}-input`
        ).value;

        break;
      case "time":
        resultList[`${dataText.toLowerCase()}`] = document.getElementById(
          `${dataText.toLowerCase()}-input`
        ).value;
        break;

      case "minutes":
        resultList[`${dataText.toLowerCase()}`] = document.getElementById(
          `${dataText.toLowerCase()}-input`
        ).value;
        break;
    }
  });

  return resultList;
}

function submitForm() {
  // to fetch date ; fetch existing Data in LocalStorage ; add new entry based on date to the Data ; Store data back to LocalStorage

  const date = document.getElementById("input-record-date").value;

  if (!date) {
    alert("Select a Date !");
    return;
  }

  console.log("test1");
  console.log(JSON.parse(localStorage.getItem("dataRecorderData")));

  

  resultsLinkedToDate[date] = getResults();

 
  localStorage.setItem("dataRecorderData", JSON.stringify(resultsLinkedToDate));
  return resultsLinkedToDate;
}

// EXCEL Export

const reshapeResultsToExportFormat = () => {
  const convertedArray = Object.keys(submitForm()).map((dateKey) => {
    return {
      date: dateKey,
      ...submitForm()[dateKey]
    };
  });

  return convertedArray;
};

submitButton.addEventListener("click", () => {
  submitForm();
  displayCalendar(currentMonth,currentYear );
});

downloadButton.addEventListener("click", () => {
  exportResultsToExcel(reshapeResultsToExportFormat());
});

function exportResultsToExcel(results) {
  console.log("Results before conversion to worksheet:", results);
  const worksheet = XLSX.utils.json_to_sheet(results);
  console.log("getting there 2");
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
  // Generate buffer
  XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  // Binary string
  XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

  // Download
  XLSX.writeFile(workbook, "Results.xlsx");
}

/// CALENDAR

// Prints a month(P1) of a given year (P2) in the calendarSubcontainer; each day has an Id with the format "yyyy-mm-dd"
const displayCalendar = (month, year) => {
  calendarSubcontainer.innerHTML = "";
  const printWeekDaysHeader = () => {
    for (let i = 0; i < 7; i++) {
      calendarSubcontainer.innerHTML += `<div class="week-day-header">${
        ["M", "T", "W", "T", "F", "S", "S"][i]
      }</div>`;
    }
  };

  const printNumberDays = () => {
    for (let i = 1; i < daysInMonth + firstDayOfMonth; i++) {
      const day = i - firstDayOfMonth + 1;

      calendarSubcontainer.innerHTML += `<div id="day-id-${year}-${month}-${day}" class="day-number">${
        i - firstDayOfMonth + 1 >= 1 ? day : ""
      }</div>`;

      if (resultsLinkedToDate[formatDate(year, month, day)] !== undefined) {
        document
          .getElementById(`day-id-${year}-${month}-${day}`)
          .classList.add("recorded-date");
      }
    }
  };

  const numberOfCellsInGrid = 42; //6*7
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  printWeekDaysHeader();
  printNumberDays();
};


// Base Display as App Opens - To switch to current Date

displayCalendar(displayMonth, displayYear);

const changeCalendarMonth = (direction) => {

  if (direction === "left") {
    displayMonth--;
    if (displayMonth < 1) {
      displayMonth = 12;
      displayYear--;
    }
  } else if (direction === "right") {
    displayMonth++;
    if (displayMonth > 12) {
      displayMonth = 1;
      displayYear++;
    }
  }
  displayCalendar(displayMonth, displayYear);
  console.log(displayMonth)
  console.log(displayYear)
  
  document.getElementById("calendar-container-text-year").textContent = displayYear;
  document.getElementById("calendar-container-text-month").textContent = monthsList[displayMonth - 1];;

  

};

buttonSwitchMonthLeft.addEventListener("click",()=> {changeCalendarMonth("left")})

buttonSwitchMonthRight.addEventListener("click", ()=>{changeCalendarMonth("right")})




// UTILITY FUNCTIONS / Variables

function getDaysInMonth(year, month) {
  // The month argument in JavaScript is zero-based, so we subtract 1 from the input month.
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + 1);
  date.setDate(date.getDate() - 1);
  return date.getDate();
}

function getFirstDayOfMonth(year, month) {
  // The month argument in JavaScript is zero-based, so we subtract 1 from the input month.
  return new Date(year, month - 1, 1).getDay();
}

function formatDate(year, month, day) {
  // Ensure month and day are two digits
  month = String(month).padStart(2, "0");
  day = String(day).padStart(2, "0");

  // Combine the parts into the "YYYY-MM-DD" format
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const monthsList = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
]
