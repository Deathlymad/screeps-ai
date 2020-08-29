/*
 * the base creep behavior. this will be held by every role.
 */

module.exports = { //should be added to prototype
    setup : function()
    {
        
    },
    
    moveTo : function(creep, position)
    {
        creep.moveTo(position)
    },
    
    onBirth : function(creep)
    {
        
    },
    
    onDeath : function(creep)
    {
        delete creep.memory
    }
};