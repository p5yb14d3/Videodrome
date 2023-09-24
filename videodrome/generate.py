''' 
VIDEODROME
http://github.com/p5yb14d3/videodrome

AUTHOR: p5yb14d3
Copyright (c) 2018, p5yb14d3
Released under MIT license.
http://github.com/p5yb14d3/videodrome/LICENSE
'''

import os
import shutil
import jinja2

APP_PATH = os.path.dirname(os.path.realpath(__file__))
supported_videos = ['mp4', 'mkv', 'avi']
		
def genCurrentDataFolderNumber(directory):
	filenames = os.listdir(directory)
	filenumber_highest = -1
	
	# REMOVE ALL DATA FOLDERS
	for filename in filenames:
		filepath = directory+"/"+filename
		if os.path.isdir(filepath) and filename.startswith("_data"):
			shutil.rmtree(filepath, ignore_errors=True)
	
	# IF THERE IS ANY REMAINING DATAFOLDERS, WE USE THAT NUMBER FOR NAMING OUR NEXT FOLDER
	for filename in filenames:
		if os.path.isdir(directory+"/"+filename) and filename.startswith("_data"):
			filenumber = int(filename[5:])
			if (filenumber > filenumber_highest):
				filenumber_highest = filenumber
			filename_path = directory+"/"+filename
	filenumber_current = filenumber_highest + 1
	# if (filenumber_current) > 9999): filenumber_current = 0
	return str(filenumber_current).zfill(4) 

def generateIndexPages(directory, data_folder, level):
	print directory
	
	# COPY THEMES DIRECTORY TO VIDEOS ROOT FOLDER
	if level == 0: # MAKE SURE TO DO THIS TO ROOT FOLDER ONLY 
		src = os.path.join(APP_PATH, "themes")
		data_folder = "_data"+genCurrentDataFolderNumber(directory)
		dest = os.path.join(directory, data_folder+"/themes")
		shutil.copytree(src,dest)

	vars = {}
	items = []
	
	directory_basename = os.path.basename(directory)
	filenames = os.listdir(directory)

	item_count = 0
	for filename in filenames:
		item = {}
		title, file_extension = os.path.splitext(filename)
		file_extension = file_extension.replace(".", "")
		# print "path:", os.path.join(directory,title)
		# print "....filename:", filename, file_extension
		item["path"] = os.path.join(directory,filename)
		item["title"] = title
		item["filename"] = filename
		item_thumbnail_path = directory+"/_thumbnails/"+title+".jpg"
		
		if os.path.isfile(item_thumbnail_path):
			item["thumbnail_path"] = "./_thumbnails/"+title+".jpg"
		else:
			item["thumbnail_path"] = ""
		
		item_poster_path = directory+"/"+directory_basename+".jpg"
		if os.path.isfile(item_poster_path):
			item["poster_path"] = "./"+directory_basename+".jpg"
		else:
			item["poster_path"] = ""
			
		if file_extension in supported_videos:
			item["type"] = "video"
			item["extension"] = file_extension
			item_count += 1
			item["count"] = item_count
		elif os.path.isdir(item["path"]):
			item["type"] = "directory"
			directory_thumbnail_path = directory+"/"+title+"/"+title+".jpg"
			if os.path.isfile(directory_thumbnail_path):
				item["directory_thumbnail_path"] = "./"+title+"/"+title+".jpg"
			else:
				item["directory_thumbnail_path"] = ""
		else:
			item["type"] = "etc"
		# print "type:", item["type"], item["path"]
		if (item["type"] == "directory"):
			if (checkIfDirectoryHasVideo(item["path"]) == True): 
				# print ">>>>>>>>>>>> directory:", title, "has video"
				items.append(item)
				generateIndexPages(item["path"], data_folder, level+1)
			else:
				pass
				# print ">>>>>>>>>>>> directory:", title, "has no video"
		elif item["type"] == "video":
			items.append(item)

	vars["data_folder"] = data_folder
	vars["path_relative"] = '../' * level
	vars["items"] = items
	vars["items_count"] = len(items)
	vars["title"] = directory_basename

	# RENDER INDEX PAGE
	templateLoader = jinja2.FileSystemLoader(searchpath = APP_PATH+"/themes/default/templates/")
	templateEnv = jinja2.Environment(loader=templateLoader)
	
	template = templateEnv.get_template("index.html")
	output = template.render(vars)
	
	f = open(os.path.join(directory, "index.html"), "w")
	f.write(output.encode("utf-8"))
	f.close()

	# RENDER VIDEO PLAYER PAGE
	templateLoader = jinja2.FileSystemLoader(searchpath = APP_PATH+"/themes/default/templates/")
	templateEnv = jinja2.Environment(loader=templateLoader)
	
	template = templateEnv.get_template("videoplayer.html")
	output = template.render(vars)
	
	f = open(os.path.join(directory, "videoplayer.html"), "w")
	f.write(output.encode("utf-8"))
	f.close()
	
def checkIfDirectoryHasVideo(directory):
	items = os.listdir(directory)
	has_video = False
	for item in items:
		item_path = os.path.join(directory, item)
		filename, file_extension = os.path.splitext(item)
		file_extension = file_extension.replace(".", "")
		# print "....", filename, file_extension
		if file_extension in supported_videos:
			has_video = True
			break
		elif os.path.isdir(item_path):
			if (checkIfDirectoryHasVideo(item_path) == True): 
				has_video = True
				break
	
	return has_video
