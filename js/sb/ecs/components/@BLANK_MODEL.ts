namespace sb.ecs.components
{
    export class BLANK_MODEL extends sb.ecs.Component
    {    


        constructor()
        {
            super(false);
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
            super.setProps(propsData);
        }
    }
}