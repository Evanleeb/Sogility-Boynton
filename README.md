# Sogility at BC Commerce Center, Building A

Coming soon page and interactive 3D space plan for the proposed Sogility
training facility at 8255 Boynton Beach Blvd, Building A, Suites 650 + 600,
Boynton Beach, FL.

Prepared by Butters Construction and Development. Schematic only, not for
construction.

## Files

    index.html    coming soon page, cinematic camera behind the type
    plan.html     interactive space plan, program rail and area schedule
    model.js      the 3D facility model, shared by both pages
    robots.txt    keeps the site out of search results
    .nojekyll     tells GitHub Pages to serve the files as is
    README.md     this file

Upload all of those to the repo root. No build step. The only external
dependencies are three.js (cdnjs) and Google Fonts.

The optional-encryption folder is not part of the site. It holds a local
tool that can password protect the pages if that is ever wanted. Do not
upload it.

## Deploy

1. Upload the files above to the root of the main branch
2. Settings, Pages, Source: Deploy from a branch, Branch: main, Folder: / (root)
3. Publishes at https://evanleeb.github.io/Sogility-Boynton/

The GitHub web uploader skips dotfiles. To add .nojekyll use Add file,
Create new file, name it .nojekyll and put a single space in the body.

## Taking it back down

Both pages carry a noindex meta tag and robots.txt disallows everything, so
search engines should stay off it while it is live. That is best effort, not
a guarantee.

When you are done showing it:

- On GitHub Free, switching the repository to private automatically
  unpublishes the Pages site. One step, done.
- On GitHub Pro, switching the repository to private does NOT take the site
  down. A Pages site stays public even when its source repo is private. Go
  to Settings, Pages and set Source to None first, then change the repo
  visibility. Check the URL in a private browser window to confirm.
- Deleting the repository outright takes down the site and the commit
  history with it.

Two things taking it down does not do. It does not retract anything already
seen or saved by whoever had the link, and while the repository stays public
the plan is readable in the commit history even after Pages is switched off.
Making the repo private closes that second one.

## Changing the plan

All the geometry lives in model.js. Both pages read from it, so one edit
updates the landing page and the space plan together.

The two suite shells, verified against Arcadis AS1.01 vector geometry:

    var S650 = {x:0,    z:0, w:69.5, d:192.5};
    var S600 = {x:69.5, z:0, w:54,   d:135.7};

Every room is one row in the ZONES array. Coordinates in feet, origin at the
northwest corner of Suite 650, x runs east, z runs south:

    {id:'tsz-a', name:'Technical Soccer Zone A', dim:'80 x 50', sf:4000,
     x:9.75, z:18.7, w:50, d:80, kind:'turf', col:'#5C9B47'}

Change x, z, w or d to move or resize a space. The floating label, the
program rail, the area schedule and the click to fly camera all read from
that one row.

    kind      turf, gym, tile, wood or carpet, sets the floor finish
    col       swatch color in the rail and the schedule
    CUT/FULL  cutaway and full wall heights in feet
    GRID_Z    column grid lines off the north wall

Helpers further down model.js, all taking feet:

    rollDoor(x, z, w, h, openFrac)   openFrac 0 closed, 1 fully up
    goal(x, z, w, depth, flip)       posts, crossbar and a real mesh net
    netting(x, z, w, d, h)           containment netting with posts
    welcomeDesk(x, z)                counter, return, logo wall, stools
    squatRack(x, z)                  uprights, safety arms, loaded bar
    person(x, z, color, bob)         figure at scale

## Scrolling past the model

The space plan frames the model in a panel rather than filling the window,
so there is page either side of it to scroll on. The wheel only zooms the
model after you click into it, or if you hold ctrl or cmd. Press Esc, or
click outside the panel, to hand scrolling back to the page. On touch, one
finger scrolls and two fingers drive the model. Expand fills the window for
presenting. The render loop pauses when the panel is off screen.

## The landing page

The call to action is a ball in front of a goal, sized as a hero element. On
screens wider than 900px it sits opposite the headline on the right, roughly
300 to 660px across depending on the window, with a soft radial behind it so
it reads against the model. Below 900px it drops inline under the stats. A
volt ring pulses off the ball every few seconds so the eye finds it before
anyone reads the label.

Click or tap it, it curls into the net, the net bulges, the label flips to
Goal and the page moves to plan.html. Roughly a second end to end. It is a
button shaped like a ball, not a game, so it cannot be missed or failed.

On a phone: tap fires it the same way a click does. The SVG transforms use
transform-box:fill-box so the ball rotates about its own centre in WebKit as
well as Chrome, the hover wind up is gated behind @media (hover:hover) so an
iOS tap goes straight to the kick instead of spending itself on a hover
state, and touch-action:manipulation removes the double tap delay. With iOS
Reduce Motion switched on the ball is a plain link and navigates instantly.
The landing page scrolls on narrow screens rather than clipping, since the
larger graphic can push the marquee past the fold on a small handset.

Size is set by the .pitch rule. The goal column and the headline column are
tuned not to collide: .pitch is clamp(300px,30vw,660px) against a .mid
capped at min(48%,620px), which leaves at least 80px of gap from 901px wide
all the way up. Change one and check the other.

Underneath it there is a plain "or open the space plan" link for anyone who
does not want the theatrics, and the whole animation is skipped for anyone
with reduced motion turned on, in which case the ball is an ordinary link.
plan.html is prefetched as soon as the pointer touches the ball, so the
transition is not followed by a load.

Timing lives in the click handler in index.html, in milliseconds:

    fired    0     ball leaves
    done     560   net reacts, label flips
    settle   760   net returns
    nav      1080  page changes

The flight path is the @keyframes flight rule. It is expressed as offsets
from the ball's start point, so if you move the ball or the goal in the SVG
you have to move the keyframes with it.

## Phone header and Safari's toolbars

The site header holds the wordmark on the left and the address on the right.
On a phone the address wrapped to three lines and ran back into the wordmark
and over the top of the model, so on narrow screens the header stacks
instead, the address drops to one short line and the hero padding was raised
to clear it.

Safari's bottom toolbar floats over the page. The content column, the
walkthrough control strip and the marquee all carry
env(safe-area-inset-bottom) padding so nothing ends up underneath it. Anchor
jumps use scroll-padding-top so the area schedule does not land behind the
fixed header.

## On a phone

The space plan detects a narrow screen and changes shape. The control row
becomes a single strip you swipe sideways instead of twelve buttons wrapping
over each other, the hero text is dropped, labels are limited to the larger
spaces so they stop stacking on top of each other, and the model renders at
1x instead of 2x so it stays smooth.

Instead of "Click to explore" the panel offers Start walkthrough. That fills
the screen, asks the browser for full screen, and tries to lock to landscape.
Chrome on Android does both. iOS Safari allows neither on a plain element, so
the page falls back to a full screen overlay and shows a turn your phone
prompt until the device is sideways. Either way the result is the same, a
full width view of a 192 foot deep space.

Inside the walkthrough one finger orbits, since the page is locked and has
nothing to scroll. Two fingers pinch to zoom. Done, Esc, or leaving full
screen exits and hands scrolling back.

Outside the walkthrough the old rule still holds: one finger scrolls the
page, two fingers drive the model.

## Page controls

Landing page: Daylight switches the model between dusk with the high bays
lit and normal daylight.

Space plan: Expand fills the window, Full height toggles the walls between
the 15 foot cutaway and full clear height, Labels hides the callouts, People
hides the figures, Shell only strips the fit out to show the raw box, Match
lights switches to the dusk render.

## Open items before this becomes a lease exhibit

- Confirm clear height in Building A, currently a 32 foot placeholder set by
  the FULL constant in model.js
- Plumbing fixture count for the four ADA restrooms against occupant load
- Confirm the outdoor futsal court does not conflict with truck circulation
  or required parking
- Confirm overhead door locations on the south walls
