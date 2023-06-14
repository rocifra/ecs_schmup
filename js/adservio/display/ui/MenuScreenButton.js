var adservio;
(function (adservio) {
    class MenuScreenButton extends sb.pixi.display.Container {
        constructor(iconTexture, buttonLabel, width, height, iconSize = 60, relativeHorizontalCenter = 0.5) {
            super();
            this._centerOffset = 60;
            this.animateIn = (delay = 0, duration = 0.7) => {
                this._labelTextContainer.x = this.width * this._relativeHorizontalCenter - 50;
                this._iconSprite.x = this.width * this._relativeHorizontalCenter - this._iconSprite.width - this._centerOffset;
                var iconTargetX = this._iconSprite.x;
                var labelTextContainerTargetX = this._labelTextContainer.x;
                this._labelTextContainer.x += 100;
                this._labelTextContainer.alpha = 0;
                this._iconSprite.x -= 100;
                this._iconSprite.alpha = 0;
                TweenMax.to(this._iconSprite, duration, { alpha: 1, x: iconTargetX, delay: delay, ease: Expo.easeOut });
                TweenMax.to(this._labelTextContainer, duration, { alpha: 0.7, x: labelTextContainerTargetX, delay: delay, ease: Expo.easeOut });
            };
            this.animateOut = (delay = 0, duration = 0.4) => {
                TweenMax.to(this._iconSprite, duration, { alpha: 0, x: this._iconSprite.x - 100, delay: delay, ease: Expo.easeIn });
                TweenMax.to(this._labelTextContainer, duration, { alpha: 0, x: this._labelTextContainer.x + 100, delay: delay, ease: Expo.easeIn });
            };
            this._relativeHorizontalCenter = relativeHorizontalCenter;
            this.width = width;
            this.height = height;
            this.interactive = true;
            this.buttonMode = true;
            this._iconSprite = new PIXI.Sprite(iconTexture);
            this._iconSprite.width = this._iconSprite.height = iconSize;
            this._iconSprite.y = (this.height - this._iconSprite.height) / 2;
            this.addChild(this._iconSprite);
            this._labelTextContainer = new sb.pixi.display.Container();
            this._labelTextContainer.width = this.width / 2;
            this._labelTextContainer.height = this.height;
            //this._labelTextContainer.showBounds();
            this.addChild(this._labelTextContainer);
            this._labelText = new PIXI.Text(buttonLabel);
            this._labelText.style.fontFamily = 'Segoe UI';
            this._labelText.style.fontSize = 22;
            this._labelText.style.fill = 0xffffff;
            this._labelText.y = (this.height - this._labelText.height) / 2;
            this._labelTextContainer.addChild(this._labelText);
        }
        set label(value) {
            this._labelText.text = value;
        }
        set iconTexture(texture) {
            this._iconSprite.texture = texture;
        }
    }
    adservio.MenuScreenButton = MenuScreenButton;
})(adservio || (adservio = {}));
//# sourceMappingURL=MenuScreenButton.js.map