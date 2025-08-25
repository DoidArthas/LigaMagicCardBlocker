owner = 'INITIALIZER';

if (!window.__LigaMagicInitDone) {
    pageLoaded(owner).then(() => {
        // Garante que está na página de carrinho
        if (window.location.href.includes("?view=ecom/carrinho")) {
            listarItensCarrinho();
            return;
        }
        else {
            // Add Block button in all cards displayed:
            addCardButtonsInterface(owner);
            addFunctionButtonsInterface(owner);

            if (window.location.href.includes("https://www.ligamagic.com")) return;

            personalizePage(owner);
        }
    }).catch(error => {
        newMessage = "Not a marketplace search page";
        logThat(owner, newMessage);    
    });

    window.__LigaMagicInitDone = true;
}

