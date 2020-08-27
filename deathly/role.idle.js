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
        
    },
    
    value : function(creep)
    {
        return 0
    },
    
    initCreep : function(data, creep)
    {
        
    }
};