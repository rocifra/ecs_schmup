namespace sb.ecs.systems
{

    export class PixiRopeTrailRenderingSystem extends sb.ecs.System
    {

        /*
        
        private _container: sb.pixi.display.Container;
        private _internalRenderer: PIXI.WebGLRenderer;
        private _renderer: PIXI.WebGLRenderer;
        private _renderTextureA: PIXI.RenderTexture;
        private _renderTextureB: PIXI.RenderTexture;
        private _currentRenderTexture: PIXI.RenderTexture;
        private _outputSprite: PIXI.Sprite;
        private _quad: PIXI.Sprite;
        */

        private _stage: sb.pixi.display.Container;

        private historyX = [];
        private historyY = [];
        //historySize determines how long the trail will be.
        private historySize = 20;
        //ropeSize determines how smooth the trail will be.
        private ropeSize = 100;
        private points = [];


        constructor(params: { container: sb.pixi.display.Container })
        {
            super(true);

            super(false);
            this._stage = params.container;
        }

        //access to other systems
        public activated()
        {
           // this._assetsManagerSystem = <sb.ecs.systems.AssetsManagerSystem>this.entityManager.systemManager.getSystemInstance("AssetsManagerSystem");
            this.entityManager.signals.getComponentTypeSignalsByStringID("RopeTrail").added.add(this.onRopeTrailComponentAdded)
            this.entityManager.signals.getComponentTypeSignalsByStringID("RopeTrail").removed.add(this.onPixiSpriteComponentRemoved)
        }

        public onRopeTrailComponentAdded = (spriteComponent: sb.ecs.components.PixiSprite) =>
        {
            //spriteComponent.sprite.texture = this._assetsManagerSystem.getTexture(spriteComponent.textureID);
            this._stage.addChild(spriteComponent.sprite);
        }

        public onPixiSpriteComponentRemoved = (spriteComponent: sb.ecs.components.PixiSprite) =>
        {
            this._stage.removeChild(spriteComponent.sprite);
        }

        public update()
        {
          
        }
    }
}