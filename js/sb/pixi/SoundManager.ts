namespace sb.pixi
{

    export class SoundManager
    {
        //signals
        public onMuteOptionChanged: sb.signals.Signal0 = new sb.signals.Signal0();

        private _soundAssetsManager: AssetsManager;
        private _isMuted: boolean = false;

        constructor(soundAssetsManager: AssetsManager)
        {
            this._soundAssetsManager = soundAssetsManager;

        }

        public play = (soundID: string, volume: number=1) =>
        {
            if (!this._isMuted)
            {
                let soundAsset: PIXI.sound.Sound = this._soundAssetsManager.getSound(soundID);

                soundAsset.volume = volume;
                soundAsset.play();
            }           
        }

        /*
        public getSound = (soundID: string): PIXI.sound.Sound =>
        {
            let soundAsset: PIXI.sound.Sound = this._soundAssetsManager.getSound(soundID)

            return soundAsset
        }
        */

        public set globalVolume(value: number)
        {
            PIXI.sound.volumeAll = value;
        }

        public get muted(): boolean { return this._isMuted }
        public set muted(value: boolean)
        {
            this._isMuted = value;
            //dispatch change signal
            this.onMuteOptionChanged.dispatch();
        }
    }
}