# Pixeli

**A coloring pixels game**

## Todo:

- chose create a pixel art or draw a already created pixel art
- create a pixel art

  - Should give you a blank canvas with specified width and height, user draws and clicks save with the help of a big color palette (picker)
  - after that the pixel art gets saved and gets a mapping. Each unique color gets a color key, it will appear on the pixel art list (see next step)

- draw already created pixel art
  - chose one in the list
  - user sees the pixel art but only numbers (white rects outlined in black with a black number)
  - he has a drawing panel with all colors that are used in the pixelart
  - each color in the palette is numbered with the corresponding color key
  - if he draws with color of 2 over a rect with number of 1 => the rect gets this color but the number doesn't dissapear
  - if he draws with color of 2 over a rect with number of 2 => the rect gets this color and the number is gone, thus its now correctly painted
  - if he draws over a rect thats already correct with an uncorrect color it the number of the correct color is back (this is an optinal feature)
  - if the pixel art is complete show him the picture in full screen and play a little animation (future feature: show him your drawing progress fast forwarded)
  - User can zoom in with mousewheel and zoom out
  - User can pan the view while holding space bar + drag mouse
