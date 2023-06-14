/// <reference path="../../sb/pixi/display/Container.ts" />
namespace adservio
{

    export class ModalNotificationScreen extends sb.pixi.display.Container
    {

        private _parentContainer: sb.pixi.display.Container
        private _backgroundQuad: PIXI.Graphics;
        private _contentBG: PIXI.mesh.NineSlicePlane;
        private _contentText: PIXI.Text;
        private _isVisible: boolean = false;
        private _dismissCallback: () => void;
        private _dismissButton: ModalScreenButton;



        constructor(width: number, height: number, parentContainer: sb.pixi.display.Container, assets: sb.pixi.AssetsManager)
        {
            super(width, height);

            this._parentContainer = parentContainer;

            this._backgroundQuad = new PIXI.Graphics();
            this._backgroundQuad.beginFill(0x000000, 0.6);
            this._backgroundQuad.drawRect(0, 0, width, height);
            this._backgroundQuad.endFill();
            this._backgroundQuad.interactive = true;
            this.addChild(this._backgroundQuad);

            this._contentBG = new PIXI.mesh.NineSlicePlane(assets.getTexture('9slice_stats_module_bg'), 12, 12, 12, 12);
            this._contentBG.pivot.x = this._contentBG.width / 2;
            this._contentBG.pivot.y = this._contentBG.height / 2;
            this._contentBG.x = width / 2;
            this._contentBG.y = height / 2;

            this.addChild(this._contentBG);

            this._contentText = new PIXI.Text("");
            this._contentText.style.fontFamily = "Segoe UI";
            this._contentText.style.fontSize = 20;
            this._contentText.style.fill = 0x183244;
            this._contentText.style.align = "center";
            this._contentText.x = this.width / 2;
            this._contentText.y = this.height / 2;
            this._contentText.anchor.set(0.5, 0);
            this.addChild(this._contentText);

            //create dismiss button
            this._dismissButton = new ModalScreenButton(assets.getTexture("9slice_button1_bg"));
            this._dismissButton.interactive = true;
            this._dismissButton.buttonMode = true;
            this._dismissButton.on("pointerdown", () =>
            {
                this._dismissButton.alpha = 1;

                if (this._dismissCallback)
                    this._dismissCallback();

                this.dismiss();
            })

            this._dismissButton.on("pointerover", () =>
            {
                this._dismissButton.alpha = 0.7;
            })

            this._dismissButton.on("pointerout", () =>
            {
                this._dismissButton.alpha = 1;
            })

            this.addChild(this._dismissButton);
        }

        public dismiss = () =>
        {
            TweenMax.to(this, 0.5, {
                alpha: 0, onComplete: () =>
                {
                    this.parent.removeChild(this);
                }
            })
        }


        public notify = (message: string, dismissText?: string, dismissIconTexture?: PIXI.Texture, dismissCallback?: () => void) =>
        {
            this._dismissCallback = dismissCallback;

            if (dismissIconTexture)
                this._dismissButton.setIconTexture(dismissIconTexture);

            this._dismissButton.setLabel(dismissText);

            this._dismissCallback = dismissCallback;
            this._isVisible = true;
            //prepare for display animation
            this._contentText.text = message;
            this.alpha = 1;
            this._contentText.alpha = 0;
            this._contentText.y = (this.height / 2) - this._contentText.height - 5;
            this._backgroundQuad.alpha = 0;
            this._contentBG.alpha = 0;
            this._contentBG.width = 20;
            this._contentBG.height = 30;

            console.log("setting alpha 0")
            this._dismissButton.alpha = 0;
            this._dismissButton.x = Math.round((this.width - this._dismissButton.width) / 2);
            this._dismissButton.y = Math.round((this.height / 2 + 5));

            this._parentContainer.addChild(this);

            TweenMax.to(this._backgroundQuad, 1, {
                alpha: 0.3, onComplete: () =>
                {
                    TweenMax.to(this._contentBG, 0.6, { width: this._contentText.width + 50, alpha: 1, ease: Expo.easeOut, onUpdate: () => { this._contentBG.pivot.x = this._contentBG.width / 2 } });
                    TweenMax.to(this._contentBG, 0.6, { delay: 0.3, height: this._contentText.height + this._dismissButton.height + 50, ease: Expo.easeOut, onUpdate: () => { this._contentBG.pivot.y = this._contentBG.height / 2 } });
                    TweenMax.to(this._contentText, 0.3, { delay: 0.4, alpha: 1 });
                    TweenMax.to(this._dismissButton, 0.3, { delay: 0.4, alpha: 1 });

                }
            })
        }

        public hide = () =>
        {
            if (this._isVisible)
            {
                TweenMax.to(this, 0.5, { alpha: 0, onComplete: () => { this._parentContainer.removeChild(this) } });
                this._isVisible = false;;
            }
        }

        public get isVisible(): boolean
        {
            return this._isVisible;
        }

    }

    class ModalScreenButton extends sb.pixi.display.Container
    {
        private _bg: PIXI.mesh.NineSlicePlane;
        private _labelText: PIXI.Text;
        private _iconSprite: PIXI.Sprite;
        private _padding: number = 5;

        constructor(bgTexture: PIXI.Texture, height: number = 50)
        {
            super()
            this.height = height;

            this._bg = new PIXI.mesh.NineSlicePlane(bgTexture, 12, 12, 12, 12);
            this._bg.height = height;
            this.addChild(this._bg);

            this._iconSprite = new PIXI.Sprite();
            this._iconSprite.width = this._iconSprite.height = height - this._padding;
            this._iconSprite.x = this._padding;
            this._iconSprite.y = (this.height - this._iconSprite.height) / 2;
            this.addChild(this._iconSprite);


            this._labelText = new PIXI.Text("");
            this._labelText.style.fontFamily = "Segoe UI";
            this._labelText.style.fontSize = 18;
            this._labelText.style.fill = 0xD0E1EC;
            this._labelText.style.align = "center";

            this._labelText.x = Math.round(this._iconSprite.x + this._iconSprite.width + this._padding);
            this._labelText.y = Math.round((this.height - this._labelText.height) / 2);
            this.addChild(this._labelText);

            this.updateSize();
        }

        private updateSize = () =>
        {
            this.width = this._iconSprite.width + this._labelText.width + 3 * this._padding + 5;
            this._bg.width = this.width;
        }

        public setLabel = (value: string) =>
        {
            this._labelText.text = value;
            this.updateSize();
        }

        public setIconTexture = (texture: PIXI.Texture) =>
        {
            this._iconSprite.texture = texture;
        }
    }
}