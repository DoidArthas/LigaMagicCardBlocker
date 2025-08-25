function removeElementsInterface(owner, itensList) {
	if (window.location.href.includes("https://www.ligamagic.com")) {
		removeElementsLM(owner, itensList);
		return;
    } else {
    	removeElements(owner, itensList);
    }
}