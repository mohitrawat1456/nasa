const display = document.querySelector(".display");
const description = document.querySelector(".description");
const forms = document.getElementById("search-form");
const history = document.getElementById("search-history");

// display current date NASA data
getCurrentImageOfTheDay();
function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  displayGivenDate(currentDate, true);
}

// Fetching date from NASA API
async function displayGivenDate(dateData, today) {
  try {
    // console.log('triggered ',dateData);
    const date = dateData;
    const your_api_key = "cQpNhL7HFEl9gzB6lSSPv1lhb0B83JPDOCAkmVmY";
    const responseBody = await fetch(
      `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${your_api_key}`
    );
    // https://api.nasa.gov/planetary/apod?date=${date}&api_key=${your_api_key}
    const parsedData = await responseBody.json();

    if (parsedData.code == 400) {
      alert(parsedData.msg);
      throw new Error(parsedData.msg);
    }

    // Adding to the display div contents
    display.innerHTML = "";
    const h1 = document.createElement("h1");
    if (today) {
      h1.innerText = "Picture of the Day";
    } else {
      h1.innerText = `Picture on ${dateData}`;
    }

    h1.classList.add("Picture-heading");
    const img = document.createElement("img");
    img.src = parsedData.url;
    display.append(h1, img);

    // Adding to the description div contents
    description.innerHTML = "";
    const h3 = document.createElement("h3");
    h3.innerText = parsedData.title;
    const p = document.createElement("p");
    p.innerText = parsedData.explanation;
    description.append(h3, p);
  } catch (err) {
    console.log("Error handled: ", err);
  }
}

// get search date function
forms.addEventListener("submit", getImageOfTheDay);
function getImageOfTheDay(e) {
  e.preventDefault();
  const obj = e.target;

  const val = obj.date.value;
  if (!val) {
    return;
  }

  displayGivenDate(val);
  // console.log(val);
  saveSearch(val);
  addSearchToHistory();
  obj.reset();
}

// Saving searched dates in localStorage function
function saveSearch(dateData) {
  const arrStr = localStorage.getItem("searches") || [];

  const arr = typeof arrStr === "string" ? JSON.parse(arrStr) : arrStr;
  arr.push(dateData);

  localStorage.setItem("searches", JSON.stringify(arr));
}

// Adding data into the search history
addSearchToHistory();
function addSearchToHistory() {
  const arrStr = localStorage.getItem("searches") || [];

  const arr = typeof arrStr === "string" ? JSON.parse(arrStr) : arrStr;

  let n = arr.length;
  history.innerHTML = "";
  for (let i = n-1; i >=0; i--) {
    const link = document.createElement("a");
    link.href = "#";
    console.log(arr[i]);

    link.onclick = (function (param) {
      return function () {
        displayGivenDate(param);
      };
    })(arr[i]);
    // link.addEventListener('click', (e) => {
    //   displayGivenDate(arr[i]);
    // });
    link.innerText = arr[i];
    const li = document.createElement("li");
    li.appendChild(link);
    history.appendChild(li);
  }
}

// Clear LocalStorage function and histories
function clearLocalStorage() {
  localStorage.clear();
  history.innerHTML = "";
  window.location.reload();
}