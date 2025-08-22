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


// Chame injectPagerBoost() no content script quando a página carregar.
function personalizePage(owner) {
  // Seleciona a tabela de paginação
  const table = document.querySelector('table.ecomresp-tab');
  if (!table) return;

  // Localiza botões existentes
  const links = Array.from(table.querySelectorAll('a.ecomresp-paginacao'));
  const nextBtn = links.find(a => a.textContent.trim() === '>');
  const currentLink = links.find(a => a.querySelector('b'));
  if (!currentLink) return;

  const currentPage = parseInt(currentLink.textContent.trim(), 10);
  if (isNaN(currentPage)) return;

  // Função para estilizar botões de paginação
  function styleBtn(btn) {
    Object.assign(btn.style, {
      fontSize: '16px',
      padding: '4px 10px',
      margin: '0 3px',
      border: '1px solid #999',
      borderRadius: '5px',
      backgroundColor: '#f8f8f8',
      textDecoration: 'none',
      color: '#000',
      display: 'inline-block'
    });
    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#e6e6e6');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#f8f8f8');
  }

  // Estiliza todos os botões já existentes
  links.forEach(styleBtn);

  // Adiciona botão "‹" antes do contador
  if (currentPage > 1 && nextBtn) {
    const u = new URL(nextBtn.href, location.href);
    u.searchParams.set('page', String(currentPage - 1));
    const prevHref = u.toString();

    const prevBtn = document.createElement('a');
    prevBtn.textContent = '‹';
    prevBtn.href = prevHref;
    prevBtn.className = 'ecomresp-paginacao';
    styleBtn(prevBtn);

    const firstCell = table.querySelector('td.textoMaior');
    if (firstCell) {
      firstCell.insertBefore(prevBtn, firstCell.firstChild);
    }
  }
}

function listarItensCarrinho() {
  const cartBody = document.querySelector('.table-cart-body');
  if (!cartBody) return;

  const items = cartBody.querySelectorAll('.table-cart-row');
  if (!items.length) return;

  // Monta a lista
  let listaTexto = "";
  const ul = document.createElement('ul');
  ul.style.listStyle = "disc";
  ul.style.paddingLeft = "20px";
  ul.style.margin = "10px 0";

  items.forEach(item => {
    const nomeEl = item.querySelector('.checkout-product--title a');
    const qtdEl = item.querySelector('.checkout-product--qty');

    if (nomeEl && qtdEl) {
      const linha = `${qtdEl.value} ${nomeEl.textContent.trim()}`;
      listaTexto += linha + "\n";

      const li = document.createElement('li');
      li.textContent = linha;
      ul.appendChild(li);
    }
  });

  // Cria bloco container para destacar
  const box = document.createElement('div');
  box.style.border = "1px solid #ccc";
  box.style.padding = "12px";
  box.style.marginBottom = "20px";
  box.style.background = "#f9f9f9";
  box.style.borderRadius = "6px";

  const titulo = document.createElement('div');
  titulo.textContent = "Itens no Carrinho:";
  titulo.style.fontWeight = "bold";
  titulo.style.marginBottom = "8px";

  // Botão de copiar
  const botaoCopiar = document.createElement('button');
  botaoCopiar.textContent = "📋 Copiar Lista";
  botaoCopiar.style.display = "block"; // ocupa linha inteira
  botaoCopiar.style.width = "100%";    // ocupa largura total da caixinha
  botaoCopiar.style.padding = "10px";
  botaoCopiar.style.margin = "10px 0";
  botaoCopiar.style.border = "1px solid #888";
  botaoCopiar.style.background = "#e6e6e6";
  botaoCopiar.style.cursor = "pointer";
  botaoCopiar.style.borderRadius = "5px";
  botaoCopiar.style.fontWeight = "bold";

    botaoCopiar.onclick = (event) => {
      event.stopPropagation(); // impede que o click borbulhe para o botão de comprar
      event.preventDefault();  // previne comportamento padrão, se houver
      navigator.clipboard.writeText(listaTexto).then(() => {
        botaoCopiar.textContent = "✅ Copiado!";
        setTimeout(() => botaoCopiar.textContent = "📋 Copiar Lista", 1500);
      });
    };

  box.appendChild(titulo);
  box.appendChild(botaoCopiar);
  box.appendChild(ul);

  // Insere acima da área de frete
  const summaryCart = document.querySelector('.summary-cart');
  if (summaryCart) {
    const entregaTitle = summaryCart.querySelector('.title-cart');
    if (entregaTitle) {
      summaryCart.insertBefore(box, entregaTitle);
    } else {
      summaryCart.prepend(box);
    }
  }
}