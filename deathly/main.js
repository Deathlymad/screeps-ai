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
    //console.log("<script>var fs = require('fs'); console.log(fs.opendirSync(__dirname).path);</script>")
    if (!setup)
    {
        scheduler.setup()
        
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
    
    try 
    {
        spawner.update()
    }
    catch(e)
    {
        console.log(e.stack)
    }
}