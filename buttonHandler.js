owner = "button_handler";

function addBlockButton(owner) {
  const cardDivs = document.querySelectorAll('.card-desc');

  if (cardDivs.length) {
    logThat(owner, 'Adding Block Buttons.', '\n\n', '\n\n\n');

    cardDivs.forEach(div => {
      const divElement = div.querySelector('.title');
      const aElement = divElement.querySelector('a');
      const linkText = aElement.textContent;
      
      div.innerHTML = `<div title="block"><button class="block-button" id="${linkText}">BLOCK</button></div>${div.innerHTML}`;
    
      const button = div.querySelector('.block-button');
      button.addEventListener('click', (event) => handleBlockButtonClick(owner, event));
  });
  }
}

function addBackupButtons(owner) {
  const cardDivs = document.querySelectorAll('.nav-category-filters.bg-dark-gray');

  if (cardDivs.length) {
    logThat(owner, 'Adding Backup Button.', '\n\n', '\n\n\n');

    cardDivs.forEach(div => {
      
      div.innerHTML = 
        `<div title="backup">
          <button class="backup-button" id="backup_button">BACKUP</button>
        </div>
        <div>
          <label for="file-input">Choose a JSON file to restore:</label>
          <input type="file" id="file-input" accept=".json">
          <button class="restore-button" id="restore_button">RESTORE</button>
        </div>${div.innerHTML}`;


      button = div.querySelector('.backup-button');
      button.addEventListener('click', (event) => handleBackupButtonClick(owner, event));

      button = div.querySelector('.restore-button');
      button.addEventListener('click', (event) => handleRestoreButtonClick(owner, event));
    });
  }
}

// Function to handle button clicks
function handleBlockButtonClick(owner, event) {
  logThat('owner', 'Block Button Clicked.', '', '');
  appendName(owner, event.target.id);
  removeElements(owner, event.target.id);
}

// Function to handle button clicks
function handleBackupButtonClick(owner, event) {
  logThat('owner', 'Backup Button Clicked.', '', '');

  chrome.storage.local.get('savedItens', (result) => {
    const items = result.savedItens || [];

    var _myArray = JSON.stringify(items); //indentation in json format, human readable

    var vLink = document.createElement('a'),
    vBlob = new Blob([_myArray], {type: "octet/stream"}),
    vName = 'watever_you_like_to_call_it.json',
    vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName );
    vLink.click();

    const newMessage = `Backuping`;
    logThat(owner, newMessage, '', '');
  });
}

// Function to handle button clicks
function handleRestoreButtonClick(owner, event) {
  logThat(owner, 'Restore Button Clicked.', '', '');

  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];

  if (!file) {
    alert('No file selected.');
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    try {
      const contents = event.target.result;
      const parsedItems = JSON.parse(contents);
      
      // Now you can use parsedItems which should contain your array data
      // For example, you might want to store it back into chrome.storage.local
      
      chrome.storage.local.set({ savedItens: parsedItems }, () => {
        const newMessage = `List saved locally. There are ${parsedItems.length} cards in the list.`;
        logThat(owner, newMessage, '', '');
      });

      const newMessage = `Restoring`;
      logThat(owner, newMessage, '', '');
    } catch (error) {
      console.error('Error restoring items:', error);
      alert('Error restoring items. Check console for details.');
    }
  };

  reader.readAsText(file);
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
