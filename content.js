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

function getHeading() {
  heading = document.createElement('div');
  heading.className = "ctw-heading"
  heading.innerText = "contributions this week"
  return heading
}

function getDateHeading(element) {
  dHeading = document.createElement('div');
  dHeading.className = "ctw-subheading"
  start = element.__data__[0].date.toISOString().substring(0, 10);
  end = element.__data__[element.__data__.length - 1].date.toISOString().substring(0, 10);
  dHeading.innerText = `${start} ~ ${end}`
  return dHeading
}

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

function getWeek(element) {
  weekBoxStyle = `display: flex;`

  grayColor = `rgb(237,237,237)`
  blueColor = `rgb(172,213,242)`



  weekBox = document.createElement('div');
  weekBox.style.cssText = weekBoxStyle;

  for (i = 0; i < 7; i++) {
    dayBox = document.createElement('div');
    dayBox.className = "ctw-box"
    dayBox.innerText = `-`
    weekBox.appendChild(dayBox)
  }
  console.log(element)
  for (let e of element.__data__) {
    curDay = weekBox.children[e.day]
    curDay.innerText = e.count;
    color = e.count ? "ctw-box-blue" : "ctx-box-gray";
    curDay.classList.add(color);
  }
  return weekBox
}

function parseTitle(element) {
  console.log(element)
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

async function run() {
    svgs = document.querySelectorAll('svg')
    console.log(svgs)

    target = Array.from(svgs).filter(element => element.className.baseVal === "contrib-calendar")
    target = target[0].children
    targetTmp = ''
    target = Array.from(target).map(function (el) {
      domArray = new DOMParser().parseFromString(el.innerHTML.toString(), "text/html").body
      console.log('aaaa', domArray, Array.from(domArray))

      domArray = Array.from(domArray.children).map(el => parseTitle(el))
      console.log(domArray)
      return {__data__: domArray.filter(el => el)}
    })

    target.map(function (el) {
      console.log(el)
    })
    console.log(target, targetTmp)

    getWeekElement(target[target.length - 4])
  }




  console.log(document)
  a = document.getElementById('js-overview')
  a = a.children[0].children[0].children[0].children[0]

  // Select the node that will be observed for mutations
  const targetNode = a // document.getElementById('js-overview');

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.');
      }
      else if (mutation.type === 'attributes') {
        console.log('The ' + mutation.attributeName + ' attribute was modified.');
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(() => run().then(() => observer.disconnect()));

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
