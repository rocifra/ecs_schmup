namespace sb.ecs.systems
{




    export class KeyboardInputSystem extends sb.ecs.System
    {

        public static KEYBOARD = {
            A: 65,
            D: 68,
            S: 83,
            W: 87,
            LEFT_ARROW: 37,
            RIGHT_ARROW: 39,
            UP_ARROW: 38,
            DOWN_ARROW: 40,
            SHIFT: 16,
            ENTER: 13
        }


        private _keyIntents: Map<number, string> = new Map();
        private _touchIntents: any
        private _gamePadIntents: any

        private _stateControlSignalsByKey: Array<Array<sb.ecs.signals.StateControlSignal>> = [];


        constructor(params?: {})
        {
            super(false);


        }

        //access to other systems
        public activated()
        {
            document.addEventListener('keydown', this.keyDownHandler);
            document.addEventListener('keyup', this.keyUpHandler);
        }

        public deactivated()
        {
            document.removeEventListener('keydown', this.keyDownHandler);
            document.removeEventListener('keyup', this.keyUpHandler);

        }

        private keyDownHandler = (event: KeyboardEvent) =>
        {
            let keyCode = event.keyCode;
            let keyStateControlSignalsArray = this._stateControlSignalsByKey[keyCode]

            if (keyStateControlSignalsArray)
            {
                for (let i = 0; i < keyStateControlSignalsArray.length; i++)
                    keyStateControlSignalsArray[i].on.dispatch();
            }
        }

        private keyUpHandler = (event: KeyboardEvent) =>
        {
            let keyCode = event.keyCode;
            let keyStateControlSignalsArray = this._stateControlSignalsByKey[keyCode]

            if (keyStateControlSignalsArray)
            {
                for (let i = 0; i < keyStateControlSignalsArray.length; i++)
                    keyStateControlSignalsArray[i].off.dispatch();
            }
        }

        public registerStateControlSignal = (signalName: string, key: number) =>
        {
            var stateControlSignal: sb.ecs.signals.StateControlSignal = this.entityManager.signals.getStateControlSignal(signalName, true);

            if (this._stateControlSignalsByKey[key])
            {
                //we have array
                //check for duplicate
                if (this._stateControlSignalsByKey[key].indexOf(stateControlSignal) > -1)
                    Logger.warn(`State control signal already registered [${signalName}]`);
                else
                    this._stateControlSignalsByKey[key].push(stateControlSignal);                
            }
            else
            {                
                //we don't have array - create one
                this._stateControlSignalsByKey[key] = [];
                this._stateControlSignalsByKey[key].push(stateControlSignal);
            }
        }

       

    }
}