chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action[0] === 'searchCard') {
        var nameCard = message.action[1];
        console.log(nameCard);

        // Get current active tab
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentTab = tabs[0];
            var currentGroupId = currentTab.groupId;

            // Function to create a new tab in the same tab group
            function createNewTab(url) {
                chrome.tabs.create({
                    url: url,
                    index: currentTab.index + 1,
                    openerTabId: currentTab.id,
                    windowId: currentTab.windowId
                });
            }

            // Create first tab
            createNewTab(`https://www.ligamagic.com.br/?view=colecao%2Fcolecao&vbuscar=${nameCard}`);

            // Create second tab
            createNewTab(`https://www.ligamagic.com.br/?view=cards%2Fsearch&card=${nameCard}`);

            // Create third tab
            createNewTab
            (
                `https://scryfall.com/search?as=grid&extras=true&lang=any&order=name&q=${nameCard}&unique=cards`
            );
        });
    }

    return true;
});
