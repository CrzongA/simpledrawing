import React from "react"
import ReactDOM from "react-dom"
import Konva from "konva"
import { Stage, Layer, Rect, Text, Path,} from 'react-konva'

class App extends React.Component{
    constructor() {
        super();
        this.state = {
            cursorCoordinates: {x:0,y:0},
            painting: false,
            path: [''],
            pathCount: 0

        }
        this.draw.bind(this)
        this.addPoint.bind(this)
        this.handleMouseDown.bind(this)
        this.handleMouseLeave.bind(this)
        this.handleMouseMove.bind(this)
        this.handleMouseUp.bind(this)
        this.updateCursor.bind(this)
    }

    updateCursor(e){
        let cursorX = e.pageX
        let cursorY = e.pageY
        return {cursorX, cursorY}
    }

    draw(){
        let pathItem, allItems=[], i=0;
        for (pathItem in this.state.path) {
            let pathProps = {
                x: 0,
                y: 0,
                data: pathItem,
                fill: 'black',
                scale: {x:1, y:2},
            }
            allItems.push(<Path key={i} {...pathProps}/>)
            i++
        }
        // console.log(allItems)
        return allItems
    }

    addPoint(x, y, start=false){
        let pathItem
        if (start){
            pathItem = 'm'+x+','+y+' '
        }
        else {
            pathItem = 'l' + x + ',' + y + ' '
        }
        let existPath = this.state.path
        // console.log(this.state.path)
        existPath[this.state.pathCount]+=(pathItem)
        this.setState({path: existPath})
    }

    handleMouseDown = (e) =>{
        let cursorX = e.pageX
        let cursorY = e.pageY
        // console.log("click "+ cursorX + " "+ cursorY)
        console.log(e)
        console.log(e.pageX, e.screenX)
        this.setState({painting: true});
        this.addPoint(cursorX, cursorY, true)

    }

    handleMouseMove = (e) =>{
        let cursorX = e.pageX
        let cursorY = e.pageY
        if (this.state.painting){
            // console.log("move "+ cursorX + " "+ cursorY)
            // console.log(e)
            this.addPoint(cursorX, cursorY)
        }
    }

    handleMouseUp = (e) =>{
        this.setState({painting: false,pathCount: this.state.pathCount+1});
    }

    handleMouseLeave= (e)=>{
        this.setState({painting: false})
    }

    render() {
        return (
            <div>
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}>
                    <Layer>
                        {this.draw()}
                    </Layer>
                </Stage>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))
