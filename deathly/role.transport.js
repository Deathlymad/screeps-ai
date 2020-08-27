/*
 * This is the example task that can be copied for all other tasks
 */

module.exports = {
    createTask : function(src, tgt, type, amount)
    {
        return {id : task.TRANSPORTING, resSource : src, resTarget : tgt, resType : type, resAmt : amount}
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
                
                switch (creep.withdraw(Game.getObjectById(creep.memory.src.id), creep.memory.transportType, transportAmt))
                {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(creep.memory.src.pos)
                    case ERR_INVALID_ARGS:
                        creep.memory.task = task.IDLE
                }
            }
            else
            {
                transportAmt = creep.store[creep.memory.transportType]
                switch (creep.transfer(Game.getObjectById(creep.memory.tgt.id), creep.memory.transportType))
                {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(creep.memory.src.pos)
                    case ERR_INVALID_ARGS:
                        creep.memory.task = task.IDLE
                }
                creep.memory.transportAmount -= transportAmt
            }
        }
        else
            creep.memory.task = task.IDLE
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
                    case MOVE:
                        score += 100
                    case ATTACK :
                        score -= 50
                    case RANGED_ATTACK :
                        score -= 50
                    case HEAL :
                        score -= 50
                    case WORK :
                        score -= 10
                }
            }
            
            return score / creep.body.length
        }
    },
    
    initCreep : function(data, creep)
    {
        creep.memory.task = task.TRANSPORTING
        
        creep.memory.src = { id : data.resSource.id, pos : data.resSource.pos}
        creep.memory.tgt = { id : data.resTarget.id, pos : data.resTarget.pos}
        creep.memory.transportType = data.resType
        creep.memory.transportAmount = obj.resAmt
    }
};