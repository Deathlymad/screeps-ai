
/*
 * generate transport from mining spots to storage
 * generate transport from mining spots or storage to consumers
 * measure throughput for transfers over the last timeframe
 */

function updateStructureData(room){
    Memory.rooms[room].structures = {}
    
    var structs = Game.rooms[room].find(FIND_STRUCTURES, {filter : function(obj){
        if (obj.store === undefined)
            return false
        return true
    }})
    
    for (structure in structs)
    {
        Memory.rooms[room].structures[structs[structure].id] = {}
        Memory.rooms[room].structures[structs[structure].id].type = structs[structure].type
        Memory.rooms[room].structures[structs[structure].id].pos = structs[structure].pos
    }
}

module.exports = {
    setup : function(room)
    {
        updateStructureData(room)
    },
    
    update : function(room)
    {
        
    }
};