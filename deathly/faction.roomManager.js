var roomExcavator = require("room.excavation")
var roomEvaluation = require("room.evaluate")
var roomOverlay = require("room.overlay")
var upgradeTask = require("role.upgrade")
var roomDistribution = require("room.distribution")
var roomMaintance = require("room.maintance")
var taskmaster = require("role.taskmaster.interface")
var TaskType = require("role.taskmaster.task").TaskType

module.exports = {
    setup : function()
    {
        if (!Memory.rooms)
            Memory.rooms = {}
        
        for (room in Game.rooms)
        {
            if (!Memory.rooms[room])
                Memory.rooms[room] = {}
            Memory.rooms[room].sources = Game.rooms[room].find(FIND_SOURCES)
            roomOverlay.setup(room)
            roomEvaluation.setup(room)
            
            roomExcavator.setup(room)
            roomDistribution.setup(room)
            roomMaintance.setup(room)
            
            if (taskmaster.getJobTypeCount(TaskType.UPGRADING) < 2)
                taskmaster.addTask(upgradeTask.createTask(room)) //check if one already exists
        }
    },
    
    update : function()
    {
        for (room in Game.rooms)
        {
            Memory.rooms[room].sources = Game.rooms[room].find(FIND_SOURCES)
            
            roomExcavator.update(room)
            roomDistribution.update(room)
            roomMaintance.update(room)
            
            cnt = taskmaster.getJobTypeCount(TaskType.UPGRADING)
            cnt += taskmaster.getQueuedJobs(TaskType.UPGRADING)
            if (cnt < 2)
                taskmaster.addTask(upgradeTask.createTask(room)) //check if one already exists
        }
    }
};