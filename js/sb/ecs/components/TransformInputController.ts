namespace sb.ecs.components
{
    //requires Transform component
    export class TransformInputController extends sb.ecs.Component
    {
        public acceleration: number = 0;
        public friction: number = 1;
        public maxSpeed: number = 1;
        public moveLeftStateControlSignal: string;
        public moveRightStateControlSignal: string;
        public moveUpStateControlSignal: string;
        public moveDownStateControlSignal: string;


        private _speedX: number = 0;
        private _speedY: number = 0;

        private _downForce: number = 0;
        private _upForce: number = 0;
        private _leftForce: number = 0;
        private _rightForce: number = 0;

        private _horizontalAxisRange: number = 0;
        private _verticalAxisRange: number = 0;

        private _transform: sb.ecs.components.Transform;


        //cached signals
        private _moveLeftStateControlSignalInstance: sb.ecs.signals.StateControlSignal;
        private _moveRightStateControlSignalInstance: sb.ecs.signals.StateControlSignal;
        private _moveUpStateControlSignalInstance: sb.ecs.signals.StateControlSignal;
        private _moveDownStateControlSignalInstance: sb.ecs.signals.StateControlSignal;

        constructor()
        {
            super(true);
            this.setInspectable("acceleration", "number");
            this.setInspectable("friction", "number");
            this.setInspectable("maxSpeed", "number");
            this.setInspectable("moveLeftStateControlSignal", "string");
            this.setInspectable("moveRightStateControlSignal", "string");
            this.setInspectable("moveUpStateControlSignal", "string");
            this.setInspectable("moveDownStateControlSignal", "string");
        }

        public attached(): void
        {
            this._transform = <sb.ecs.components.Transform>this.entity.getComponent("Transform");

            this._moveLeftStateControlSignalInstance = this.entity.entityManager.signals.getStateControlSignal(this.moveLeftStateControlSignal);
            this._moveRightStateControlSignalInstance = this.entity.entityManager.signals.getStateControlSignal(this.moveRightStateControlSignal);
            this._moveUpStateControlSignalInstance = this.entity.entityManager.signals.getStateControlSignal(this.moveUpStateControlSignal);
            this._moveDownStateControlSignalInstance = this.entity.entityManager.signals.getStateControlSignal(this.moveDownStateControlSignal);
        }

        public detached(): void
        {

        }

        public activated()
        {
            this._moveLeftStateControlSignalInstance.on.add(this.moveLeft_on_handler);
            this._moveLeftStateControlSignalInstance.off.add(this.moveLeft_off_handler);

            this._moveRightStateControlSignalInstance.on.add(this.moveRight_on_handler);
            this._moveRightStateControlSignalInstance.off.add(this.moveRight_off_handler);

            this._moveUpStateControlSignalInstance.on.add(this.moveUp_on_handler);
            this._moveUpStateControlSignalInstance.off.add(this.moveUp_off_handler);

            this._moveDownStateControlSignalInstance.on.add(this.moveDown_on_handler);
            this._moveDownStateControlSignalInstance.off.add(this.moveDown_off_handler);
        }

        public deactivated()
        {
            // document.removeEventListener('keydown', this.keyDownHandler);
            //document.removeEventListener('keyup', this.keyUpHandler);
        }

        private moveLeft_on_handler = () =>
        {
            //left arrow down
            this._leftForce = -1;
            this._horizontalAxisRange = this._leftForce + this._rightForce;
        }
        private moveLeft_off_handler = () =>
        {
            //left arrow up
            this._leftForce = 0;
            this._horizontalAxisRange = this._leftForce + this._rightForce;
        }
        private moveRight_on_handler = () =>
        {
            //right arrow down
            this._rightForce = 1;
            this._horizontalAxisRange = this._leftForce + this._rightForce;
        }
        private moveRight_off_handler = () =>
        {
            //right arrow up
            this._rightForce = 0;
            this._horizontalAxisRange = this._leftForce + this._rightForce;
        }
        private moveUp_on_handler = () =>
        {
            //top arrow down
            this._upForce = -1;
            this._verticalAxisRange = this._upForce + this._downForce;
        }
        private moveUp_off_handler = () =>
        {
            //top arrow up
            this._upForce = 0;
            this._verticalAxisRange = this._upForce + this._downForce;
        }
        private moveDown_on_handler = () =>
        {
            //down arrow down
            this._downForce = 1;
            this._verticalAxisRange = this._upForce + this._downForce;
        }
        private moveDown_off_handler = () =>
        {
            //down arrow up
            this._downForce = 0;
            this._verticalAxisRange = this._upForce + this._downForce;
        }


        public update(deltaMS: number, deltaSC: number): void
        {

            //accelerate
            this._speedX += this._horizontalAxisRange * this.acceleration;
            this._speedY += this._verticalAxisRange * this.acceleration;

            //apply friction
            this._speedX *= this.friction;
            this._speedY *= this.friction;

            if (Math.abs(this._speedX) > this.maxSpeed)
            {
                if (this._speedX > 0)
                    this._speedX = this.maxSpeed;
                else
                    this._speedX = -this.maxSpeed;
            }
            if (Math.abs(this._speedY) > this.maxSpeed)
            {
                if (this._speedY > 0)
                    this._speedY = this.maxSpeed;
                else
                    this._speedY = -this.maxSpeed;
            }

            this._transform.x += this._speedX * deltaSC;
            this._transform.y += this._speedY * deltaSC;
        }
    }
}