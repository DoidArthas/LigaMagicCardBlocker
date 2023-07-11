function addBlockButton() {
    const cardDiv = document.querySelectorAll('.card-desc');
    if (cardDiv) {
        cardDiv.forEach(function(div) {
            const divElement = div.querySelector('.title');
            const aElement = divElement.querySelector('a');
            const linkText = aElement.textContent;
            div.innerHTML = '<div title="block"><button class="block-button" id="' + linkText + '">BLOCK</button></div>' + div.innerHTML;
        });
    } 
}
