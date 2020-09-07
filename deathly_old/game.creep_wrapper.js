
Creep.prototype.onConstruct = function () {
    console.log("found new creep")
}

Creep.prototype.onDestroy = function () {
}

var Creeps = {
    lastList : [],
    creeps : {},
    
    hook : function(name, pre, post) {
        if (!Creep[name] instanceof Function)
            new Error("Tried to hook a non-function member of creep: " + name)
            
        Creep.prototype[name + "_pre"] = pre
        Creep.prototype["_" + name] = Creep.prototype[name]
        Creep.prototype[name + "_post"] = post
        
	    Creep.prototype[name] = function(...args) {
	        this[name + "_pre"](...arguments)
	        this["_" + name](...arguments)
	        this[name + "_post"](...arguments)
	    }
    },
    
    update : function() {
        currList = Object.keys(Game.creeps)
        diff = currList.filter((obj) => (obj in Creeps.lastList));
        r_diff = Creeps.lastList.filter((obj) => (obj in currList));
        
        Creeps.lastList = currList
        
        for (creepName of diff)
        {
            if (!Game.creeps[creepName])
            {
                Creeps.lastList.splice(Creeps.lastList.indexOf(creepName), 1)
                continue
            }
                
            Creeps.creeps[creepName] = Game.creeps[creepName]
            Creeps.creeps[creepName].onConstruct()
        }
        
        for (creepName of r_diff)
        {
            Creeps.creeps[creepName].onDestroy()
            delete Creeps.creeps[creepName]
        }
    }
}

module.exports = Creeps;