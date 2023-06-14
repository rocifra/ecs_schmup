namespace sb.signals
{

    export class Signal1 extends SignalBase
    {

        constructor()
        {
            super();
        }

        public dispatch = (data: any = null): void=>
        {
            var i: number;
            var length: number;

            //dispatch listeners
            //a dispatch might modify the array so we traverse it from tail

            //regular listeners
            length = this.listeners.length
            for (i = 0; i < this.listeners.length; i++)
            {
                this.listeners[i].call(null, data);

                //
                var lengthChange: number = length - this.listeners.length;
                if (lengthChange > 0)
                {
                    length -= lengthChange;
                    i--;
                }
            }
         

            //once listeners
            length = this.onceListeners.length
            for (i = 0; i < length; i++)
            {
                this.onceListeners[i].call(null, data);

                //remove onceListeners from array
                this.onceListeners.splice(i, 1);

                //
                var lengthChange: number = length - this.onceListeners.length;
                if (lengthChange > 0)
                {
                    length -= lengthChange;
                    i--;
                }
            }           
        }
    }
}