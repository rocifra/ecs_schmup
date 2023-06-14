namespace sb.ecs.components
{
    //requires Transform component
    export class KeyboardPositionController extends sb.ecs.Component
    {
        public acceleration: number = 0;
        public friction: number = 1;

        private _transform: sb.ecs.components.Transform;
        private _speedX: number = 0;
        private _speedY: number = 0;
        private _accDown: number = 0;
        private _accUp: number = 0;
        private _accLeft: number = 0;
        private _accRight: number = 0;

        constructor()
        {
            super(true);
            this.setInspectable("acceleration", "number");
            this.setInspectable("friction", "number");
        }

        private keyDownHandler = (event: KeyboardEvent) =>
        {
            if (event.keyCode == 37) 
            {
                //left arrow pressed
                this._accLeft = -this.acceleration;
            }
            else if (event.keyCode == 38)
            {
                //up arrow was pressed
                this._accUp = -this.acceleration;
            }
            else if (event.keyCode == 39)
            {
                //right arrow was pressed
                this._accRight = this.acceleration;
            }
            else if (event.keyCode == 40)
            {
                //down arrow was pressed
                this._accDown = this.acceleration;
            }
        }

        private keyUpHandler = (event: KeyboardEvent) =>
        {
             if (event.keyCode == 37) 
            {
                 //left arrow pressed
                 this._accLeft = 0;

            }
            else if (event.keyCode == 38)
            {
                 //up arrow was pressed
                 this._accUp = 0;
            }
            else if (event.keyCode == 39)
            {
                 //right arrow was pressed
                 this._accRight = 0;
            }
            else if (event.keyCode == 40)
            {
                 //down arrow was pressed
                 this._accDown = 0;
            }
        }

        public initialized()
        {

        }

        public attached(): void
        {
            this._transform = <sb.ecs.components.Transform>this.entity.getComponent("Transform");
        }

        public activated()
        {
            document.addEventListener('keydown', this.keyDownHandler);
            document.addEventListener('keyup', this.keyUpHandler);
        }

        public deactivated()
        {
            document.removeEventListener('keydown', this.keyDownHandler);
            document.removeEventListener('keyup', this.keyUpHandler);

        }

        public update(deltaMS: number, deltaSC: number): void
        {
            
            //accelerate
            this._speedX += this._accLeft + this._accRight;
            this._speedY += this._accUp + this._accDown;

            //apply friction
            this._speedX *= this.friction;
            this._speedY *= this.friction;            

            this._transform.x += this._speedX * deltaSC;
            this._transform.y += this._speedY * deltaSC;            
        }
    }
}