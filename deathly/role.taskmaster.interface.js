

module.exports = {
    addTask : function(taskObj)
    {
        Memory.taskmaster.queue.push(taskObj)
    }
    
};