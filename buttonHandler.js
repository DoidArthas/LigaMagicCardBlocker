owner = "button_handler";

function handleBlockButtonClick(owner, event) {
    logThat('owner', 'Block Button Clicked.', '', '');
    const cardName = normalizer(event.target.id);

    appendName(owner, cardName);
    removeElements(owner, cardName);
}

function handleSearchButtonClick(owner, event, buttonType) {
    const cardName = event.target.id;

    let url = "";

    if (buttonType === "collection") {
        url = `https://www.ligamagic.com.br/?view=colecao%2Fcolecao&vbuscar=${encodeURIComponent(cardName)}`;
    } else if (buttonType === "marketplace") {
        url = `https://www.ligamagic.com.br/?view=cards%2Fsearch&card=${encodeURIComponent(cardName)}`;
    } else if (buttonType === "scryfall") {
        url = `https://scryfall.com/search?as=grid&extras=true&lang=any&order=name&q=${encodeURIComponent(cardName)}&unique=cards`;
    }

    // Abre a aba diretamente
    if (chrome && chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url: url });
    } else {
        // fallback caso chrome.tabs não esteja disponível
        window.open(url, "_blank");
    }

    logThat(owner, `Opened ${buttonType} search for "${cardName}"`);
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

