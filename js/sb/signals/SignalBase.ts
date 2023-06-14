namespace sb.signals
{

    export abstract class SignalBase
    {
        protected listeners: Array<Function>;
        protected onceListeners: Array<Function>;
       
        constructor()
        {
            this.listeners = new Array();
            this.onceListeners = new Array();
        }

        private registerListener(listener: Function, once: Boolean = false): void
        {
            if (once == true)
            {
                //don't register twice
                if (this.onceListeners.indexOf(listener) <0)
                    this.onceListeners.push(listener);
            }
            else
            {
                //don't register twice
                if (this.listeners.indexOf(listener) < 0)
                {
                    this.listeners.push(listener);
                }
                else
                {
                    console.warn("Duplicate signal handler registration attempted!")
                }
            }
        }

        public add(listener: Function): void
        {
            this.registerListener(listener);
        }

        public addOnce(listener: Function): void
        {
            this.registerListener(listener, true);
        }


        public remove(listener: Function): void
        {
            var listenerIndex: number = this.listeners.indexOf(listener);

            if (listenerIndex >= 0)            
                this.listeners.splice(listenerIndex, 1);            
        }

        public removeAll(): void
        {
            this.listeners.length = 0;
            this.onceListeners.length = 0;
        }

        public abstract dispatch: (...params) => void

    }
}