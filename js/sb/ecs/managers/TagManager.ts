namespace sb.ecs.managers
{


    export class TagManager
    {

        private _numericTagsMap: Map<string, number> = new Map();

        //tag filters trebuie pregenerat (num tags)
        private _tagFilters: Array<Array<ITagFilterSlot>> = [];
        private _tagCounter: number = 0;

        private _tagFilterSlotPool: sb.data.ObjectPool = new sb.data.ObjectPool(this.tagFilterSlotCreator, 1, true, 1, "TagFilterSlot")


        constructor() { }

        private tagFilterSlotCreator(): ITagFilterSlot
        {
            return { tagManagerIndex: -1, numericTag: -1, entity: null };
        }

        public registerStringTag(stringTag: string)
        {
            //check against a map
            if (!this._numericTagsMap.has(stringTag))
            {
                //generate new numeric tag if not found in map
                this._numericTagsMap.set(stringTag, this._tagCounter);
                //inc counter
                this._tagCounter++;
                //add new slot to tagFilters
                this._tagFilters.push(new Array());
            }
            else
                Logger.warn(`Entity tag [${stringTag}] already registered!`)
        }

        public getFreeTagFilterSlot(): ITagFilterSlot { return this._tagFilterSlotPool.getInstanceFromPool() }
        public returnTagFilterSlot(tagFilterSlot: ITagFilterSlot)
        {
            tagFilterSlot.numericTag = -1;
            tagFilterSlot.tagManagerIndex = -1;
            tagFilterSlot.entity = null;
            this._tagFilterSlotPool.returnInstanceToPool(tagFilterSlot);
        }

        public getNumericTag(stringTag: string, autoRegister: boolean = false): number
        {
            //check against a map
            if (this._numericTagsMap.has(stringTag))
                return this._numericTagsMap.get(stringTag)
            else if (autoRegister)
            {
                this.registerStringTag(stringTag);
                return this._numericTagsMap.get(stringTag)
            }
            else
            {
                Logger.warn(`Entity tag [${stringTag}] not registered!`);
            }
        }

        public filter(entity: sb.ecs.Entity)
        {
            //check if tags
            if (entity.tags.length > 0)
            {
                for (let i = 0; i < entity.tags.length; i++)
                {
                    let tagFilterSlot = entity.tags[i];

                    if (this._tagFilters[tagFilterSlot.numericTag])
                        this._tagFilters[tagFilterSlot.numericTag].push(tagFilterSlot);

                    //update tagData with index
                    tagFilterSlot.tagManagerIndex = this._tagFilters[tagFilterSlot.numericTag].length - 1;
                }
            }
        }

        public unfilter(entity: sb.ecs.Entity)
        {
            //check if tags
            if (entity.tags.length > 0)
            {
                for (let i = 0; i < entity.tags.length; i++)
                {
                    let filterSlot = entity.tags[i];
                    let filteredSlots = this._tagFilters[filterSlot.numericTag];

                    //remove entity from filter
                    let lastSlot: ITagFilterSlot = filteredSlots[filteredSlots.length - 1];
                    filteredSlots[filterSlot.tagManagerIndex] = lastSlot;
                    lastSlot.tagManagerIndex = filterSlot.tagManagerIndex;
                    filterSlot.tagManagerIndex = -1;
                    filteredSlots.length--;
                }
            }
        }



        public getFilteredEntitySlots(numericTag: number): Array<ITagFilterSlot>
        {
            if (this._tagFilters.length > numericTag)
                return this._tagFilters[numericTag]
            else
                Logger.warn(`Tag is not registered! ${numericTag}`);
        }

        public setTagDataObjectPoolSize = (size: number) =>
        {
            if (size > this._tagFilterSlotPool.size)
                this._tagFilterSlotPool.expandPool(size - this._tagFilterSlotPool.size);
        }
    }
}