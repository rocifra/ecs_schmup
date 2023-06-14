namespace sb.ecs
{

    export class System
    {
        public entityManager: sb.ecs.EntityManager;
        public stringID: string;

        private _isDynamic: boolean;

        constructor(isDynamic: boolean)
        {
            this._isDynamic = isDynamic;
        }

        //overridables
        //
        public activated(): void { }
        //
        public deactivated(): void { }
        //called each tick if component is set as dynamic | override to implement logic
        public update(deltaMS: number, deltaSC: number): void { }

        public get isDynamic(): boolean { return this._isDynamic }
    }
}