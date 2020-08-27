var roomExcavator = require("room.excavation")
var roomEvaluation = require("room.evaluate")
var roomOverlay = require("room.overlay")
var upgradeTask = require("role.upgrade")
var taskmaster = require("role.taskmaster.interface")

module.exports = {
    setup : function()
    {
        Memory.rooms = {}
        
        for (room in Game.rooms)
        {
            Memory.rooms[room] = {}
            Memory.rooms[room].sources = Game.rooms[room].find(FIND_SOURCES)
            roomExcavator.setup(room)
            roomEvaluation.setup(room)
            roomOverlay.setup(room)
            
            taskmaster.addTask(upgradeTask.createTask(room))
        }
    },
    
    update : function()
    {
        for (room in Game.rooms)
        {
            Memory.rooms[room].sources = Game.rooms[room].find(FIND_SOURCES)
            roomExcavator.update(room)
        }
    }
};