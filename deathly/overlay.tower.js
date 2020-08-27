var overlayManager = require("overlay.registration")

var ranges = [5, 20, 50]

function displayTowerRange(visualObj)
{
    towers = Game.rooms[visualObj.roomName].find(FIND_STRUCTURES, {filter : function(obj)
        {
            
        }
    })
    for (tower in towers)
    {
        for (range of ranges)
        {
            visualObj.circle(tower.pos.x, tower.pos.y, {radius : range, fill : "#f00000", opacity:0.1})
        }
    }
}

module.exports = {
    setup : function()
    {
        overlayManager.registerOverlay(displayTowerRange, "displayTowerRange", "Displays tower Range.")
    },
    
    update : function()
    {
    }

};