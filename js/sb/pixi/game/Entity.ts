namespace sb.pixi.game
{

    export abstract class Entity
    {

        public position: { x: number, y: number } = { x: 0, y: 0 };
        public rotation: number = 0;
        //public engineIndex: number = -1; //-1 = out of bounds | not part of array


        constructor()
        {

        }

        public abstract update(deltaMS: number, deltaSC: number): void


    }
}