var taskmaster = require("role.taskmaster")
var spawner = require("building.spawner")
var debugUtil = require("util.debug")
var cliUtil = require("util.cli")
var roomManager = require("faction.roomManager")
var overlayMain = require("overlay.main")
var setup = false;

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

    backup.upgrader()
    backup.builder()
    
    try 
    {
        spawner.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
    
    try 
    {
        taskmaster.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
    
    try 
    {
        overlayMain.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
    
    try 
    {
        roomManager.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
    
    try 
    {
        debugUtil.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
}