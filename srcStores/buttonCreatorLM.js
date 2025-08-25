// Função principal que adiciona botões a cards
function addCardButtonsLM(owner, singleCard = null) {
    const cardDivs = singleCard ? [singleCard] : document.querySelectorAll('#mtg-cards .mtg-single');

    if (!cardDivs.length) return;

    logThat(owner, '(LM) Adding Block Buttons.', '\n\n', '\n\n\n');

    cardDivs.forEach(div => {
        // pega apenas o nome principal (em português)
        const mainNameElement = div.querySelector('.mtg-name a');
        const cardName = mainNameElement?.textContent?.trim();
        if (!cardName) return;

        const safeName = escapeHtml(cardName);

        const namesContainer = div.querySelector('.mtg-names');
        if (!namesContainer) return;

        // evita duplicação
        if (namesContainer.querySelector('.card-buttons')) return;

        // cria container principal
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'card-buttons';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'space-between';
        buttonsContainer.style.marginTop = '5px';

        // botão BLOCK
        const blockDiv = document.createElement('div');
        blockDiv.title = 'block';
        const blockButton = document.createElement('button');
        blockButton.className = 'block-button';
        blockButton.id = safeName;
        blockButton.textContent = 'BLOCK';
        blockButton.addEventListener('click', (event) => handleBlockButtonClick(owner, event));
        blockDiv.appendChild(blockButton);

        // container de buscas
        const searchDiv = document.createElement('div');
        searchDiv.className = 'searchButtons';

        const createSearchButton = (title, className, target) => {
            const wrapper = document.createElement('div');
            wrapper.title = title;
            const button = document.createElement('button');
            button.className = className;
            button.id = safeName;
            button.textContent = title.toUpperCase();
            button.addEventListener('click', (event) => handleSearchButtonClick(owner, event, target));
            wrapper.appendChild(button);
            return wrapper;
        };

        searchDiv.appendChild(createSearchButton('collection', 'search-button_collection', 'collection'));
        searchDiv.appendChild(createSearchButton('marketplace', 'search-button_marketplace', 'marketplace'));
        searchDiv.appendChild(createSearchButton('scryfall', 'search-button_scryfall', 'scryfall'));

        // adiciona ao container principal
        buttonsContainer.appendChild(blockDiv);
        buttonsContainer.appendChild(searchDiv);

        namesContainer.appendChild(buttonsContainer);
    });
}

function handleMoreButton(owner){
    // Captura o botão de "Exibir mais"
    const exibirMaisBtn = document.querySelector('#exibir_mais_cards input.exibir-mais');

    if (exibirMaisBtn) {
        // Armazena o handler original
        const originalClick = exibirMaisBtn.onclick;

        // Substitui pelo nosso handler
        exibirMaisBtn.onclick = function(event) {
            // Chama o handler original para carregar os novos cards
            if (originalClick) originalClick.call(this, event);

            // Pequeno delay para esperar os cards serem inseridos no DOM
            setTimeout(() => {
                // Seleciona apenas os novos cards que ainda não têm botões
                const newCards = document.querySelectorAll('#mtg-cards .mtg-single:not(:has(.card-buttons))');

                // Aplica a função apenas nos novos
                addCardButtonsLM('LM', null, newCards);
                pageLoaded(owner);
                handleMoreButton(owner);
            }, 4000); // 100ms geralmente é suficiente, ajuste se necessário
        };
    }
}


function addFunctionButtonsLM(owner) {
    // Seleciona os containers onde os botões devem ser inseridos
    const filterContainers = document.querySelectorAll('.nav-category-filters.bg-dark-gray');

    if (!filterContainers.length) {
        logThat(owner, 'No filter containers found for function buttons.', '', '');
        return;
    }

    logThat(owner, '(LM) Adding Function Buttons.', '\n\n', '\n\n\n');

    filterContainers.forEach(container => {
        // Criar wrapper para os botões
        const wrapper = document.createElement('div');
        wrapper.className = "function-buttons-wrapper";
        wrapper.innerHTML = `
            <div title="backup">
                <button class="backup-button">BACKUP</button>
            </div>

            <div>
                <label for="file-input-restore">Choose a JSON file to restore:</label>
                <input type="file" id="file-input-restore" accept=".json">
                <button class="restore-button">RESTORE</button>
            </div>

            <div title="showBlocked">
                <button class="showCards-button">SHOW BLOCKED CARDS</button>
            </div>

            <div>
                <label for="file-input-csv">Choose a CSV file to add:</label>
                <input type="file" id="file-input-csv" accept=".csv">
                <button class="collection-button">ADD COLLECTION</button>
            </div>
        `;

        // Adiciona os botões antes do conteúdo já existente
        container.prepend(wrapper);

        // Seleciona botões dentro desse wrapper
        const backupButton = wrapper.querySelector('.backup-button');
        const restoreButton = wrapper.querySelector('.restore-button');
        const showButton = wrapper.querySelector('.showCards-button');
        const collectionButton = wrapper.querySelector('.collection-button');

        // Adiciona listeners
        if (backupButton) {
            backupButton.addEventListener('click', () => handleBackupButtonClick(owner));
        }

        if (restoreButton) {
            restoreButton.addEventListener('click', () => handleRestoreButtonClick(owner));
        }

        if (showButton) {
            showButton.addEventListener('click', (event) => handleShowCardsButtonClick(owner, event));
        }

        if (collectionButton) {
            collectionButton.addEventListener('click', () => handleCollectionButtonClick(owner));
        }
    });
}
