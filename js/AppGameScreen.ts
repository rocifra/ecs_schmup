

namespace app
{
    export class AppGameScreen extends adservio.GameScreenBase
    {

        public entityManager: sb.ecs.EntityManager;

        constructor()
        {
            super();

            this.onInitialized.addOnce(this.initializeOnce_handler);
            this.onGameStarted.add(this.gameStart_handler);
            this.onGameReset.add(this.gameReset_handler);
            this.onGamePaused.add(this.gamePaused_handler);
            this.onGameResumed.add(this.gameResumed_handler);

            this.entityManager = new sb.ecs.EntityManager();
        }

        private initializeOnce_handler = () =>
        {

        }

        private animateOutStarted_handler = () =>
        {

        }

        private animateInStarted_handler = () =>
        {

        }

        private onAnimateInCompleted_handler = () =>
        {


        }

        private gameStart_handler = () =>
        {
            Logger.log("Game Start");

            this.timeline.add(this.entityManager.update);

            let startTime: number = performance.now();

            let pixiGraphicsContainer = new sb.pixi.display.Container(this.width, this.height)
            this.addChild(pixiGraphicsContainer);

            let transformDebuggerGraphicsContainer = new sb.pixi.display.Container(this.width, this.height);
            this.addChild(transformDebuggerGraphicsContainer);

            let particleContainer = new sb.pixi.display.Container(this.width, this.height);
            this.addChild(particleContainer);

            //let pixiGraphicsSystem = new sb.ecs.systems.PixiGraphicsSystem(pixiGraphicsContainer);
            // let assetsManager = new sb.ecs.systems.AssetsManager(this.engine.assets);
            //  let transformDebugger = new sb.ecs.systems.TransformDebugger(transformDebuggerGraphicsContainer);

            //register generic signals


            //register systems
            this.entityManager.systemManager.registerSystemConstructor(sb.ecs.systems.PixiGraphicsSystem, { pixiGraphicsContainer: pixiGraphicsContainer });
            this.entityManager.systemManager.registerSystemConstructor(sb.ecs.systems.AssetsManagerSystem, { assets: this.engine.assets });
            this.entityManager.systemManager.registerSystemConstructor(sb.ecs.systems.TransformDebugger, { graphicsLayer: transformDebuggerGraphicsContainer });
            this.entityManager.systemManager.registerSystemConstructor(sb.ecs.systems.KeyboardInputSystem);
            this.entityManager.systemManager.registerSystemConstructor(sb.ecs.systems.PixiParticleSystemRenderer, {
                container: particleContainer, texture: this.engine.assets.getTexture("particle")
            });
            //this.entityManager.systemManager.registerSystemConstructor(sb.ecs.systems.FXPixiTrailsRenderingSystem, { container: particleContainer, renderer: this.engine.renderer });



            //create systems
            this.entityManager.systemManager.createSystem("PixiGraphicsSystem");
            this.entityManager.systemManager.createSystem("AssetsManagerSystem");
            this.entityManager.systemManager.createSystem("KeyboardInputSystem");
            this.entityManager.systemManager.createSystem("PixiParticleSystemRenderer");
            this.entityManager.systemManager.createSystem("FXPixiTrailsRenderingSystem");
            //this.entityManager.systemManager.createSystem("TransformDebugger");


            // register components
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.Debugger, 1);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.Transform, 10000);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.PixiSprite, 10000);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.VectorMotion, 10000);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.MisterBouncy, 10000);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.MaxAge, 10000);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.EntityEmitter, 10000);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.TransformInputController, 2);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.EntityEmitterInputController, 50);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.Children, 50);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.Target, 3000);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.AngularTargetTracking, 3000);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.ParticleSystem, 100);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.DeathSpawn, 100);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.RocketLaunchSequence, 100);
            this.entityManager.componentManager.registerComponentConstructor(sb.ecs.components.RopeTrail, 100);

            //set tags pool
            this.entityManager.tagManager.setTagDataObjectPoolSize(40000);

            //register entity tags
            this.entityManager.tagManager.registerStringTag("enemy_bullet");
            this.entityManager.tagManager.registerStringTag("bad_finger");

            //load blueprints
            //get app config json
            var requestURL = 'configs/ecsData.json';
            var request = new XMLHttpRequest();

            request.open('GET', requestURL);
            request.responseType = 'json';
            request.onload = () =>
            {
                if (request.status != 404)
                {
                    console.log(request)
                    var blueprints: IBlueprintSchema = request.response.blueprints;

                    this.initializeEngine(blueprints);
                }
                else
                    console.log("blueprints load error. Not Found!");
            }
            request.send();

        }

        private initializeEngine = (blueprints: IBlueprintSchema) =>
        {
            console.log("Blueprints loaded ", blueprints)

            //init engine
            this.entityManager.initialize(10000);
            this.entityManager.blueprintManager.parseBlueprintsFromJSON(blueprints);

            let keyboardInputSystem = <sb.ecs.systems.KeyboardInputSystem>this.entityManager.systemManager.getSystemInstance("KeyboardInputSystem");

            keyboardInputSystem.registerStateControlSignal("move-left", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.A);
            keyboardInputSystem.registerStateControlSignal("move-left", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.LEFT_ARROW);
            keyboardInputSystem.registerStateControlSignal("move-right", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.D);
            keyboardInputSystem.registerStateControlSignal("move-right", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.RIGHT_ARROW);
            keyboardInputSystem.registerStateControlSignal("move-up", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.UP_ARROW);
            keyboardInputSystem.registerStateControlSignal("move-up", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.W);
            keyboardInputSystem.registerStateControlSignal("move-down", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.S);
            keyboardInputSystem.registerStateControlSignal("move-down", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.DOWN_ARROW);
            keyboardInputSystem.registerStateControlSignal("player-fire", sb.ecs.systems.KeyboardInputSystem.KEYBOARD.SHIFT);



            /*
            document.addEventListener('keydown', (event: KeyboardEvent) =>
            {
                console.log("key press")
                if (event.keyCode == 37) 
                {
                    //left arrow pressed
                    this.entityManager.signals.getGenericSignalByName("move-left-action").dispatch();
                }
                else if (event.keyCode == 38)
                {
                    //up arrow was pressed
                }
                else if (event.keyCode == 39)
                {
                    //right arrow was pressed
                    this.entityManager.signals.getGenericSignalByName("move-right-action").dispatch();
                }
                else if (event.keyCode == 40)
                {
                    //down arrow was pressed
                }
            });
            */



            let hotRod = this.entityManager.createEntityFromBlueprint("HotRod");

            //let hotRod: sb.ecs.Entity = this.entityManager.getFreeEntity();//new sb.ecs.Entity(this.entityManager);
            //let sprite = <sb.ecs.components.PixiSprite>hotRod.getComponent("PixiSprite");
            //sprite.setProps({ textureID: "hot_rod" });
            let transform = <sb.ecs.components.Transform>hotRod.getComponent("Transform");
            transform.x = this.width / 2;
            transform.y = this.height / 2;
            //let missileLauncher =<ch>hotRod.getComponent("Children")
            //let keyboardPositionController = <sb.ecs.components.KeyboardPositionController>hotRod.getComponent("KeyboardPositionController");
            //keyboardPositionController.acceleration = 3;
            //keyboardPositionController.friction = 0.9;
            //let entityEmitter = <sb.ecs.components.EntityEmitter>hotRod.getComponent("EntityEmitter");
            //entityEmitter.interval = 16;
            //entityEmitter.yVariance = 10;
            // entityEmitter.rotationVariance = 0.5;
            // entityEmitter.numEntitiesEmittedPerTick = 2;


            this.entityManager.addEntity(hotRod);

            var fieldA = document.createElement('div');
            fieldA.style.position = 'absolute';
            fieldA.style.left = "50%";
            fieldA.style.top = "0px";
            fieldA.style.color = "white";
            fieldA.textContent = "blaaa";
            document.body.appendChild(fieldA);

            var currentTime = 0;

            var scope = this;
            this.engine.debugSampler.registerSampler("Entities time", "Entities time:", this.entityManager, "lastEntitiesProcessTime", 30, 1)
            this.engine.debugSampler.registerSampler("Systems time", "Systems time:", this.entityManager, "lastSystemsProcessTime", 30, 1)
            this.engine.debugSampler.registerSampler("Tags", `Tagged [ enemy_bullet ]:`, {
                get count()
                {
                    let numericTag = scope.entityManager.tagManager.getNumericTag("enemy_bullet");
                    return scope.entityManager.tagManager.getFilteredEntitySlots(numericTag).length
                }
            }, "count", 30, 1)
            this.engine.debugSampler.registerSampler("Particles", "Particles", this.entityManager.systemManager.getSystemInstance("PixiParticleSystemRenderer"), "numTotalParticles", 1, 10)


            //debug
            var field = document.createElement('div');
            field.style.position = 'absolute';
            field.style.left = "40%";
            field.style.top = "0px";
            field.style.color = "white";
            field.textContent = "blaaa";
            document.body.appendChild(field);

            this.timeline.add(() =>
            {
                field.textContent = String(this.entityManager.numLiveEntities) + "\n" + String(this.entityManager.removalQueueLength);
            })


            var timer: sb.time.TimelineTimer = new sb.time.TimelineTimer(this.timeline, 15);
            var clientX: number = 0;
            var clientY: number = 0;
            var counter: number = 0;

            var godFinger = this.entityManager.createEntityFromBlueprint("GodFinger");
            var godEmitter = <sb.ecs.components.EntityEmitter>godFinger.getComponent("EntityEmitter");
            var godTransform = <sb.ecs.components.Transform>godFinger.getComponent("Transform");
            godFinger.addStringTag("bad_finger");
            this.entityManager.addEntity(godFinger);

            timer.onTick.add(() =>
            {/*
                for (var i = 0; i < 60; i++)
                {
                    
                    let entity: sb.ecs.Entity = this.entityManager.getFreeEntity();
                    let sprite = <sb.ecs.components.PixiSprite>entity.getComponent("PixiSprite");
                    sprite.textureID = "bullet";
                    //let motion = <sb.ecs.components.VectorMotion>entity.getComponent("VectorMotion");
                    // motion.acceleration = 0;
                    // motion.friction = 1;
                    //  motion.speed = 20;
                    entity.getComponent("MisterBouncy")

                    let transform = <sb.ecs.components.Transform>entity.getComponent("Transform");
                    transform.x = clientX;
                    transform.y = clientY + (1 - Math.random()) * 20;

                    //let maxAge = <sb.ecs.components.MaxAge>entity.getComponent("MaxAge");
                    //maxAge.maxAge = 2000;
                    // let vectorMotion = <sb.ecs.components.VectorMotion>entity.getComponent("VectorMotion");
                    //vectorMotion.acceleration = 0.4;
                    //vectorMotion.friction = 0.998;
                  
                    let entity = this.entityManager.createEntityFromBlueprint("BBullet");

                    this.entityManager.addEntity(entity);
                     
                }
                 */
            })

            window.addEventListener("pointerdown", (event: MouseEvent) =>
            {
                //let entity = this.entityManager.createEntityFromBlueprint("BBullet");

                godTransform.x = event.clientX;
                godTransform.y = event.clientY;
                //godEmitter.paused = false;

                //this.entityManager.addEntity(entity);
                //timer.start();
            })
            window.addEventListener("pointerup", () =>
            {
                //godEmitter.paused = true;
                //timer.stop()
            })
            window.addEventListener("pointermove", (event: MouseEvent) =>
            {
                clientX = event.clientX;
                clientY = event.clientY;

                godTransform.x = event.clientX;
                godTransform.y = event.clientY;
            })
        }

        private gamePaused_handler = () =>
        {
            Logger.log("Game Pause");
        }

        private gameResumed_handler = () =>
        {
            Logger.log("Game Resume")
        }


        private gameReset_handler = () =>
        {
            Logger.log("GameScreen Reset");
        }


    }




}