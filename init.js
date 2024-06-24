owner = 'INITIALIZER';

pageLoaded(owner).then(() => {
    // Add Block button in all cards displayed:
    addCardButtons(owner);
    addFunctionButtons(owner);

}).catch(error => {
    newMessage = "Not a marketplace search page";
    logThat(owner, newMessage);    
});