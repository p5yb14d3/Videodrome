import setuptools

with open("LICENSE", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="videodrome",
    version="0.2.4",
    author="p5yb14d3",
    author_email="p5yb14d3@gmail.com",
    description="Static Media Center Generator in Python with HTML5 UI",
	
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/p5yb14d3/videodrome",
	license="MIT",
	platform="All",
	
    packages=setuptools.find_packages(),
	include_package_data = True,
	
	install_requires=[
		"jinja2 == 2.10",
    ],
	
	entry_points={
		'console_scripts': [
			'videodrome = videodrome.__main__:main'
		]
	},
	
    classifiers=(
        "Programming Language :: Python :: 2.7",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ),
)