/** Creates a div element with selected week's contributions. */
function getWeekElement(element) {
  heading = getHeading()
  dateHeading = getDateHeading(element)
  header = getHeader()
  week = getWeek(element)

  i = document.createElement('div');

  container = document.createElement('div');
  container.className = "ctw-container";

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
  heading.innerText = "contributions this week"
  return heading
}

/** Creates a date sub header out of the element provided. 
 *  for example : "2020-09-14 ~ 2020-09-20"
 */
function getDateHeading(element) {
  dHeading = document.createElement('div');
  dHeading.className = "ctw-subheading"
  start = element.__data__[0].date.toISOString().substring(0, 10);
  end = element.__data__[element.__data__.length - 1].date.toISOString().substring(0, 10);
  dHeading.innerText = `${start} ~ ${end}`
  return dHeading
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
