// Color blindness simulation using SVG feColorMatrix filters
// Based on Vienot, Brettel, and Mollon (1999) color transformation matrices

export const COLOR_BLIND_SVG_FILTERS = `
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;">
  <defs>
    <filter id="protanopia-filter">
      <feColorMatrix type="matrix" values="
        0.567, 0.433, 0,     0, 0
        0.558, 0.442, 0,     0, 0
        0,     0.242, 0.758, 0, 0
        0,     0,     0,     1, 0
      "/>
    </filter>
    <filter id="deuteranopia-filter">
      <feColorMatrix type="matrix" values="
        0.625, 0.375, 0,   0, 0
        0.7,   0.3,   0,   0, 0
        0,     0.3,   0.7, 0, 0
        0,     0,     0,   1, 0
      "/>
    </filter>
  </defs>
</svg>`;
