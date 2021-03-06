
var hexMap = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]

function numberToHex(nbr)
{
    return hexMap[nbr >> 4] + hexMap[nbr & 15]
}

function toHexCode(color)
{
    if (!module.exports.isColor(color))
    {
        console.log("Invalid Color in toHexCode")
        console.log(Object.keys(color))
        console.log(Object.values(color))
        return "#000000"
    }
    
    return "#" + numberToHex(color.r) + numberToHex(color.g) + numberToHex(color.b)
    
}


module.exports = {
    isColor : function(obj)
    {
        if (!obj)
            return false
        if (!obj.hasOwnProperty("r"))
            return false
        if (!obj.hasOwnProperty("g"))
            return false
        if (!obj.hasOwnProperty("b"))
            return false
        
        return obj.r >= 0 && obj.r < 256 && obj.g >= 0 && obj.g < 256 && obj.b >= 0 && obj.b < 256
    },
    
    colorToHex : toHexCode,
    
    getGradientColor : function(colorArr = [{r : 255, g : 0, b : 0}, {r : 0, g : 255, b : 0}], val = 0, minVal = 0, maxVal = 255)
    {
        if (colorArr.length < 2)
            return toHexCode(colorArr[0])
        
        range = Math.abs(maxVal - minVal) + 1
        
        
        if (val > maxVal || val < minVal)
        {
            console.log(minVal)
            console.log(maxVal)
            console.log(val)
        }
        ratio = (colorArr.length - 1) / range
        
        minPos = Math.floor((val - minVal) * ratio)
        maxPos = Math.ceil((val - minVal) * ratio)
        minColor = colorArr[minPos]
        maxColor = colorArr[maxPos]
        
        //console.log(minPos)
        //console.log(maxPos)
        
        //minRatio = (normalizedVal - minPos) / (255 - (minPos * 255 / colorArr.length))
        minRatio = Math.abs((val - (minPos / ratio)) / range)
        
        maxRatio = 1 - minRatio
        
        
        color = {r : minColor.r * maxRatio + maxColor.r * minRatio, g : minColor.g * maxRatio + maxColor.g * minRatio, b : minColor.b * maxRatio + maxColor.b * minRatio}
        
        return toHexCode(color)
        
    }
};