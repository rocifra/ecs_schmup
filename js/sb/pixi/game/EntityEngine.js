var sb;
(function (sb) {
    var pixi;
    (function (pixi) {
        var game;
        (function (game) {
            class EntityEngine {
                constructor() {
                    this.updateEntities = (deltaMS, deltaSC) => {
                        let count = this.numEntities;
                        for (let i = 0; i < count; i++) {
                            this._entities[i].update(deltaMS, deltaSC);
                        }
                    };
                    this.update = (deltaMS, deltaSC) => {
                        //update entities
                        this.updateEntities(deltaMS, deltaSC);
                        //update dynamic systems
                    };
                    this.addEntity = (entity) => {
                        /*
                        if (entity.engineIndex>-1)
                        {
                            entity.engineIndex = this._entities.push(entity);
                        }
                        */
                    };
                }
                //getters & setters
                get numEntities() { return this._entities.length; }
            }
            game.EntityEngine = EntityEngine;
        })(game = pixi.game || (pixi.game = {}));
    })(pixi = sb.pixi || (sb.pixi = {}));
})(sb || (sb = {}));
//# sourceMappingURL=EntityEngine.js.map