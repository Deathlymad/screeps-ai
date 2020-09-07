creepHandler = require("role.creep")
scheduler = require("system.schedule")
module.exports = {
    /** @param {Creep} creep **/
    update: function() {
        var data = ["backup", "backup_builder", "Harvester", "Builder", "Upgrader", "Miner"]
        
        for (name in Game.creeps) {
            for( var i = 0; i < data.length; i++) {
                if ( data[i] === name) { data.splice(i, 1); }
            }
        }
        
        if (Game.rooms["W8N4"].controller.ticksToDowngrade < 19000) //contingency mode
        {
            if (!("backup" in data)) {
                Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "backup", {memory : {}})
                scheduler.registerOffsetCall( creepHandler.onSpawn.bind(null, "backup"), "onSpawn_backup_Hive", 12)
            }
            if (!("backup_builder" in data)) {
                Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "backup_builder", {memory : {}})
                scheduler.registerOffsetCall( creepHandler.onSpawn.bind(null, "backup_builder"), "onSpawn_backup_builder_Hive", 12)
            }
        }
        
        
        if (!("Miner" in data)) {
            Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Miner", {memory : {}})
            scheduler.registerOffsetCall( creepHandler.onSpawn.bind(null, "Miner"), "onSpawn_Miner_Hive", 12)
        }
        if (!("Upgrader" in data)) {
            Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Upgrader", {memory : {}})
            scheduler.registerOffsetCall( creepHandler.onSpawn.bind(null, "Upgrader"), "onSpawn_Upgrader_Hive", 12)
        }
        if (!("Builder" in data)) {
            Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Builder", {memory : {}})
            scheduler.registerOffsetCall( creepHandler.onSpawn.bind(null, "Builder"), "onSpawn_Builder_Hive", 12)
        }
        if (!("Harvester" in data)) {
            Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Harvester", {memory : {}})
            scheduler.registerOffsetCall( creepHandler.onSpawn.bind(null, "Harvester"), "onSpawn_Harvester_Hive", 12)
        }
    }
};