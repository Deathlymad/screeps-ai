/*
 * building.*
 *      behavior for buildings
 * faction.*
 *      global behavior and wrapper
 * overlay.*
 *      overlay code and registration
 * role.*
 *      creep logic
 * room.*
 *      room internal logic
 * util.*
 *      functionality and miscellaneous
 * 
 * registers:
 *      overlay.registration.registerOverlay(function, name, description, registerCLI = true)
 *          calls function, passing a visual object to render the overlay to.
 *              name is the string by which it can be enabled in the console
 *              description description for CLI help
 *              registerCLI whether to register to the console wrapper
 *
 *      util.cli.addCall(function, name, description, ...args)
 *          registers function to be used as require("util.cli").<name>(...args)
 *              name is the string by which it can be enabled in the console
 *              description description for CLI help
 *              registerCLI whether to register to the console wrapper
 *
 */