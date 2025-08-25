function backupName()
{
    const now = new Date();

    backup = ''; 
    backup = backup.concat
    (
        'LMCB-backup_',
        now.getFullYear(), '-',
        zeroAdd(now.getMonth() + 1), '-',
        zeroAdd(now.getDate()), '_',
        zeroAdd(now.getHours()), '-',
        zeroAdd(now.getMinutes()), '-',
        zeroAdd(now.getSeconds()),
        '.json'
    )

    return backup;
}

// Function to parse CSV data into an array of rows and handle quoted fields
function parseCSV(csvData) {
    const rows = [];
    let currentRow = [];
    let insideQuote = false;
    let currentField = '';
  
    for (let i = 0; i < csvData.length; i++) {
      const char = csvData[i];
  
      if (char === '"') {insideQuote = !insideQuote;} 
      else if (char === ',' && !insideQuote)
      {
        currentRow.push(currentField.trim());
        currentField = '';
      }
      else if (char === '\n' && !insideQuote)
      {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
      else {currentField += char;}
    }
  
    // Push the last field and row
    currentRow.push(currentField.trim());
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
  
    return rows;
}

//Function to add cards to the block-list
function appendName(owner, cards, append = true) {
    chrome.storage.local.get('savedItens', (result) => {
      const items = result.savedItens || [];
  
      const newMessage = `Adding new Cards to block-list: ${cards}`;
      logThat(owner, newMessage, '', '');
  
      if(append === true)
      {
        var concatItems = items.concat(cards);
        var uniqueItems = Array.from(new Set(concatItems));
      }
      else var uniqueItems = Array.from(new Set(cards));
      
      chrome.storage.local.set({ savedItens: uniqueItems }, () => {
        const newMessage = `List saved locally. There are ${uniqueItems.length} cards in the list.`;
        logThat(owner, newMessage, '', '');
      });
    });
}

// Função para escapar entidades HTML de forma segura
function escapeHtml(text) {
    if (typeof text !== 'string') return ''; // evita erro se text for null/undefined

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

function normalizer(titleElement) {
    if (!titleElement) return '';

    let text = typeof titleElement === 'string' ? titleElement : titleElement.textContent || '';
    text = String(text).trim();
    if (!text) return '';

    // decodifica entidades HTML
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    text = txt.value;

    try {
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos
        text = text.replace(/\s+/g, ' ').toLowerCase();
    } catch (err) {
        console.warn('Normalizer falhou para:', text, err);
    }

    return text;
}

