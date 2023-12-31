//Function to remove cards from page
function removeElements(owner, itensList) {
  const cardDiv = document.querySelectorAll('.card-item');
  const container = document.createElement('div'); // Create a container element
  container.style.display = 'flex'; // Set container's display property to flex

  logThat(owner, 'Removing cards already in list:', '\n\n', '\n\n\n');
  cardDiv.forEach((cardDiv) => {
    const titleElement = cardDiv.querySelector('.title');
    if (itensList.includes(titleElement.innerText)) {
      container.appendChild(cardDiv); // Add the matched div to the container
      logThat(owner, "REMOVER: Moving \"" + titleElement.innerText + "\" card to the bottom.", '', '');
    }
  });

  const pageContainer = document.querySelector('body'); // Adjust the container if necessary
  pageContainer.appendChild(container); // Append the container to the page
}
