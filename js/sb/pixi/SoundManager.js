var sb;
(function (sb) {
    var pixi;
    (function (pixi) {
        class SoundManager {
            constructor(soundAssetsManager) {
                //signals
                this.onMuteOptionChanged = new sb.signals.Signal0();
                this._isMuted = false;
                this.play = (soundID, volume = 1) => {
                    if (!this._isMuted) {
                        let soundAsset = this._soundAssetsManager.getSound(soundID);
                        soundAsset.volume = volume;
                        soundAsset.play();
                    }
                };
                this._soundAssetsManager = soundAssetsManager;
            }
            /*
            public getSound = (soundID: string): PIXI.sound.Sound =>
            {
                let soundAsset: PIXI.sound.Sound = this._soundAssetsManager.getSound(soundID)
    
                return soundAsset
            }
            */
            set globalVolume(value) {
                PIXI.sound.volumeAll = value;
            }
            get muted() { return this._isMuted; }
            set muted(value) {
                this._isMuted = value;
                //dispatch change signal
                this.onMuteOptionChanged.dispatch();
            }
        }
        pixi.SoundManager = SoundManager;
    })(pixi = sb.pixi || (sb.pixi = {}));
})(sb || (sb = {}));
//# sourceMappingURL=SoundManager.js.map