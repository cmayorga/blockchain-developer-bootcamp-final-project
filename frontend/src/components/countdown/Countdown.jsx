import React, { Component } from "react";
import moment from 'moment';
import { withRouter } from "react-router-dom";
import Store from "../../stores";
import styles from "../../styles/countdown.css"
import { GET_BALANCES_RETURNED, CONFIGURE_RETURNED } from "../../constants/constants";

const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store


class Countdown extends React.Component {

    state = {
        days: undefined,
        hours: undefined,
        minutes: undefined,
        seconds: undefined, 
        periodFinished: undefined,
        currentDrop: undefined,
        addedBJdrop: undefined
    };
    
    componentDidMount() {
        /*
        dispatcher.register(function(payload) {
            //const currentPool = store.getStore('rewardPools')
            //7console.log("currentPool:" + JSON.stringify(currentPool));
            //console.log("token:" + JSON.stringify(currentPool[0].tokens[0]));
            console.log("periodFinish:" , payload.type, payload.periodFinish);
          });
        */
        const days = 0;
        const hours = 0;
        const minutes = 0;
        const seconds = 1;
        if (seconds != 0){
            this.setState({ days, hours, minutes, seconds });        
        }        
        emitter.on(CONFIGURE_RETURNED, this.periodFinishedReturned);
    }

    componentWillReceiveProps(){
        const days = 0;
        const hours = 0;
        const minutes = 0;
        const seconds = 1;
        if (seconds != 0){
            this.setState({ days, hours, minutes, seconds });        
        }        
        emitter.on(CONFIGURE_RETURNED, this.periodFinishedReturned);
    }
    
    componentWillUnmount() {
       // if (this.interval) {
       //     clearInterval(this.interval);
       // }        
    }

    periodFinishedReturned = (periodFinished, currentDrop, currentBJDrop) => {    
        //this.setState({ periodFinished: store.getStore('periodFinished') })
        //console.log(JSON.stringify(periodFinished));
        console.log("periodFinished:", periodFinished);
        var pfin = new Date(periodFinished*1000).toString();
        //console.log(pfin);   
        var that = this;     
        this.setState({currentDrop:currentDrop, addedBJdrop:currentBJDrop})
        this.interval=setInterval(function(){            
            const then = moment.unix(periodFinished);
            const now = moment();
            //console.log(now.toString());
            //console.log(then.toString());        
            //console.log(then.diff(now, 'days'));
            //console.log(then.diff(now, 'hours'));
            //console.log(then.diff(now, 'minutes'));
            const diff = then.diff(now);
            const diffDuration = moment.duration(diff);
            const days = diffDuration.days();
            const hours = diffDuration.hours();
            const minutes = diffDuration.minutes();
            const seconds = diffDuration.seconds();
            if (seconds != 0){
                that.setState({ days, hours, minutes, seconds });        
            }
        }, 500);
    }
    
    render() {
        const { days, hours, minutes, seconds, currentDrop, addedBJdrop } = this.state;
        
        // Mapping the date values to radius values
        const daysRadius = mapNumber(days, 30, 0, 0, 360);
        const hoursRadius = mapNumber(hours, 24, 0, 0, 360);
        const minutesRadius = mapNumber(minutes, 60, 0, 0, 360);
        const secondsRadius = mapNumber(seconds, 60, 0, 0, 360);
        const nextCurrentDrop = Math.round(currentDrop/1.05, 2);
        
        if (!seconds) {
            return null;
        }
        if(seconds < 0){
            return "CARLOS Rewarding system is not started";
        }
        
        return (
            <div>
                <h1>Current week distribution [ {currentDrop} CARLOS ]</h1>
                <h1>Next week emission Drop [ {nextCurrentDrop} CARLOS ]</h1>
                {/*<h2 className="countdown-extra-BJ">[ {addedBJdrop} extra CARLOS ] will be added to drop coming from our <a href="https://www.ytho.online/copy-of-play" target="_blank">games</a> house winnings</h2>*/}
                <div className="countdown-wrapper">
                    {(
                        <div className="countdown-item">
                            {/*<SVGCircle radius={daysRadius} />*/}
                            {days}
                            <span>days</span>
                        </div>
                    )}
                    {(
                        <div className="countdown-item">
                            {/*<SVGCircle radius={hoursRadius} />*/}
                            {hours}
                            <span>hours</span>
                        </div>
                    )}
                    {(
                        <div className="countdown-item">
                            {/*<SVGCircle radius={minutesRadius} />*/}
                            {minutes}
                            <span>minutes</span>
                        </div>
                    )}
                    {(
                        <div className="countdown-item">
                            {/*<SVGCircle radius={secondsRadius} />*/}
                            {seconds}
                            <span>seconds</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const SVGCircle = ({ radius }) => (
    <svg className="countdown-svg">
        <path
            fill="none"
            stroke="#333"
            stroke-width="4"
            d={describeArc(25, 25, 24, 0, radius)}
        />
    </svg>
);

// From StackOverflow: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = [
        'M',
        start.x,
        start.y,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y
    ].join(' ');
    
    return d;
}

// From StackOverflow: https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers

function mapNumber(number, in_min, in_max, out_min, out_max) {
    return (
        ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
}

export default Countdown;