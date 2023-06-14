
namespace sb.debug
{

    export class Logger
    {
        public loggingLevel: number = 0; 

        constructor()
        {

        }

        public log(...params: any[]): void
        {
            if (this.loggingLevel < 1)
                console.log.apply(console, params);
        }

        public warn = (...params: any[]) =>
        {
            if (this.loggingLevel < 2)
                console.warn.apply(console, params);
        }

        public error = (...params: any[]) =>
        {
            if (this.loggingLevel < 3)
                console.error.apply(console, params);
        }
    }
}

var Logger: sb.debug.Logger = window["Logger"];

if (Logger)
{
    console.log("'Logger' global namespace is in use!")
}
else
{
    Logger = new sb.debug.Logger();
}
  





