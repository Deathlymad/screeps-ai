

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
            if (Game.creeps[creep].memory.task == type)
                cnt += 1
        }
        return cnt
    },
    
    getQueuedJobs : function(type)
    {
        cnt = 0
        for (creep in Memory.taskmaster.queue)
        {
            if (Memory.taskmaster.queue[creep].id == type)
                cnt += 1
        }
        return cnt
    }
    
};