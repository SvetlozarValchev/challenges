### Tell us about one of your commercial projects with Node.js and/or AngularJS.

##### Insurance App (Angular 1.x)

Mobile App that allows you to manage your insurance policies and take pictures of your car and send them to the insurers directly.

##### Insurance Backend (Node)

On the back there's a server that exposed endpoints for the Mobile App, as well as the Administrative Panel and the Main website. 
The communication was made through WebSockets. 
It used Redis in combination with MongoDB for caching and storage.
Since there's additional data to be pulled from 3rd parties, the backend was split into microservices that handle the different providers.
