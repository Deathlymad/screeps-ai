/*
 * Logical Creep Group for spawn replentishing and task claiming
 
 * NOTES:
 *   IMPORTANT: Squads need to be distinct
 *   this is basically the entity the creep part of the stuff that needs to be done in rooms. Like an HR department.
 *   it describes the creeps properties / types
 *   it keeps track of how many there are in each squad storing IDs.
 *   it will refill itself
 *   it assigns squads to creeps on birth - they are permanent for a creeps life
 *   this is technically also the basis of joint operations. (there should be also a peer/network/hierachy entity for that because the scaling of global logic is (creepCount)! )
 *   technically this logic is not room based however the actions tend to be more reasonable in rooms. is this a superentity?
 *   this might be useful as a hierachy of tasks? (DomesticSquad -> MiningSquad -> MiningSquad_W8N4)
 *   in what relation is that to the room management?
 */

var creepSquad = function(name, minProperties, scaleProperties) {
    this.name = name
    this.minProps = minProperties
    this.scaleProps = scaleProperties
    this.creeps = {} //stores creeps
}

creepSquad.prototype.setup = function() {
    //scan creeps whether they have a squad. 
}

creepSquad.prototype.update = function() {
    
}

creepSquad.prototype.count = function() {
    
}

creepSquad.prototype.setNewSize = funciton() {
    
}

module.exports = {
    squads : {
        "miningSquad" : creepSquad("miningSquad", [WORK, MOVE], [WORK, MOVE])
    },
    setup : function() {
        for (squadName in this.squads) {
            this.squads[squadName].setup()
        }
    },
    
    update : function() {
        for (squadName in this.squads) {
            this.squads[squadName].update()
        }
    }
};
