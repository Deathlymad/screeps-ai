function help()
{
        str = "CLI Help\nTo use the CLI interface type cli.*function name*\n"
        
        for (entry in Memory.cli.helpText)
        {
            str += " >  " + entry + " - " + Memory.cli.helpText[entry] + "\n"
        }
        console.log(str)    
}

module.exports = {
    setup : function()
    {
        Memory.cli = {}
        Memory.cli.helpText = {}
        
        console.log("To setup the CLI system please enter \'cli = require(\"util.cli\")\'")
        
        module.exports.addCall(help, "help", "Displays the current help text.")
    },
    
    addCall : function(func, name, help, ...args)
    {
        Memory.cli.helpText[name] = help
        module.exports[name] = func.bind(null, ...args)
    }
};