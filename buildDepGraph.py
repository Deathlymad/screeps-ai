import re
from PythonLibs.graph import Graph, GraphIO
import os
import os.path
import argparse


parser = argparse.ArgumentParser(description = "examines code files and builds an inclusion graph.")

parser.add_argument("-r", "--recursive", help = "Should files should be examined recursive", action="store_true", default=True)

parser.add_argument("-e", "--escape", metavar="escape", help = "escape characters of inclusion that need to be culled", type=str, action="append", required=True)
parser.add_argument("-s", "--suffix", metavar="suffix", help = "Code file suffix", type=str, required = False, default=".js")
parser.add_argument("-i", "--include", metavar="include", help = "Inclusion predicate (optional)", type=str, required = False, default="require(*)")
parser.add_argument("-d", "--directory", metavar="directory", help = "Code directory thats supposed to be examined (optional)", required = False, type=str, default="deathly")

args = parser.parse_args()

codeFiles = [f for f in os.listdir(args.directory) if os.path.isfile(os.path.join(args.directory, f)) and f.endswith(args.suffix)]

edges = []

g = Graph.Graph()

idMap = {}

if (args.include.count("*") != 1):
	raise ArgumentError("A provided inclusion predicate needs exactly one \"*\" where the file name is expected")

posArg = args.include.index("*")

matcher = re.compile(args.include[:posArg].replace("(", "\(").replace(")", "\)") + "(.*)" + args.include[posArg + 1:].replace("(", "\(").replace(")", "\)"))

for f in codeFiles:
	
	idMap[f] = g.append(f)
	
	with open(os.path.join(args.directory, f), "rt") as file:
		txt = file.read()
		
		for include in matcher.finditer(txt):
			str = include.group(1)
			
			if ")" in str:
				continue
			
			for entry in args.escape:
				str = str.replace(entry, "")
			
			edges.append((f, str.replace("\"", "")))

for (_from, _to) in edges:
	g.addConnection(idMap[_from], idMap[_to + ".js"])
	
GraphIO.writeGraphToFile(g, "depGraph")