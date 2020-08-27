var debugUtil = require("util.debug")
var cliUtil = require("util.cli")
var TaskType = require("role.taskmaster.task").TaskType

var medianCap = 1000

function evaluateConsumptionRatio(room)
{
    Memory.rooms[room].eval.energySourceCap = Memory.rooms[room].sources.length * Memory.rooms[room].sources[0].energyCapacity
    Memory.rooms[room].eval.energySourceGen = Memory.rooms[room].eval.energySourceCap / 300
    energyMinable = 0
    for (source of Memory.rooms[room].sources)
        energyMinable += source.energy
    
    //with this condition all new consideration past 10000 basically push out the last one. This calculation converges to the average a convergence past a point doesn't have an important impact
    if (Memory.rooms[room].eval.energySourceMinable.cnt < medianCap)
        Memory.rooms[room].eval.energySourceMinable.cnt += 1
    Memory.rooms[room].eval.energySourceMinable.val = (Memory.rooms[room].eval.energySourceMinable.val * (Memory.rooms[room].eval.energySourceMinable.cnt - 1) + energyMinable) / Memory.rooms[room].eval.energySourceMinable.cnt
}

function evaluateCreepPerformance(room)
{
    idleCnt = 0
    roomCnt = 0
    mineCnt = 0
    upgradeCnt = 0
    for (creep in Game.creeps)
    {
        if (!Game.creeps[creep].room.name == room)
            continue
        
        roomCnt += 1
        switch(Game.creeps[creep].memory.task)
        {
            case TaskType.IDLE:
                idleCnt += 1
                break
            case TaskType.MINING:
                mineCnt += 1
                break
            case TaskType.UPGRADING:
                upgradeCnt += 1
                break
        }
    }
    
    if (Memory.rooms[room].eval.CreepCheckCtr < medianCap)
        Memory.rooms[room].eval.CreepCheckCtr += 1 
    Memory.rooms[room].eval.creepsInRoom = ((Memory.rooms[room].eval.creepsInRoom * (Memory.rooms[room].eval.CreepCheckCtr - 1)) + roomCnt) / Memory.rooms[room].eval.CreepCheckCtr
    Memory.rooms[room].eval.creepsIdle = ((Memory.rooms[room].eval.creepsIdle * (Memory.rooms[room].eval.CreepCheckCtr - 1)) + idleCnt) / Memory.rooms[room].eval.CreepCheckCtr
    Memory.rooms[room].eval.creepsMining = ((Memory.rooms[room].eval.creepsMining * (Memory.rooms[room].eval.CreepCheckCtr - 1)) + mineCnt) / Memory.rooms[room].eval.CreepCheckCtr
    Memory.rooms[room].eval.CreepsUpgrading = ((Memory.rooms[room].eval.CreepsUpgrading * (Memory.rooms[room].eval.CreepCheckCtr - 1)) + upgradeCnt) / Memory.rooms[room].eval.CreepCheckCtr
}

module.exports = {
    setup : function(room)
    {
        Memory.rooms[room].eval = {}
        
        //Energy Data
        Memory.rooms[room].eval.energySourceGen = 0
        Memory.rooms[room].eval.energySourceCap = 0
        Memory.rooms[room].eval.energySourceMinable = {}
        Memory.rooms[room].eval.energySourceMinable.val = 0.0
        Memory.rooms[room].eval.energySourceMinable.cnt = 0
        
        Memory.rooms[room].eval.creepsInRoom = 0
        Memory.rooms[room].eval.creepsIdle = 0
        Memory.rooms[room].eval.creepsMining = 0
        Memory.rooms[room].eval.CreepsUpgrading = 0
        Memory.rooms[room].eval.CreepCheckCtr = 0
        //add evaluation of travel time
        
        debugUtil.registerDebug(evaluateConsumptionRatio.bind(null, room), "Room_Consumption_Evaluation_" + room, 5)
        debugUtil.registerDebug(evaluateCreepPerformance.bind(null, room), "Room_Creep_Evaluation_" + room, 5)
        cliUtil.addCall(module.exports.printRoomSummary, "roomEvaluation", "Prints a summary of the rooms current state of operations.")
        
    },
    
    printRoomSummary : function(room)
    {
        var str  = "================================================\n"
        str += " +             Ressource Summary              + \n"
        str += " +                Room: " + room + "                  + \n"
        str += "================================================\n"
        
        var energySourceGen = Memory.rooms[room].eval.energySourceGen
        var energySourceCap = Memory.rooms[room].eval.energySourceCap
        var energySourceMinable = Memory.rooms[room].eval.energySourceMinable.val
        var energySourceUtilization = energySourceCap - energySourceMinable
        var energySourceUtilizationPercent = (energySourceUtilization / 3) / energySourceGen
        
        str += "    Energy:\n"
        str += "        Generated: " + energySourceGen + "\n"
        str += "        Source Capacity: " + energySourceCap + "\n"
        str += "        Average Available: " + energySourceMinable + "\n"
        str += "        Approx. Average Utilization: " + energySourceUtilizationPercent.toFixed(2) + "%\n"
        str += "================================================\n"
        
        
    roomCnt = Memory.rooms[room].eval.creepsInRoom
    idleCnt = Memory.rooms[room].eval.creepsIdle
    mineCnt = Memory.rooms[room].eval.creepsMining
    upgradeCnt = Memory.rooms[room].eval.CreepsUpgrading
        
        str += "    Creeps:\n"
        str += "        Avg. in Room: " + roomCnt.toFixed(2) + "\n"
        str += "        Avg. Idling: " + idleCnt.toFixed(2) + "      (" + (idleCnt * 100 / roomCnt).toFixed(2) + "%)" + "\n"
        str += "        Avg. Mining: " + mineCnt.toFixed(2) + "      (" + (mineCnt * 100 / roomCnt).toFixed(2) + "%)" + "\n"
        str += "        Avg. Upgrading: " + upgradeCnt.toFixed(2) + "      (" + (upgradeCnt * 100 / roomCnt).toFixed(2) + "%)" + "%\n"
        str += "================================================\n"
        
        
        
        return str
    }
};