var task = require("role.taskmaster.task").TaskType

/*
 * add state migration to terminate upgrade action when storage is empty
 */

module.exports = {
    createTask : function(roomName)
    {
        return {id : task.UPGRADING, room : roomName}
    },
    verifyTask : function(obj)
    {
        return obj && obj.room
    },
    
    setup : function()
    {
        
    },
    
    update : function(creep)
    {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgradeState = true
        }
        else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.upgradeState = false
        }
        
        if(creep.memory.upgradeState) {
            var sourceGoal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter : function(obj){
                return obj.structureType == STRUCTURE_CONTAINER && obj.store[RESOURCE_ENERGY] > 100
            }})
            
            if (sourceGoal === null)
                module.exports.endTask(creep.name)
            if(creep.withdraw(sourceGoal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sourceGoal);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    },
    
    value : function(creep)
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
                    score += 100
                        break
                case MOVE :
                    score += 35
                        break
            }
        }
        
        return score / (creep.body.length + 1)
    },
    
    initCreep : function(data, creep)
    {
        creep.memory.task = task.UPGRADING
        creep.memory.room = data.room
    },
    
    endTask : function(creepName)
    {
        Memory.creeps[creepName].task = task.IDLE
        delete Memory.creeps[creepName].room
        delete Memory.creeps[creepName].upgradeState
    }
};