namespace sb.ecs
{
    export class SignalManager
    {

        //private onInitialized = new sb.signals.si()

        private _componentSignals: Array<any> = [];

        private _genericSignalsIndexMap: Map<string, sb.signals.Signal1> = new Map();
        private _entityManager: EntityManager;

        private _stateControlSignalsMap: Map<string, sb.ecs.signals.StateControlSignal> = new Map();
        private _stateControlSignalsArray: Array<sb.ecs.signals.StateControlSignal> = [];

        constructor()
        {
            //this.onInitialized.add(asdasdasd)

        }

        public createStateControlSignal = (signalName: string): sb.ecs.signals.StateControlSignal =>
        {
            var controlSignal: sb.ecs.signals.StateControlSignal;

            if (!this._stateControlSignalsMap.has(signalName))
            {
                controlSignal = new sb.ecs.signals.StateControlSignal();
                this._stateControlSignalsMap.set(signalName, controlSignal);
                this._stateControlSignalsArray.push(controlSignal);
                Logger.log(`New state control signal created [${signalName}]`);
            }
            else
                Logger.warn(`A  state control signal with this name [${signalName}] already created!`);            

            return controlSignal;
        }

        public getStateControlSignal = (signalName: string, autoCreate: boolean = false): sb.ecs.signals.StateControlSignal =>
        {
            var signal: sb.ecs.signals.StateControlSignal = this._stateControlSignalsMap.get(signalName);

            if (!signal)
            {
                if (autoCreate)
                    signal = this.createStateControlSignal(signalName);
                else
                    Logger.warn(`State control signal ${signalName} not found!`);          
            }                  

            return signal
        }


        public initialize(entityManager: EntityManager)
        {
            this._entityManager = entityManager;
        }

        public getComponentTypeSignalsByStringID(constructorName: string): ComponentSignals
        {
            let intID = this._entityManager.componentManager.intIDLookup(constructorName);

            return this.getComponentTypeSignalsByIntID(intID);
        }

        public getComponentTypeSignalsByIntID(intID: number): ComponentSignals
        {
            if (intID < this._componentSignals.length)
                return this._componentSignals[intID];
            else
                Logger.warn("Invalid component ID - ", intID)
        }

        public createComponentTypeSignals(componentTypeIntID: number)
        {
            this._componentSignals[componentTypeIntID] = new ComponentSignals();
        }

        public createGenericSignal = (signalName: string): sb.signals.Signal1 =>
        {
            var signal: sb.signals.Signal1;

            if (!this._genericSignalsIndexMap.has(signalName))
            {
                signal = new sb.signals.Signal1();
                this._genericSignalsIndexMap.set(signalName, signal);

                Logger.log(`New generic signal created [${signalName}]`);
            }
            else
            {
                Logger.warn(`A signal with this name [${signalName}] already created!`)
            }

            return signal;
        }

       
        public getGenericSignalByName = (signalName: string): sb.signals.Signal1 =>
        {
            var signal: sb.signals.Signal1 = this._genericSignalsIndexMap.get(signalName);

            if (!signal)
            {
                signal = this.createGenericSignal(signalName);
                Logger.warn(`Generic signal ${signalName} not found! Created new instance!`);
            }          

            return signal
        }
    }

    class ComponentSignals
    {
        public added: sb.signals.Signal1 = new sb.signals.Signal1();
        public removed: sb.signals.Signal1 = new sb.signals.Signal1();
    }
}