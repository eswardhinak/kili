chrome.runtime.onInstalled.addListener(function (object) {
  if (object.reason === "install") {
    chrome.tabs.create({})
    chrome.runtime.setUninstallURL("https://enterflow.typeform.com/to/I2zWkK16")
  }
})
