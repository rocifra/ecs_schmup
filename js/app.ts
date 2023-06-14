﻿
class Greeter
{
    public engine: adservio.Engine;
   

    constructor()
    {

         //get app config json
        var requestURL = 'configs/engineConfig.json';
        var request = new XMLHttpRequest();

        request.open('GET', requestURL);
        request.responseType = 'json';
        request.onload = () =>
        {
            if (request.status != 404)
            {
                var engineConfig: IEngineConfig = request.response;

                this.initializeEngine(engineConfig);
            }
            else
                console.log("engineConfig load error. Not Found!");
        }
        request.send();

       
    }

    private initializeEngine = (engineConfig: IEngineConfig) =>
    {
        this.engine = new adservio.Engine(engineConfig, document.body);
        this.engine.canvas.id = "app_canvas";
        this.engine.registerScreen("MENU_SCREEN", new adservio.DefaultMenuScreen());
        this.engine.registerScreen("GAME_SCREEN", new app.AppGameScreen());
        this.engine.onAssetsLoadComplete.addOnce(() => { this.engine.switchToScreen("GAME_SCREEN") })

    }


}

window.onload = () =>
{
    var greeter = new Greeter();
};