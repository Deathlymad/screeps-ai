var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var TaskType = require("role.taskmaster.task").TaskType

TaskModule = {
    0 : require("role.idle"), //empty default state
    1 : require("role.mine"), //goes to mining spot and mines
    2 : require("role.build"), //builds construction site
    3 : require("role.repair"), //repairs damaged buildings
    4 : require("role.upgrade"), //upgrades controller
    5 : require("role.transport")
}

module.exports = {
    setup : function()
    {
        for(var name in Game.creeps) 
            if (!Game.creeps[name].memory.task)
                Game.creeps[name].memory.task = TaskType.IDLE
        
        for (task in TaskModule)
        {
            if (!TaskModule[task])
                continue
            
            TaskModule[task].setup()
        }
        
        Memory.taskmaster = {}
        Memory.taskmaster.queue = []
    },
    
    update : function()
    {   
        for(name in Game.creeps) {
            
            if (name == "backup")
                continue
            if (name == "backup_builder")
                continue
            
            
            creep = Game.creeps[name]
            
            if (!creep.memory.task)
                creep.memory.task = TaskType.IDLE
            if (creep.memory.task == TaskType.IDLE)
            {
                if (Memory.taskmaster.queue.length > 0)
                {
                    newTask = Memory.taskmaster.queue[0]
                    newTaskEntry = 0
                    for (entry in Memory.taskmaster.queue)
                    {
                        if (TaskModule[newTask.id].value(creep) < TaskModule[Memory.taskmaster.queue[entry].id].value(creep))
                        {
                            newTask = Memory.taskmaster.queue[entry]
                            newTaskEntry = entry
                        }
                    }
                    
                    Memory.taskmaster.queue.splice(newTaskEntry, 1)
                    
                    TaskModule[newTask.id].initCreep(newTask, creep) //objectify
                }
            }
            TaskModule[creep.memory.task].update(creep)
        }
    }
};