import React from "react"
import ReactDOM from "react-dom"
import Konva from "konva"
import {Stage, Layer, Rect, Text, Path,} from 'react-konva'
import "../css/index.css"

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            cursorCoordinates: {sx: 0, sy: 0, px: 0, py: 0, cx: 0, cy: 0, lx: 0, ly: 0},
            painting: false,
            moving: false,
            path: [''],
            pathCount: 0,
            prevMoveXY:{x:0, y:0},
            prevOffset:{x:0, y:0},
            offset:{x:0, y:0},
            mode:['draw']
        }
        this.draw.bind(this)
        this.addPoint.bind(this)
        this.closePath.bind(this)
        this.handleMouseDown.bind(this)
        this.handleMouseLeave.bind(this)
        this.handleMouseMove.bind(this)
        this.handleMouseUp.bind(this)
        this.updateCursor.bind(this)
        this.clearPoints.bind(this)
        this.switchMode.bind(this)
    }

    updateCursor(e) {
        let ScursorX = e.evt.screenX
        let ScursorY = e.evt.screenY
        let PcursorX = e.evt.pageX
        let PcursorY = e.evt.pageY
        return {ScursorX, ScursorY, PcursorX, PcursorY}
    }

    draw() {
        let pathItem, allItems = [], i = 0;
        for (pathItem of this.state.path) {
            let pathProps = {
                data: pathItem,
                stroke: 'black',
                // fill: 'black',
                scale: {x: 1, y: 1},
                offsetX: this.state.offset.x,
                offsetY: this.state.offset.y
            }
            allItems.push(<Path key={i} {...pathProps}/>)
            i++
        }
        // console.log(allItems)
        return allItems
    }

    addPoint(x, y, start = false) {
        let pathItem
        if (start) {
            pathItem = 'M' + x + ' ' + y + ' '
        } else {
            pathItem = 'L' + x + ' ' + y + ' '
        }
        let existPath = this.state.path
        // console.log(this.state.path)
        existPath[this.state.pathCount] += (pathItem)
        this.setState({path: existPath})
    }

    addPointStroke(x, y, start = false) {
        let pathItem
        if (start) {

        }
    }

    switchMode = (e) => {
        console.log(e)
        if(this.state.mode=="draw"){
            console.log("move mode")
            this.setState({mode: 'move'})
        }
        else if (this.state.mode=="move"){
            console.log("draw mode")
            this.setState({mode: 'draw'})
        }
    }

    closePath() {
        let existPath = this.state.path
        // existPath[this.state.pathCount]+="z"
        this.setState({path: existPath})
    }

    handleMouseDown = (e) => {
        let cursorX = e.evt.layerX
        let cursorY = e.evt.layerY
        // console.log("click "+ cursorX + " "+ cursorY)
        // console.log(e.currentTarget, e.target.content.className)
        console.log(e.evt.screenX, e.evt.screenY)
        if (this.state.mode=="draw") {
            this.setState({painting: true});
            this.addPoint(cursorX, cursorY, true)
        }
        else if (this.state.mode=="move"){
            this.setState({moving: true, prevMoveXY:{x:cursorX, y:cursorY}})
        }

    }

    handleMouseMove = (e) => {
        let ScursorX = e.evt.screenX
        let ScursorY = e.evt.screenY
        let PcursorX = e.evt.pageX
        let PcursorY = e.evt.pageY
        let CcursorX = e.evt.clientX
        let CcursorY = e.evt.clientY
        let LcursorX = e.evt.layerX
        let LcursorY = e.evt.layerY

        if (this.state.painting) {
            // console.log("move "+ CcursorX + " "+ CcursorY)
            // console.log(e)
            this.addPoint(LcursorX, LcursorY)
        }
        else if (this.state.moving){
            let origin = this.state.prevMoveXY
            let prevOffset = this.state.prevOffset
            console.log(origin.x)
            let moveX = origin.x-LcursorX
            let moveY = origin.y-LcursorY
            this.setState({offset: {x:prevOffset.x+moveX, y:prevOffset.y+moveY}})
        }
        this.setState({
            cursorCoordinates: {
                px: PcursorX,
                py: PcursorY,
                sx: ScursorX,
                sy: ScursorY,
                cx: CcursorX,
                cy: CcursorY,
                lx: LcursorX,
                ly: LcursorY
            }
        })
    }

    handleMouseUp = (e) => {
        let LcursorX = e.evt.layerX
        let LcursorY = e.evt.layerY
        if (this.state.painting) {
            this.closePath()
            this.setState({pathCount: this.state.pathCount + 1, painting: false})
        }
        else if (this.state.moving){
            this.setState({moving:false, prevMoveXY:{x:0, y:0}, prevOffset:this.state.offset})
        }
    }

    handleMouseLeave = (e) => {
        this.setState({painting: false, moving:false})
    }

    clearPoints = (e) => {
        console.log("clear paths")
        this.setState({path:[]})
    }

    render() {
        return (
            <div>
                <div className={"toolsWrapper"}>
                    <div
                        style={{position: "absolute", zIndex: -1}}
                        className={"cursorCoordinates"}>
                        <p>All coordinate types</p>
                        <span>
                            <p>pagex: {this.state.cursorCoordinates.px} pagey: {this.state.cursorCoordinates.py}</p>
                        </span>
                        <span>
                            <p>screenx: {this.state.cursorCoordinates.sx} screeny: {this.state.cursorCoordinates.sy}</p>
                        </span>
                        <span>
                            <p>cursorx: {this.state.cursorCoordinates.cx} cursory: {this.state.cursorCoordinates.cy}</p>
                        </span>
                        <span>
                            <p>layerx: {this.state.cursorCoordinates.lx} layery: {this.state.cursorCoordinates.ly}</p>
                        </span>
                    </div>
                    <div className={"modeChooser"}>
                        <div className={"cButton"} onClick={this.switchMode}>
                            <div>{this.state.mode}</div>
                        </div>
                    </div>
                    <div className={"clearPointsButton cButton"} onClick={this.clearPoints}>
                        <div>Clear</div>
                    </div>
                </div>
                <div className={"canvas"}>
                <Stage
                    width={window.innerWidth*0.8}
                    height={window.innerHeight}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                >
                    <Layer>
                        {this.draw()}
                    </Layer>
                </Stage>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"))
