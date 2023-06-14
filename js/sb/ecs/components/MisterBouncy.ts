namespace sb.ecs.components
{
    //requires Transform component
    export class MisterBouncy extends sb.ecs.Component
    {
        private _gravity: number = 0.75;
        private _speedX: number = Math.random() * 10;
        private _speedY: number = (Math.random() * 10) - 5;
        private _friction: number = 1;
        private _bounds: PIXI.Rectangle;

        private _graphicsSystem: sb.ecs.systems.PixiGraphicsSystem;

        private _transform: Transform;

        constructor()
        {
            super(true);
        }

        public attached(): void
        {
            this._transform = <Transform>this.entity.getComponent("Transform");
            this._graphicsSystem = <sb.ecs.systems.PixiGraphicsSystem>this.entity.entityManager.systemManager.getSystemInstance("PixiGraphicsSystem");
            this._graphicsSystem.stage.showBounds();
            this._bounds = new PIXI.Rectangle(0, 0, this._graphicsSystem.stage.width, this._graphicsSystem.stage.height);

            //let view = this._graphicsSystem.stage;            
        }

        public update(deltaMS: number, deltaSC: number): void
        {
            
            this._speedY += this._gravity;
            this._speedX *= this._friction;
            this._speedY *= this._friction;

            this._transform.x += this._speedX;
            this._transform.y += this._speedY;

            if (this._transform.x > this._bounds.right)
            {
                this._transform.x -= this._speedX;
                this._speedX *= -1;
                
            }
            else if (this._transform.x < this._bounds.left)
            {
                this._transform.x = this._speedX;
                this._speedX *= -1;
            }

            if (this._transform.y > this._bounds.bottom)
            {
                this._transform.y -= this._speedY;
                this._speedY -= this._gravity
                this._speedY *= -1;
                
                /*
                if (Math.random() > 0.5)
                {
                    this._speedY -= Math.random() * 6;
                }
                */
            }
            else if (this._transform.y < this._bounds.top)
            {
                this._speedY *= -1;
                this._transform.y = this._bounds.top;
            }
        }
    }
}