var colorUtil = require("util.color")
var overlayManager = require("overlay.registration")

var gradient = [{r : 255, g : 0, b : 255}, {r : 255, g : 255, b : 0}, {r : 0, g : 255, b : 0}]

function displayHealthBar(visual, obj)
{
        color = colorUtil.getGradientColor(gradient, obj.hits, 0, obj.hitsMax)
        
        visual.rect(obj.pos.x - 0.4, obj.pos.y - 0.3, 0.8, 0.2, {fill:"#000000", opacity : 0.3})
        visual.rect(obj.pos.x - 0.4, obj.pos.y - 0.3, 0.8 * obj.hits / obj.hitsMax, 0.2, {fill:color, opacity : 0.3})
}

function displayHealthBars(visual)
{
    if (!Game.rooms[visual.roomName])
        return
    objects = Game.rooms[visual.roomName].find(FIND_STRUCTURES, {filter : function(obj) {
        return obj.hits < obj.hitsMax
    }})
    
    for (objIdx in objects)
    {
        object = objects[objIdx]
        displayHealthBar(visual, object)
    }
    objects = Game.rooms[visual.roomName].find(FIND_CREEPS, {filter : function(obj) {
        return obj.hits < obj.hitsMax
    }})
    
    for (objIdx in objects)
    {
        object = objects[objIdx]
        displayHealthBar(visual, object)
    }
}

module.exports = {
    setup : function()
    {
        overlayManager.registerOverlay(displayHealthBars, "displayHealthBars", "Enables Health bars per damaged structure.")
    }
};