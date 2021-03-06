var TaskType = require("role.taskmaster.task").TaskType


module.exports = {
    createTask : function(site)
    {
        return {id : TaskType.REPAIRING, obj : site}
    },
    verifyTask : function(obj)
    {
        return obj && obj.obj
    },
    
    setup : function()
    {
    },
    
    update : function(creep)
    {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.state = true
        }
        else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.state = false
        }
        
        if(creep.memory.state) {
            var sourceGoal = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter : function(obj){
                return obj.structureType == STRUCTURE_CONTAINER && obj.store[RESOURCE_ENERGY]
            }})
            if(creep.withdraw(sourceGoal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sourceGoal);
            }
        }
        else {
            res = creep.repair(Game.getObjectById(creep.memory.site))
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.site));
            }
            
            if (Game.getObjectById(creep.memory.site).hits == Game.getObjectById(creep.memory.site).hitsMax)
            {
                module.exports.endTask(creep.name)
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
        
        return score / creep.body.length
    },
    
    initCreep : function(data, creep)
    {
        creep.memory.task = TaskType.REPAIRING
        creep.memory.site = data.obj
        creep.memory.state = true
    },
    
    endTask : function(creepName)
    {
        //needs to reschedule?
        Memory.creeps[creepName].task = TaskType.IDLE
        delete Memory.creeps[creepName].site
        delete Memory.creeps[creepName].state
    }
};
