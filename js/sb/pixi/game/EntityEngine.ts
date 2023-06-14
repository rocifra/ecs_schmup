namespace sb.pixi.game
{

    export class EntityEngine
    {

        private _entities: Entity[];

        constructor()
        {

        }

        private updateEntities = (deltaMS: number, deltaSC: number)  =>
        {
            let count: number = this.numEntities;

            for (let i = 0; i < count; i++)
            {
                this._entities[i].update(deltaMS, deltaSC) ;
            }
        }


        public update = (deltaMS: number, deltaSC: number)  =>
        {
            //update entities
            this.updateEntities(deltaMS, deltaSC);

            //update dynamic systems
        }

        public addEntity = (entity: Entity) =>
        {
            /*
            if (entity.engineIndex>-1)
            {
                entity.engineIndex = this._entities.push(entity);
            }
            */
        }

        //getters & setters
        private get numEntities(): number { return this._entities.length }

    }
}