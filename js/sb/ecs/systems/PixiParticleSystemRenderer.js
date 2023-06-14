var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var systems;
        (function (systems) {
            class PixiParticleSystemRenderer extends sb.ecs.System {
                constructor(params) {
                    super(true);
                    this._psArray = [];
                    this._configA = {
                        "alpha": {
                            "start": 1,
                            "end": 0
                        },
                        "scale": {
                            "start": 0.2,
                            "end": 0.3,
                            "minimumScaleMultiplier": 1
                        },
                        "color": {
                            "start": "#e4f9ff",
                            "end": "#3fcbff"
                        },
                        "speed": {
                            "start": 4,
                            "end": 1,
                            "minimumSpeedMultiplier": 1
                        },
                        "acceleration": {
                            "x": 0,
                            "y": 0
                        },
                        "maxSpeed": 0,
                        "startRotation": {
                            "min": 0,
                            "max": 360
                        },
                        "noRotation": true,
                        "rotationSpeed": {
                            "min": 0,
                            "max": 0
                        },
                        "lifetime": {
                            "min": 0.2,
                            "max": 0.3
                        },
                        "blendMode": "add",
                        "frequency": 0.008,
                        "emitterLifetime": -1,
                        "maxParticles": 600,
                        "pos": {
                            "x": 1,
                            "y": 1
                        },
                        "addAtBack": false,
                        "spawnType": "point",
                    };
                    this._configB = {
                        "alpha": {
                            "start": 1,
                            "end": 0.17
                        },
                        "scale": {
                            "start": 0.2,
                            "end": 1,
                            "minimumScaleMultiplier": 1
                        },
                        "color": {
                            "start": "#ebd5c3",
                            "end": "#e07512"
                        },
                        "speed": {
                            "start": 300,
                            "end": 100,
                            "minimumSpeedMultiplier": 1
                        },
                        "acceleration": {
                            "x": 0,
                            "y": 0
                        },
                        "maxSpeed": 0,
                        "startRotation": {
                            "min": 0,
                            "max": 360
                        },
                        "noRotation": false,
                        "rotationSpeed": {
                            "min": 0,
                            "max": 0
                        },
                        "lifetime": {
                            "min": 0.2,
                            "max": 0.3
                        },
                        "blendMode": "screen",
                        "frequency": 0.002,
                        "emitterLifetime": 0.2,
                        "maxParticles": 200,
                        "pos": {
                            "x": 1,
                            "y": 1
                        },
                        "addAtBack": false,
                        "spawnType": "circle",
                        "spawnCircle": {
                            "x": 0,
                            "y": 0,
                            "r": 4
                        }
                    };
                    this.psCreator = () => {
                        let emitter = new PIXI.particles.Emitter(this._psContainer, null, null);
                        return emitter;
                    };
                    this.particleSystemComponentAdded_handler = (component) => {
                        //console.log("adding particle system")
                        //throw new Error("Method not implemented.");
                        let emitter = this._psPool.getInstanceFromPool();
                        if (component.configuration == "a")
                            emitter.init([this.particleTex], this._configA);
                        else
                            emitter.init([this.particleTex], this._configB);
                        component.emitter = emitter;
                        this._psArray.push(component);
                    };
                    this.particleSystemComponentRemoved_handler = (component) => {
                        component.emitter.cleanup();
                        //remove @ index
                        let index = this._psArray.indexOf(component);
                        this._psArray[index] = this._psArray[this._psArray.length - 1];
                        this._psArray.length--;
                        //return emitter to pool
                        this._psPool.returnInstanceToPool(component.emitter);
                        component.emitter = null;
                        //throw new Error("Method not implemented.");
                    };
                    this._psContainer = params.container;
                    this.particleTex = params.texture;
                    this._psPool = new sb.data.ObjectPool(this.psCreator, 10, true, 1, "Particle Emitter");
                }
                activated() {
                    //register to filter signals
                    this.entityManager.signals.getComponentTypeSignalsByStringID("ParticleSystem").added.add(this.particleSystemComponentAdded_handler);
                    this.entityManager.signals.getComponentTypeSignalsByStringID("ParticleSystem").removed.add(this.particleSystemComponentRemoved_handler);
                }
                update(deltaMS, deltaSC) {
                    for (let i = 0; i < this._psArray.length; i++) {
                        let component = this._psArray[i];
                        let emitter = component.emitter;
                        emitter.spawnPos.set(component.transform.x, component.transform.y);
                        emitter.update(deltaMS * 0.001);
                    }
                }
                get numTotalParticles() {
                    let count = 0;
                    for (let i = 0; i < this._psArray.length; i++)
                        count += this._psArray[i].emitter.particleCount;
                    return count;
                }
            }
            systems.PixiParticleSystemRenderer = PixiParticleSystemRenderer;
        })(systems = ecs.systems || (ecs.systems = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=PixiParticleSystemRenderer.js.map