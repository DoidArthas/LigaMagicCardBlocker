owner = 'INITIALIZER';

if (!window.__LigaMagicInitDone) {
    pageLoaded(owner).then(() => {
        // Add Block button in all cards displayed:
        addCardButtons(owner);
        addFunctionButtons(owner);
        personalizePage(owner);
        
        // Garante que está na página de carrinho
        if (!window.location.href.includes("?view=ecom/carrinho")) return;
        else listarItensCarrinho();
    }).catch(error => {
        newMessage = "Not a marketplace search page";
        logThat(owner, newMessage);    
    });

    window.__LigaMagicInitDone = true;
}

