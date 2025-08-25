owner = "button_creator";

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
