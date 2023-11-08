owner = 'INITIALIZER';

//Add Block button in all cards
addBlockButton(owner);

// Find all button elements on the page
const buttons = document.querySelectorAll('button.block-button');

// Attach the click event listener to each button
buttons.forEach((button) => {
    button.addEventListener('click', handleButtonClick);
});

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
        const cardItens = document.querySelectorAll('.card-item');
        removeElements(owner, itens, cardItens);
    }
    newMessage = "Cards in block list: " + itens.length;
    logThat(owner, newMessage, '\n\n', '\n\n\n');
});


