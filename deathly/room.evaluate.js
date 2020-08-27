var debugUtil = require("util.debug")
var cliUtil = require("util.cli")

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

module.exports = {
    setup : function(room)
    {
        Memory.rooms[room].eval = {}
        Memory.rooms[room].eval.energySourceGen = 0
        Memory.rooms[room].eval.energySourceCap = 0
        Memory.rooms[room].eval.energySourceMinable = {}
        Memory.rooms[room].eval.energySourceMinable.val = 0.0
        Memory.rooms[room].eval.energySourceMinable.cnt = 0
        debugUtil.registerDebug(evaluateConsumptionRatio.bind(null, room), "Room_Consumption_Evaluation_" + room, 5)
        cliUtil.addCall(module.exports.printRoomSummary, "roomEvaluation", "Prints a summary of the rooms current state of operations.")
        
    },
    
    printRoomSummary : function(room)
    {
        var energySourceGen = Memory.rooms[room].eval.energySourceGen
        var energySourceCap = Memory.rooms[room].eval.energySourceCap
        var energySourceMinable = Memory.rooms[room].eval.energySourceMinable.val
        var energySourceUtilization = energySourceCap - energySourceMinable
        var energySourceUtilizationPercent = (energySourceUtilization / 3) / energySourceGen
        
        var str  = "================================================\n"
        str += " +             Ressource Summary              + \n"
        str += " +                Room: " + room + "                  + \n"
        str += "================================================\n"
        str += "    Energy:\n"
        str += "        Generated: " + energySourceGen + "\n"
        str += "        Source Capacity: " + energySourceCap + "\n"
        str += "        Average Available: " + energySourceMinable + "\n"
        str += "        Approx. Average Utilization: " + energySourceUtilizationPercent.toFixed(2) + "%\n"
        str += "================================================\n"
        
        return str
    }
};