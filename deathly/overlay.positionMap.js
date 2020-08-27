var colorUtil = require("util.color")
var debugUtil = require("util.debug")
var overlayManager = require("overlay.registration")

var gradient = [{r : 0, g : 0, b : 255}, {r : 0, g : 255, b : 255}, {r : 0, g : 255, b : 0}, {r : 255, g : 255, b : 0}, {r : 255, g : 0, b : 0}]


function displayPositionMatrix(visualObj)
{
    for (posX in Memory.rooms[visualObj.roomName].positionMatrix)
    {
        if (posX == "max")
            continue
        for (posY in Memory.rooms[visualObj.roomName].positionMatrix[posX])
        {
            color = colorUtil.getGradientColor(gradient, Memory.rooms[visualObj.roomName].positionMatrix[posX][posY], 0, Memory.rooms[visualObj.roomName].positionMatrix.max)
            
            visualObj.rect(posX - 0.5, posY - 0.5, 1, 1, {fill:color, opacity : 0.3})
        }
    }
}

function updatePositionMatrix(delta)
{
    max = 0
    for (name in Game.creeps)
    {
        creep = Game.creeps[name]
        
        if (!Memory.rooms[creep.pos.roomName].positionMatrix[creep.pos.x])
            Memory.rooms[creep.pos.roomName].positionMatrix[creep.pos.x] = {}
        if (!Memory.rooms[creep.pos.roomName].positionMatrix[creep.pos.x][creep.pos.y])
            Memory.rooms[creep.pos.roomName].positionMatrix[creep.pos.x][creep.pos.y] = 0
        
        Memory.rooms[creep.pos.roomName].positionMatrix[creep.pos.x][creep.pos.y] += 1
    }
    for (room in Game.rooms)
    {
        for (posX in Memory.rooms[room].positionMatrix)
            for (posY in Memory.rooms[room].positionMatrix[posX])
                if (max < Memory.rooms[room].positionMatrix[posX][posY])
                max = Memory.rooms[room].positionMatrix[posX][posY]
        Memory.rooms[room].positionMatrix.max = max
    }
}

function updatePosMat()
{
    for (room in Game.rooms)
    {
        updatePositionMatrix(room)
    }
}

module.exports = {
    setup : function()
    {
        Memory.rooms[room].positionMatrix = {}
        Memory.rooms[room].positionMatrix.max = 0
        
        debugUtil.registerDebug(updatePosMat, "Update_Position_Matrix", 1)
        overlayManager.registerOverlay(displayPositionMatrix, "displayPositionMatrix", "This Function resets the Position Heatmap.")
    },
    
    resetPositionMatrix : function(room)
    {
        Memory.rooms[room].positionMatrix = []
        Memory.rooms[room].positionMatrix.max = 0
        return "reset Position Matrix"
    },
    update : function()
    {
        for (room in Game.rooms)
        {
            updatePositionMatrix(room)
        }
    }

};