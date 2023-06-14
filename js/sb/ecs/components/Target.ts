namespace sb.ecs.components
{
    export class Target extends sb.ecs.Component
    {
        public targetableTag: string;
        private _targetedTransform: sb.ecs.components.Transform = null;

        constructor()
        {
            super(false);
            this.setInspectable("targetableTag", "string");
        }

        public get targetedTransform(): sb.ecs.components.Transform
        {
            if (!this._targetedTransform)             
            {
                //aquire target
                let tagManager = this.entityManager.tagManager;
                let targetables = tagManager.getFilteredEntitySlots(tagManager.getNumericTag(this.targetableTag));

                let randomIndex = Math.floor(Math.random() * (targetables.length - 1));

                this._targetedTransform = <Transform>targetables[randomIndex].entity.getComponent("Transform");
            }

            return this._targetedTransform;
        }

    }
}