//enforces single instances
namespace sb.ecs.systems
{

    export class TransformDebugger extends sb.ecs.System
    {

        private _transformViewPool: sb.data.ObjectPool;
        //private _views: Array<TransformView> = [];
        private _debugSpritesMap: Map<components.Transform, TransformView> = new Map();
        private _graphicsLayer: sb.pixi.display.Container;

        constructor(params: { graphicsLayer: sb.pixi.display.Container })
        {
            super(true);

            this._graphicsLayer = params.graphicsLayer;
           
        }

        public activated(): void
        {
            this._transformViewPool = new sb.data.ObjectPool(this.transformView_constructor, this.entityManager.componentManager.getComponentMapSize("Transform"), true, 1, "TransformDebugView");
            //register to filter signals
            this.entityManager.signals.getComponentTypeSignalsByStringID("Transform").added.add(this.transformComponentAdded_handler);
            this.entityManager.signals.getComponentTypeSignalsByStringID("Transform").removed.add(this.transformComponentRemoved_handler);
        }

        private transformView_constructor(): TransformView
        {
            let view = new TransformView()

            return view;
        }

        private transformComponentRemoved_handler = (transformComponent: sb.ecs.components.Transform) =>
        {
            let view: TransformView = this._debugSpritesMap.get(transformComponent);
            this._debugSpritesMap.delete(transformComponent);
            this._graphicsLayer.removeChild(view);
            this._transformViewPool.returnInstanceToPool(view);
            
        }

        private transformComponentAdded_handler = (transformComponent: sb.ecs.components.Transform) =>
        {
            let view: TransformView = this._transformViewPool.getInstanceFromPool();
            //view.transformComponent = transformComponent;
            view.x = transformComponent.x;
            view.y = transformComponent.y;
            this._debugSpritesMap.set(transformComponent, view)
            this._graphicsLayer.addChild(view);
        }

       

        public update(deltaMS: number, deltaSC: number)
        {
            for (let [transformComponent, view] of this._debugSpritesMap)
            {
                view.x = transformComponent.x;
                view.y = transformComponent.y;
                view.rotation = transformComponent.rotation;
            }           
        }
    }

    class TransformView extends sb.pixi.display.Container
    {
        public transformComponent: sb.ecs.components.Transform;

        private _graphics: PIXI.Graphics;
        private _size: number = 50;
        private _thickness: number = 1;

        constructor()
        {

            super(50, 50);

            this._graphics = new PIXI.Graphics();

            // set the line style to have a width of 5 and set the color to red
            this._graphics.lineStyle(1, 0xCC0000);
            this._graphics.beginFill(0xCC0000);

            this._graphics.drawRect(-1, -this._size / 2, 2, this._size);
            this._graphics.drawRect(-this._size / 2, -1, this._size, 2);

            this.addChild(this._graphics);
        }
    }
}