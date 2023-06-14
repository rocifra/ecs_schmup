namespace sb.pixi.display
{

    export class Container extends PIXI.Container
    {

        //private _bounds: number = 0;
        private _width: number = 0;
        private _height: number = 0;

        private _boundsGraphics: PIXI.Graphics;
        private _boundsGraphicsColor: number = 0xCC0000;
        private _boundsGraphicsThickness: number = 1;

        constructor(width: number = 0, height: number = 0)
        {
            super();

            this._width = width;
            this._height = height;
        }

        private updateBounds = () =>
        {
            if (this._boundsGraphics)
            {
                //clear
                this._boundsGraphics.clear();

                // set the line style to have a width of 5 and set the color to red
                this._boundsGraphics.lineStyle(this._boundsGraphicsThickness, this._boundsGraphicsColor);

                // draw a rectangle
                this._boundsGraphics.drawRect(0, 0, this._width, this._height);
            }
        }

        //so we can override getters and setters
        protected setHeight(value: number)
        {
            this._height = value;
            this.updateBounds();
        }

        protected setWidth(value: number)
        {
            this._width = value;
            this.updateBounds();
        }

        public showBounds = (color: number = 0xCC0000, thickness: number = 1) =>
        {
            this._boundsGraphicsThickness = thickness;
            this._boundsGraphicsColor = color;

            if (!this._boundsGraphics)
            {
                this._boundsGraphics = new PIXI.Graphics();

                this.addChild(this._boundsGraphics);

                this.updateBounds();
            }
        }

        public set height(value: number) { this.setHeight(value) }
        public get height(): number { return this._height }
        public set width(value: number) { this.setWidth(value) }
        public get width(): number { return this._width }
    }
}