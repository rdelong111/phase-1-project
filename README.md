# phase-1-project

## Introduction
League of Legends is an extremely popular game. Although, it is very complex and has a ton of info that can be overwhelming to a new or casual player.  There is available info on the different champions in the LoL client, but I prefer to be shown exact numbers or exact type of champion (tank, mage, etc) instead of reading through the lore or looking at graphs.

### Learning Goals
- Design and architect features across a frontend
- Communicate and collaborate in a technical environment
- Integrate JavaScript and an external API
- Debug issues in small- to medium-sized projects
- Build and iterate on a project MVP

### Project Requirements
1. Your app must be a HTML/CSS/JS frontend that accesses data from a public API. All interactions between the client and the API should be handled asynchronously and use JSON as the communication format.
2. Your entire app must run on a single page. There should be NO redirects. In other words, your project will contain a single HTML file.
3. Your app needs to incorporate at least 3 separate event listeners (DOMContentLoaded, click, change, submit, etc).
4. Some interactivity is required. This could be as simple as adding a "like" button or adding comments. These interactions do not need to persist after reloading the page.
5. Follow good coding practices. Keep your code DRY (Do not repeat yourself) by utilizing functions to abstract repetitive code.

### Stretch Goals
1. Use json-server in your project to persist your app's interactivity.

## Before you open the HTML file...
Assuming you have `json-server` installed globally, run this command to run the server:

```console
$ json-server --watch data.json
```

### Updating Free-to-Play Champions
Every week on Tuesday, a new set of champions are selected to be the Free-to-Play champions (even if you don't own them, you can play as them)

In order to access the id's of the current free to play champions, you'll need to go to [Free-Champs][] and login to your developer account (free to make). After you login, scroll to the bottom of [Free-Champs][] and click **Execute Request**. The **RESPONSE BODY** should show the list of champion id's.

[Free-Champs]: https://developer.riotgames.com/apis#champion-v3/GET_getChampionInfo

*Your development API key expires every day. Go to your account dashboard to generate a new one. It is free to do so.*

Update the `"freeChampionIds"` key list in data.json:

```
"freeChampionIds": {
    "key": [
      10,
      13,
      28,
      40,
      67,
      74,
      86,
      89,
      101,
      111,
      120,
      221,
      427,
      498,
      518,
      887
    ]
  }
```

## Resources
**™ & © 2022 Riot Games, Inc.  League of Legends and all related logos, characters, names and distinctive likenesses thereof are exclusive property of Riot Games, Inc.  All Rights Reserved.**

- [Riot Developer Portal](https://developer.riotgames.com/)
- [json-server](https://www.npmjs.com/package/json-server)