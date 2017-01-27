# Google Home - Company Search

This was an intital experiment to play around with the Google Home to understand the different options available and how it could work with some of the FT data.

This example demostrates how to get quick action up and running with [api.ai](https://api.ai/) with a webhook for fulfillment.

## Available speech Commands

1. "Ok Google, Let me talk to FT Labs"
2. "Tell me about Walmart"

The `FT Labs` part in step 1 will be whatever you set as your Invocation name.

Step 2 can also be invocted with any of thw following.

- "I would like to know more about Ford Motor"
- "Get me info on Alphabet"
- "Get me information on Apple"

## Set up

### Webhook set up
- Create a new app in Heroku
- Deploy the code from this repo (minus the `company-search.zip` file)
- Set the `markets` environment variable in Heroku where the value is a FT markets data api key 

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

- Follow [these instructions](https://support.google.com/googlehome/answer/7029485?co=GENIE.Platform%3DAndroid&hl=en) for connection the Home to the Home app.
	- One caveat is that you will need to switch your phone language to English - United states.
	- Make sure you use the same account that you use to authorize yourself as when testing via api.ai
- Once you have the Home set up follow the instructions to test the action in the web simulator
- Once the web simulator is loaded you should now be able to test the action by speaking to the Home 
