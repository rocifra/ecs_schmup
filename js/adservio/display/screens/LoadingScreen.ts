
namespace adservio
{
    export class LoadingScreen extends adservio.Screen
    {
        public onProgress: sb.signals.Signal1 = new sb.signals.Signal1();

        //animation data
        private _progressBarBeforeWidth: number;
        private _progressBarAfterWidth: number;

        private _loadingTextfieldBeforeAlpha: number;
        private _loadingTextfieldAfterAlpha: number;


        //strings data
        private _gameStrings: IGameStrings;

        //loader reference
        private _runtimeAssets: sb.pixi.AssetsManager;

        //display components
        private _loadingText: PIXI.Text;
        private _progressBar: adservio.ProgressBar;

        //signal bindings (signals used by pixi)
        //private _progressSignalBinding: PIXI.MiniSignalBinding;

        //timeline animations
        //private _animationTimeline: TimelineMax;

        constructor()
        {
            super();

            this.onInitialized.addOnce(this.init);
            this.onActivated.add(this.screenActivated_handler);
            this.onDeactivated.add(this.screenDeactivated_handler);
        }

        private init = () =>
        {
            //store refs
            this._gameStrings = this.engine.engineConfig.gameStrings;
            this._runtimeAssets = this.engine.preloaderAssets;

            this._progressBarBeforeWidth = 50;
            this._progressBarAfterWidth = this.width * .7;

            this._loadingText = new PIXI.Text(this._gameStrings["LOADING_TEXT_STRING"]);
            this._loadingText.style.fill = 0xFFFFFF;
            this._loadingText.style.fontSize = 14;
            
            this._loadingText.x = (this.width - this._loadingText.width) * 0.5;            

            this.addChild(this._loadingText);

            //create progress bar
            this._progressBar = new adservio.ProgressBar(this._runtimeAssets.getTexture("progress_bar_bg"), this._runtimeAssets.getTexture("progress_bar_fill"));
            this._progressBar.y = this.height * 0.5;
            this._progressBar.x = (this.width - this._progressBarAfterWidth) / 2;
            this.addChild(this._progressBar);
        }

        private screenActivated_handler = () =>
        {
            this.engine.assets.onProgressChanged.add(this.updateProgress);
        }

        private screenDeactivated_handler = () =>
        {
            this.engine.assets.onProgressChanged.remove(this.updateProgress);
        }

        private updateProgress = (ratio: number) =>
        {

            this._progressBar.progress = ratio ;
        }

        public animateIn(callback?: Function)
        {
            //prep animation
            this._loadingText.alpha = 0;
            this._loadingText.y = this.height / 2 + 60;

            TweenMax.to(this._loadingText, 0.8, { y: this._loadingText.y - 40, alpha: 0.7, ease: Expo.easeOut });
            TweenMax.to(this._progressBar, 0.8, { width: this._progressBarAfterWidth, delay: 0.2, ease: Expo.easeOut, onComplete: callback });
        }

        public animateOut(callback?: Function)
        {
            TweenMax.to(this, 1, { y: -this.height / 2, alpha: 0, ease: Expo.easeInOut, onComplete: callback })
        }

        

    }

}