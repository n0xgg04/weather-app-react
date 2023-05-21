import React from 'react'
import Weather from './components/Weather'
export default class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return (
            <>
              <Weather/>
            </>
        )
    }


}