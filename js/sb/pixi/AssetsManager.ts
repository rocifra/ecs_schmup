namespace sb.pixi
{

    export class AssetsManager
    {
        public onAssetsLoadCompleted: sb.signals.Signal0 = new sb.signals.Signal0();
        public onProgressChanged: sb.signals.Signal1 = new sb.signals.Signal1();

        private _loader: PIXI.loaders.Loader;

        constructor()
        {
            this._loader = new PIXI.loaders.Loader();
            this._loader.onComplete.add(() => { this.onAssetsLoadCompleted.dispatch() })
            this._loader.onProgress.add(() => { this.onProgressChanged.dispatch(this._loader.progress / 100) })
        }

        public add = (resourceID: string, resourceURL: string) =>
        {
            this._loader.add(resourceID, resourceURL);
        }

        public beginLoad = () =>
        {
            this._loader.load();
        }

        public getTexture = (textureID: string, scale: number = 1): PIXI.Texture =>
        {
            let texture: PIXI.Texture
            let resource: PIXI.loaders.Resource = this._loader.resources[textureID];

            if ((!resource) || (resource.error))
            {
                console.warn("Texture missing - ", textureID);
                texture = this._loader.resources["errorTexture"].texture;
            }
            else
            {
                texture = this._loader.resources[textureID].texture;
            }

            if (texture.baseTexture.resolution != scale)
            {
                texture.baseTexture.resolution = scale;
                texture.baseTexture.update();
            }

            return texture
        }

        public getSound = (soundID: string): any =>
        {
            let sound: PIXI.sound.Sound = this._loader.resources[soundID]["sound"];

            if (!sound)
                console.warn("Sound asset not found! - ", soundID);

            return sound
        }
    }
}