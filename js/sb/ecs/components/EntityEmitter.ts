namespace sb.ecs.components
{
    //requires Transform component   
    export class EntityEmitter extends sb.ecs.Component
    {

        //public blueprintID: number = 1000;
        public interval: number = 1000;
        public xVariance: number = 0;
        public yVariance: number = 0;
        public rotationVariance: number = 0;
        public emitterX: number = 0;
        public emitterY: number = 0;
        public numEntitiesEmittedPerTick: number = 1;

        public currentTime: number = 0;
        public paused: boolean = false;
        public blueprintID: string = null;

        private _transform: Transform;
        

        constructor()
        {
            super(true);
            this.setInspectable("interval", "string");
            this.setInspectable("xVariance", "number");
            this.setInspectable("yVariance", "number");
            this.setInspectable("rotationVariance", "number");
            this.setInspectable("emitterX", "number");
            this.setInspectable("emitterY", "number");
            this.setInspectable("numEntitiesEmittedPerTick", "number");

            this.setInspectable("paused", "boolean");
            this.setInspectable("blueprintID", "string");
        }
        
        public attached(): void
        {
            //get refs
            this._transform = <Transform>this.entity.getComponent("Transform");
        }

        public detached(): void
        {
            this.paused = false;
            //this._stateControlSignalInstance
        }

        public activated()
        {
            this.currentTime = 0;            
        }

        public deactivated()
        {
           
        }

        public emit = () =>
        {
            //build an entity bullet
            let bullet = this.entityManager.createEntityFromBlueprint(this.blueprintID);
            let transform = <sb.ecs.components.Transform>bullet.getComponent("Transform");

            //set transform properties for the newly created entity with added variances					
            transform.x = this._transform.x + this.emitterX + this.xVariance * (Math.random() * 2 - 1);
            transform.y = this._transform.y + this.emitterY + this.yVariance * (Math.random() * 2 - 1);
            transform.rotation = this._transform.rotation + this.rotationVariance * (Math.random() * 2 - 1);

            this.entityManager.addEntity(bullet);
        }

        public update(deltaMS: number, deltaSC: number) 
        {
            if (!this.paused)
            {
                //update current time
                this.currentTime += deltaMS;

                //check if current time exceeded interval
                if (this.currentTime >= this.interval)
                {
                    //emit entity
                    for (let i = 0; i < this.numEntitiesEmittedPerTick; i++)
                        this.emit();

                    //reset current time
                    this.currentTime = 0;
                }
            }
        }
    }
}