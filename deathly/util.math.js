
module.exports = {
    
    distanceToPoint : function(point, other) {
        return Math.sqrt(Math.pow(point.x - other.x, 2) + Math.pow(point.y - other.y, 2)) 
    }
};