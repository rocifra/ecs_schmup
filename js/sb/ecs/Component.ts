namespace sb.ecs
{
    export class Component
    {
        public entityManager: sb.ecs.EntityManager = null;
        public entity: sb.ecs.Entity;
        //public dynamicEntityArrayIndex: number = -1;
        public stringID: string;
        public intID: number

        private _isDynamic: boolean;
        private _propsMap: Map<string, string> = new Map();


        constructor(isDynamic: boolean)
        {
            this._isDynamic = isDynamic;
        }


        protected setInspectable(valueName: string, valueType: string)
        {
            if (!this._propsMap.has(valueName))
                this._propsMap.set(valueName, valueType);
            else
                Logger.error("Inspectable property '", valueName, "' already registered")
        }

        //OVERRIDEABLES
        //called once right after instance construction | systems are available here
        public initialized() { }
        //called when attached to entity
        public attached(): void { }
        //called when detached from entity
        public detached(): void { }
        //called when entity is added to manager
        public activated(): void { }
        //called when entity is removed from manager
        public deactivated(): void { }
        //called each tick if component is set as dynamic | override to implement logic
        public update(deltaMS: number, deltaSC: number): void { }

        public setProps(propsData: Object)
        {
            for (var property in propsData)
            {
                if (propsData.hasOwnProperty(property))
                {
                    this[property] = propsData[property];
                }
            }
          
        }



        public get isDynamic(): boolean { return this._isDynamic }


    }
}