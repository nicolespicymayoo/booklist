import React, { Component } from "react"

type Props = {
  view: string
  setView: () => void
  currView: "favs" | "recommended by others" | "add a book"
}

const ViewOption: React.SFC<Props> = ({ view, setView, currView }) => (
  <div className={`view-option ${view === currView ? "active" : null}`} onClick={setView}>
    {" "}
    {view}{" "}
  </div>
)

export default ViewOption
