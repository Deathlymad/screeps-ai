var overlayManager = require("overlay.registration")
var colorUtil = require("util.color")

function indexToPoint(index) {
    return { x: (index - (index % 50)) / 50, y: (index % 50)};
}

module.exports = {
    
    hilbertValued : [],
    hilbertMax : 0,
    hilbertMin : 0,
    
    setup : function()
    {
        overlayManager.registerOverlay(this.displayLinear, "displayLinear", "Displays a Hilbert curve over the map grid.")
        this.genLinear()
    },
    
    displayLinear : function(visual)
    {
        for (entry of module.exports.hilbertValued)
        {
            visual.rect(entry.x - 0.5, entry.y - 0.5, 1, 1, {fill : entry.color, opacity : 0.4})
        }
    },
    
    genLinear : function()
    {
        module.exports.hilbertMin = 0
        module.exports.hilbertMax = 0
        
        terr = Game.map.getRoomTerrain("W8N4")
        
        for (let index = 0; index < 2500; index += 1) {
            const point = indexToPoint(index);
            
            value = 0
        
            if (index > 0)
                value = module.exports.hilbertValued[index - 1].color
            
            if (terr.get(point.x, point.y) === TERRAIN_MASK_WALL)
                value = 0
            else
            {
                value += 1
                //value = 255
                if (module.exports.hilbertMax < value)
                {
                    module.exports.hilbertMax = value
                }
            }
                
            module.exports.hilbertValued.push({ x : point.x, y : point.y, color : value})
        }
        
        for (let index = 2499; index >= 0; index -= 1) {
            const point = indexToPoint(index);
            
            value = 0
            
                if (index < 2499)
                    value = module.exports.hilbertValued[index + 1].color
                
                if (terr.get(point.x, point.y) === TERRAIN_MASK_WALL)
                    value = 0
                else
                {
                    value += 1
                    //value = 255
                    if (module.exports.hilbertMax < value)
                    {
                        module.exports.hilbertMax = value
                    }
                    if (module.exports.hilbertMin > value)
                    {
                        module.exports.hilbertMin = value
                    }
                }
                
            module.exports.hilbertValued[index].color = Math.min(value, module.exports.hilbertValued[index].color)
        }
        
        module.exports.hilbertMax /= 2
        
        for (entry in module.exports.hilbertValued)
        {
            col = Math.max(module.exports.hilbertMin, Math.min(module.exports.hilbertMax, module.exports.hilbertValued[entry].color))
            module.exports.hilbertValued[entry].color = colorUtil.getGradientColor([{r : 255, g : 0, b : 0}, {r : 0, g : 255, b : 0}], col, module.exports.hilbertMin, module.exports.hilbertMax)
        }
    }
};