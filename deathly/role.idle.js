var task = require("role.taskmaster.task").TaskType


module.exports = {
    createTask : function()
    {
        return {id : task.IDLE}
    },
    verifyTask : function()
    {
        
    },
    
    setup : function()
    {
        
    },
    
    update : function(creep)
    {
        creep.say("😴", true)
    },
    
    value : function(creep)
    {
        return 0
    },
    
    initCreep : function(data, creep)
    {
        
    },
    
    endTask : function(creep)
    {
        Memory.creeps[creepName].task = task.IDLE
    }
};