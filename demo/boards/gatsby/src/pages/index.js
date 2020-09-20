import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import {ChessboardSquare, ChessboardProvider} from '@chessboard/board'

import pieces from '../resources/chessboard-pieces.json'

const IndexPage = () => {
  const [value, setValue] = React.useState('Hello')
  const onChange = React.useCallback((e) => setValue(e.target.value), [])

  return (
    <Layout>
      <SEO title="Home" />

      <ChessboardProvider pieces={pieces}>
        <ChessboardSquare name="FirstPiece" props={{title: 'Microfrontends', value, onChange}}/>
        <ChessboardSquare name="SecondPiece" props={{title: 'Rocks!', value}}/>
      </ChessboardProvider>
    </Layout>
  )
}

export default IndexPage
