var taskmaster = require("role.taskmaster")
var spawner = require("building.spawner")
var debugUtil = require("util.debug")
var cliUtil = require("util.cli")
var roomManager = require("faction.roomManager")
var overlayMain = require("overlay.main")
var setup = false;
var loop = true

var backup = require("setup")

module.exports.loop = function () {
    if (!setup)
    {
        //init code 
        cliUtil.setup()
        debugUtil.setup()
        taskmaster.setup()
        
        roomManager.setup()
        
        overlayMain.setup()
        setup = true
    }

    if (Game.rooms["W8N4"].controller.ticksToDowngrade < 5000) //contingency mode
    {
        backup.upgrader()
        backup.builder()
    }

    if (loop)
    {
        try
        {
            spawner.update()
            
            taskmaster.update()
            
            overlayMain.update()
            
            roomManager.update()
            debugUtil.update()
        }
        catch (e)
        {
            loop = false
            console.log(e.stack)
        }
    }
}