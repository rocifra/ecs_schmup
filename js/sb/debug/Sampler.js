var sb;
(function (sb) {
    var debug;
    (function (debug) {
        class Sampler {
            constructor() {
                this._samplers = {};
                this._isUpdating = false;
                this.updateSamplers = () => {
                    if (this._isUpdating) {
                        for (let key in this._samplers) {
                            let sampleProcess = this._samplers[key];
                            sampleProcess.update();
                        }
                        window.requestAnimationFrame(this.updateSamplers);
                    }
                };
                this._view = new SamplerView();
            }
            registerSampler(samplerID, description, object, objectKey, sampleAveragingCount = 1, dataPollingInterval = 1, decimalPrecision = 2, denominator = 1) {
                if (!(samplerID in this._samplers)) {
                    var sampler = new SampleProcess(description, object, objectKey, sampleAveragingCount, dataPollingInterval, decimalPrecision, denominator);
                    this._samplers[samplerID] = sampler;
                    //add to view
                    this._view.domElement.appendChild(sampler.viewField.domElement);
                    if (!this._isUpdating) {
                        this._isUpdating = true;
                        this.updateSamplers();
                    }
                }
            }
            get domElement() { return this._view.domElement; }
        }
        debug.Sampler = Sampler;
        class SamplerView {
            constructor() {
                this.domElement = document.createElement('div');
                //set css
                this.domElement.style.position = "fixed";
                this.domElement.style.width = "200px";
                //element.style.height = "30px";
                this.domElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                this.domElement.style.zIndex = "100";
                this.domElement.style.cursor = "pointer";
                this.domElement.style.padding = "10px";
                this.domElement.style.fontFamily = "Segoe UI";
            }
        }
        class SampleProcess {
            constructor(description, object, objectKey, sampleAveragingCount = 1, dataPollingInterval = 1, decimalPrecision = 10, denominator = 1) {
                this._sampleDataPool = [];
                this._denominator = 1;
                this._decimalPrecision = 10;
                //helpers
                this._pollingIntervalCounter = 0;
                this._sampleCounter = 0;
                this._sampleResult = 0;
                this.update = () => {
                    this._pollingIntervalCounter++;
                    //then we should pull new data
                    if (this._pollingIntervalCounter == this._pollingInterval) {
                        //reset counter
                        this._pollingIntervalCounter = 0;
                        //test if we need to average data
                        if (this._sampleAveragingCount > 1) {
                            this._sampleCounter++;
                            this._sampleDataPool.push(this._object[this._objectKey]);
                            if (this._sampleCounter == this._sampleAveragingCount) {
                                this._sampleResult = 0;
                                for (var i = 0; i < this._sampleDataPool.length; i++)
                                    this._sampleResult += this._sampleDataPool[i];
                                this._sampleResult = this._sampleResult / this._sampleDataPool.length;
                                //reset
                                this._sampleCounter = 0;
                                this._sampleDataPool.length = 0;
                            }
                        }
                        else {
                            this._sampleResult = this._object[this._objectKey];
                        }
                        //update field view
                        this.viewField.sampleResultField.textContent = (this._sampleResult / this._denominator).toFixed(this._decimalPrecision);
                    }
                };
                this._sampleAveragingCount = sampleAveragingCount;
                this._pollingInterval = dataPollingInterval;
                this._decimalPrecision = decimalPrecision;
                this._denominator = denominator;
                this._object = object;
                this._objectKey = objectKey;
                this.viewField = new SampleProcessViewField();
                this.viewField.descriptionField.textContent = description;
            }
        }
        class SampleProcessViewField {
            constructor() {
                this.domElement = document.createElement('div');
                this.descriptionField = document.createElement('div');
                this.sampleResultField = document.createElement('div');
                this.domElement.style.width = "100%";
                this.domElement.style.height = "30px";
                this.domElement.style.color = "#8BC34A";
                this.domElement.style.lineHeight = "30px";
                this.domElement.style.fontSize = "12px";
                this.domElement.style.display = "flex";
                this.domElement.style.alignItems = "center";
                this.descriptionField.style.height = "100%";
                this.sampleResultField.style.height = "100%";
                this.sampleResultField.style.flexGrow = "1";
                this.sampleResultField.style.textAlign = "right";
                this.domElement.appendChild(this.descriptionField);
                this.domElement.appendChild(this.sampleResultField);
            }
        }
    })(debug = sb.debug || (sb.debug = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Sampler.js.map