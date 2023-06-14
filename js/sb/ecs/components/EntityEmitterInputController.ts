namespace sb.ecs.components
{
    //requires Transform component
    export class EntityEmitterInputController extends sb.ecs.Component
    {
        public stateControlSignalName: string = null;

        private _entityEmitterComponent: sb.ecs.components.EntityEmitter;
        private _stateControlSignalInstance: sb.ecs.signals.StateControlSignal = null;

        constructor()
        {
            super(false);
            this.setInspectable("stateControlSignalName", "string");
        }

        public attached()
        {
            this._entityEmitterComponent = <sb.ecs.components.EntityEmitter>this.entity.getComponent("EntityEmitter");
            this._stateControlSignalInstance = this.entity.entityManager.signals.getStateControlSignal(this.stateControlSignalName);
        }

        public activated()
        {
            this._stateControlSignalInstance.on.add(this.beginEmit);
            this._stateControlSignalInstance.off.add(this.endEmit);
        }

        private beginEmit = () =>
        {
            this._entityEmitterComponent.paused = false;           
        }

        private endEmit = () =>
        {
            this._entityEmitterComponent.paused = true;
        }

    }
}