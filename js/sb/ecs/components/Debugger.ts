namespace sb.ecs.components
{

    //requires Transform component   
    export class Debugger extends sb.ecs.Component
    {
        private _transform: Transform;

        constructor()
        {
            super(true);
        }

        public attached()
        {
            this._transform = <Transform>this.entity.getComponent("Transform")
        }

        public update(deltaMS: number, deltaSC: number): void
        {
            console.log(this._transform.x, this._transform.y, this._transform.rotation)
        }
    }
}