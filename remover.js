//Function to remove cards from page
function removeElements(owner, itensList) {
  const cardDiv = document.querySelectorAll('.card-item');
  let container = document.querySelector('.removedCards');

  if (!container) {
    container = document.createElement('div'); // Create a container element
    container.className = "removedCards";
    
    const cards = document.querySelector('.cards');
    container.style.cssText = cards.cssText;

    const pageContainer = document.querySelector('body'); // Adjust the container if necessary
    pageContainer.appendChild(container); // Append the container to the page
  }


  logThat(owner, 'Removing cards already in list:', '\n\n', '\n\n\n');
  cardDiv.forEach((cardDiv) => {
    const titleElement = cardDiv.querySelector('.title').innerText.trim();

    const normalizedTitle = normalizer(titleElement);

    if (itensList.includes(normalizedTitle)) {
      buttons = cardDiv.querySelector('.card-buttons');
      if(buttons) buttons.innerHTML = ``;

      container.appendChild(cardDiv); // Add the matched div to the container
      logThat(owner, 'REMOVER: Moving \"' + titleElement.innerText + '\" card to the bottom.', '', '');
    }
  });

  
}

function pageLoaded(owner) {
  return new Promise((resolve, reject) => {
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
    setTimeout(() => {
        console.log('Page loaded for owner:', owner);
        resolve(); // Resolve the promise when loading is completed
    }, 300); // Simulating a delay
  });

}
