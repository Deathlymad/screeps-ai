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
    
    hilbert : {},
    hilbertValued : {},
    hilbertMax : {},
    hilbertMin : {},
    
    setup : function()
    {
        overlayManager.registerOverlay(this.displayHilbert, "displayHilbert", "Displays a Hilbert curve over the map grid.")
    },
    
    displayHilbert : function(visual)
    {
        //visual.poly(module.exports.hilbert)
        if (!module.exports.hilbertValued.hasOwnProperty(visual.roomName))
        {
            console.log("generating")
            module.exports.genHilbert(visual.roomName)
        }
        
        
        for (entry of module.exports.hilbertValued[visual.roomName])
        {
            visual.rect(entry.x - 0.5, entry.y - 0.5, 1, 1, {fill : entry.color, opacity : 0.4})
        }
    },
    
    genHilbert : function(room)
    {
        module.exports.hilbertMin[room] = 0
        module.exports.hilbertMax[room] = 0
        module.exports.hilbert[room] = []
        module.exports.hilbertValued[room] = []
        
        terr = Game.map.getRoomTerrain(room)
        const n = 2 ** 6;
        const curve = new Array(n * n);
        for (let index = 0; index < curve.length; index += 1) {
            const point = indexToPoint(index, 6);
            
            if (point.x - 7 < 0 && point.x - 7 > 49 && point.y - 7 < 0 && point.y - 7 > 49)
                continue
            
            module.exports.hilbert[room].push([Math.max(0, Math.min(point.x - 7, 49)), Math.max(0, Math.min(point.y - 7, 49))])
            prevVal = {value : 0}
            
            value = 0
            if (point.x - 7 >= 0 && point.x - 7 <= 49 && point.y - 7 > 0 && point.y - 7 < 49)
            {
                if (index > 0)
                    value = module.exports.hilbertValued[room][index - 1].value
                
                if (terr.get(point.x - 7, point.y - 7) === TERRAIN_MASK_WALL)
                    value = value/2
                else
                    value += 1
            }
            module.exports.hilbertValued[room].push({ x : point.x - 7, y : point.y - 7, value : value})
        }
        
        for (let index = curve.length - 1; index >= 0; index -= 1) {
            const point = indexToPoint(index, 6);
            
            value = 0
            if (point.x - 7 >= 0 && point.x - 7 <= 49 && point.y - 7 >= 0 && point.y - 7 <= 49)
            {
                if (index < curve.length - 1)
                    value = module.exports.hilbertValued[room][index + 1].value
                
                value += module.exports.hilbertValued[room][index].value 
                if (terr.get(point.x - 7, point.y - 7) === TERRAIN_MASK_WALL)
                    value = value/2
                else
                    value += 1
            }
            module.exports.hilbertValued[room][index].value = value
        }
        
        module.exports.hilbertValued[room] = module.exports.hilbertValued[room].filter((entry) => entry.value > 96)
        
        for (entry in module.exports.hilbertValued[room])
        {
            if (module.exports.hilbertMax[room] < module.exports.hilbertValued[room][entry].value)
                module.exports.hilbertMax[room] = module.exports.hilbertValued[room][entry].value
            if (module.exports.hilbertMin[room] > module.exports.hilbertValued[room][entry].value)
                module.exports.hilbertMin[room] = module.exports.hilbertValued[room][entry].value
        }
        
        color = colorUtil.colorToHex({r : Math.random() * 200 + 55, g : Math.random() * 200 + 55, b : Math.random() * 200 + 55})
        
        console.log(color)
        
        for (let index = 1; index < module.exports.hilbertValued[room].length; index += 1)
        {
            col = Math.max(module.exports.hilbertMin[room], Math.min(module.exports.hilbertMax[room], module.exports.hilbertValued[room][index].value))
            
            if (module.exports.hilbertValued[room][index].value > module.exports.hilbertValued[room][index - 1].value)
                color = colorUtil.colorToHex({r : Math.random() * 200 + 55, g : Math.random() * 200 + 55, b : Math.random() * 200 + 55})
            //module.exports.hilbertValued[index].color = colorUtil.getGradientColor([{r : 255, g : 0, b : 0}, {r : 0, g : 255, b : 0}], Math.min(128, col), module.exports.hilbertMin, module.exports.hilbertMax)
            module.exports.hilbertValued[room][index].color = color
        }
        
        
        
    }
};