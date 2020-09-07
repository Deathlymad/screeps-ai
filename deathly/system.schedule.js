cliUtil = require("util.cli")

var scheduler = (function() {
    
    schedule = []
    
    findPosRec = function(val, begin, end) {
    	range = end - begin;
    	if (schedule.length == 0)
    		return 0;
    	else if (range == 0)
    		return begin;
    	else
    	{
    		if (schedule[begin + (range >> 1)].nextInvocation > val.nextInvocation)
    			return findPosRec(val, begin, begin + (range >> 1));
    		else
    			return findPosRec(val, begin + (range >> 1) + (range & 1 ? 1 : 0), end);
    	}
    }
    
    findPos = function(val) {
        return findPosRec(val, 0, schedule.length)
    }
    
    insert = function(val) {
        schedule.splice(findPos(val), 0, val)
    }
    
    publicFuncs = {
        setup : function() {
            cliUtil.addCall(this.printSchedule, "printSchedule", "Prints the schedule.")
        },
        
    	registerOffsetCall : function(func, name, offset) {
    		this.registerCallEx(func, name, offset, 0)
    	},
    	
    	registerRecurrentCall : function(func, name, freq) {
    		this.registerCallEx(func, name, 0, freq)
    	},
    	
        registerCallEx : function(func, name, offset, freq)
        {
    		//Sanitization needed
            insert({name : name, func : func, frequency : freq, nextInvocation : Game.time + 1 + offset})
        },
        
        update : function()
        {
            while (Game.cpu.getUsed() + 1 < Game.cpu.tickLimit &&	//Check if we still have time in this tick
    				schedule.length > 0 && 							//check whether there might still be something to do
    				schedule[0].nextInvocation <= Game.time)		//check if its already time to do it
            {
                obj = schedule.shift()
    			obj.func()
    			if (obj.frequency > 0)
    			{
    				insert({name : obj.name, func : obj.func, frequency : obj.frequency, nextInvocation : Game.time + 1 + obj.frequency})
    			}
            }
            if (	schedule.length > 0 && 							//check whether there might still be something to do
    				schedule[0].nextInvocation <= Game.time)		//check if its already time to do it
            {
                console.log("WARNING: Debugger is having a noticable carryover. Debug budget needs to be increased or debug functions optimized.", 'background: #222; color: #ff0000')
                console.log("The Debug operation that used the most budget is ." + maxTime.name, 'background: #222; color: #ff0000')
            }
        },
        
        printSchedule : function() {
            console.log(JSON.stringify(schedule))
        }
    }
    
    return publicFuncs
})()


module.exports = scheduler