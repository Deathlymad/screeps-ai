var excavation = require("room.excavation")
var TaskType = require("role.taskmaster.task").TaskType
var interface = require("role.mine.interface")
var taskmaster = require("role.taskmaster.interface")

module.exports = {
    
    setup : function()
    {
        
    },
    
    initCreep : function(data, creep)
    {
        creep.memory.task = TaskType.MINING
        creep.memory.room = data.room
        creep.memory.spotID = excavation.aquireMiningSpot(data.room, data.spotID)
        creep.memory.spotLoc = excavation.getSpotLocation(data.room, creep.memory.spotID)
        creep.memory.sourceID = excavation.getSpotSource(data.room, creep.memory.spotID)
    },

    update : function(creep)
    {
        if (creep.memory.spotLoc.x != creep.pos.x || creep.memory.spotLoc.y != creep.pos.y || creep.memory.spotLoc.roomName != creep.pos.roomName)
        {
            creep.moveTo(new RoomPosition(creep.memory.spotLoc.x, creep.memory.spotLoc.y, creep.memory.spotLoc.roomName))
        }
        else
            if ( OK != (res = creep.harvest(Game.getObjectById(creep.memory.sourceID))))
            {
                console.log("Creep encountered Error " + String(res) + " while harvesting.")
                module.exports.endTask(creep.name)
            }
    },
    
    value : function(creep)
    {
        if (creep.body.every((obj) => obj.type == WORK || obj.type == MOVE)) //this unit cannot carry, it is a dedicated miner
            return 100
        else
        {
            score = 0
            for (comp in creep.body)
            {
                component = creep.body[comp]
                switch(String(component.type))
                {
                    case WORK:
                        score += 100
                        break
                    case ATTACK :
                        score -= 50
                        break
                    case RANGED_ATTACK :
                        score -= 50
                        break
                    case HEAL :
                        score -= 50
                        break
                    case CARRY :
                        score -= 10
                        break
                }
            }
            
            return score / creep.body.length
        }
    },
    
    endTask : function(creepName)
    {
        excavation.releaseMiningSpot(Memory.creeps[creepName].room, Memory.creeps[creepName].spotID)
        Memory.creeps[creepName].task = TaskType.IDLE
        delete Memory.creeps[creepName].spotID
        delete Memory.creeps[creepName].spotLoc
        delete Memory.creeps[creepName].sourceID
        delete Memory.creeps[creepName].room
    }
};