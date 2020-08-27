/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('setup');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    upgrader : function()
    {
        if (!Game.creeps["backup"])
            return
        
        if(Game.creeps["backup"].store[RESOURCE_ENERGY] == Game.creeps["backup"].store.getCapacity(RESOURCE_ENERGY))
            Game.creeps["backup"].memory.state = true
        else if (Game.creeps["backup"].store[RESOURCE_ENERGY] == 0)
            Game.creeps["backup"].memory.state = false
        
        if(!Game.creeps["backup"].memory.state) {
            var sources = Game.creeps["backup"].pos.findClosestByPath(FIND_SOURCES);
            if(Game.creeps["backup"].harvest(sources) == ERR_NOT_IN_RANGE) {
                Game.creeps["backup"].moveTo(sources);
            }
        }
        else {
            if(Game.creeps["backup"].upgradeController(Game.creeps["backup"].room.controller) == ERR_NOT_IN_RANGE) {
                Game.creeps["backup"].moveTo(Game.creeps["backup"].room.controller);
            }
        }
    },
    
    
    builder : function()
    {
        if (!Game.creeps["backup_builder"])
            return
        
        if(Game.creeps["backup_builder"].store[RESOURCE_ENERGY] == Game.creeps["backup_builder"].store.getCapacity(RESOURCE_ENERGY))
            Game.creeps["backup_builder"].memory.state = true
        else if (Game.creeps["backup_builder"].store[RESOURCE_ENERGY] == 0)
            Game.creeps["backup_builder"].memory.state = false
        
        if(!Game.creeps["backup_builder"].memory.state) {
            var sources = Game.creeps["backup_builder"].pos.findClosestByPath(FIND_SOURCES);
            if(Game.creeps["backup_builder"].harvest(sources) == ERR_NOT_IN_RANGE) {
                Game.creeps["backup_builder"].moveTo(sources);
            }
        }
        else {
            var tgt = Game.creeps["backup_builder"].pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(Game.creeps["backup_builder"].build(tgt) == ERR_NOT_IN_RANGE) {
                Game.creeps["backup_builder"].moveTo(tgt);
            }
        }
    }
};