# Sogility at BC Commerce Center, Building A

Interactive 3D space plan for the proposed Sogility training facility at
8255 Boynton Beach Blvd, Building A, Suites 650 + 600, Boynton Beach, FL.

Prepared by Butters Construction and Development. Schematic only, not for construction.

## What is in here

    index.html    the whole site, including the 3D model
    .nojekyll     tells GitHub Pages to serve the files as is
    README.md     this file

Everything is self contained. The only external dependencies are three.js
(loaded from cdnjs) and Google Fonts. No build step.

## Deploy to GitHub Pages

1. Create a repo, for example Evanleeb/Sogility-Building-A
2. Upload index.html, README.md and .nojekyll to the root of the main branch
3. Settings, Pages, Source: Deploy from a branch, Branch: main, Folder: / (root)
4. The site publishes at https://evanleeb.github.io/Sogility-Building-A/

## Editing the plan

All geometry lives in one place near the top of the script block in index.html.

The two suite shells:

    var S650 = {x:0, z:0, w:69.5, d:191};
    var S600 = {x:69.5, z:0, w:54, d:135.5};

Every room is one row in the ZONES array. Coordinates are in feet, origin at
the northwest corner of Suite 650, x runs east, z runs south:

    {id:'tsz-a', name:'Technical Soccer Zone A', dim:'80 x 50', sf:4000,
     x:10, z:18.75, w:50, d:80, kind:'turf', col:'#5C9B47'}

Change x, z, w or d to move or resize a space. The label, the right hand
program list, the area schedule table and the click to fly camera all read
from the same row, so one edit updates everything.

    kind    turf, gym, tile, wood or carpet, sets the floor finish
    col     the swatch color in the list and the schedule

CUT and FULL set the cutaway and full wall heights in feet.

## Open items before this becomes a lease exhibit

- Confirm clear height in Building A, currently shown at 32 feet
- Confirm interior column locations against the Arcadis shell drawings
- Plumbing fixture count for the four ADA restrooms against occupant load
- Confirm the outdoor futsal court location does not conflict with truck
  circulation or required parking
- Confirm overhead door locations on the south wall
