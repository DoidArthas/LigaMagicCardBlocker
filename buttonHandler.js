owner = "button_handler";

function addCardButtons(owner){
    const cardDivs = document.querySelector('.container').querySelectorAll('.card-desc');

    if (cardDivs.length) {
        logThat(owner, 'Adding Block Buttons.', '\n\n', '\n\n\n');

        cardDivs.forEach(div => {
            const divElement = div.querySelector('.title');
            const aElement = divElement.querySelector('a');
            const linkText = escapeHtml(aElement.textContent);

            div.innerHTML =
            `
            <div style="display: flex; justify-content: space-between;" class="card-buttons">
                <div title="block">
                    <button class="block-button" id="${linkText}">BLOCK</button>
                </div>

                <div class="searchButtons">
                    <div title="searchCollection">
                        <button class="search-button_collection" id="${linkText}">COLLECTION</button>
                    </div>

                    <div title="searchMarketplace">
                        <button class="search-button_marketplace" id="${linkText}">MARKETPLACE</button>
                    </div>

                    <div title="searchScryfall">
                        <button class="search-button_scryfall" id="${linkText}">SCRYFALL</button>
                    </div>
                </div>
            </div>
            ${div.innerHTML}`;

            const block_button = div.querySelector('.block-button');
            block_button.addEventListener
                ('click', (event) => handleBlockButtonClick(owner, event));

            const search_collection_button = div.querySelector('.search-button_collection');
            search_collection_button.addEventListener
                ('click', (event) => handleSearchButtonClick(owner, event, "collection"));

            const search_market_button = div.querySelector('.search-button_marketplace');
            search_market_button.addEventListener
                ('click', (event) => handleSearchButtonClick(owner, event, "marketplace"));

            const search_scryfall_button = div.querySelector('.search-button_scryfall');
            search_scryfall_button.addEventListener
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

            ${div.innerHTML}`;

            backup_button = div.querySelector('.backup-button');
            backup_button.addEventListener
                ('click', (event) => handleBackupButtonClick(owner));

            restore_button = div.querySelector('.restore-button');
            restore_button.addEventListener
                ('click', (event) => handleRestoreButtonClick(owner));

            show_button = div.querySelector('.showCards-button');
            show_button.addEventListener
                ('click', (event) => handleShowCardsButtonClick(owner, event));

            collection_button = div.querySelector('.collection-button');
            collection_button.addEventListener
                ('click', (event) => handleCollectionButtonClick(owner));
        });
    }
}

function handleBlockButtonClick(owner, event) {
    logThat('owner', 'Block Button Clicked.', '', '');
    const cardName = normalizer(event.target.id);

    appendName(owner, cardName);
    removeElements(owner, cardName);
}

function handleSearchButtonClick(owner, event, buttonType) {
    cardName = event.target.id;
    chrome.runtime.sendMessage({ action: ['searchCard', cardName, buttonType]}, function(response) {
        console.log('Message sent to background script');
    });
}

function handleBackupButtonClick(owner) {
    logThat('owner', 'Backup Button Clicked.', '', '');

    const nameBackup = backupName();

    chrome.storage.local.get('savedItens', (result) => {
        const items = result.savedItens || [];

        var cards = JSON.stringify(items); //indentation in json format, human readable

        var vLink = document.createElement('a'),
        vBlob = new Blob([cards], {type: "octet/stream"}),
        vName = nameBackup,
        vUrl = window.URL.createObjectURL(vBlob);
        vLink.setAttribute('href', vUrl);
        vLink.setAttribute('download', vName );
        vLink.click();

        const newMessage = `Backuping`;
        logThat(owner, newMessage);
    });
}

function handleRestoreButtonClick(owner) {
    logThat(owner, 'Restore Button Clicked.', '', '');

    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('No file selected.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(loadEvent) {
        try {
            const contents = loadEvent.target.result;
            const normalized = normalizer(contents);
            const parsedItems = JSON.parse(normalized);

            appendName(owner, parsedItems, false);

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

    const container = document.querySelector('.container');
    const removedCards = document.querySelector('.removedCards');

    const cards = document.querySelector('.cards');

    cards.innerHTML =
    `
    ${removedCards.innerHTML}
    ${cards.innerHTML}
    `

    const buttons = document.querySelectorAll('.remove-button');

    if (buttons.length) {
        buttons.forEach(div => {
            const linkText = div.id;

            div.addEventListener
                ('click', (event) => handleRemoveButtonClick(owner, linkText));
        });
    }
}

function handleCollectionButtonClick(owner) {
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

            if (cardName !== '') cards.push(cardName);
        }

        appendName(owner, cards);
    };

    reader.onerror = function(event) {
        console.error('Error reading file:', event.target.error);
    };

    reader.readAsText(file);
}

function handleRemoveButtonClick(owner, title) {
    newMessage = `Removind \"${title}\" from block list.`;
    logThat(owner, newMessage);

    chrome.storage.local.get('savedItens', (result) => {
        let items = result.savedItens || [];

        items = items.filter(item => item !== title);
        
        chrome.storage.local.set({ savedItens: items }, () => {
          const newMessage = `List saved locally. There are ${items.length} cards in the list.`;
          logThat(owner, newMessage, '', '');
        });
    });

    const card = document.getElementById(title);

    card.innerHTML = ``;
}