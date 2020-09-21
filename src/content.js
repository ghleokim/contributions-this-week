let calendarObj = {};
getCalendar();

let timeZoneOffset = new Date().getTimezoneOffset() * 60000;

/** Creates a div element with selected week's contributions. */
function getWeekElement(element) {
  heading = getHeading()
  dateHeading = getDateHeading(element)
  header = getHeader()
  week = getWeek(element)

  i = document.createElement('div');

  container = document.createElement('div');
  container.className = "ctw-container";
  container.id = "ctw-container";

  container.appendChild(heading)
  container.appendChild(dateHeading);
  container.appendChild(header);
  container.appendChild(week);

  i.appendChild(container);

  document.body.appendChild(i);
}

/** Creates a title div for ctw. */
function getHeading() {
  heading = document.createElement('div');
  heading.className = "ctw-heading"
  heading.id = "ctw-heading"
  heading.innerText = "contributions this week"
  return heading
}

/** Creates a date sub header out of the element provided. 
 *  for example : "2020-09-14 ~ 2020-09-20"
 */
function getDateHeading(element) {
  dHeadingContainer = document.createElement('div');
  dHeadingContainer.className = "ctw-subheadingContainer";


  arrowFormer = document.createElement('div');
  arrowFormer.className = "ctw-subheading-former";
  arrowFormer.innerText = "◂";

  arrowNext = document.createElement('div');
  arrowNext.className = "ctw-subheading-next";
  arrowNext.innerText = "▸";

  arrowFormer.addEventListener("click", goBefore);
  arrowNext.addEventListener("click", goNext);

  dHeading = document.createElement('div');
  dHeading.className = "ctw-subheading"
  start = element.__data__[0].date.toISOString().substring(0, 10);
  end = element.__data__[element.__data__.length - 1].date.toISOString().substring(0, 10);
  dHeading.innerText = `${start} ~ ${end}`

  dHeadingContainer.appendChild(arrowFormer)
  dHeadingContainer.appendChild(dHeading)
  dHeadingContainer.appendChild(arrowNext)

  return dHeadingContainer
}

/** Creates a table header div for the ctw table. */
function getHeader() {
  headerBox = document.createElement('div');
  headerBox.className = "ctw-headerContainer"

  weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  for (i = 0; i < 7; i++) {
    headerDay = document.createElement("div");
    headerDay.innerText = weekDay[i];
    headerDay.className = "ctw-header";

    headerBox.appendChild(headerDay)
  }

  return headerBox
}

/** Creates the actual table content div for the ctw table. */
function getWeek(element) {
  weekBox = document.createElement('div');
  weekBox.className = "ctw-weekContainer";

  for (i = 0; i < 7; i++) {
    dayBox = document.createElement('div');
    dayBox.className = "ctw-box"
    dayBox.innerText = `-`
    weekBox.appendChild(dayBox)
  }

  for (let e of element.__data__) {
    curDay = weekBox.children[e.day]
    curDay.innerText = e.count;
    color = e.count ? "ctw-box-blue" : "ctx-box-gray";
    curDay.classList.add(color);
  }
  return weekBox
}


/** Parses a <rect> element and parses data out of it
 *  it can parse
 *      <rect ... data-original-title="14 contributions<br />Friday Sep 11, 2020"></rect>
 *  into
 *      {count:14, day: 5, date: [Date object]}
 */
function parseTitle(element) {
  data = element.outerHTML.toString()
  data = data.split('"')
  if (data.length < 17) return;

  data = data[17].split('>')
  contributionString = data[0].split(' ')[0]
  dateObj = new Date(data[1])

  if (!Date.parse(dateObj)) return;

  return {
    count: contributionString === 'No' ? 0 : contributionString,
    day: dateObj.getDay(),
    date: dateObj
  }
}

/** A main function that gets data from HTML body. */
async function run() {
  svgs = document.querySelectorAll('svg');
  target = Array.from(svgs).filter(element => element.className.baseVal === "contrib-calendar");
  target = target[0].children;
  targetTmp = '';
  target = Array.from(target).map(function (el) {
    domArray = new DOMParser().parseFromString(el.innerHTML.toString(), "text/html").body;
    domArray = Array.from(domArray.children).map(el => parseTitle(el));
    return {
      __data__: domArray.filter(el => el)
    }
  })

  getWeekElement(target[target.length - 4]);
  
  chrome.storage.sync.get(['labWeekOffset'], async function (result) {
    await getCalendar()
    updateWeek(result.labWeekOffset)
    document.getElementById('ctw-container').className = "ctw-container"
  })
}

/** A main function that gets calendar.json from current url's username */
async function getCalendar() {
  const usernameFromUrl = document.URL.split('/')[3]
  let currentResult = await fetch(`https://lab.ssafy.com/users/${usernameFromUrl}/calendar.json`)
    .then(res => res.json())

  calendarObj = currentResult
  return currentResult
}

/** A date function that returns the start day of this week */
function getThisWeekStart() {
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

/** A function that returns empty data array */
function getWeekTemplate(offset) {
  const weekStart = getThisWeekStart()
  const obj = []
  weekStart.setDate(weekStart.getDate() + offset * 7)

  for (let i = 0; i < 7; i++) {
    const curDay = new Date(weekStart)
    curDay.setDate(curDay.getDate() + i)
    countVal = 0
    if (curDay > new Date()) {
      countVal = '-'
    }
    curObj = {
      count: countVal,
      day: i,
      date: curDay
    }
    obj.push(curObj)
  }
  return obj
}

function goBefore() {
  chrome.storage.sync.get(['labWeekOffset'], function (result) {
    const current = result.labWeekOffset ? result.labWeekOffset : 0
    const target = current - 1

    updateWeek(target)
    updateStorage(target)
  })
}

function goNext() {
  chrome.storage.sync.get(['labWeekOffset'], function (result) {
    const current = result.labWeekOffset ? result.labWeekOffset : 0
    const target = current + 1

    updateWeek(target)
    updateStorage(target)
  })
}

function updateStorage(offset) {
  chrome.runtime.sendMessage({ setOffset: { value: offset } })
}

function updateWeek(offset) {
  const template = getWeekTemplate(offset)
  setWeekHeading(template)
  setWeekData(template, calendarObj)
}

/** Change week heading */
function setWeekHeading(template) {
  let start = new Date(template[0].date - timeZoneOffset)
  start = start.toISOString().split('T')[0]

  let end = new Date(template[6].date - timeZoneOffset)
  end = end.toISOString().split('T')[0]

  const dHeading = document.getElementsByClassName('ctw-subheading')[0]
  dHeading.innerText = `${start} ~ ${end}`
}

/** Puts count data in template and returns */
function setWeekData(template, calendar) {
  const weekData = template.map((value) => {
    const stringValue = new Date(value.date - timeZoneOffset)
    const ds = stringValue.toISOString().split('T')[0]
    const data = calendar[ds] ? calendar[ds] : 0
    if (value.count !== '-') {
      value.count = data
    }
    return value
  })

  const weekContainer = document.getElementsByClassName('ctw-weekContainer')[0].children
  weekData.forEach((value, index) => {
    if (value.count !== '-') {
      const dataColored = value.count ? "blue" : "gray"
      weekContainer[index].setAttribute("data-colored", dataColored)
    } else {
      weekContainer[index].setAttribute("data-colored", "")
    }
    weekContainer[index].innerText = value.count
  })
}

jsOverview = document.getElementById('js-overview');

if (!!jsOverview) {
  jsOverview = jsOverview.children[0].children[0].children[0].children[0];

  // Select the node that will be observed for mutations
  const targetNode = jsOverview

  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    childList: true,
    subtree: true
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(() => run().then(() => observer.disconnect()));

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

/** Sets empty template for calendar. */
function addEmptyTemplate() {
  const i = document.createElement('div')
  i.innerHTML = `
  <div id="ctw-container" class="ctw-container d-none">
    <div class="ctw-heading">contributions this week</div>
    <div class="ctw-subheadingContainer">
      <div id="ctw-btn-former" class="ctw-subheading-former">◂</div>
      <div class="ctw-subheading"></div>
      <div id="ctw-btn-next" class="ctw-subheading-next">▸</div>
    </div>
    <div class="ctw-headerContainer">
      <div class="ctw-header">Sun</div>
      <div class="ctw-header">Mon</div>
      <div class="ctw-header">Tue</div>
      <div class="ctw-header">Wed</div>
      <div class="ctw-header">Thu</div>
      <div class="ctw-header">Fri</div>
      <div class="ctw-header">Sat</div>
    </div>
    <div class="ctw-weekContainer">
      <div class="ctw-box">-</div>
      <div class="ctw-box">-</div>
      <div class="ctw-box">-</div>
      <div class="ctw-box">-</div>
      <div class="ctw-box">-</div>
      <div class="ctw-box">-</div>
      <div class="ctw-box">-</div>
    </div>
  </div>
  `
  document.body.appendChild(i)
}