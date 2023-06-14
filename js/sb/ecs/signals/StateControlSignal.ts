namespace sb.ecs.signals
{

    export class StateControlSignal
    {
        public on: sb.signals.Signal1;
        public off: sb.signals.Signal1;

        constructor()
        {
            this.on = new sb.signals.Signal1();
            this.off = new sb.signals.Signal1();
        }
    }
}