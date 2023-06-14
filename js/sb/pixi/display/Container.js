var sb;
(function (sb) {
    var pixi;
    (function (pixi) {
        var display;
        (function (display) {
            class Container extends PIXI.Container {
                constructor(width = 0, height = 0) {
                    super();
                    //private _bounds: number = 0;
                    this._width = 0;
                    this._height = 0;
                    this._boundsGraphicsColor = 0xCC0000;
                    this._boundsGraphicsThickness = 1;
                    this.updateBounds = () => {
                        if (this._boundsGraphics) {
                            //clear
                            this._boundsGraphics.clear();
                            // set the line style to have a width of 5 and set the color to red
                            this._boundsGraphics.lineStyle(this._boundsGraphicsThickness, this._boundsGraphicsColor);
                            // draw a rectangle
                            this._boundsGraphics.drawRect(0, 0, this._width, this._height);
                        }
                    };
                    this.showBounds = (color = 0xCC0000, thickness = 1) => {
                        this._boundsGraphicsThickness = thickness;
                        this._boundsGraphicsColor = color;
                        if (!this._boundsGraphics) {
                            this._boundsGraphics = new PIXI.Graphics();
                            this.addChild(this._boundsGraphics);
                            this.updateBounds();
                        }
                    };
                    this._width = width;
                    this._height = height;
                }
                //so we can override getters and setters
                setHeight(value) {
                    this._height = value;
                    this.updateBounds();
                }
                setWidth(value) {
                    this._width = value;
                    this.updateBounds();
                }
                set height(value) { this.setHeight(value); }
                get height() { return this._height; }
                set width(value) { this.setWidth(value); }
                get width() { return this._width; }
            }
            display.Container = Container;
        })(display = pixi.display || (pixi.display = {}));
    })(pixi = sb.pixi || (sb.pixi = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Container.js.map