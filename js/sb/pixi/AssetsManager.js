var sb;
(function (sb) {
    var pixi;
    (function (pixi) {
        class AssetsManager {
            constructor() {
                this.onAssetsLoadCompleted = new sb.signals.Signal0();
                this.onProgressChanged = new sb.signals.Signal1();
                this.add = (resourceID, resourceURL) => {
                    this._loader.add(resourceID, resourceURL);
                };
                this.beginLoad = () => {
                    this._loader.load();
                };
                this.getTexture = (textureID, scale = 1) => {
                    let texture;
                    let resource = this._loader.resources[textureID];
                    if ((!resource) || (resource.error)) {
                        console.warn("Texture missing - ", textureID);
                        texture = this._loader.resources["errorTexture"].texture;
                    }
                    else {
                        texture = this._loader.resources[textureID].texture;
                    }
                    if (texture.baseTexture.resolution != scale) {
                        texture.baseTexture.resolution = scale;
                        texture.baseTexture.update();
                    }
                    return texture;
                };
                this.getSound = (soundID) => {
                    let sound = this._loader.resources[soundID]["sound"];
                    if (!sound)
                        console.warn("Sound asset not found! - ", soundID);
                    return sound;
                };
                this._loader = new PIXI.loaders.Loader();
                this._loader.onComplete.add(() => { this.onAssetsLoadCompleted.dispatch(); });
                this._loader.onProgress.add(() => { this.onProgressChanged.dispatch(this._loader.progress / 100); });
            }
        }
        pixi.AssetsManager = AssetsManager;
    })(pixi = sb.pixi || (sb.pixi = {}));
})(sb || (sb = {}));
//# sourceMappingURL=AssetsManager.js.map