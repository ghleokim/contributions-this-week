// chrome.runtime.onInstalled.addListener(function () {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//       chrome.declarativeContent.onPageChanged.addRules([{
//         conditions: [new chrome.declarativeContent.PageStateMatcher({
//           pageUrl: { hostEquals: 'lab.ssafy.com' },
//           css: ["div.js-contrib-calendar"]
//         })
//         ],
//         actions: [new chrome.declarativeContent.RequestContentScript({js: ["content.js"]})]
//       }]);
//     });
//   });

chrome.runtime.onMessage.addListener(
  function(message, callback) {
    if (message == "runContentScript"){
      chrome.tabs.executeScript({
        file: 'content.js'
      });
    }
 });
