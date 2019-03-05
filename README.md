# HDPK (HPCC Data Package(s)): A Visual Studio Extension
	ECL is a fantastic language for data programming. One of the key aspects of HPCC and ECL is the flexibility to work with data without defining a schema. 
	To accomplish this ECL provides the capability of defining the data structures within code. While this provides flexibility, 
	it can become quite complex when the projects grow in size. HDPK addresses this by provides the capability to define your data structures statically. 
	Use the VSCode HDPK plugin to auto translate a HDPK definition to ECL.

## Features:
	This extension adds following support to VS Code, using ECL
	1) ECL code generation
		Generate ECL files with data Modules consisting following EXPORTs
			data related RECORDS/Layouts, 
			DATASETs, 
			Datasets with field transformations (to name few TRIM, TRIMALL, UPPERCASE, Custom function or function macros, etc...)
			File related RECORDS/Layouts 
			Metadata DATASETs
	2) Embedded ECL code generation: Important code snippets to help with above data files
		Extras.ecl is the file generated with embedded ecl code exports
			for E.g.: 
			Sales mode vs orders query: EXPORT sales_mode_vs_orders := TABLE(Sales.CleanDataset, {Ship_Mode, UNSIGNED INTEGER4 Sum_Order_Quantity := SUM(GROUP, Order_Quantity)}, Ship_Mode, FEW);
			Custom transaformation:	EXPORT CleanBusinessName := hdpk.CleanBusinessName('name');
	3) Visualizer ECL code geration: To create visualizations/charts on the data
		Charts.ECL is the file generated with all the charts
			An example:	Visualizer.TwoD.Pie('sales_mode_vs_orders_chart', /*datasource*/, 'sales_mode_vs_orders', , ,  ); 
			Generates a two dimentional Pie chart showing Sales Mode vs Orders
	
## Usage:
	The package can be used with any IDE, which supports ECL language. VS Code supports ECL if the ECL extension is installed or it can be used using ECL IDE. Assuming the HPCC cluster is configured.

	Note: Any file with hdpk extention (*.hdpk) is the definiation file (input file) to create the necessary package. The packageName property in this file defines the package folder name to create, and its created when this file is saved.
	1) Copy the created package folder to your ECL workspace
	2) Open the ECL workspace. It should show the copied folder.
	3) Create any Builder window or any ecl file to import the package and use exports within it.
	4) Compile the code, there should not be any error.
	5) Submit the code and observe the above features in results.
	Note: PesronsFile.ecl is a Persons sampleData, inbuilt for an example. When BWR_Samples.ecl is submitted the file is written into ~hdpk:persons 
	6) To see the Visualizer open charts.ecl of package and submit. View the results on ECL Watch, Workunits Resource tab.
	Note: One of the example is on hpccSystems, HDPK git. Peek at example folder and examine the construction of example.hdpk. Also the sample data and examples.
## Installation:
	Install Visual Studio Code.
	In VS-Code open the command palette (cmd-shift-p) and select Install Extension. Enter 'hdpk' to filter the available extensions and choose "hdpk: HPCC data dictionary".
	Locate and install the appropriate ECL Client Tools from hpccsystem.com
	To install Visualizer follow the instruction at hpccsystems.com: 
	https://hpccsystems.com/blog/visualizing-ecl-and-sharing-your-results-hpcc-systems-visualizer

## VS-Code Settings
	None

## Launch Settings
	Submitting or debugging HDPK using VS-Code requires *.hdpk file as noted above. When Saved (ctrl + S) triggers the extension to generate the package with the name configure in the file.
	A sample is attached in the HDPK GIT. 

## Building and Debugging the Extension
	You can set up a development environment for debugging the extension during extension development.
	First, make sure you do not have the extension installed in ~/.vscode/extensions. Then clone the repo somewhere else on your machine, run npm install and open a development instance of Code.
	cd ~
	git clone https://github.com/hpcc-systems/HDPK.git
	cd HDPK
	npm install
	code .
	You can now go to the Debug viewlet and select Launch Extension then hit run (F5).
	In the [Extension Development Host] instance, open your HDPK folder.
	You can now hit breakpoints and step through the extension.
	If you make edits and save *.hdpk, it will re-executes the code. The debugging instance will automatically reattach.

## License
	Apache-2.0
	
## Known Issues
The package is not compiled to check ECL syntaxes. Need to call ECLCC to check the syntax before creating the package.
Clear the package package folder before successive run of the extension. E.g. If a data file is renamed in *.hdpk the file resides in it. But, new file is still created.
Minimum error handling. Need a better way to log.
Default transformations are now hardcoded, currently supports, TRIM, TRIMALL, TRIMRIGHT, TRIMBOTH, UPPERCASE, LOWERCASE and custom, defined in ECL section.

## Release Notes
### 1.0.0
Initial release with all the code
