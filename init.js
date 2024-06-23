owner = 'INITIALIZER';

pageLoaded(owner).then(() => {
    // Add Block button in all cards displayed:
    addBlockButton(owner);
    addFunctionButtons(owner);

})