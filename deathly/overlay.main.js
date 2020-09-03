var positionMap = require("overlay.positionMap")
var registration = require("overlay.registration")
var tower = require("overlay.tower")
var healthbars = require("overlay.healthbars")
var hilbert = require("overlay.hilbert")
var linear = require("overlay.linear")

module.exports = {
    setup : function()
    {
        registration.setup()
        positionMap.setup()
        
        tower.setup()
        healthbars.setup()
        hilbert.setup()
        linear.setup()
    },
    
    update : function()
    {
        registration.update()
        positionMap.update()
    }
};