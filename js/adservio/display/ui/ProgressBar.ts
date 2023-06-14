namespace adservio
{
    export class ProgressBar extends sb.pixi.display.Container
    {
        private _bg: PIXI.mesh.NineSlicePlane;
        private _fill: PIXI.mesh.NineSlicePlane;
        private _fillPadding: number = 4;
       
        private _progress: number = 0;

        constructor(backgroundTexture: PIXI.Texture, fillTexture: PIXI.Texture)
        {
            super();

            this._bg = new PIXI.mesh.NineSlicePlane(backgroundTexture, 8, 8, 8, 8);

            this._fill = new PIXI.mesh.NineSlicePlane(fillTexture, 4, 4, 4, 4);
            this._fill.x = this._fillPadding;
            this._fill.y = this._fillPadding;

            this.width = backgroundTexture.width;
            this.height = backgroundTexture.height;

           // this.render();

            this.addChild(this._bg);
            this.addChild(this._fill);
        }

        private renderFill = () =>
        {
            var targetFillWidth: number = (this.width - 2 * this._fillPadding) * this._progress;

            if (targetFillWidth < this._fill.texture.width)
                this._fill.width = this._fill.texture.width;
            else
                this._fill.width = targetFillWidth;
        }

        //overrides
        public setHeight(value: number)
        {
            super.setHeight(value);

            this._bg.height = value;
            this._fill.height = value - 2 * this._fillPadding;
        }

        public setWidth(value: number)
        {
            super.setWidth(value);
            this._bg.width = value;
            this.renderFill();            
        }

        public set progress(value: number)
        {
            this._progress = value;
            this.renderFill();
        }
       

    }
}