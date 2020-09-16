var overlayManager = require("overlay.registration")

data = {}

function displayStorage(visualObj)
{
    if (!Object.keys(data).includes(visualObj.roomName))
    {
        sources = Game.rooms[visualObj.roomName].find(FIND_SOURCES)
        if (sources.length == 2)
            data[visualObj.roomName] = {p1 : Game.rooms[visualObj.roomName].controller.pos, p2 : sources[0].pos, p3 : sources[1].pos}
        else if (sources.length == 1)
            data[visualObj.roomName] = {p1 : Game.rooms[visualObj.roomName].controller.pos, p2 : sources[0].pos, p3 : sources[0].pos}
        
        midX = (data[visualObj.roomName].p1.x + data[visualObj.roomName].p2.x + data[visualObj.roomName].p3.x) / 3
        midY = (data[visualObj.roomName].p1.y + data[visualObj.roomName].p2.y + data[visualObj.roomName].p3.y) / 3
        console.log(midX)
        console.log(midY)
        console.log(visualObj.roomName)
        
        data[visualObj.roomName].mid = new RoomPosition(Math.round(midX), Math.round(midY), visualObj.roomName)
    }
    
    visualObj.poly([data[visualObj.roomName].p1, data[visualObj.roomName].p2, data[visualObj.roomName].p3], {fill : "#EEF1B6"})
    visualObj.circle(data[visualObj.roomName].mid, {radius : 0.5})
}

module.exports = {
    setup : function()
    {
        overlayManager.registerOverlay(displayStorage, "displayStoragePos", "Displays Storage Base.")
    }
};