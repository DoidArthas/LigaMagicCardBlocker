function removeElementsLM(owner, itensList) {
    const cardDivs = document.querySelectorAll('.mtg-single'); // todos os cards atuais

    if (!cardDivs || cardDivs.length === 0) return; // sem cards, sai da função

    let container = document.querySelector('.removedCards');

    // Cria container apenas se não existir
    if (!container) {
        container = document.createElement('div');
        container.className = 'removedCards';

        // Copia estilos do container original, se existir
        const originalContainer = document.querySelector('.container');
        if (originalContainer) {
            container.style.cssText = originalContainer.style.cssText || '';
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.gap = '10px';
        }

        document.body.appendChild(container);
    }

    cardDivs.forEach((cardDiv, index) => {
        // Pega o título principal ou auxiliar
        const titleElement = cardDiv.querySelector('.mtg-name a') || cardDiv.querySelector('.mtg-name-aux a');
        if (!titleElement || !titleElement.textContent) return; // protege contra undefined

        let normalizedTitle;
        try {
            normalizedTitle = normalizer(titleElement); // normaliza título
        } catch (err) {
            console.warn('Normalizer falhou para:', titleElement.textContent, err);
            return;
        }

        // Verifica se o card já está na lista de itens
        if (itensList.includes(normalizedTitle)) {
            // Evita criar botão duplicado
            if (!cardDiv.querySelector('.remove-button')) {
                const removeButton = document.createElement('button');
                removeButton.textContent = 'REMOVE FROM BLOCK-LIST';
                removeButton.className = 'remove-button';
                removeButton.id = `remove-${index}`;
                removeButton.style.marginTop = '5px';
                removeButton.addEventListener('click', () => {
                    logThat(owner, `Removing ${normalizedTitle} from block-list.`);
                    cardDiv.remove();
                });
                cardDiv.appendChild(removeButton);
            }

            // Move o card para o container de removidos
            container.appendChild(cardDiv);
        }
    });
}
