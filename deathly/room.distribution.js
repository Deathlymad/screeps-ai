var debugUtil = require("util.debug")
var excavation = require("room.excavation")
var taskmaster = require("role.taskmaster.interface")
var transport = require("role.transport")
/*
 * generate transport from mining spots to storage
 * generate transport from mining spots or storage to consumers
 * measure throughput for transfers over the last timeframe
 */


var storageRatio = 0.5
var consumerRatio = 0.8

function updateStructureData(room){
    Memory.rooms[room].structures = {}
    
    var structs = Game.rooms[room].find(FIND_MY_STRUCTURES, {filter : function(obj){
        if (obj.store === undefined)
            return false
        return true
    }})
    
    for (structure in structs)
    {
        Memory.rooms[room].structures[structs[structure].id] = {}
        Memory.rooms[room].structures[structs[structure].id].type = structs[structure].type
        Memory.rooms[room].structures[structs[structure].id].pos = structs[structure].pos
        Memory.rooms[room].structures[structs[structure].id].cap = structs[structure].store.getCapacity(RESOURCE_ENERGY)
        Memory.rooms[room].structures[structs[structure].id].filling = false
    }
}

module.exports = {
    setup : function(room)
    {
        debugUtil.registerDebug(updateStructureData.bind(null, room), "updateDistributionStructures", 100)
    },
    
    update : function(room)
    {
        var energySources = excavation.getActiveSpots(room)
        energySources = energySources.map(x => Game.rooms[room].lookForAt(LOOK_STRUCTURES, x.pos.x, x.pos.y)[0])
        if (Memory.rooms[room].storage)
        {
            if (Memory.rooms[room].storage.store[RESOURCE_ENERGY] > (Memory.rooms[room].structures[structs[structure].id].cap * storageRatio)) //storage can provide
            {
                for (structID in Memory.rooms[room].structures)
                {
                    obj = Game.getObjectById(structID)
                    delta = Memory.rooms[room].structures[structID].cap - obj.store[RESOURCE_ENERGY]
                    if (obj.store[RESOURCE_ENERGY] < (Memory.rooms[room].structures[structID].cap * consumerRatio))
                        taskmaster.addTask(transport.createTask(Memory.rooms[room].storage, Game.getObjectByID(structID), RESOURCE_ENERGY, delta))
                }
            }
            else //storage needs to be resupplied
            {
                maxEnergy = -1
                maxSpotID = -1
                
                for (structID in Memory.rooms[room].structures)
                {
                    obj = Game.getObjectById(structID)
                    delta = Memory.rooms[room].structures[structID].cap - obj.store[RESOURCE_ENERGY]
                    for (spot in energySources)
                    {
                        if (energySources[spot].store[RESOURCE_ENERGY] > maxEnergy)
                        {
                            maxSpotID = spot
                            maxEnergy = energySources[spot].store[RESOURCE_ENERGY]
                        }
                    }
                    if (maxSpotID == -1)
                        break
                    
                    newDelta = Math.min(delta, maxEnergy)
                    if (obj.store[RESOURCE_ENERGY] < (Memory.rooms[room].structures[structID].cap * consumerRatio) && !Memory.rooms[room].structures[structID].filling)
                    {
                        Memory.rooms[room].structures[structID].filling = true
                        taskmaster.addTask(transport.createTask(energySources[maxSpotID], obj, RESOURCE_ENERGY, newDelta))
                    }
                }
            }
        }
        else //storage needs to be resupplied
        {
            if (energySources.length == 0)
                return
            maxEnergy = -1
            maxSpotID = -1
            
            for (structID in Memory.rooms[room].structures)
            {
                obj = Game.getObjectById(structID)
                delta = Memory.rooms[room].structures[structID].cap - obj.store[RESOURCE_ENERGY]
                for (spot in energySources)
                {
                    if (energySources[spot].store[RESOURCE_ENERGY] > maxEnergy)
                    {
                        maxSpotID = spot
                        maxEnergy = energySources[spot].store[RESOURCE_ENERGY]
                    }
                }
                if (maxSpotID == -1)
                    break
                
                newDelta = Math.min(delta, maxEnergy)
                if (obj.store[RESOURCE_ENERGY] < (Memory.rooms[room].structures[structID].cap * consumerRatio) && !Memory.rooms[room].structures[structID].filling)
                {
                    Memory.rooms[room].structures[structID].filling = true
                    taskmaster.addTask(transport.createTask(energySources[maxSpotID], obj, RESOURCE_ENERGY, newDelta))
                }
            }
        }
    }
};