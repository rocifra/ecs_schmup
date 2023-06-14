namespace sb.ecs.components
{
    //requires Transform component   
    export class Sprite extends sb.ecs.Component
    {

        //inspectables
        public textureID: string;
        public anchorX: number = 0.5;
        public anchorY: number = 0.5;
        public pivotX: number = 0;
        public pivotY: number = 0;

        //width /height/anchorX/anchorY
        public sprite: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        private _texture: PIXI.Texture;
        private _transform: Transform;
        private _entityManager: sb.ecs.EntityManager;
        //private _graphicsSystem: sb.ecs.systems.PixiGraphicsSystem;
        //private _assetsManager: sb.ecs.systems.AssetsManager


        constructor()
        {
            super(true);

            this.setInspectable("textureID", "string");
            this.setInspectable("anchorX", "number");
            this.setInspectable("anchorY", "number");
            this.setInspectable("pivotX", "number");
            this.setInspectable("pivotY", "number");
        }

        public attached(): void
        {
            this._transform = <Transform>this.entity.getComponent("Transform");
        }

        public activated(): void
        {

            this.sprite.pivot.set(this.pivotX, this.pivotY);
            this.sprite.anchor.set(this.anchorX, this.anchorY);
            this.sprite.position.set(this._transform.x, this._transform.y);

            /*
            this.sprite.texture = this._assetsManager.getTexture(this.textureID);
           
            this._graphicsSystem.stage.addChild(this.sprite);
            */
        }

        public deactivated(): void
        {
            // this.sprite.parent.removeChild(this.sprite);
        }

        public update(deltaMS: number, deltaSC: number): void
        {
            this.sprite.position.set(this._transform.x, this._transform.y);
            this.sprite.rotation = this._transform.rotation;
        }
    }
}