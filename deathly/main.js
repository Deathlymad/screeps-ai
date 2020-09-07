var taskmaster = require("role.taskmaster")
var spawner = require("building.spawner")
var cliUtil = require("util.cli")
var roomManager = require("faction.roomManager")
var overlayMain = require("overlay.main")
var backup = require("setup")
var scheduler = require("system.schedule")
var creep = require("role.creep")

var setup = false;
module.exports.loop = function () {
    
    if (!setup)
    {
        scheduler.setup()
        //scheduler.registerCallEx( ()=> console.log("test"), "TestFunc", 2, 5)
        //scheduler.registerCallEx( ()=> console.log("test2"), "TestFunc", 1, 6)
        
        //init code 
        cliUtil.setup()
        creep.setup()
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
    
    scheduler.update()
}