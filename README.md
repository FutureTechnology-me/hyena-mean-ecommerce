# hyena-mean-ecommerce
Simple MEAN e-commerce application with seed

This is a basic MEAN application which has

- user Create, Read, Update, Delete
- user authentication
- product database
- product seed
- dynamically generated filter navigation 
- paypal checkout

This is not a complete application. It's a fast starting point for a new application. 

To get started with this you will need to set environment variables 

DATABASEURL : the url for your mongodb

OURSECRET : the secret you wish to use to generate user salt/hash

You'll want to update checkout.html to use the desired paypal email. 

I'll improve this as often as possible. Intended future features 

- front end admin tools
- multiple starting template options
- completely DRY code 
- better separation and organization of individual components
- other payment options / use of profile data to prefill payment forms
- paypal post purchase route

sample deployment at https://young-reef-40477.herokuapp.com/#/
