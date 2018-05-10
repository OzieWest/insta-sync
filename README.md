## Insta-Sync
Scripts collect info from Instagram.com and copy to Mongodb

#### Disclaimer
Please Note that this is a research project. I am by no means responsible for any usage of this tool. Use on your own behalf. I’m also not responsible if your accounts get banned due to extensive use of this tool.

#### Requirements
- Insta-Proxy
- Mongodb

#### Build
```bash
npm run build
```

#### Run
```bash
#!/bin/bash

export MONGO_DB="insta-sync"
export MONGO_URL="mongodb://localhost:27017"
export PROXY_HOST="http://localhost:3000"
export SESSION_ID=YOUR_SESSION_ID
export USER_ID=YOUR_USER_ID

npm start
```

#### What will I see? (after running script)
- followers profiles (id, username, fullName, pic)
- "following" activities (follow-unfollow for each user)
- "following" reports (basic changelog)
- *more coming...*

**Notes:** the script should be run on daily (hourly, etc) basis to get more detailed info about your profile