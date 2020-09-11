var TaskType = require("role.taskmaster.task").TaskType

TaskModule = {
    1 : require("role.mine"),       //goes to mining spot and mines
    2 : require("role.build"),      //builds construction site
    3 : require("role.repair"),     //repairs damaged buildings
    4 : require("role.upgrade"),    //upgrades controller
    5 : require("role.transport"),  //transports resource from a to b
    6 : require("role.idle")        //empty default state
}

module.exports = {
    setup : function()
    {
        for(var name in Game.creeps) 
            if (!Object.keys(Game.creeps[name].memory).includes("task"))
            {
                //console.log("task entry missing in memory upon init")
                Game.creeps[name].memory.task = TaskType.IDLE
            }
        
        for (task in TaskModule)
        {
            if (!TaskModule[task])
                continue
            
            TaskModule[task].setup()
        }
        
        if (!Memory.taskmaster.queue)
            Memory.taskmaster = {}
        if (!Memory.taskmaster.queue)
            Memory.taskmaster.queue = []
    },
    
    update : function()
    {   
        for(name in Game.creeps) {
            
            if (name == "backup")
                continue
            if (name == "backup_builder")
                continue
            
            if (!Object.keys(Memory.creeps).includes(name))
            {
                Memory.creeps[name] = {}
            }
            if (!Object.keys(Memory.creeps[name]).includes("task"))
            {
                //console.log("Reset task (" + Memory.creeps[name].task + ") of creep " + name)
                Memory.creeps[name].task = TaskType.IDLE
            }
            if (Memory.creeps[name].task === TaskType.IDLE)
            {
                if (Memory.taskmaster.queue.length > 0)
                {
                    newTask = Memory.taskmaster.queue[0]
                    newTaskEntry = 0
                    for (entry in Memory.taskmaster.queue)
                    {
                        if (TaskModule[newTask.id].value(Game.creeps[name]) < TaskModule[Memory.taskmaster.queue[entry].id].value(Game.creeps[name]))
                        {
                            newTask = Memory.taskmaster.queue[entry]
                            newTaskEntry = entry
                        }
                    }
                    
                    Memory.taskmaster.queue.splice(newTaskEntry, 1)
                    
                    TaskModule[newTask.id].initCreep(newTask, Game.creeps[name]) //objectify
                }
            }
            TaskModule[Memory.creeps[name].task].update(Game.creeps[name])
        }
    },
    
    cleanupCreep : function(creepName)
    {
        console.log("Cleaning up " + creepName)
        if (creepName == "backup")
            return
        if (creepName == "backup_builder")
            return
        
        console.log("Invoking cleanup of " + String(Memory.creeps[creepName].task) +  " for creep " + creepName)
        TaskModule[Memory.creeps[creepName].task].endTask(creepName)
    }
};