chrome.runtime.onInstalled.addListener(function() {

});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({
            sucess: true,
        });
    });