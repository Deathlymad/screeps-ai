var task = require("role.taskmaster.task").TaskType

module.exports = {
    createTask : function(roomName, miningSpotID)
    {
        return {id : task.MINING,  room : roomName, spotID : miningSpotID}
    },
    verifyTask : function(obj)
    {
        return obj && obj.spotID && obj.room
    }
};