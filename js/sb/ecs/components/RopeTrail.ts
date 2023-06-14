
namespace sb.ecs.components
{
    export class RopeTrail extends sb.ecs.Component
    {
        public segmentsCount: number = 60;
        public historySize: number = 70;

        public cTransform: Transform;

        private _historyX: Array<number> = [];
        private _historyY: Array<number> = [];
        private _points: Array<PIXI.Point> = [];
        private _pixiRope: PIXI.mesh.Rope;
        private _assetSystem: sb.ecs.systems.AssetsManagerSystem;
        private _graphicsSystem: sb.ecs.systems.PixiGraphicsSystem;

        //requires transform
        constructor()
        {
            super(true);
            this.setInspectable("segmentsCount", "number");
            this.setInspectable("historySize", "number");
        }

        //OVERRIDEABLES
        //called once right after instance construction | systems are available here
        public initialized()
        {
            this._assetSystem = <sb.ecs.systems.AssetsManagerSystem>this.entityManager.systemManager.getSystemInstance("AssetsManagerSystem");
            this._graphicsSystem = <sb.ecs.systems.PixiGraphicsSystem>this.entityManager.systemManager.getSystemInstance("PixiGraphicsSystem");

            this._historyX = [];
            this._historyY = [];

            for (let i = 0; i < this.historySize; i++)
            {
                this._historyX.push(0);
                this._historyY.push(0);
            }

            //Create rope points.
            for (var i = 0; i < this.segmentsCount; i++)
            {
                this._points.push(new PIXI.Point(0, 0));
            }

            this._pixiRope = new PIXI.mesh.Rope(this._assetSystem.getTexture("trail2"), this._points);

            //Set the blendmode
            this._pixiRope.blendMode = PIXI.BLEND_MODES.ADD;
        }

        //called when attached to entity
        public attached(): void
        {
            this.cTransform = <Transform>this.entity.getComponent("Transform");
        }

        //called when entity is added to manager
        public activated(): void
        {
            for (let i = 0; i < this.historySize; i++)
            {
                this._historyX[i] = this.cTransform.x;
                this._historyY[i] = this.cTransform.y;
            }

            for (var i = 0; i < this.segmentsCount; i++)
            {
                this._points[i].x = this.cTransform.x;
                this._points[i].y = this.cTransform.y;
            }

            //this._pixiRope.position.set(this.cTransform.x, this.cTransform.y)
            //add to stage
            this._graphicsSystem.stage.addChild(this._pixiRope);
        }

        //called when entity is removed from manager
        public deactivated(): void
        {
            this._graphicsSystem.stage.removeChild(this._pixiRope);
        }
        //called each tick if component is set as dynamic | override to implement logic
        public update(deltaMS: number, deltaSC: number): void
        {
            //Update the mouse values to history
            this._historyX.pop();
            this._historyX.unshift(this.cTransform.x);
            this._historyY.pop();
            this._historyY.unshift(this.cTransform.y);

            //Update the points to correspond with history.
            for (let i = 0; i < this.segmentsCount; i++)
            {
                var p = this._points[i];

                //Smooth the curve with cubic interpolation to prevent sharp edges.
                var ix = this.cubicInterpolation(this._historyX, i / this.segmentsCount * this.historySize);
                var iy = this.cubicInterpolation(this._historyY, i / this.segmentsCount * this.historySize);

                p.x = ix;
                p.y = iy;

            }
        }

/**
 * Cubic interpolation based on https://github.com/osuushi/Smooth.js
 * @param	k
 * @return
 */
        private cubicInterpolation = (array, t, tangentFactor: number = null) =>
        {
            
            function clipInput(k, arr)
            {
                if (k < 0)
                    k = 0;
                if (k > arr.length - 1)
                    k = arr.length - 1;
                return arr[k];
            }

            function getTangent(k, factor, array)
            {
                return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
            }

            if (tangentFactor == null) tangentFactor = 1;

            var k = Math.floor(t);
            var m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
            var p = [clipInput(k, array), clipInput(k + 1, array)];
            t -= k;
            var t2 = t * t;
            var t3 = t * t2;
            return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
        }

        public setProps(propsData: Object)
        {
            super.setProps(propsData);
        }
    }
}