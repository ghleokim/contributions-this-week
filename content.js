function getWeekElement(element) {
  containerStyle = `display: inline-block;position: fixed; top: 100px; right: 40px;background: rgba(250, 250, 250, 0.7)`

  heading = getHeading()
  dateHeading = getDateHeading(element)
  header = getHeader()
  week = getWeek(element)

  container = document.createElement('div');
  container.style.cssText = containerStyle

  container.appendChild(heading)
  container.appendChild(dateHeading);
  container.appendChild(header);
  container.appendChild(week);

  document.body.appendChild(container);
}

function getHeading() {
  headingStyle = `
      line-height: 25px;
      text-align: center;
      margin: 0px;
      font-weight: 700;
      color: rgb(100,100,100);
      font-size: 12px;
    `
  heading = document.createElement('div');
  heading.style.cssText = headingStyle
  heading.innerText = `contributions this week`
  return heading
}

function getDateHeading(element) {
  dHeadingStyle = `
      line-height: 25px;
      text-align: center;
      margin: 0px;
      font-weight: 300;
      color: rgb(100,100,100);
      font-size: 12px;
    `
  dHeading = document.createElement('div');
  dHeading.style.cssText = dHeadingStyle
  start = element.__data__[0].date.toISOString().substring(0, 10);
  end = element.__data__[element.__data__.length - 1].date.toISOString().substring(0, 10);
  dHeading.innerText = `${start} ~ ${end}`
  return dHeading
}

function getHeader() {
  // style
  headerBoxStyle = `display: flex;`
  headerDayStyle = `
      width:  25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      margin: 0px;
      font-weight: 300;
      color: rgb(100,100,100);
      font-size: 12px;
    `
  headerBox = document.createElement('div');
  headerBox.style.cssText = headerBoxStyle;

  weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  for (i = 0; i < 7; i++) {
    headerDay = document.createElement("div");
    headerDay.innerText = weekDay[i];
    headerDay.style.cssText = headerDayStyle;

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

    boxStyle = `
        width:  25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        margin: 0px 0px 5px 0px;
        font-weight: 500;
        color: rgb(30,30,30);
        background-color: ${grayColor};
      `
    dayBox.style.cssText = boxStyle;
    dayBox.innerText = `-`
    weekBox.appendChild(dayBox)
  }
  console.log(element)
  for (let e of element.__data__) {
    curDay = weekBox.children[e.day]
    curDay.innerText = e.count;
    curDay.style.backgroundColor = e.count ? blueColor : grayColor;
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

      // return Array.from(domArray).map(function(el) {
      //   data = el.outerHTML.toString()
      //   data = data.split('"')[17].split('>')
      //   contributionString = data[0].split(' ')[0]
      //   dateObj = new Date(data[1])
      //   console.log(data)
      //   return {
      //     __data__: {
      //       count: contributionString === 'No'? 0 : contributionString,
      //       day: dateObj.getDay(),
      //       date: dateObj
      //     }
      //   }
      // })

      return Array.from(el).map(function (el) {
        data = el.toString()
        data = data.split('"')[17].split('>')

        contributionString = data[0].split(' ')[0]
        dateObj = new Date(data[1])
        return {
          __data__: {
            count: contributionString === 'No' ? 0 : contributionString,
            day: dateObj.getDay(),
            date: dateObj
          }
        }
      })
    })

    target.map(function (el) {
      console.log(el)
    })
    console.log(target, targetTmp)

    // targetTmp = ''
    // Array.from(target).forEach(function(el){
    //   this.targetTmp += el.innerHTML.toString();
    // })
    // console.log(target, targetTmp)


    getWeekElement(target[target.length - 4])
  }




  console.log(document)
  a = document.getElementById('js-overview')
  a = a.children[0].children[0].children[0].children[0]
  console.log(a)


  // a.addEventListener("DOMSubtreeModified", function() {
  //   loaded = document.getElementById('js-overview')
  //   console.log('modified')
  // }, {once:false})

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

// Later, you can stop observing
// observer.disconnect();