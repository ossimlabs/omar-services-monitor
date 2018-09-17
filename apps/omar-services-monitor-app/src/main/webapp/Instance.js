import React, { Component } from "react";
import moment from "moment";

class Instance extends Component {
  state = {
    instanceInfo: null,
    instanceMetrics: this.props.data.leaseInfo.serviceUpTimestamp
  };

  fetchInstanceInfo = () => {
    //console.log(Math.round(this.props.data.leaseInfo.serviceUpTimestamp));
    const app = this.props.data.app.toLowerCase();
    fetch(`${this.props.server}/${app}/info`)
      .then(function(response) {
        return response.json();
      })
      .then(instanceJson => {
        //console.log('instanceJson:', instanceJson);
        const instanceInfo = instanceJson.app;
        //console.log("App:", instanceInfo);
        this.props.getVersion(instanceInfo.version);

        this.setState({ instanceInfo });
      })
      .catch(error =>
        console.error(
          `[Fetch InstanceInfo Error] connecting to ${
            this.props.server
          } with ${error}`
        )
      );
  };

  componentDidMount() {
    this.fetchInstanceInfo();
  }

  componentWillReceiveProps(nextProps) {
    // Update the state when new props are passed in from the parent component
    this.setState({ instanceMetrics: nextProps.data.leaseInfo.serviceUpTimestamp });
  }

  getUptime(time) {
    let now = moment(new Date()); // todays date
    let timeStamp = moment(time); // instance serviceUpTimestamp
    let duration = moment.duration(now.diff(timeStamp));
    let upTime = duration.humanize();
    return upTime;
  }

  getInstanceStatus(time) {
    let now = moment(new Date()); // todays date
    let timeStamp = moment(time); // instance serviceUpTimestamp
    let duration = moment.duration(now.diff(timeStamp));
    return duration.asHours();
  }

  render() {

    const instanceTimeUp = this.state.instanceMetrics ? (
      <div>{this.getUptime(this.state.instanceMetrics)}</div>
    ) : (
      <div>No Metrics</div>
    );

    let metrics = Math.round(parseFloat(this.getInstanceStatus(this.state.instanceMetrics)));

    if(metrics < 1) {
      return <div className="left pod pod-yellow z-depth-1">{instanceTimeUp}</div>
    }
    else if (metrics >= 1 && metrics < 24) {
      return <div className="left pod pod-lightgreen z-depth-1">{instanceTimeUp}</div>
    }
    else if (metrics >= 24 && metrics < 48) {
      return <div className="left pod pod-green z-depth-1">{instanceTimeUp}</div>
    }
    else if (metrics >= 48) {
      return <div className="left pod pod-blue z-depth-1">{instanceTimeUp}</div>
    }

  }
}

export default Instance;
