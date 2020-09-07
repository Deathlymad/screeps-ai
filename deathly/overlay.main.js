var positionMap = require("overlay.positionMap")
var registration = require("overlay.registration")
var tower = require("overlay.tower")
var healthbars = require("overlay.healthbars")
var hilbert = require("overlay.hilbert")

module.exports = {
    setup : function()
    {
        registration.setup()
        positionMap.setup()
        
        tower.setup()
        healthbars.setup()
        hilbert.setup()
    },
    
    update : function()
    {
        registration.update()
        positionMap.update()
    }
};