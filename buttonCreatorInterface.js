function addCardButtonsInterface(owner){
	if (window.location.href.includes("https://www.ligamagic.com")) {
		addCardButtonsLM(owner);
		handleMoreButton(owner);
		return;
    } else {
    	addCardButtons(owner);
    }
}

function addFunctionButtonsInterface(owner){
	if (window.location.href.includes("https://www.ligamagic.com")) {
		addFunctionButtonsLM(owner);
		return;
    } else {
    	addFunctionButtons(owner);
    }
}