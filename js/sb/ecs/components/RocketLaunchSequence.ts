namespace sb.ecs.components
{
    //requires VectorMotion, Transform, AngularTargetTracking
    export class RocketLaunchSequence extends sb.ecs.Component
    {

        public launchDuration: number = 0;
        public launchDurationVariance: number = 0;
        public launchDirection: number = 0;
        public launchDirectionVariance: number = 0;
        public acceleration: number = 0;
        public launchEndFriction: number = 0;

        private _cTransform: Transform;

        private _currentTime: number = 0;
        private _currentSpeed: number = 0;
        private _launchSequenceEnded: boolean = false;

        constructor()
        {
            super(true);

        }

        public attached()
        {
            //requires VectorMotion, Transform, AngularTargetTracking
            this._cTransform = <Transform>this.entity.getComponent("Transform");

            this.disableRocketComponents();
        }

        public activated()
        {
            this._currentTime = 0;
            this._launchSequenceEnded = false;
            this._currentSpeed = 0;
        }

        public enableRocketComponents = () =>
        {
            this.entity.enableDynamicComponent("VectorMotion");
            this.entity.enableDynamicComponent("AngularTargetTracking");
           // this.entity.enableDynamicComponent("ParticleSystem");
        }
        public disableRocketComponents = () =>
        {
            this.entity.disableDynamicComponent("VectorMotion");
            this.entity.disableDynamicComponent("AngularTargetTracking");
            //this.entity.disableDynamicComponent("PixiSprite");
        }

        public update(deltaMS: number, deltaSC: number)
        {
            this._currentTime += deltaMS;

            //check if time to enable components and disable self
            if (this._currentTime >= this.launchDuration)
            {
                if (!this._launchSequenceEnded)
                    this.enableRocketComponents();

                this._launchSequenceEnded = true;

                //apply friction
                this._currentSpeed *= this.launchEndFriction;

                if (this._currentSpeed < 0.5)
                    this.entity.disableDynamicComponent(this.stringID);
            }
            else
            {
                //accelerate
                this._currentSpeed += this.acceleration;
            }

            this._cTransform.x += Math.cos(this.launchDirection) * this._currentSpeed * deltaSC;
            this._cTransform.y += Math.sin(this.launchDirection) * this._currentSpeed * deltaSC;
        }
    }
}