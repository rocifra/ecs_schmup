//enforces single instances
namespace sb.ecs.systems
{

    export class AssetsManagerSystem extends sb.ecs.System
    {
        private _assets: sb.pixi.AssetsManager

        constructor(params:{ assets: sb.pixi.AssetsManager })
        {
            super(false);

            this._assets = params.assets;          
        }       



        public getTexture(textureID: string): PIXI.Texture
        {
            
            return this._assets.getTexture(textureID);
        }
    }
}