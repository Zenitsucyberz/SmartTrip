import { Component } from "react";
import type { ReactNode } from "react";


interface Props {
    children: ReactNode;
}


interface State {
    hasError:boolean;
}



export default class ErrorBoundary 
extends Component<Props,State>{


    state={
        hasError:false
    };


    static getDerivedStateFromError(){

        return {
            hasError:true
        };

    }


    render(){

        if(this.state.hasError){

            return(
                <div style={{
                    padding:40,
                    color:"red"
                }}>

                    <h2>
                        Something crashed in SmartTrip
                    </h2>

                    <p>
                        Open browser console (F12)
                        and check the error.
                    </p>

                </div>
            );

        }


        return this.props.children;

    }

}