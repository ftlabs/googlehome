# Google Home - Company Search

## Set up

### Webhook set up
- Create a new app in Heroku
- Deploy the code from this repo (minus the `company-search.zip` file)

### api.ai setup
- Create an account on [api.ai](https://api.ai/)
- Create a new agent
- Go to the agent settings (cog icon next to the agent name in the left hand column)
- Go to the Export and Import tab
- Import the `company-search.zip` that is in this repo	
- Go to Fulfillment and enable Webhook
- Add the url from the heroku app to the fulfillment webhook
- Go to Integrations and enable Actions on Google
- Change the Invocation name to whatever you want use

## Testing
