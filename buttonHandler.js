owner = "button_handler";

function addBlockButton(owner) {
  const cardDivs = document.querySelectorAll('.card-desc');
  if (cardDivs.length) {
    logThat(owner, 'Adding Block Buttons.', '\n\n', '\n\n\n');

    for (const div of cardDivs) {
      const divElement = div.querySelector('.title');
      const aElement = divElement.querySelector('a');
      const linkText = aElement.textContent;
      div.innerHTML = `<div title="block"><button class="block-button" id="${linkText}">BLOCK</button></div>${div.innerHTML}`;
    }
  }
}

// Function to handle button clicks
function handleButtonClick(owner, event) {
  logThat('owner', 'Button Clicked.', '', '');
  appendName(owner, event.target.id);
  removeElements(owner, event.target.id);
}

//Function to add cards to the block-list
function appendName(owner, cardName) {
  chrome.storage.local.get('savedItens', (result) => {
    const items = result.savedItens || [];

    const newMessage = `Adding new Card to block-list: ${cardName}`;
    logThat(owner, newMessage, '', '');

    items.push(cardName);

    chrome.storage.local.set({ savedItens: items }, () => {
      const newMessage = `List saved locally. There are ${items.length} cards in the list.`;
      logThat(owner, newMessage, '', '');
    });
  });
}


//Add Block button in all cards
addBlockButton(owner);

// Find all button elements on the page
// Attach the click event listener to each button
document.querySelectorAll('button.block-button').forEach((button) => {
  button.addEventListener('click', (event) => handleButtonClick(owner, event));
});
