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

### Testing via the web simulator

The web simulator is really useful for quick testing when you are happy to test via text rather than speech.
It is meant to also work with speech but I was unable to make that work and in that case I think it would be better to test with the real device.

- Go to [api.ai](https://api.ai/)
- Go to Integrations and to the Google Actions settings
- Click Authorize in the bottom right
- Authorize yourself withy our Google account
- When it comes back to the Google Actions settings click preview in the bottom right
- After a couple seconds a blue modal should appear in the bottom right of the screen 
- Follow the link in this to try it on the Google Home Web Simulator

### Testing via a Google Home 
