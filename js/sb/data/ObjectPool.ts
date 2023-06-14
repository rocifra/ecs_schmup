namespace sb.data
{
    export class ObjectPool
    {
        private pool: Array<any>;
        private constructorMethod: () => any;
        private expandRate: number;
        private autoExpand: boolean;
        private poolID: string;
        private _totalSlots: number = 0;

        constructor( constructorMethod: () => any, initialSize: number = 0, autoExpand: boolean = true, expandRate: number = 1, poolID: string = "default" )
        {
            this.pool = new Array();
            this.constructorMethod = constructorMethod;
            this.autoExpand = autoExpand;
            this.expandRate = expandRate;
            this.poolID = poolID;
            
            if ( initialSize > 0 ) this.expandPool( initialSize );		
        }        

        /***********************************
		 * PUBLIC API 
		 */

        public expandPool(amount: number): void
        {
            for (var i: number = 0; i < amount; i++)
            {
                this.pool.push(this.constructorMethod());

                this._totalSlots++;
                //dispatch signal on new object creation
                // onObjectCreated.dispatch();
            }
        }

        public getInstanceFromPool(): any
        {
            var instance: any = this.pool.shift();

            if ( ( !instance ) && ( this.autoExpand == true ) )
            {
                this.expandPool( this.expandRate );           

                //warn that the pool is empty and new instances will be created
                console.warn("The pool for type - '" + this.poolID + "' is empty. Expanding by amount - " + this.expandRate + "New pool size - " + this._totalSlots);
                
                instance = this.pool.shift();                
            }

            return instance;
        }

        public get size(): number
        {
            return this.pool.length;
        }

        public returnInstanceToPool( instance:any ):void
        {
            this.pool.push( instance );
        }   
    }
}