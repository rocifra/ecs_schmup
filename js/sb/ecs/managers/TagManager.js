var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var managers;
        (function (managers) {
            class TagManager {
                constructor() {
                    this._numericTagsMap = new Map();
                    //tag filters trebuie pregenerat (num tags)
                    this._tagFilters = [];
                    this._tagCounter = 0;
                    this._tagFilterSlotPool = new sb.data.ObjectPool(this.tagFilterSlotCreator, 1, true, 1, "TagFilterSlot");
                    this.setTagDataObjectPoolSize = (size) => {
                        if (size > this._tagFilterSlotPool.size)
                            this._tagFilterSlotPool.expandPool(size - this._tagFilterSlotPool.size);
                    };
                }
                tagFilterSlotCreator() {
                    return { tagManagerIndex: -1, numericTag: -1, entity: null };
                }
                registerStringTag(stringTag) {
                    //check against a map
                    if (!this._numericTagsMap.has(stringTag)) {
                        //generate new numeric tag if not found in map
                        this._numericTagsMap.set(stringTag, this._tagCounter);
                        //inc counter
                        this._tagCounter++;
                        //add new slot to tagFilters
                        this._tagFilters.push(new Array());
                    }
                    else
                        Logger.warn(`Entity tag [${stringTag}] already registered!`);
                }
                getFreeTagFilterSlot() { return this._tagFilterSlotPool.getInstanceFromPool(); }
                returnTagFilterSlot(tagFilterSlot) {
                    tagFilterSlot.numericTag = -1;
                    tagFilterSlot.tagManagerIndex = -1;
                    tagFilterSlot.entity = null;
                    this._tagFilterSlotPool.returnInstanceToPool(tagFilterSlot);
                }
                getNumericTag(stringTag, autoRegister = false) {
                    //check against a map
                    if (this._numericTagsMap.has(stringTag))
                        return this._numericTagsMap.get(stringTag);
                    else if (autoRegister) {
                        this.registerStringTag(stringTag);
                        return this._numericTagsMap.get(stringTag);
                    }
                    else {
                        Logger.warn(`Entity tag [${stringTag}] not registered!`);
                    }
                }
                filter(entity) {
                    //check if tags
                    if (entity.tags.length > 0) {
                        for (let i = 0; i < entity.tags.length; i++) {
                            let tagFilterSlot = entity.tags[i];
                            if (this._tagFilters[tagFilterSlot.numericTag])
                                this._tagFilters[tagFilterSlot.numericTag].push(tagFilterSlot);
                            //update tagData with index
                            tagFilterSlot.tagManagerIndex = this._tagFilters[tagFilterSlot.numericTag].length - 1;
                        }
                    }
                }
                unfilter(entity) {
                    //check if tags
                    if (entity.tags.length > 0) {
                        for (let i = 0; i < entity.tags.length; i++) {
                            let filterSlot = entity.tags[i];
                            let filteredSlots = this._tagFilters[filterSlot.numericTag];
                            //remove entity from filter
                            let lastSlot = filteredSlots[filteredSlots.length - 1];
                            filteredSlots[filterSlot.tagManagerIndex] = lastSlot;
                            lastSlot.tagManagerIndex = filterSlot.tagManagerIndex;
                            filterSlot.tagManagerIndex = -1;
                            filteredSlots.length--;
                        }
                    }
                }
                getFilteredEntitySlots(numericTag) {
                    if (this._tagFilters.length > numericTag)
                        return this._tagFilters[numericTag];
                    else
                        Logger.warn(`Tag is not registered! ${numericTag}`);
                }
            }
            managers.TagManager = TagManager;
        })(managers = ecs.managers || (ecs.managers = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=TagManager.js.map