
var taskmaster = require("role.taskmaster")
var spawner = require("building.spawner")
var debugUtil = require("util.debug")
var cliUtil = require("util.cli")
var roomManager = require("faction.roomManager")
var overlayMain = require("overlay.main")
var backup = require("setup")

handler = {
    get : function(target, prop, receiver)
    {
        //console.log("ding")
        return Reflect.get(...arguments)
    },
    set : function(target, prop, value) {
        console.log("property removed: ${prop}");
        return Reflect.set(...arguments)
    },
    
    deleteProperty : function(target, prop) {
        if (prop in target) {
            //delete target[prop];
            console.log("property removed: ${prop}");
            return Reflect.deleteProperty(...arguments)
            // expected output: "property removed: texture"
        }
    },
    
    defineProperty : function(target, key, descriptor) {
        console.log("property defined: ${prop}");
        return Reflect.set(...arguments)
    }
}

creepHandler = {
    construct : function(target, args) {
        console.log('Creep Hook works');
        // expected output: "monster1 constructor called"
    
        return new target(...args);
    },
    apply : function(target, thisArg, args) {
        console.log('Creep Hook works');
        // expected output: "monster1 constructor called"
    
        return target.apply(thisArg, ...args)
    },
    
    
    set : function(target, prop, value) {
        console.log("property removed: ${prop}");
        return Reflect.set(...arguments)
    },
    
    defineProperty : function(target, key, descriptor) {
        console.log("creep property defined: ${prop}");
        return Reflect.set(...arguments)
    }
}

Game.creeps = new Proxy(Game.creeps, handler)
Memory.creeps = new Proxy(Memory.creeps, handler)
Creep = new Proxy(Creep, creepHandler)

var setup = false;

module.exports.loop = function () {
    if (!setup)
    {
        //init code 
        cliUtil.setup()
        debugUtil.setup()
        taskmaster.setup()
        
        roomManager.setup()
        
        overlayMain.setup()
        setup = true
    }
    
    backup.upgrader()
    backup.builder()
    
    try 
    {
        spawner.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
    
    try 
    {
        taskmaster.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
    
    try 
    {
        overlayMain.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
    
    try 
    {
        roomManager.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
    
    try 
    {
        debugUtil.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
}