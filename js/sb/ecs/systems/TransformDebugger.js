//enforces single instances
var sb;
//enforces single instances
(function (sb) {
    var ecs;
    (function (ecs) {
        var systems;
        (function (systems) {
            class TransformDebugger extends sb.ecs.System {
                constructor(params) {
                    super(true);
                    //private _views: Array<TransformView> = [];
                    this._debugSpritesMap = new Map();
                    this.transformComponentRemoved_handler = (transformComponent) => {
                        let view = this._debugSpritesMap.get(transformComponent);
                        this._debugSpritesMap.delete(transformComponent);
                        this._graphicsLayer.removeChild(view);
                        this._transformViewPool.returnInstanceToPool(view);
                    };
                    this.transformComponentAdded_handler = (transformComponent) => {
                        let view = this._transformViewPool.getInstanceFromPool();
                        //view.transformComponent = transformComponent;
                        view.x = transformComponent.x;
                        view.y = transformComponent.y;
                        this._debugSpritesMap.set(transformComponent, view);
                        this._graphicsLayer.addChild(view);
                    };
                    this._graphicsLayer = params.graphicsLayer;
                }
                activated() {
                    this._transformViewPool = new sb.data.ObjectPool(this.transformView_constructor, this.entityManager.componentManager.getComponentMapSize("Transform"), true, 1, "TransformDebugView");
                    //register to filter signals
                    this.entityManager.signals.getComponentTypeSignalsByStringID("Transform").added.add(this.transformComponentAdded_handler);
                    this.entityManager.signals.getComponentTypeSignalsByStringID("Transform").removed.add(this.transformComponentRemoved_handler);
                }
                transformView_constructor() {
                    let view = new TransformView();
                    return view;
                }
                update(deltaMS, deltaSC) {
                    for (let [transformComponent, view] of this._debugSpritesMap) {
                        view.x = transformComponent.x;
                        view.y = transformComponent.y;
                        view.rotation = transformComponent.rotation;
                    }
                }
            }
            systems.TransformDebugger = TransformDebugger;
            class TransformView extends sb.pixi.display.Container {
                constructor() {
                    super(50, 50);
                    this._size = 50;
                    this._thickness = 1;
                    this._graphics = new PIXI.Graphics();
                    // set the line style to have a width of 5 and set the color to red
                    this._graphics.lineStyle(1, 0xCC0000);
                    this._graphics.beginFill(0xCC0000);
                    this._graphics.drawRect(-1, -this._size / 2, 2, this._size);
                    this._graphics.drawRect(-this._size / 2, -1, this._size, 2);
                    this.addChild(this._graphics);
                }
            }
        })(systems = ecs.systems || (ecs.systems = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=TransformDebugger.js.map