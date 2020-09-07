
module.exports = {

forEachFn : function(proto, cb) {
	var names = Object.getOwnPropertyNames(proto);
	var name,i,desc;
	for(i=0; i<names.length; i++) {
		name = names[i];
		desc = Object.getOwnPropertyDescriptor(proto, name);
		if(desc.get !== undefined || desc.set !== undefined)		
			continue;				
		cb(name,proto);
	}
},
getExistingSetter : function (obj, propName) {
        if (WatchJS.preserveExistingSetters) {
            var existing = Object.getOwnPropertyDescriptor(obj, propName);
            return existing.set;
        }

        return undefined;
    },

    defineGetAndSet : function (obj, propName, getter, setter) {
        try {
            var existingSetter = this.getExistingSetter(obj, propName);
            Object.defineProperty(obj, propName, {
                get: getter,
                set: function(value) {
                    setter.call(this, value, true); // coalesce changes
                    if (existingSetter) {
                        existingSetter(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
        }
        catch(e1) {
            try{
                Object.prototype.__defineGetter__.call(obj, propName, getter);
                Object.prototype.__defineSetter__.call(obj, propName, function(value) {
                    setter.call(this,value,true); // coalesce changes
                });
            }
            catch(e2) {
                observeDirtyChanges(obj,propName,setter);
                //throw new Error("watchJS error: browser not supported :/")
            }
        }

    }
};