var adservio;
(function (adservio) {
    class ProgressBar extends sb.pixi.display.Container {
        constructor(backgroundTexture, fillTexture) {
            super();
            this._fillPadding = 4;
            this._progress = 0;
            this.renderFill = () => {
                var targetFillWidth = (this.width - 2 * this._fillPadding) * this._progress;
                if (targetFillWidth < this._fill.texture.width)
                    this._fill.width = this._fill.texture.width;
                else
                    this._fill.width = targetFillWidth;
            };
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
        //overrides
        setHeight(value) {
            super.setHeight(value);
            this._bg.height = value;
            this._fill.height = value - 2 * this._fillPadding;
        }
        setWidth(value) {
            super.setWidth(value);
            this._bg.width = value;
            this.renderFill();
        }
        set progress(value) {
            this._progress = value;
            this.renderFill();
        }
    }
    adservio.ProgressBar = ProgressBar;
})(adservio || (adservio = {}));
//# sourceMappingURL=ProgressBar.js.map