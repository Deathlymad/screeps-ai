scheduler = require("system.schedule")
taskmaster = require("role.taskmaster")

module.exports = { //should be added to prototype
    setup : function()
    {
        for (creepName in Game.creeps)
            this.onSpawn(creepName)
    },
    
    onSpawn : function(creep)
    {
        if (!Game.creeps[creep])
        {
            console.log("Creep " + creep + " is supposed to have spawned but it can't be detected")
            return //maybe retry? this risks a massive task leak
        }
        
        //console.log(JSON.stringify(Memory.creeps[creep]))
        scheduler.registerOffsetCall( function(){ module.exports.onDeath(creep)}, "onDeath_" + creep + "_Hive", Game.creeps[creep].ticksToLive + 1)
        console.log("Creep " + creep + " was born. It will live " + Game.creeps[creep].ticksToLive)
    },
    
    onDeath : function(creep)
    {
        if (Game.creeps[creep] && !(Game.creeps[creep].ticksToLive === undefined))
        {
            console.log("Creep " + creep + " is supposed to have died but it seems he escaped death. for now. (" + Game.creeps[creep].ticksToLive + " ticks)")
            scheduler.registerOffsetCall( function(){module.exports.onDeath(creep)}, "onDeath_" + creep + "_Hive", Game.creeps[creep].ticksToLive + 1)
        }
        
        //console.log("Clearing up Creep " + creep)
        taskmaster.cleanupCreep(creep)
        
        delete Memory.creeps[creep]
        console.log("Creep " + creep + " died.")
    }
};