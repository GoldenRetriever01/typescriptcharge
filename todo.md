## mvp

- [x] editable world title
- [x] editable world description
- [x] clocks
- [x] character list
  - [x] name
  - [x] group
  - [x] concept
  - [x] appearance
  - [x] ties
  - [x] momentum
  - [x] condition / stress clock
  - [x] actions
  - [x] talents
- [x] require discord login
- [x] configurable discord user list

- [x] cursor presence

## high priority

- [x] use liveblocks auth to better restrict room access (at the moment, anyone can update the room via the one public key)
- [x] room storage backup cron job

## medium priority

- dice rolls
  - button which opens a popover for rolling dice
    - [ ] buttons per kind of dice, click to add one to the pool
    - [ ] x button to clear dice
    - [ ] optional description for what's being rolled
    - [ ] roll button posts to server, pending indicator while in flight
  - dice logs
    - [x] all dice results
    - [x] normalized dice string (e.g. 2d6+1d8+3)
    - [x] dice total
    - [x] dice min
    - [x] dice max
    - [ ] rolled by
    - [x] scrollable
    - [x] stay scrolled at bottom
    - [x] subscribe to realtime dice logs
    - [x] toggle panel visibility
    - [x] animation
- [ ] cheatsheet for roll mechanics and momentum usages
- [ ] error pages

### improve administration

- [ ] admin dashboard, configure discord user IDs allowed to write
  - configure discord admin ID as an environment variable
- [ ] admin dashboard, configure discord user IDs allowed to read (or everyone)
- [ ] attach nicknames to discord user IDs ^
- [ ] public/private visibility on characters
- [ ] public/private visibility on clocks

## UI polish

- [ ] proper tooltips on icon buttons

## nice to have

- [ ] export data
- [ ] flavor: show logged in user at the top right, with a menu to log out
- [ ] import character from fari
- [ ] chat (like in Fari app with the message next to your cursor)
- [ ] rich text editor with markdown and shit
- [x] fade other cursors if they are on a different page
- [ ] DnD to reorder clocks
