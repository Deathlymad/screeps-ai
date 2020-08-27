var overlayRegistration = require("overlay.registration")

var OVERLAY_SOURCE_ADJACENCY = 1
var OVERLAY_CONTROLLER_ADJACENCY = 2

var OVERLAY_CREEP_MOVEMENT = 3

function displayFreeFieldsInArea(visual, areaX, areaY, width, height, style)
{
    if (!visual.roomName in Game.rooms)
        return
    terrain = Game.rooms[visual.roomName].getTerrain()
    for (i = 0; i < width; i++)
        for (j = 0; j < height; j++)
            if (terrain.get(areaX + i, areaY + j) != TERRAIN_MASK_WALL)
                visual.rect(areaX + i - 0.5, areaY + j - 0.5, 1, 1, style)
}
function displaySourceOverlay(visual)
{
    if (!Memory.rooms[visual.roomName])
        return
    for (sourceID in Memory.rooms[visual.roomName].sources)
    {
        var source = Memory.rooms[visual.roomName].sources[sourceID]
            displayFreeFieldsInArea(visual, source.pos.x - 1, source.pos.y - 1, 3, 3, {fill:"#FFFF00", opacity : 0.3})
    }
}
function displayControllerOverlay(visual)
{
    if (visual.roomName in Game.rooms)
        displayFreeFieldsInArea(visual, Game.rooms[visual.roomName].controller.pos.x - 3, Game.rooms[visual.roomName].controller.pos.y - 3, 7, 7, {fill:"#CF0000", opacity : 0.3})
}
function displayMovementOverlay(room)
{
    for (creep in Memory.creeps)
    {
        if (Memory.creeps[creep]._move)
        {
            Game.rooms[room].visual.poly(Room.deserializePath(Memory.creeps[creep]._move.path), {stroke: '#fff', strokeWidth: .15, opacity: .2, lineStyle: 'dashed'})
        }
    }
}

module.exports = {
    setup : function(room) {
        //room dependent. this will overwrite
        
        overlayRegistration.registerOverlay(displaySourceOverlay, "displaySourceOverlay", "Renders the room overlay displaying all adjacent fields of a source.")
        overlayRegistration.registerOverlay(displayControllerOverlay, "displayControllerAdjacentOverlay", "Renders the room overlay displaying all adjacent fields of a source.")
        overlayRegistration.registerOverlay(displayMovementOverlay, "displayMovementOverlay", "Renders the overlay displaying all current creep paths.")
    }
};