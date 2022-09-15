# Paint Application

The above application is web based drawing tool made with JavaScript (vue.js) which contain following features

  - Pencil
  - Line
  - Circle
  - Rectangle
  - Eraser
  - Text
  - Image

The above paint application is for testing save and restore feature with API.
# Following all the features are valid inside iFrame only

## Observation
- If any drawing is available on page and save button is clicked then drawing will be saved to the API.
- After saving drawing, any change is made and waypoint is switched then returning to the same waypoint, the page will ask if saved drawing is required or the last state is required where changes were not saved.
- On clicking close button the API will clear all the saved diagram and page will be rendered as initial rendering.