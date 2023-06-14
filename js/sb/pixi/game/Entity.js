var sb;
(function (sb) {
    var pixi;
    (function (pixi) {
        var game;
        (function (game) {
            class Entity {
                //public engineIndex: number = -1; //-1 = out of bounds | not part of array
                constructor() {
                    this.position = { x: 0, y: 0 };
                    this.rotation = 0;
                }
            }
            game.Entity = Entity;
        })(game = pixi.game || (pixi.game = {}));
    })(pixi = sb.pixi || (sb.pixi = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Entity.js.map