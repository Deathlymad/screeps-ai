/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.taskmaster.task');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
     TaskType : {
        MINING : 1,
        BUILDING : 2,
        REPAIRING : 3,
        UPGRADING : 4,
        TRANSPORTING : 5,
        IDLE : 6
    }
};