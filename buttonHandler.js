owner = "button_handler";

function addBlockButton(owner) {
  const container = document.querySelector('.container');
  const cardDivs = container.querySelectorAll('.card-desc');

  if (cardDivs.length) {
    logThat(owner, 'Adding Block Buttons.', '\n\n', '\n\n\n');

    cardDivs.forEach(div => {
      const divElement = div.querySelector('.title');
      const aElement = divElement.querySelector('a');
      const linkText = escapeHtml(aElement.textContent);
      
      div.innerHTML = 
        `<div style="display: flex; justify-content: space-between;">
          <div title="block">
            <button class="block-button" id="${linkText}">BLOCK</button>
          </div>

          <div class="searchButtons">
            <div title="search">
              <button class="search-button_collection" id="${linkText}">COLLECTION</button>
            </div>

            <div title="search">
              <button class="search-button_marketplace" id="${linkText}">MARKETPLACE</button>
            </div>

            <div title="search">
              <button class="search-button_scryfall" id="${linkText}">SCRYFALL</button>
            </div>
          </div>
        </div>
        ${div.innerHTML}`;
    
      const button = div.querySelector('.block-button');
      button.addEventListener('click', (event) => handleBlockButtonClick(owner, event));

      const search_collection = div.querySelector('.search-button_collection');
      search_collection.addEventListener
        ('click', (event) => handleSearchButtonClick(owner, event, "collection"));

      const search_market = div.querySelector('.search-button_marketplace');
      search_market.addEventListener
        ('click', (event) => handleSearchButtonClick(owner, event, "marketplace"));

      const search_scryfall = div.querySelector('.search-button_scryfall');
      search_scryfall.addEventListener
        ('click', (event) => handleSearchButtonClick(owner, event, "scryfall"));
  });
  }
}

function addFunctionButtons(owner) {
  //Div to hold function buttons, may change depending on each site;
  const cardDivs = document.querySelectorAll('.nav-category-filters.bg-dark-gray');

  if (cardDivs.length) {
    logThat(owner, 'Adding Function Buttons.', '\n\n', '\n\n\n');

    cardDivs.forEach(div => {
      
      div.innerHTML = 
        `
        <div title="backup">
          <button class="backup-button" id="backup_button">BACKUP</button>
        </div>

        <div>
          <label for="file-input">Choose a JSON file to restore:</label>
          <input type="file" id="file-input" accept=".json">
          <button class="restore-button" id="restore_button">RESTORE</button>
        </div>

        <div title="showBlocked">
          <button class="showCards-button" id="showCards_button">SHOW BLOCKED CARDS</button>
        </div>

        <div>
          <label for="file-input">Choose a CSV file to add:</label>
          <input type="file" id="csv-input" accept=".csv">
          <button class="collection-button" id="collection_button">ADD COLLECTION</button>
        </div>

        ${div.innerHTML}
        `;


      button = div.querySelector('.backup-button');
      button.addEventListener('click', (event) => handleBackupButtonClick(owner, event));

      button = div.querySelector('.restore-button');
      button.addEventListener('click', (event) => handleRestoreButtonClick(owner, event));

      button = div.querySelector('.showCards-button');
      button.addEventListener('click', (event) => handleShowCardsButtonClick(owner, event));

      button = div.querySelector('.collection-button');
      button.addEventListener('click', (event) => handleCollectionButtonClick(owner, event));
    });
  }
}

// Function to handle button clicks
function handleBlockButtonClick(owner, event) {
  logThat('owner', 'Block Button Clicked.', '', '');
  cardName = normalizer(event.target.id);

  appendName(owner, cardName);
  removeElements(owner, cardName);
}

function handleSearchButtonClick(owner, event, buttonType) {
  cardName = event.target.id;
  chrome.runtime.sendMessage({ action: ['searchCard', cardName, buttonType]}, function(response) {
    console.log('Message sent to background script');
  });
}

// Function to handle button clicks
function handleBackupButtonClick(owner, event) {
  logThat('owner', 'Backup Button Clicked.', '', '');

  const now = new Date();

  backupName = ''; 
  backupName = backupName.concat(
    'LMCB-backup_',
    now.getFullYear(), '-',
    zeroAdd(now.getMonth()), '-',
    zeroAdd(now.getDate()), '_',
    zeroAdd(now.getHours()), '-',
    zeroAdd(now.getMinutes()), '-',
    zeroAdd(now.getSeconds()),
    '.json'
  )

  chrome.storage.local.get('savedItens', (result) => {
    const items = result.savedItens || [];

    var _myArray = JSON.stringify(items); //indentation in json format, human readable

    var vLink = document.createElement('a'),
    vBlob = new Blob([_myArray], {type: "octet/stream"}),
    vName = backupName,
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

      contentsLower = normalizer(contents);

      const parsedItems = JSON.parse(contentsLower);

      const uniqueItems = Array.from(new Set(parsedItems));
      
      // Now you can use parsedItems which should contain your array data
      // For example, you might want to store it back into chrome.storage.local
      
      chrome.storage.local.set({ savedItens: uniqueItems }, () => {
        const newMessage = `List saved locally. There are ${uniqueItems.length} cards in the list.`;
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

function handleShowCardsButtonClick(owner, event) {
  message = "Showing Blocked Cards";

  logThat(owner, message);
}

function handleCollectionButtonClick(owner, event) {
  const fileInput = document.getElementById('csv-input');
  const file = fileInput.files[0];
  
  if (!file) {
    console.error('No file selected.');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const csvData = event.target.result;
    
    // Split CSV into rows while considering quoted fields that may contain commas
    const rows = parseCSV(csvData);
    
    const cards = [];
    
    for (let i = 1; i < rows.length; i++) { // Start from index 1 to skip header row
      const columns = rows[i];
      const cardPT = columns[3] ? columns[3].trim() : ''; // "Card (PT)" column
      const cardEN = columns[4] ? columns[4].trim() : ''; // "Card (EN)" column
      
      // Choose "Card (PT)" if available, otherwise fallback to "Card (EN)"
      const cardName = cardPT !== '' ? cardPT : cardEN;
      
      if (cardName !== '') {
        cards.push(cardName);
      }
    }

    chrome.storage.local.get('savedItens', (result) => {
      const items = result.savedItens || [];
  
      const newMessage = `Adding new Cards to block-list: ${cards}`;
      logThat(owner, newMessage, '', '');
  
      const concatItems = items.concat(cards);
      const uniqueItems = Array.from(new Set(concatItems));
  
      chrome.storage.local.set({ savedItens: uniqueItems }, () => {
        const newMessage = `List saved locally. There are ${uniqueItems.length} cards in the list.`;
        logThat(owner, newMessage, '', '');
      });
    });
  };
  
  reader.onerror = function(event) {
    console.error('Error reading file:', event.target.error);
  };
  
  reader.readAsText(file);
}

// Function to parse CSV data into an array of rows and handle quoted fields
function parseCSV(csvData) {
  const rows = [];
  let currentRow = [];
  let insideQuote = false;
  let currentField = '';

  for (let i = 0; i < csvData.length; i++) {
    const char = csvData[i];

    if (char === '"') {
      insideQuote = !insideQuote;
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !insideQuote) {
      currentRow.push(currentField.trim());
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Push the last field and row
  currentRow.push(currentField.trim());
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
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

// Function to escape HTML entities
function escapeHtml(text) {
  text = text.trim();
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function zeroAdd(value) {
  if(value < 10){
    value = `0${value}`;
  }
  return value;
}

function normalizer(text) {
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return text;
}