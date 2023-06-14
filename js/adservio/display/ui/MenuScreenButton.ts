namespace adservio
{
    export class MenuScreenButton extends sb.pixi.display.Container
    {

        private _iconSprite: PIXI.Sprite;

        private _labelTextContainer: sb.pixi.display.Container;
        private _labelText: PIXI.Text;

        private _relativeHorizontalCenter: number;
        private _centerOffset: number = 60;

        constructor(iconTexture: PIXI.Texture, buttonLabel: string, width: number, height: number, iconSize: number = 60, relativeHorizontalCenter: number = 0.5)
        {
            super();

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

        public animateIn = (delay: number = 0, duration: number = 0.7) =>
        {
            this._labelTextContainer.x = this.width * this._relativeHorizontalCenter - 50;
            this._iconSprite.x = this.width * this._relativeHorizontalCenter - this._iconSprite.width - this._centerOffset;

            var iconTargetX: number = this._iconSprite.x;
            var labelTextContainerTargetX: number = this._labelTextContainer.x;


            this._labelTextContainer.x += 100;
            this._labelTextContainer.alpha = 0;

            this._iconSprite.x -= 100;
            this._iconSprite.alpha = 0;

            TweenMax.to(this._iconSprite, duration, { alpha: 1, x: iconTargetX, delay: delay, ease: Expo.easeOut })
            TweenMax.to(this._labelTextContainer, duration, { alpha: 0.7, x: labelTextContainerTargetX, delay: delay, ease: Expo.easeOut })

        }

        public animateOut = (delay: number = 0, duration: number = 0.4) =>
        {
            TweenMax.to(this._iconSprite, duration, { alpha: 0, x: this._iconSprite.x - 100, delay: delay, ease: Expo.easeIn })
            TweenMax.to(this._labelTextContainer, duration, { alpha: 0, x: this._labelTextContainer.x + 100, delay: delay, ease: Expo.easeIn })
        }

        public set label(value: string)
        {
            this._labelText.text = value;
        }

        public set iconTexture(texture: PIXI.Texture)
        {
            this._iconSprite.texture = texture;
        }
    }
}