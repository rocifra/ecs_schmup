namespace sb.ecs.systems
{

    export class PixiGraphicsSystem extends sb.ecs.System
    {

        private _stage: sb.pixi.display.Container;
        private _assetsManagerSystem: sb.ecs.systems.AssetsManagerSystem;

        constructor(params: { pixiGraphicsContainer: sb.pixi.display.Container })
        {
            super(false);
            this._stage = params.pixiGraphicsContainer;
        }

        //access to other systems
        public activated()
        {
            this._assetsManagerSystem = <sb.ecs.systems.AssetsManagerSystem>this.entityManager.systemManager.getSystemInstance("AssetsManagerSystem");
            this.entityManager.signals.getComponentTypeSignalsByStringID("PixiSprite").added.add(this.onPixiSpriteComponentAdded)
            this.entityManager.signals.getComponentTypeSignalsByStringID("PixiSprite").removed.add(this.onPixiSpriteComponentRemoved)
        }

        public deactivated()
        {

        }
        
        public onPixiSpriteComponentAdded = (spriteComponent: sb.ecs.components.PixiSprite) =>
        {
            spriteComponent.sprite.texture = this._assetsManagerSystem.getTexture(spriteComponent.textureID);
            this._stage.addChild(spriteComponent.sprite);            
        }

        public onPixiSpriteComponentRemoved = (spriteComponent: sb.ecs.components.PixiSprite) =>
        {
            this._stage.removeChild(spriteComponent.sprite);
        }
        

        public get stage(): sb.pixi.display.Container { return this._stage }
    }
}