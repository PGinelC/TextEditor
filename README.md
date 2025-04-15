# TextEditor
does the basic stuff for now.

## Requirements

### Must Have
- [x] Opens files as an app
- [x] edit and save files
- [x] create new empty file
- [x] ctrl Z
- [x] save as
- Implement a "Save As" option in your menu bar with keyboard shortcut (Ctrl+Shift+S)
- Use Electron's `dialog.showSaveDialog()` to prompt the user for a new file location
- Use `fs.writeFile()` to save the content to the new location
- Update your current file path variable to the new path
- [x] ctrl s
- electron has an accelerator feature but you can listen to keyboard shortcuts manually too
- [ ] show col and line you are in
- Create a status bar at the bottom of your editor
- Add an event listener for cursor movement in your text area/editor component
- Calculate line and column numbers from cursor position
- Update the status bar whenever the cursor moves
- [ ] output to pdf
	- [ ] change font size
	- [ ] change margin size
	- [ ] change text color
	- `html-pdf` or `pdfkit`
	- dialog.showSaveDialog()
	- font and margin size you can edit in the save dialog

- [ ] renders mark down as mark down but you can still edit (maybe a preview mode?)
- Implement a toggle button to switch between edit and preview modes
- In edit mode, show the raw markdown
- In preview mode, render the markdown as HTML using a library like `marked` or `showdown`
### Could Have
- [ ] You can insert text boxes you can move -> how do you save this for later editing?
- Create a custom component for text boxes that can be dragged around
- Store text box positions and content in a JSON structure
- Save this metadata alongside your main text content (possibly in a separate file or as a header comment)
- On file load, restore these text boxes with their positions
- [ ] draw lines & arrows
- Implement a drawing layer above your text editor
- Use HTML Canvas or SVG for the drawing functionality
- Store vector information for these drawings
- Save drawing data in a similar way to the text boxes
- [ ] import images
- Add a file picker dialog for images
- Use `fs.readFile()` to load the image data
- Either embed images as base64 in your document or store references to local files
- Render images inline with the text or in a separate layer
- [ ] check saving before exit
- add event listener at close() and use dialog.showMessageBox()
### Would Have
- [ ] Make any drawing
- Expand your drawing layer to support free-form drawing
- Implement different brush types and colors
- Store drawing data as vector paths or raster data
- Consider using a library like Paper.js or Fabric.js
- [ ] change editor themes
- Create a theming system with CSS variables for colors, fonts, etc.
- Implement theme switching functionality
- Include several built-in themes (light, dark, etc.)
- Store user theme preference in app settings