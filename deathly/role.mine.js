var excavation = require("room.excavation")
var task = require("role.taskmaster.task").TaskType
var interface = require("role.mine.interface")
var taskmaster = require("role.taskmaster.interface")

module.exports = {
    
    setup : function()
    {
        
    },
    
    initCreep : function(data, creep)
    {
        creep.memory.task = task.MINING
        creep.memory.spotID = excavation.aquireMiningSpot(data.room, data.spotID)
        creep.memory.spotLoc = excavation.getSpotLocation(data.room, creep.memory.spotID)
        creep.memory.sourceID = excavation.getSpotSource(data.room, creep.memory.spotID)
    },

    update : function(creep)
    {
        if (creep.memory.spotLoc.x != creep.pos.x || creep.memory.spotLoc.y != creep.pos.y || creep.memory.spotLoc.roomName != creep.pos.roomName)
        {
            creep.moveTo(new RoomPosition(creep.memory.spotLoc.x, creep.memory.spotLoc.y, creep.memory.spotLoc.roomName), {visualizePathStyle : {}})
        }
        else
            if ( 0 != (res = creep.harvest(Game.getObjectById(creep.memory.sourceID))))
            {
                console.log("Creep encountered Error " + String(res) + " while harvesting.")
                creep.memory.task = task.IDLE
                excavation.releaseMiningSpot(creep.room.name, creep.memory.spotID)
            }
            else if (creep.ticksToLive <= 1)
            {
                excavation.releaseMiningSpot(creep.room.name, creep.memory.spotID)
                taskmaster.addTask(interface.createTask(creep.room.name, excavation.reserveMiningSpot(creep.room.name)))
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
                    case ATTACK :
                        score -= 50
                    case RANGED_ATTACK :
                        score -= 50
                    case HEAL :
                        score -= 50
                    case CARRY :
                        score -= 10
                }
            }
            
            return score / creep.body.length
        }
    }
};