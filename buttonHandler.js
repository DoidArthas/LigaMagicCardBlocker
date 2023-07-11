// Function to handle button clicks
function handleButtonClick(event) {
  console.log(event.target.id);
  appendName(event.target.id);
  const cardItens = document.querySelectorAll('.card-item');
  removeElements(event.target.id, cardItens);
}

//Function to add cards to the block-list
function appendName(cardName) {
  chrome.storage.local.get('savedItens', function(result) 
  {
    var itens = result.savedItens;
  
    console.log("Adding new Card: " + cardName);
    itens.push(cardName);

    console.log('Retrieved list:', itens);

    chrome.storage.local.set({ savedItens: itens }, function() 
    {
      console.log('List saved locally.');
    });
  });
}
