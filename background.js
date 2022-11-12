chrome.runtime.onInstalled.addListener(function(details) {
  switch(details.reason) {
    case "install":
      chrome.tabs.create({url: "https://singlethreaded.me/kili-signup"})
    case "update":
      break;
  }
})