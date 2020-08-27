var overlayRegistration = require("overlay.registration")
var mathUtil = require("util.math")
var taskmaster = require("role.taskmaster.interface")
var miner = require("role.mine.interface")

var FREE = -1
var RESERVED = 0
var AQUIRED = 1

//needs to spawn miner creeps. needs to assign mining Task to Creep on start.

function cmp(a, b)
{
    if (Game.spawns["Hive"].pos.findPathTo(a.x, a.y, {ignoreCreeps:true, range:1}).length == Game.spawns["Hive"].pos.findPathTo(b.x, b.y, {ignoreCreeps:true, range:1}).length )
    {
        return mathUtil.distanceToPoint(Game.spawns["Hive"].pos, a) > mathUtil.distanceToPoint(Game.spawns["Hive"].pos, b)
    }
    else
    {
        return Game.spawns["Hive"].pos.findPathTo(a.x, a.y, {ignoreCreeps:true, range:1}).length > Game.spawns["Hive"].pos.findPathTo(b.x, b.y, {ignoreCreeps:true, range:1}).length
    }
}

function visualizeTargetMiningSpots(visual)
{
    //remap
    targetSpots = {}
    for (entry of Memory.rooms[room].potentialMiningSpots)
    {
        if (!targetSpots[entry.sourceID])
            targetSpots[entry.sourceID] = []
        targetSpots[entry.sourceID].push(entry.pos)
        visual.poly(Game.spawns["Hive"].pos.findPathTo(entry.pos.x, entry.pos.y, {ignoreCreeps:true, range:1}))
        visual.text(String(Game.spawns["Hive"].pos.findPathTo(entry.pos.x, entry.pos.y, {ignoreCreeps:true, range:1}).length), entry.pos.x, entry.pos.y, {align : "center"})
    }
    
    for (entry in targetSpots)
    {
        targetSpots[entry].sort((a, b) => cmp(a, b) ? 1 : -1)
        
        maxLen = Math.min(targetSpots[entry].length, 2)
        for (i = 0; i < maxLen; i++)
            visual.rect(targetSpots[entry][i].x - 0.5, targetSpots[entry][i].y - 0.5, 1, 1)
    }
}


module.exports = {
    setup : function(room)
    {
        //calculate potential mining spots.
        mineSpot = Game.rooms[room].find(FIND_STRUCTURES, {filter : function(obj) {
                if (obj.structureType == STRUCTURE_CONTAINER)
                {
                    for (id in Memory.rooms[room].sources)
                        if (Math.abs(Memory.rooms[room].sources[id].pos.x - obj.pos.x) <= 1 && Math.abs(Memory.rooms[room].sources[id].pos.y - obj.pos.y) <= 1)
                            return true
                    return false
                }
            }
        })
        Memory.rooms[room].miningSpots = {}
        for (spot in mineSpot)
        {
            Memory.rooms[room].miningSpots[spot] = {}
            for (source in Memory.rooms[room].sources)
            {
                if (Memory.rooms[room].sources[source].pos.getRangeTo(mineSpot[spot]) <= 1)
                    Memory.rooms[room].miningSpots[spot].sourceID = Memory.rooms[room].sources[source].id
            }
            
            Memory.rooms[room].miningSpots[spot].pos = mineSpot[spot].pos
            Memory.rooms[room].miningSpots[spot].state = FREE
            
        }
        
        Memory.rooms[room].potentialMiningSpots = []
        
        terrain = Game.rooms[room].getTerrain()
        for (id in Memory.rooms[room].sources)
        {
            var source = Memory.rooms[room].sources[id]
            for (x = source.pos.x - 1; x <= source.pos.x + 1; x++)
                for (y = source.pos.y - 1; y <= source.pos.y + 1; y++)
                {
                    fieldData = Game.rooms[room].lookAt(x, y)
                    res = true
                    for (field of fieldData)
                    {
                        switch(String(field.type))
                        {
                            case "structure":
                                res = false
                                break
                            case "terrain":
                                res = res && field.terrain != "wall"
                                break
                        }
                    }
                    if (res)
                        Memory.rooms[room].potentialMiningSpots.push({pos : new RoomPosition(x, y, room), sourceID : source.id})
                }
        }
        
        for (spot in Memory.rooms[room].miningSpots)
        {
            if (Memory.rooms[room].miningSpots[spot].state == FREE)
            {
                task = miner.createTask(room, module.exports.reserveMiningSpot(room))
                taskmaster.addTask(task)
            }
        }
        
        overlayRegistration.registerOverlay(visualizeTargetMiningSpots, "displayTargetSpotOverlay", "Renders the room overlay displaying all target potential mining spots.")
        
        //actually dynamic
    },
    
    update : function(room)
    {
        mineSpot = Game.rooms[room].find(FIND_STRUCTURES, {filter : function(obj) {
                if (obj.structureType == STRUCTURE_CONTAINER)
                {
                    for (id in Memory.rooms[room].sources)
                        if (Math.abs(Memory.rooms[room].sources[id].pos.x - obj.pos.x) <= 1 && Math.abs(Memory.rooms[room].sources[id].pos.y - obj.pos.y) <= 1)
                            return true
                    return false
                }
            }
        })
        
        knownSpots = Object.keys(Memory.rooms[room].miningSpots).map(x => Memory.rooms[room].miningSpots[x].pos)
        mineSpots = mineSpot.map(x => x.pos)
        
        var ret = [];
        for(var i in mineSpots) {   
            for (knownSpotKey in knownSpots)
                if (mineSpots[i].x == knownSpots[knownSpotKey].x && mineSpots[i].y == knownSpots[knownSpotKey].y && mineSpots[i].roomName == knownSpots[knownSpotKey].roomName)
                    ret.push(i);
        }
        for (entry of ret)
            mineSpots.splice(entry, 1)
        
        for (spot in mineSpots)
        {
            Memory.rooms[room].miningSpots[spot] = {}
            for (source in Memory.rooms[room].sources)
            {
                if (Memory.rooms[room].sources[source].pos.getRangeTo(mineSpot[spot]) <= 1)
                    Memory.rooms[room].miningSpots[spot].sourceID = Memory.rooms[room].sources[source].id
            }
            
            Memory.rooms[room].miningSpots[spot].pos = mineSpot[spot].pos
            Memory.rooms[room].miningSpots[spot].state = FREE
        }
        
        for (spot in Memory.rooms[room].miningSpots)
        {
            if (Memory.rooms[room].miningSpots[spot].state == FREE)
            {
                console.log(Memory.rooms[room].miningSpots[spot].state)
                task = miner.createTask(room, module.exports.reserveMiningSpot(room))
                taskmaster.addTask(task)
            }
        }
    },
    
    getSpotLocation : function(room, spotID)
    {
        return Memory.rooms[room].miningSpots[spotID].pos
    },
    getSpotSource : function(room, spotID)
    {
        return Memory.rooms[room].miningSpots[spotID].sourceID
    },
    
    reserveMiningSpot : function(room)
    {
        spot = -1
        for (obj in Memory.rooms[room].miningSpots)
        {
            if (Memory.rooms[room].miningSpots[obj].state == FREE)
            {
                spot = obj
                Memory.rooms[room].miningSpots[obj].state = RESERVED
                break
            }
        }
        
        return spot
    },
    aquireMiningSpot : function(room, spot)
    {
        if (Memory.rooms[room].miningSpots[spot] && Memory.rooms[room].miningSpots[spot].state == RESERVED)
        {
            Memory.rooms[room].miningSpots[spot].state = AQUIRED
            return spot
        }
        return -1
    },
    releaseMiningSpot : function(room, spot)
    {
        if (Memory.rooms[room].miningSpots[spot] && Memory.rooms[room].miningSpots[spot].state == AQUIRED)
        {
            Memory.rooms[room].miningSpots[spot].state = FREE
        }
    }
};