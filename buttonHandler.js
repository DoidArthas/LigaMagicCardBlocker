// Function to handle button clicks
function handleButtonClick(event) {
  logThat('BUTTON_HANDLER', 'Button Clicked.');
  appendName(event.target.id);
  const cardItens = document.querySelectorAll('.card-item');
  removeElements(event.target.id, cardItens);
}

//Function to add cards to the block-list
function appendName(cardName) {
  chrome.storage.local.get('savedItens', function(result) 
  {
    var itens = result.savedItens;
    
    newMessage = "Adding new Card to block-list: " + cardName
    logThat('BUTTON_HANDLER', newMessage);
    itens.push(cardName);

    chrome.storage.local.set({ savedItens: itens }, function() 
    {
      newMessage = 'List saved locally. There are ' + itens.length + ' cards in list.';
      logThat('BUTTON_HANDLER', newMessage);
    });
  });
}
