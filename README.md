# Sogility at BC Commerce Center, Building A

Coming soon page and interactive 3D space plan for the proposed Sogility
training facility at 8255 Boynton Beach Blvd, Building A, Suites 650 + 600,
Boynton Beach, FL.

Prepared by Butters Construction and Development. Schematic only, not for construction.

## Files

    index.html    public coming soon page, cinematic camera behind the type
    plan.html     interactive space plan with the program rail and area schedule
    model.js      the 3D facility model, shared by both pages
    .nojekyll     tells GitHub Pages to serve the files as is
    README.md     this file

No build step. The only external dependencies are three.js (cdnjs) and
Google Fonts.

## Deploy to GitHub Pages

1. Upload index.html, plan.html, model.js, README.md and .nojekyll to the
   root of the main branch of Evanleeb/Sogility-Boynton
2. Settings, Pages, Source: Deploy from a branch, Branch: main, Folder: / (root)
3. The site publishes at https://evanleeb.github.io/Sogility-Boynton/

The GitHub web uploader skips dotfiles. To add .nojekyll use Add file,
Create new file, name it .nojekyll and put a single space in the body.

## Editing the plan

All geometry lives in model.js. Both pages read from it, so one edit
updates the landing page and the space plan together.

The two suite shells, verified against Arcadis AS1.01 vector geometry:

    var S650 = {x:0,    z:0, w:69.5, d:192.5};
    var S600 = {x:69.5, z:0, w:54,   d:135.7};

Every room is one row in the ZONES array. Coordinates are in feet, origin
at the northwest corner of Suite 650, x runs east, z runs south:

    {id:'tsz-a', name:'Technical Soccer Zone A', dim:'80 x 50', sf:4000,
     x:9.75, z:18.7, w:50, d:80, kind:'turf', col:'#5C9B47'}

Change x, z, w or d to move or resize a space. The floating label, the
program rail, the area schedule and the click to fly camera all read from
that one row.

    kind      turf, gym, tile, wood or carpet, sets the floor finish
    col       swatch color in the rail and the schedule
    CUT/FULL  cutaway and full wall heights in feet
    GRID_Z    column grid lines off the north wall

Useful helpers further down model.js, all taking feet:

    rollDoor(x, z, w, h, openFrac)   openFrac 0 closed, 1 fully up
    goal(x, z, w, depth, flip)       posts, crossbar and a real mesh net
    netting(x, z, w, d, h)           containment netting with posts
    welcomeDesk(x, z)                counter, return, logo wall, stools
    squatRack(x, z)                  uprights, safety arms, loaded bar
    person(x, z, color, bob)         figure at scale

## Known placeholders

- Clear height is set to 32 feet in model.js (the FULL constant). Confirm
  against the shell drawings and change it there.
- The coming soon page says "Now in design" rather than an opening date.
  Edit the .status line in index.html once a date is set.

## Open items before this becomes a lease exhibit

- Confirm clear height in Building A
- Plumbing fixture count for the four ADA restrooms against occupant load
- Confirm the outdoor futsal court does not conflict with truck
  circulation or required parking
- Confirm overhead door locations on the south walls

## Scrolling past the model

The space plan frames the model in a panel rather than filling the window,
so there is page either side of it to scroll on. The wheel only zooms the
model after you click into it, or if you hold ctrl or cmd. Press Esc, or
click anywhere outside the panel, to hand scrolling back to the page. On
touch, one finger scrolls the page and two fingers drive the model.

Expand blows the panel up to fill the window for presenting. The render
loop pauses whenever the panel is off screen or the tab is in the
background, so scrolling the rest of the page stays smooth.

## Page controls

Landing page: a Daylight / Match lights button switches the model between
dusk with the high bays lit and normal daylight.

Space plan: Expand fills the window, Full height toggles the walls between the 15 foot cutaway and
full clear height, Labels hides the floating callouts, People hides the
figures, Shell only strips every piece of fit out so the raw box shows,
and Match lights switches to the dusk render.

## If a page shows only "Loading"

model.js did not load. Both pages need it in the same folder. Confirm all
of index.html, plan.html and model.js are in the repo root, then hard
refresh. Both pages now fall through and render without the model rather
than hanging, so a stuck loading screen means an older copy is cached.
