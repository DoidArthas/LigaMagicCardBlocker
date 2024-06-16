//Function to remove cards from page
function removeElements(owner, itensList) {
  const cardDiv = document.querySelectorAll('.card-item');
  const container = document.createElement('div'); // Create a container element
  container.style.display = 'flex'; // Set container's display property to flex

  logThat(owner, 'Removing cards already in list:', '\n\n', '\n\n\n');
  cardDiv.forEach((cardDiv) => {
    const titleElement = cardDiv.querySelector('.title');
    if (itensList.includes(titleElement.innerText.trim())) {
      container.appendChild(cardDiv); // Add the matched div to the container
      logThat(owner, 'REMOVER: Moving \"' + titleElement.innerText + '\" card to the bottom.', '', '');
    }
  });

  const pageContainer = document.querySelector('body'); // Adjust the container if necessary
  pageContainer.appendChild(container); // Append the container to the page
}

function pageLoaded(owner) {
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
}