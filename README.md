<h1 align="center"> Parachute </h1> <br>

<p align="center">
 <img alt="Render" src="https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white"/>

<p align="center">
  <a href="https://parachute-share.herokuapp.com/">
    <img alt="Parachute" title="Parachute" src="https://i.imgur.com/wGC8z0k.jpg" width="250"/>
  </a>
</p>

<p align="center">
  A web-based AirDrop alternative.
 </p>

## Table of Contents

- [Built With](#build-with)
- [How Does It Work](#how-does-it-work)
- [Privacy](#privacy)
- [Feedback](#feedback)

## Built With
- [Node](https://nodejs.org/en/)
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- Vanilla HTML, CSS and JavaScript

## How Does It Work
Parachute allows you to send files to devices that are on the same network. If you open the website on two different devices which are on the same network, you will see that they will be paired. After the pairing is successful, you can upload a file on one device and the other one will automatically download it.

## Privacy
Privacy was an important focus during this project. All file transfers are peer to peer and nothing is stored in a database. (The project doesn't even use a database) All connections are encrypted through either HTTPS or WSS.

## Feedback

Feel free to send feedback on [Twitter](https://twitter.com/mmvvpp123) or [file an issue](https://github.com/nimatullo/parachute/issues/new). Feature requests are always welcome.

## Run Your Own Instance

Clone this repository
```sh
$ git clone https://github.com/nimatullo/parachute
```

Go into the repository
```sh
$ cd parachute
```

Install dependencies
```sh
$ npm install
```

Run the app
```
$ npm start
```

_Runs on port 8000 by default._
