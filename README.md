# BSA Tree Recycle

This is the source code for the [BSA Tree Recycle][btr] web application.  Boy Scout troops can use this app during their annual Christmas tree recycling fundraiser to record the location of tree pickups.  As drivers mark the locations of tree pickups using their location-enabled mobile devices, those locations appear on the map page in real time and are recorded for future reference.

[btr]: http://bsatreerecycle.herokuapp.com

###The Stack

This site is hosted by [Heroku][h], and is built on [node.js][n] using the [express][e] web framework. Data is stored in a [MongoDB][mdb] database hosted by [MongoHQ][mhq]. Pages are built with the help of Twitter's outstanding [Bootstrap][b] framework and rendered using [Handlebars][h] templates.  The whole thing is written in JavaScript and HTML5.

[h]: http://www.heroku.com/
[n]: http://nodejs.org/
[e]: http://expressjs.com/
[mdb]: http://www.mongodb.org/
[mhq]: http://www.mongohq.com/
[b]: http://twitter.github.com/bootstrap/
[h]: http://handlebarsjs.com/

###Installation and setup

This is fairly easy to install and run locally.  Even if you don't intend to deploy to Heroku, start with their great articles [Getting Started with Heroku][h1] and [Getting Started with Node.js on Heroku][h2]. 

You'll need [node.js][n], [NPM][npm] and a local installation of [MongoDB][mdb] with the connection string in a local `.env` file:

* `MONGOHQ_URL=mongodb://username:password@localhost:27017/pickups` (Note the collection name "pickups")

You'll also need the following dependencies from NPM:

* `express` (web framework for node.js)
* `hbs` (Handlebars engine for express)
* `mongodb` (MongoDB driver for node.js)

[h1]: https://devcenter.heroku.com/articles/quickstart
[h2]: https://devcenter.heroku.com/articles/nodejs
[npm]: https://npmjs.org/

###Roadmap

* __0.8.x__ (Current) Basic functionality in recent versions of Chrome and Firefox
* __0.9.x__ (Spring 2013) Support for recent versions of Safari and Internet Explorer, and beta testing
* __1.0.x__ (Summer 2013) Production release

###Contribution

Comments, questions, feedback and pull requests are welcome.