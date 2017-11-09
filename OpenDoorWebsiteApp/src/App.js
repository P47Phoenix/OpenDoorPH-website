import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact={true} path="/" render={Main} />
          <Route exact={true} path="/opendoor" render={Main} />
          <Route exact={true} path="/opendoor/Home/Location" render={Location} />
          <Route exact={true} path="/opendoor/Home/About" render={About} />
        </div>
      </Router>
    );
  }
}

const Main =()=> {
  return (
<div>
  <p>
    Open Door Full Gospel is committed to being a rock solid church through prayer,
    bible study, and community service. We strive to reach out to the community in any
    way we can. We provide solid foundations through biblically sound programs for youth,
    children, Nursery, and young adults (classes coming soon). Our pastor, Dennis Gulley,
    brings the truth of the Bible and applies it to everyday life.
  </p>
  <p>
    In the summer of 2009 we held a clothes drive. All the clothes we gathered were
    given away to the community free. We also held our first annual Vacation Bible School.
    In the fall of 2009 we held a food drive. All the food gathered was donated to Harvesters.
    We were able to help pack boxes of bread to be sent out into community pantries.
    At the end of 2009 we were privileged to be able to work with Uplift in feeding
    the homeless. Coats, sleeping bags, clothes, and food were gathered to be donated
    to the organization. We are looking forward to being able to work with them again
    and encourage all to look into what a wonderful group this is.
  </p>
  <p>
    In 2010 we will be working with Kansas City Rescue Mission to prepare and serve
    hot meals to the homeless. Plans are under way for our Second annual VBS as well
    as plans to work with Uplift again. These are just a few of the things going on
    at Open Door. Come by and experience the love of Christ. We would love to have you
    as part of our church family.
  </p>
</div>
  )
}

const MapStyle = {
  "color": '#0000FF', 
  "text-align": "left"
}

const Location = () => {
  return (
  <div class="location">
    <div class="address">
      Open Door Full Gospel Church Of Pleasant Hill
      <br />
      135 S 1st St
      <br />
      Pleasant Hill, Missouri 64080
    </div>
    <div class="map">
      <iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0"
        marginwidth="0" src="http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080+&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A&amp;output=embed">
      </iframe>
      <br />
      <small><a href="http://maps.google.com/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080+&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A"
        style={MapStyle}>View Larger Map</a></small>
    </div>
  </div>
  )
}

const About = () => {
  return (
    <div>
      <p>
      Open door was founded by Herbert & Willetta Lowry and William & Mable Burnett in
      July of 1975. Services were first held in an old house on the corner of Cedar and
      Campbell. There were 35 people in attendance at the first service. The founders
      asked Harvey Bryant to pastor the church. Pastor Bryant bought the churches current
      building after it was damaged by smoke from a neighboring building. The church later
      bought the building from Pastor Bryant.
    </p>
    <p>
      Open door was led for some time by Pastor Bryant. After which it was also led by
      Don Sherwood, Lauren Simmons, Jim Coons, Roger Nichols, Sam Meyers, and then Dennis
      Gulley; whom is still currently at Open Door. We invite you to come and experience
      the wonderful things God is doing at Open Door!
    </p>
    </div>
  )
}

export default App;