var taskmaster = require("role.taskmaster.interface")
var TaskType = require("role.taskmaster.task").TaskType

/*
 * This is the example task that can be copied for all other tasks
 */

module.exports = {
    createTask : function(src, tgt, type, amount)
    {
        return {id : TaskType.TRANSPORTING, resSource : src, resTarget : tgt, resType : type, resAmt : amount}
    },
    verifyTask : function(obj)
    {
        if (!obj)
            return false
        if (!obj.resSource)
            return false
        if (!obj.resTarget)
            return false
        if (!obj.resType)
            return false
        if (!obj.resAmt)
            return false
        
        return true
    },
    
    setup : function()
    {
        
    },
    
    update : function(creep)
    {
        if (creep.memory.transportAmount > 0)
        {
            if (creep.store.getFreeCapacity(creep.memory.transportType) != 0 && creep.store[creep.memory.transportType] != creep.memory.transportAmount)
            {
                transportAmt = Math.min(creep.memory.transportAmount, creep.store.getFreeCapacity(creep.memory.transportType))
                
                src = Game.getObjectById(creep.memory.src.id)
                res = creep.withdraw(src, creep.memory.transportType, transportAmt)
                
                if (res == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(src)
                }
                else if (res == ERR_INVALID_ARGS)
                {
                    module.exports.endTask(creep.name)
                }
            }
            else
            {
                transportAmt = creep.store[creep.memory.transportType]
                
                tgt = Game.getObjectById(creep.memory.tgt.id)
                res = creep.transfer(tgt, creep.memory.transportType)
                
                if (res == ERR_NOT_IN_RANGE)
                {
                        creep.moveTo(tgt)
                }
                else if (res == ERR_INVALID_ARGS)
                {
                        module.exports.endTask(creep.name)
                }
                creep.memory.transportAmount -= transportAmt
            }
        }
        else
        {
            Memory.rooms[creep.memory.tgt.pos.roomName].structures[creep.memory.tgt.id].filling = false
            module.exports.endTask(creep.name)
        }
    },
    
    value : function(creep)
    {
        if (creep.body.every((obj) => obj.type == CARRY || obj.type == MOVE)) //this unit cannot carry, it is a dedicated miner
            return 150
        else
        {
            score = 0
            for (comp in creep.body)
            {
                component = creep.body[comp]
                switch(String(component.type))
                {
                    case CARRY:
                        score += 100
                        break
                    case MOVE:
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
                    case WORK :
                        score -= 10
                        break
                }
            }
            
            return score / creep.body.length
        }
    },
    
    endTask : function(creepName)
    {
        if (Memory.creeps[creepName].transportAmount > 0)
        {
            taskmaster.addTask(module.exports.createTask(Memory.creeps[creepName].src, Memory.creeps[creepName].tgt, Memory.creeps[creepName].transportType, Memory.creeps[creepName].transportAmount))
        }
        Memory.creeps[creepName].task = TaskType.IDLE
        delete Memory.creeps[creepName].src
        delete Memory.creeps[creepName].tgt
        delete Memory.creeps[creepName].transportType
        delete Memory.creeps[creepName].transportAmount
    },
    
    initCreep : function(data, creep)
    {
        Memory.creeps[creepName].task = TaskType.TRANSPORTING
        
        Memory.creeps[creepName].src = { id : data.resSource.id, pos : data.resSource.pos}
        Memory.creeps[creepName].tgt = { id : data.resTarget.id, pos : data.resTarget.pos}
        Memory.creeps[creepName].transportType = data.resType
        Memory.creeps[creepName].transportAmount = data.resAmt
    }
};