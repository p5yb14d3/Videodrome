''' 
VIDEODROME
http://github.com/p5yb14d3/videodrome

AUTHOR: p5yb14d3
Copyright (c) 2018, p5yb14d3
Released under MIT license.
http://github.com/p5yb14d3/videodrome/LICENSE
'''

import os, sys
import generate
import webbrowser

APP="Videodrome"
APP_PATH = os.path.dirname(os.path.realpath(__file__))

def main():
	if len(sys.argv) == 1:
		print "\nUSAGE:"
		print "------"
		print "videodrome generate <path of folder containing videos>"
	if len(sys.argv) > 1:
		if (sys.argv[1] == "generate"):
			if (len(sys.argv) > 2):
				if (sys.argv[2][0] == "~") :
					video_path = os.path.expanduser(sys.argv[2])
				elif sys.argv[2] != "":
					video_path = sys.argv[2]
				else:
					video_path = ""
			else:
				video_path = ""
				
			# CHECK IF IS PATH EXIST
			if video_path == "":
				print "Video directory is not stated."
			elif (os.path.isdir(video_path)):
				print "Processing videos from:", video_path
				generate.generateIndexPages(video_path, "", 0)
				webbrowser.open(video_path+"\index.html", new=2)
			else:
				print "Path does not exist."

if __name__ == "__main__":
	main()