# Chessboard - A MicroFrontend Framework for React

Chessboard is complete, no-compromise MicroFrontend Framework for React.

Using Chessboard, you will be able to develop your own micro-frontends (called "Pieces"), 
complete with resource importation, css loaders and modules, and all other frontend goodies.

A Chessboard Piece is a working application in itself, but it can be integrated into a broader
application called a "Board": a master application on which the various Pieces will be layed.

Chessboard supports both Client Side Rendering and Server Side Rendering, for SPA or static
sites alike.

## Terminology

### Piece

A Piece is a micro-application developed in React, which can be loaded inside a master application
as a micro-frontend.

Pieces _must_ be packaged using [NWB](https://github.com/insin/nwb/tree/master/src), and
more precisely using the `@chessboard/nwb-config` configuration generator. This allows 
Chessboard to inject any configuration it requires so that the Piece is able to run
flawlessly in all environment: dev/prod, standalone/injected, csr/ssr...

### Board

A Board is an application that will be using Chessboard Pieces. Chessboard has no pre-conception
regarding Boards, except that they must be using React. A NWB app can be a board, but so can
a CRA app or a Gatsby site.

### Square

A Square is a placeholder for a Piece. Squares are layed on Boards using the `ChessboardSquare`
component from the `@chessboard/client` package. At runtime, the referenced Piece will be
loaded and displayed in place of the Square.

It is also possible to inject Pieces at build-time through the static-injection tool, or at fetch-time 
through the Pieces proxy.

### Static Injection/Pieces Proxy

The Pieces Proxy sits between a CDN and the client,
and any HTML file passed through it will see its Pieces placeholder populated by a 
Server-Side-Rendered version of the component.

The Static Injection tool acts just like the Pieces Proxy, but acts on file at build time,
patching any HTML file found in a given path.

Those tools are developed by the [ARA Framework project](https://ara-framework.github.io/website/),
which Chessboard is inspired by and compatible with.

## Demonstration

This package provides a full demonstration of Chessboard in action. The demonstration is composed
of three parts:

 - Two Pieces, called `FirstPiece` and `SecondPiece`, which source can be found in the [demo/pieces](./demo/pieces) folder.
 - One Board, built with create-react-app, which loads our two Pieces in a single application.
 
### Running the demo

#### Pre-required
Install all dependency, using the `mixt` mono-repo manager:

```
npm ci
npx mixt ci
npx mixt build
npm run demo:install
```

#### Development mode
In order to run the demo in development mode, we need to launch both pieces and
the board.

The root `package.json` contains all the scripts necessary for launching the demo.

```
npm run dev:piece:first     # launch the first Piece in dev mode

npm run dev:piece:second    # launch the second Piece in dev mode

npm run dev:board:cra       # launch the Board
```

Run each command in a separate terminal. The last one should automatically open
your browser, where you can see the stitched application.

Edit any of the Pieces in [demo/pieces](./demo/pieces) to see your changes
reflected in real-time with hot-reload, directly in the Board application!

You can also edit the Board in [demo/board/create-react-app](./demo/boards/create-react-app).

> Note: this Readme uses the Create React App-based Board, but you can also play around
> with another Board (Gatsby, NextJs or NWB), by changing `:cra` accordingly (`:gatsby`, `:nextjs`, `:nwb`) 

#### Production mode

Likely, the demo can be built to run in production mode.

First, run the build scripts:
```
npm run build:piece:first     # build the first Piece for production

npm run build:piece:second    # build the second Piece for production

npm run build:board:cra       # build the Board
```

Then, launch the serve commands:
```
npm run serve:piece:first     # serve the first Piece

npm run serve:piece:second    # serve the second Piece

npm run serve:board:cra       # serve the Board
```

Finally, open-up your browser to http://localhost:3000 to see the production site.


### Acknowledgments

A lot of ideas for the Chessboard framework have been inspired by the [ARA Framework](https://ara-framework.github.io/website/).

If you don't need HMR and other frontends goodies out of the box, and if you're not afraid
of handling your own webpack configs manually, check them out!

[ARA Framework](https://ara-framework.github.io/website/) has the benefit of offering bindings
for other frontend such as Vue.js or Angular, while Chessboard focuses on React.
