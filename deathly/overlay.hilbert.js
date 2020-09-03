var overlayManager = require("overlay.registration")
var colorUtil = require("util.color")

/*
 * registerOverlay : function(func, name, desc, addCLI = true)
 */

function indexToPoint(index, order) {
    const n = 2 ** order;
    const point = { x: 0, y: 0 };
    let rx, ry, s;
    for (let s = 1, t = index; s < n; s *= 2) {
        rx = 1 & (t / 2);
        ry = 1 & (t ^ rx);
        rotate(point, rx, ry, s);
        point.x += s * rx;
        point.y += s * ry;
        t /= 4;
    }
    return point;
}

function pointToIndex(point, order) {
    const n = 2 ** order;
    let rx,
    ry,
    index = 0;
    for (let s = n / 2; s > 0; s = Math.floor(s / 2)) {
        rx = (point.x & s) > 0 ? 1 : 0;
        ry = (point.y & s) > 0 ? 1 : 0;
        index += s * s * ((3 * rx) ^ ry);
        rotate(point, rx, ry, n);
    }
    return index;
}

function rotate(point, rx, ry, n) {
  if (ry !== 0) {
    return;
  }
  if (rx === 1) {
    point.x = n - 1 - point.x;
    point.y = n - 1 - point.y;
  }
  [point.x, point.y] = [point.y, point.x];
}

//function genHilbert(posX, posY, rotState, lebel)

module.exports = {
    
    hilbert : [],
    hilbertValued : [],
    hilbertMax : 0,
    hilbertMin : 0,
    
    setup : function()
    {
        overlayManager.registerOverlay(this.displayHilbert, "displayHilbert", "Displays a Hilbert curve over the map grid.")
        this.genHilbert()
    },
    
    displayHilbert : function(visual)
    {
        visual.poly(module.exports.hilbert)
        for (entry of module.exports.hilbertValued)
        {
            visual.rect(entry.x - 0.5, entry.y - 0.5, 1, 1, {fill : entry.color, opacity : 0.1})
        }
    },
    
    genHilbert : function()
    {
        module.exports.hilbertMin = 0
        module.exports.hilbertMax = 0
        
        terr = Game.map.getRoomTerrain("W8N4")
        const n = 2 ** 6;
        const curve = new Array(n * n);
        for (let index = 0; index < curve.length; index += 1) {
            const point = indexToPoint(index, 6);
            module.exports.hilbert.push([Math.max(0, Math.min(point.x - 7, 49)), Math.max(0, Math.min(point.y - 7, 49))])
            prevVal = {color : 0}
            
            value = 0
            if (point.x - 7 >= 0 && point.x - 7 <= 49 && point.y - 7 > 0 && point.y - 7 < 49)
            {
                if (index > 0)
                    value = module.exports.hilbertValued[index - 1].color
                
                if (terr.get(point.x - 7, point.y - 7) === TERRAIN_MASK_WALL)
                    value = 0
                else
                {
                    value += 1
                    //value = 255
                }
            }
            module.exports.hilbertValued.push({ x : point.x - 7, y : point.y - 7, color : value})
        }
        
        for (let index = curve.length - 1; index >= 0; index -= 1) {
            const point = indexToPoint(index, 6);
            
            value = 0
            if (point.x - 7 >= 0 && point.x - 7 <= 49 && point.y - 7 >= 0 && point.y - 7 <= 49)
            {
                if (index < curve.length - 1)
                    value = module.exports.hilbertValued[index + 1].color
                
                value += module.exports.hilbertValued[index].color 
                if (terr.get(point.x - 7, point.y - 7) === TERRAIN_MASK_WALL)
                    value = 0
                else
                {
                    value += 1
                    //value = 255
                }
            }
            module.exports.hilbertValued[index].color = Math.min(128, value)
        }
        
        module.exports.hilbertMax = 128
        
        top20 = Math.floor(module.exports.hilbertValued.length * 0.18)
        module.exports.hilbertValued = module.exports.hilbertValued.sort((a, b) => a.color > b.color ? -1 : 1)
        module.exports.hilbertValued = module.exports.hilbertValued.slice(0, top20)
        
        
        for (entry in module.exports.hilbertValued)
        {
            if (module.exports.hilbertMax < module.exports.hilbertValued[entry].color)
            {
                module.exports.hilbertMax = module.exports.hilbertValued[entry].color
            }
            if (module.exports.hilbertMin > module.exports.hilbertValued[entry].color)
            {
                module.exports.hilbertMin = module.exports.hilbertValued[entry].color
            }
        }
        
        for (entry in module.exports.hilbertValued)
        {
            col = Math.max(module.exports.hilbertMin, Math.min(module.exports.hilbertMax, module.exports.hilbertValued[entry].color))
            module.exports.hilbertValued[entry].color = colorUtil.getGradientColor([{r : 255, g : 0, b : 0}, {r : 0, g : 255, b : 0}], col, module.exports.hilbertMin, module.exports.hilbertMax)
        }
        
        
        
    }
};