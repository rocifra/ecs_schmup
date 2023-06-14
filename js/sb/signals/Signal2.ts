namespace sb.signals
{

    export class Signal2 extends SignalBase
    {

        constructor()
        {
            super();
        }

        public dispatch = (data1: any = null, data2: any = null): void =>
        {
            var i: number;
            var length: number;

            //dispatch listeners

            //traverse from HEAD!
            //regular listeners
            length = this.listeners.length
            for (i = 0; i < this.listeners.length; i++)
            {
                this.listeners[i].call(null, data1, data2);

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
                this.onceListeners[i].call(null, data1, data2);

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

            /*
            //a dispatch might modify the array so we traverse it from tail
            //regular listeners
            i = this.listeners.length - 1;
            for (i; i >= 0; --i)
            {
                this.listeners[i].call(null, data1, data2);
            }

            //once listeners
            i = this.onceListeners.length - 1;
            for (i; i >= 0; --i)
            {
                this.onceListeners[i].call(null, data1, data2);

                //remove onceListeners from array
                this.onceListeners.splice(i, 1);
            }
            */
        }
    }
}