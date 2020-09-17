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

// chrome.tabs.onActivated.addListener(activeInfo => {
//   const tabId = activeInfo.tabId
//   chrome.tabs.get(tabId, current_tab_info => {
//     if (/^https:\/\/lab\.ssafy\.com/.test(current_tab_info.url)) {
//       console.log(`injected in ${tabId}`,current_tab_info)
//       chrome.tabs.executeScript(tabId, {file: "content.js"})
//       chrome.tabs.insertCSS(tabId, {file: "ctw.css"})
//     }
//   })
// })
