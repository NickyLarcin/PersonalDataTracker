const lifeVariablesContainer = document.getElementById(
  "life-variables-container"
);

const submitButton = document.getElementById("submit-button");
const downloadButton = document.getElementById("download-button");

const dataOutput = {};

const lifeVariables = [
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
        <label for="${dataText.toLowerCase()}-input" class="input-label">${inputHelp}</label>
        <div class="range-container">
          <input type="range" id="${dataText.toLowerCase()}-input" name="${dataText.toLowerCase()}-input" min="${
          optNumMinMax[0]
        }" max="${
          optNumMinMax[1]
        }" value="${defaultValue}" oninput="updateValue(value, '${dataText.toLowerCase()}input-value')">
          <span id="${dataText.toLowerCase()}input-value">${defaultValue}</span>
          </div>
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
   
          <textarea id="${dataText.toLowerCase()}-input" rows="4" cols="50" class="input-text">${inputHelp}
        </textarea>

      </div>
    </div>
          
          
          
          `;
        break;

      case "textRange":
        console.log(lifeVariables[index]["dataTypeOptions"]);
        lifeVariablesContainer.innerHTML += `
          <div class="life-variable addShadow">
      <div class="life-variable-info">
        <p class="variable-title">${dataText}</p>
        <p class="variable-description">${description}</p>
      </div>
      <hr class="life-variable-separator"/>
      <div class="life-variable-select">
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
    }
  });

  return resultList;
}

function submitForm() {
  console.log("test1");
  console.log(JSON.parse(localStorage.getItem("dataRecorderData")));

  resultsLinkedToDate =
    JSON.parse(localStorage.getItem("dataRecorderData")) === null
      ? {}
      : JSON.parse(localStorage.getItem("dataRecorderData"));

  //const resultsLinkedToDate = {}
  const date = document.getElementById("input-record-date").value;

  console.log("test2");
  console.log(resultsLinkedToDate);

  resultsLinkedToDate[date] = getResults();

  console.log("test3");
  console.log(resultsLinkedToDate);
  localStorage.setItem("dataRecorderData", JSON.stringify(resultsLinkedToDate));
  return resultsLinkedToDate;
}

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
