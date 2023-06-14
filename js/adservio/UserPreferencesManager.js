var adservio;
(function (adservio) {
    class UserPreferencesManager {
        constructor(engine) {
            //change handlers
            this.soundManagerMuteOptionChange_handler = () => {
                this.updateUserPreferencesChangesFromEngine();
            };
            this.setDefaultUserPreferences = () => {
                //set default
                this._userPreferences = {
                    soundEnabled: true
                };
            };
            this.loadUserPreferences = () => {
                this._userPreferences = JSON.parse(localStorage.getItem("userPreferences"));
                if (!this._userPreferences) {
                    //set default
                    Logger.log("User preferences data not found. Generating default!");
                    this.setDefaultUserPreferences();
                    this.saveUserPreferences();
                }
            };
            this.applyUserPreferences = () => {
                Logger.log("Applying user preferences data to engine!");
                this._engine.soundManager.muted = !this._userPreferences.soundEnabled;
            };
            this.updateUserPreferencesChangesFromEngine = () => {
                Logger.log("Updating user preferences data from engine!");
                console.log("muted - ", this._engine.soundManager.muted);
                //get sound muted preference
                this._userPreferences.soundEnabled = !this._engine.soundManager.muted;
                //save to local storage
                this.saveUserPreferences();
            };
            this.saveUserPreferences = () => {
                Logger.log("Saving user preferences data to localStorage.");
                localStorage.setItem("userPreferences", JSON.stringify(this._userPreferences));
            };
            this._engine = engine;
            //load user preferences
            this.loadUserPreferences();
            //apply user preferences
            this.applyUserPreferences();
            //add change handlers
            this._engine.soundManager.onMuteOptionChanged.add(this.soundManagerMuteOptionChange_handler);
        }
    }
    adservio.UserPreferencesManager = UserPreferencesManager;
})(adservio || (adservio = {}));
//# sourceMappingURL=UserPreferencesManager.js.map