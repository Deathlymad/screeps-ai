var taskmaster = require("role.taskmaster.interface")
var scheduler = require("util.debug")
var repairTask = require("role.repair")
var buildTask = require("role.build")

var repairThreshold = 0.8

var STATE_FREE = 0
var STATE_ACTIVE = 1

function updateConstructionList(room)
{
    var constructionSites = Game.rooms[room].find(FIND_CONSTRUCTION_SITES).map(x => x.id)
    
    siteColl = []
    
    for (site of constructionSites)
    {
        if (!site in Object.keys(Memory.rooms[room].maintance.constructionSites))
        {
            Memory.rooms[room].maintance.constructionSites[site] = STATE_FREE
        }
        
        siteColl.push(site)
    }
    
    idList = Object.keys(Memory.rooms[room].maintance.constructionSites)
    
    var ret = [];
    for(var i in idList) 
        if(siteColl.indexOf(idList[i]) > -1)
            ret.push(idList[i]);
    
    for (site of ret)
        delete Memory.rooms[room].maintance.constructionSites[site]
}

function updateRepairList(room)
{
    var repairSites = Game.rooms[room].find(FIND_MY_STRUCTURES, {filter : function(obj) {
        return (obj.hits / obj.hitsMax) < repairThreshold
    }}).map(x => x.id)
    
    siteColl = []
    
    for (site of repairSites)
    {
        if (!site in Object.keys(Memory.rooms[room].maintance.repairSites))
        {
            Memory.rooms[room].maintance.repairSites[site] = STATE_FREE
        }
        
        siteColl.push(site)
    }
    
    idList = Object.keys(Memory.rooms[room].maintance.repairSites)
    
    var ret = [];
    for(var i in idList) 
        if(siteColl.indexOf(idList[i]) > -1)
            ret.push(idList[i]);
    
    for (site of ret)
        delete Memory.rooms[room].maintance.repairSites[site]
}

module.exports = {
    setup : function(room)
    {
        Memory.rooms[room].maintance = {}
        Memory.rooms[room].maintance.constructionSites = {}
        Memory.rooms[room].maintance.repairSites = {}
    }
    
    update : function(room)
    {
        updateConstructionList(room)
        updateRepairList(room)
        
        for (site in Memory.rooms[room].maintance.repairSites)
        {
            if (Memory.rooms[room].maintance.repairSites[site] == STATE_FREE)
            {
                taskmaster.addTask(repairTask.createTask(site))
                Memory.rooms[room].maintance.repairSites[site] = STATE_ACTIVE
            }
        }
        
        for (site in Memory.rooms[room].maintance.constructionSites)
        {
            if (Memory.rooms[room].maintance.constructionSites[site])
            {
                taskmaster.addTask(buildTask.createTask(site))
                Memory.rooms[room].maintance.repairSites[site] = STATE_ACTIVE
            }
        }
    }
};