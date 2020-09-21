chrome.tabs.onCreated.addListener(tab => {
  const tabId = tab.id
  chrome.tabs.get(tabId, current_tab_info => {
    // console.log(`injected in ${tabId}`,current_tab_info)
    if (/^https:\/\/lab\.ssafy\.com/.test(current_tab_info.pendingUrl)) {
      chrome.tabs.executeScript(tabId, {file: "content.js"})
      chrome.tabs.insertCSS(tabId, {file: "ctw.css"})
    }
  })
})

function getOffset() {
  chrome.storage.sync.get(['labWeekOffset'], function(result) {
    data = result
    if (!Object.keys(result).length) {
      setOffset();
      data = {'labWeekOffset': 0}
    }
  })
}

function setOffset(offset) {
  data = offset ? offset : 0
  chrome.storage.sync.set({'labWeekOffset': data}, function() {
    console.log(`saved ${data}`)
  })
}

function resetStorage() {
  chrome.storage.sync.remove(['labWeekOffset'])
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.setOffset) {
    const data = request.setOffset ? request.setOffset.value : 0
    setOffset(data)
  }
})
