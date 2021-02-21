# BlackJack Game

## Table of contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Sources](#sources)
- [Setup](#setup)

## Introduction

It's player vs automated dealer BlackJack game with following assumptions:

- game utilizes BlackJack rules
- starting credit $1000
- use of [Deck Of Cards API](https://deckofcardsapi.com/) with 6-decks, cards are shuffled before each round
- each game consists of 5 rounds after which game ends and final credit is added to ranking
- player places bet before each round starts
- possible actions during each round are: hit, bet, double
- wins are 1.5 x Bet, loose means the bet is gone
- hands from every round are displayed on "Round History" during the game
- the game can be reset at any time
- the game is stored locally and can be loaded or reoladed at any time - including browser restart.
- responsiveness

## Technologies

Project is created with:

- ReactJS
- Typescript
- Styled-components

## Sources

- [BlackJack rules](https://en.wikipedia.org/wiki/Blackjack)
- [Styled-components](https://styled-components.com/)
- [Deck Of Cards API](https://deckofcardsapi.com/)
- [Adding typescript](https://create-react-app.dev/docs/adding-typescript/)

# Getting Started with BlackJack Game App

### `npm install`

Installs all required dependencies.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
