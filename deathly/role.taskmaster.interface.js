

module.exports = {
    addTask : function(taskObj)
    {
        Memory.taskmaster.queue.push(taskObj)
    },
    
    getJobTypeCount : function(type)
    {
        cnt = 0
        for (creep in Game.creeps)
        {
            if (Game.creeps[creep].memory.type == type)
                cnt += 1
        }
        return cnt
    }
    
};