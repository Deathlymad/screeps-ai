var HookedCreep = function(obj)
{
    this.creep = obj
    this.name = this.creep.name
}
Object.defineProperty(HookedCreep.prototype, "pos", {
    get : function() {
        return this.creep.pos
    },
    set : function(val) {
        return this.creep.pos = val
    }
})
Object.defineProperty(HookedCreep.prototype, "room", {
    get : function() {
        return this.creep.room || {name : "undefined"}
    },
    set : function(val) {
        return this.creep.room = val
    }
})
Object.defineProperty(HookedCreep.prototype, "energy", {
    get : function() {
        return this.creep.energy || 0
    },
    set : function(val) {
        return this.creep.energy = val
    }
})

Object.defineProperty(HookedCreep.prototype, "memory", {
    get : function() {
        return this.creep.memory || Memory.creeps[this.name]
    },
    set : function(val) {
        this.creep.memory = val
    }
})

Object.defineProperty(HookedCreep.prototype, "body", {
    get : function() {
        return this.creep.body || {}
    },
    set : function(val) {
        this.creep.body = val
    }
})

Object.defineProperty(HookedCreep.prototype, "store", {
    get : function() {
        return this.creep.store || {}
    },
    set : function(val) {
        this.creep.store = val
    }
})

HookedCreep.prototype.constructor = HookedCreep;

HookedCreep.prototype.onConstruct = function () {
    console.log(Object.keys(this.creep))
}

HookedCreep.prototype.onDestroy = function () {
    this.creep = null
}

var names = Object.getOwnPropertyNames(Creep.prototype);
var name,i,desc;
for(i=0; i<names.length; i++) {
	name = names[i];
	desc = Object.getOwnPropertyDescriptor(Creep.prototype, name);
	if(desc.get !== undefined || desc.set !== undefined)
	    continue
	
	HookedCreep.prototype[name] = function(...args) { this.creep[name](...args) }
}
