# CF App

Stacks:
- React
- Redux
- GraphQL


# Node Modules

  "dependencies": {
    "axios": "^0.17.0",
    "body-parser": "^1.18.2",
    "express": "^4.15.4",
    "express-graphql": "^0.6.11",
    "extract-text-webpack-plugin": "^3.0.2",
    "graphql": "^0.11.7",
    "history": "^4.7.2",
    "mysql": "^2.15.0",
    "node-sass": "^4.7.1",
    "nodemon": "^1.12.1",
    "promise-mysql": "^3.1.3",
    "react": "^15.6.1",
    "react-dom": "^15.6.1",
    "react-redux": "^5.0.6",
    "react-router": "^4.2.0",
    "react-router-dom": "^4.2.2",
    "redux": "^3.7.2",
    "redux-logger": "^3.0.6",
    "redux-promise-middleware": "^4.4.1",
    "redux-thunk": "^2.2.0",
    "sass-loader": "^6.0.6",
    "webpack": "^3.4.1",
    "webpack-dev-server": "^2.6.1"
  },
  "devDependencies": {
    "babel-core": "^6.25.0",
    "babel-loader": "^7.1.1",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-2": "^6.24.1",
    "css-loader": "^0.28.4",
    "file-loader": "^0.11.2",
    "react-hot-loader": "^1.3.1",
    "style-loader": "^0.18.2",
    "url-loader": "^0.5.9"
  }

# Git Note

## Rewrite All Local Change With Remote
First do a commit of your changes

git add *
git commit -a -m "local file server commit message"

Then fetch the changes and overwrite if there is a conflict

git fetch origin master
git merge -s recursive -X theirs origin/master
