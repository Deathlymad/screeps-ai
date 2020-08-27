var cli = require("util.cli")

function setOverlay(overlay, name)
{
    Memory.overlay.activeOverlays.push(overlay)
    return "Activated Overlay " + name
}

module.exports = {
    
    visuals : { "W8N4" : new RoomVisual("W8N4")},
    overlays : {},
    
    setup : function()
    {
        Memory.overlay = {}
        Memory.overlay.ctr = 0
        
        Memory.overlay.activeOverlays = []
        
        cli.addCall(module.exports.setClearOverlay, "clearOverlay", "This Function clears all overlays.")
        cli.addCall(module.exports.addRoomVisual, "addRoomVisual", "Adds a room to the existing Overlay targets.")
        //add general overlay functions
    },
    
    update : function()
    {
        
        for (vis in module.exports.visuals)
        {
            for (entry in Memory.overlay.activeOverlays)
            {
                module.exports.overlays[Memory.overlay.activeOverlays[entry]](module.exports.visuals[vis])
            }
        }
    },
    
    setClearOverlay : function()
    {
        Memory.overlay.activeOverlays = []
        return "Cleared Overlays"
    },
    
    addRoomVisual : function(room)
    {
        module.exports.visuals[room] = new RoomVisual(room)
    },
    
    registerOverlay : function(func, name, desc, addCLI = true)
    {
        if (!Memory.overlay)
            Memory.overlay = {}
        if (!Memory.overlay.ctr)
            Memory.overlay.ctr = 0
        newID = Memory.overlay.ctr
        Memory.overlay.ctr += 1
        
        module.exports.overlays[newID] = func //stores function in module
        
        if (addCLI)
            cli.addCall(setOverlay.bind(null, newID, name), name, desc)
    }
    
};
