namespace sb.ecs.components
{
    export class MaxAge extends sb.ecs.Component
    {
        public maxAge: number = 2000;

        private _currentAge: number = 0;

        constructor()
        {
            super(true);
            this.setInspectable("maxAge", "number");

        }

        public activated()
        {
            this._currentAge = 0;
        }




        public update(deltaMS: number, deltaSC: number): void
        {
            this._currentAge += deltaMS;

            if (this._currentAge > this.maxAge)
            {
                //remove entity
                this.entity.removeSelf();
            }
        }
    }
}