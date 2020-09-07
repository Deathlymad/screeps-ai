var cli = require("util.cli")


var budget = 100
var maxCarryover = 10

module.exports = {
    
    debug_calls : {},
    
    setup : function() {
        if (!Memory.debug)
            Memory.debug = {}
        if (!Memory.debug.debugList)
            Memory.debug.debugList = []
        if (!Memory.debug.debugQueue)
            Memory.debug.debugQueue = []
        if (!(Memory.debug.isActive instanceof Boolean))
            Memory.debug.isActive = true
            
        for (entry in Memory.debug.debugList)
        {
            if (!module.exports.verifyDebugEntry(entry))
               Memory.debug.debugList.splice(entry, 1)
        }
        for (entry in Memory.debug.debugQueue)
        {
            if (!(Memory.debug.debugQueue[entry] instanceof Function))
               Memory.debug.debugList.splice(entry, 1)
        }
        cli.addCall(module.exports.enableDebug, "enableDebug", "Enables Debug evaluations.")
        cli.addCall(module.exports.disableDebug, "disableDebug", "Disables Debug evaluations.")
    },
    
    getDebugState : function() {
        return Memory.debug.isActive
    },
    
    enableDebug : function()
    {
        Memory.debug.isActive = true
        return "Enabled Debug Evaluations"
    },
    disableDebug : function()
    {
        Memory.debug.isActive = false
        return "Disabled Debug Evaluations"
    },
    
    verifyDebugEntry : function(objName) {
        if (!(Memory.debug.debugList[objName].func instanceof Function))
            return false
        if (!(Memory.debug.debugList[objName].name instanceof String))
            return false
        if (!(Memory.debug.debugList[objName].cost instanceof Number))
            return false
        if (!(Memory.debug.debugList[objName].frequency instanceof Number))
            return false
        if (!(Memory.debug.debugList[objName].lastInvocation instanceof Number))
            return false
        
        if (Memory.debug.debugList[objName].func.length != 1)
            return false
        
        if (Memory.debug.debugList[objName].cost < 0 || Memory.debug.debugList[objName].cost > budget)
            return false
        if (Memory.debug.debugList[objName].frequency < 0)
            return false
        
        return true
    },
    
    invocationCost : function(name, ...args)
    {
        var start = Date.now()
        if (!module.exports.debug_calls[name] || !module.exports.debug_calls[name] instanceof Function)
        {
            console.log(name)
            console.log(module.exports.debug_calls[name])
            console.log(Object.keys(module.exports.debug_calls))
        }
        module.exports.debug_calls[name](...args)
        return Date.now() - start
    },
    
    registerDebug : function(func, n, freq)
    {
        //if (Memory.debug.debugList.find(obj => obj.name == n))
            //console.log("WARNING. Overwriting debug data in Memory.")
        
        module.exports.debug_calls[n] = func
        
        console.log("Added function " + n)
        
        var invocation_cost = module.exports.invocationCost(n, 0)
        obj = {name : n, frequency : freq, cost : invocation_cost, lastInvocation : Game.time}
        
        Memory.debug.debugList.push(obj)
    },
    
    update : function()
    {
        
        if (!Memory.debug.isActive)
            return;
        for (debugData in Memory.debug.debugList)
        {
            if (Game.time % Memory.debug.debugList[debugData].frequency == 0 || Memory.debug.debugList[debugData].frequency == 1)
            {
                Memory.debug.debugQueue.push(Memory.debug.debugList[debugData].name)
            }
        }
        var time = budget
        
        var queueSize = Memory.debug.debugQueue.length
        var maxTime = {time : 0, name : "ERROR"}
        
        while (time > 0 && Memory.debug.debugQueue.length > 0)
        {
            obj = Memory.debug.debugQueue.shift()
            tmpTime = module.exports.invocationCost(obj, Game.time - Memory.debug.debugList[debugData].lastInvocation)
            if (tmpTime > maxTime.time) {
                maxTime.time = tmpTime
                maxTime.name = obj.name
            }
            time -= tmpTime
        }
        if (queueSize - Memory.debug.debugQueue.length > maxCarryover)
        {
            console.log("WARNING: Debugger is having a noticable carryover. Debug budget needs to be increased or debug functions optimized.", 'background: #222; color: #ff0000')
            console.log("The Debug operation that used the most budget is ." + maxTime.name, 'background: #222; color: #ff0000')
        }
    }
};