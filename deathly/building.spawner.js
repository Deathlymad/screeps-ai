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
            if (data.includes("backup")) {
                if (Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "backup") === OK)
                    scheduler.registerOffsetCall( function(){creepHandler.onSpawn("backup")}, "onSpawn_backup_Hive", 12)
            }
        }
            if (data.includes("backup_builder")) {
                if (Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "backup_builder") === OK)
                    scheduler.registerOffsetCall( function(){creepHandler.onSpawn("backup_builder")}, "onSpawn_backup_builder_Hive", 12)
            }
        
        if (data.includes("Miner")) {
            if (Game.spawns["Hive"].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], "Miner") === OK)
                scheduler.registerOffsetCall( function(){creepHandler.onSpawn("Miner")}, "onSpawn_Miner_Hive", 15)
        }
        if (data.includes("Upgrader")) {
            if (Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Upgrader") === OK)
                scheduler.registerOffsetCall( function(){creepHandler.onSpawn("Upgrader")}, "onSpawn_Upgrader_Hive", 12)
        }
        if (data.includes("Builder")) {
            if (Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Builder") === OK)
                scheduler.registerOffsetCall( function(){creepHandler.onSpawn("Builder")}, "onSpawn_Builder_Hive", 12)
        }
        if (data.includes("Harvester")) {
            if (Game.spawns["Hive"].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], "Harvester") === OK)
                scheduler.registerOffsetCall( function(){creepHandler.onSpawn("Harvester")}, "onSpawn_Harvester_Hive", 15)
        }
    }
};