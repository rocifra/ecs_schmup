var sb;
(function (sb) {
    var data;
    (function (data) {
        class ObjectPool {
            constructor(constructorMethod, initialSize = 0, autoExpand = true, expandRate = 1, poolID = "default") {
                this._totalSlots = 0;
                this.pool = new Array();
                this.constructorMethod = constructorMethod;
                this.autoExpand = autoExpand;
                this.expandRate = expandRate;
                this.poolID = poolID;
                if (initialSize > 0)
                    this.expandPool(initialSize);
            }
            /***********************************
             * PUBLIC API
             */
            expandPool(amount) {
                for (var i = 0; i < amount; i++) {
                    this.pool.push(this.constructorMethod());
                    this._totalSlots++;
                    //dispatch signal on new object creation
                    // onObjectCreated.dispatch();
                }
            }
            getInstanceFromPool() {
                var instance = this.pool.shift();
                if ((!instance) && (this.autoExpand == true)) {
                    this.expandPool(this.expandRate);
                    //warn that the pool is empty and new instances will be created
                    console.warn("The pool for type - '" + this.poolID + "' is empty. Expanding by amount - " + this.expandRate + "New pool size - " + this._totalSlots);
                    instance = this.pool.shift();
                }
                return instance;
            }
            get size() {
                return this.pool.length;
            }
            returnInstanceToPool(instance) {
                this.pool.push(instance);
            }
        }
        data.ObjectPool = ObjectPool;
    })(data = sb.data || (sb.data = {}));
})(sb || (sb = {}));
//# sourceMappingURL=ObjectPool.js.map