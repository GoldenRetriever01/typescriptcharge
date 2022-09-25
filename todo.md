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

- [ ] use liveblocks auth to better restrict room access (at the moment, anyone can update the room via the one public key)
- [ ] room storage backup cron job

## medium priority

- [ ] dice rolls
- [ ] audit log: say who did what + dice rolls
- [ ] cheatsheet for roll mechanics and momentum usages

### improve administration

- [ ] admin dashboard, configure discord user IDs allowed to write
  - configure discord admin ID as an environment variable
- [ ] admin dashboard, configure discord user IDs allowed to read (or everyone)
- [ ] attach nicknames to discord user IDs ^
- [ ] public/private visibility on characters
- [ ] public/private visibility on clocks

## nice to have

- [ ] export data
- [ ] flavor: show logged in user at the top right, with a menu to log out
- [ ] import character from fari
- [ ] chat (like in Fari app with the message next to your cursor)
- [ ] rich text editor with markdown and shit
- [ ] fade other cursors if they are on a different page
