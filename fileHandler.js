var itens = ['Uivador Ferve-Sangue', 'Infiltrador il-Kor', 'Degolador il-Dal'];
saveList(itens);

function saveList(itens) {
    chrome.storage.local.set({ savedItens: itens }, function() {
      console.log('List saved locally.');
    });
  }