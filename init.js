owner = 'INITIALIZER';

//If block-list don't exist, create it
//Then remove all cards in block-list from page
chrome.storage.local.get('savedItens', function(result) 
{
    var itens = result.savedItens;

    if (typeof itens === 'undefined')
    {
        itens = ['firstCardName'];
        logThat(owner, 'No list yet, creating it.', '', '');
        chrome.storage.local.set({ savedItens: itens }, function() 
        {
            logThat(owner, 'List saved locally.', '', '');
        });
    }
    else
    {
        removeElements(owner, itens);
    }
    newMessage = "Cards in block list: " + itens.length;
    logThat(owner, newMessage, '\n\n', '\n\n\n');
});
