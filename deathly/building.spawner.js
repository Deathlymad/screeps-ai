/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('building.spawner');
 * mod.thing == 'a thing'; // true
 */

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
            }
            if (!("backup_builder" in data)) {
                Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "backup_builder", {memory : {}})
            }
        }
        
        
        if (!("Miner" in data)) {
            Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Miner", {memory : {role:"miner"}})
        }
        if (!("Upgrader" in data)) {
            Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Upgrader", {memory : {role:"upgrader"}})
        }
        if (!("Builder" in data)) {
            Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Builder", {memory : {role:"builder"}})
        }
        if (!("Harvester" in data)) {
            Game.spawns["Hive"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Harvester", {memory : {role:"harvester"}})
        }
    }
};