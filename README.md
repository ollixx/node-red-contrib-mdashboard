# node-red-contrib-mdashboard

[![npm version](https://badge.fury.io/js/node-red-contrib-mdashboard.svg)](https://badge.fury.io/js/node-red-contrib-mdashboard)
## Note that this is a fork of the official node-red-dashboard
This is a fork which solves a very specific requirement- widget
state is emitted only to the socket origin that caused the change. For example, if two users have the same dashboard open
and one user types into a text input, the other user will not get the text update. This works well when a typical web form
like behavior is needed- multiple users can use the same dashboard url as a form to submit data back to the flow. This
version of the dashboard can be installed along with the original node-red-dashboard- the UI configuration for the two
dashboards are distinct and the settings appear in different tabs in the sidebar. Note that this changes the behavior of
the original node-red-dashboard - specifically, one user's changes could overwrite another's without them knowing about it.
In that sense, this dashboard is multi-user only for input- all dashboard users still share the same backend instance.

Most of the documentation is left as is from the original project as it is applicable to the current project as well.
## For Installation, Settings etc.
[original README](https://github.com/node-red/node-red-dashboard) 

## Multiple Users

This Dashboard fork supports multiple individual users- see note at top. If a widget state on a dashboard changes, the event is emitted only to the dashboard from which it originated.

Messages coming from the dashboard **do** have a `msg.socketid`, and updates like change of tab,
notifications, and audio alerts will be directed only to that session. Delete the `msg.sessionid` to send
to all sessions.
