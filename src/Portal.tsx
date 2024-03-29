import { Link } from 'react-router-dom'
import "./Portal.css"
import React, { useEffect, useState } from 'react';

import { animated, useSpring } from '@react-spring/web'
import Avatar from '@mui/material/Avatar'
import { AvatarGroup, Button, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import * as img from './thumbs';

const data = [
  {
    name: "Donnie",
    bio: "Donnie's bio",
    path: img.donnie
  },
  {
    name: "Skrillex",
    bio: "Skrillex's bio",
    path: img.skrillex
  },
  {
    name: "Flume",
    bio: "Flume's bio",
    path: img.flume
  },
  {
    name: "fred again...",
    bio: "Fred Again's bio",
    path: img.fredagain
  },
  {
    name: "Odesza",
    bio: "Odesza's bio",
    path: img.odesza
  },
  {
    name: "Aurora",
    bio: "Aurora's bio",
    path: img.aurora
  },
  {
    name: "Doja Cat",
    bio: "Doja Cat's bio",
    path: img.doja
  },
  {
    name: "Flying Lotus",
    bio: "Flying Lotus' bio",
    path: img.flylo
  },
]

// TODO: scale things better
function Portal() {
  const [isVisible, setIsVisible] = useState(true);
  const [active, setActive] = useState(-1);

  // fade effect for words
  const landerSummaryStyles = useSpring({
    opacity: isVisible ? 1 : .1,
    y: isVisible ? 0 : -50,
  })

  // fade effect for logo
  const landerLogoStyles = useSpring({
    y: isVisible ? 0 : -50,
  })

  // fade effect for roster
  const rosterStyles = useSpring({
    opacity: !isVisible ? 1 : 0,
    y: !isVisible ? 0 : -50,
  })

  // gets an entire roster as an array of avatargroups
  const getRoster = () => {
    let items: JSX.Element[] = [];

    // get a group of 5
    for(let i = 0; i < (data.length % 3) + 1; i++) {
      items.push(getGroup(3 * i));
    }

    return items;
  }

  // get at most 5 roster members starting from an index
  const getGroup = (start: number) => {
    return (
      <AvatarGroup max={10} style={{ justifyContent: "center"}} key={"group-" + start}>
        {data.slice(start,start + 3).map((item, i) => (
          <Tooltip title={isVisible ? "" : item.name} key={item.name}>
            <Link to={"/bio/" + item.name}>
              <Avatar alt={item.name} src={item.path} sx={{ width: 100, height: 100, cursor: "pointer" }}/>
            </Link>
          </Tooltip>
        ))}
      </AvatarGroup>
    )
  }

  return (
    <div>
      {/* logo */}
      <animated.div style={{...landerLogoStyles}}>
        <img src={img.logo} className="logo" alt="logo" style={{ cursor: "grab" }} onClick={() => setIsVisible(!isVisible)}/>
      </animated.div>

      {/* summary */}
      <animated.div style={{...landerSummaryStyles, zIndex: 1, position: "absolute", left: 0, right: 0}}>
        <h1>Space Hash Records</h1>
        <p className="subtitle">Pushing boundaries since 2023</p>
      </animated.div>

      {/* roster */}
      <animated.div style={{...rosterStyles, width: "100vw", zIndex: 2, position: "absolute", left: 0, right: 0}}>
        {!isVisible && getRoster()}
      </animated.div>
    </div>
  )
}

export default Portal;