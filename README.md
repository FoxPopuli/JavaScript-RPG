# JavaScript RPG

A template for a monster collecting RPG which may resemble a certain popular franchise, built with code which may resemble a certain popular italian dish.

Built using _only_ JavaScript and the built-in Canvas API, which was as ill advised as it sounds. Currently requires Visual Studio Code with the [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to run, since at the moment it breaks when hosted.

## Controls

- Interact: e
- Move up: w
- Move left: a
- Move down: s
- Move right: d

## Features

- Grid-based movement with occlusion culling
- Intractable NPCs with dialog options
- Unique animations for walking, running and traversing water

## Instructions

1.  Clone the main branch
2.  Open the repo in Visual Studio Code
3.  Install the [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) if you haven't already.
4.  Navigate to index.html in the root directory.
5.  Click the "Go Live" button on the status bar.

## Known issues

- Movement controls will occasionally lock. Fixable by mashing the controls a bit
- Textboxes might display incorrectly. Usually fixable by refreshing the page
- Minor graphical glitches

## FAQ

1.  **Why do this?** </br>
    Originally it was to pracitice OOP and inheritence in JavaScript, but I was having fun with it so the scope kept widening.
2.  **Why is it so bad?**<br>
    I wrote it a long time ago
3.  **Will you refactor it?**<br>
    Perhaps, but probably not any time soon. It's extremely fragile and annoying to work with.
4.  **Then why link to it on your resume?**<br>
    It may be basic and janky, but it still took a lot of work. Every feature is a home grown solution implimented with vanilla JavaScript, only using the Canvas API to display the maps and sprites. The grid-based movement alone took days of tinkering and maths to pull off. At the end of the day, I'm still proud I got as far as I did.

5.  **What would you do differently if you had to start over?**<br>
    I would spend much more time establishing the scope and planning features ahead of time. Specifically, I would pay more attention to writing classes to do only one thing, exposing as few methods as possible. I would also build the game to run on a more robust frame-time system to more easily impliment scripted events and animations.
