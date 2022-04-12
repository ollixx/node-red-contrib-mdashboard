# mdashboard synchronizer
This module automatically tweaks the orginial node-red-dashboard to become the latest mdashboard version.

## usage
cd into the node-red-contrib-mdashboard directory

execute `node mui/mui.js`

commit and push

## changes
Here is the list of all changes, that are executed for a new version of the node-red-dashboard:

### package.json
- change project name to node-red-contrib-mdashboard
- change the repo url
- add a matching description
- exchange the list of commiters
- add some more keywords (haha!)

### README.md
- replace the orginial README in the root with mui.README.md

### ui.js
- uncomment the socketid handling so we make the dashboard multi client aware

## TODO
### session handling
It would be nice to maintain sessions for each client. The idea is to keep all sessions in some global store (the global context maybe?).

Any message coming out of a mdashboard node will have a msg._session property, that contains
- socketid
- sessionid (optional)
- remaining session time-to-live in ms (reset with every websocket message in either direction)
- any other properties set by the user

To update changes of the current session (user data only), a msg containing the msg._session property AND a msg.ui_control object with
a property "savesession": true has to be sent to any mdashboard node.
The new session will than replace the current one, hence the userdata is stored and will be delivered with every incoming ui message.

The session duration should be either set by another ui_control property or in the mui settings object.

Session handling has to be triggered on every node's in message and on every message coming from the (m)ui.

### build pipeline
Maybe it is possible to automate the whole synchronization process after each release of the node-red-dashboard.
We have to check, if git actions allow events in external projects to trigger a pipeline.
The rest is a matter of a decent pipeline and proper error handling.