// the idea is a grid that transform into a tab when the screen is too small

import React from 'react';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AppBar, Grid, Tab } from '@mui/material';
import { ScreenRangeContainer } from '../FilterWall/ConditionalWall';

export function SmartGrid ({ children, ...props }) {
  return (
    <>
      <ScreenRangeContainer min={1000}>
        <Grid {...props}>
          {children}
        </Grid>
      </ScreenRangeContainer>
      <ScreenRangeContainer min={0} max={999}>
        <SmartTab {...props}>
          {children}
        </SmartTab>
      </ScreenRangeContainer>
    </>
  )
}

function SmartTab ({ children = [], ...props }) {
  const [tab, setTab] = React.useState('0')
  if (!Array.isArray(children)) {
    children = [children]
  }
  const customChilds = children?.filter((child) => child.type.name === 'SmartGrid' && child.props.item)
  if (props.container) return <TabContext value={tab}>
    {customChilds.map((child, index) => <TabPanel key={index} value={`${index}`} >
      {child.props.children}
    </TabPanel>)}
    <AppBar position="static" color="default"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        zIndex: 1000
      }}
    >
      <TabList style={{
        padding: '0px 10px',
        margin: '0px auto',
      }}>
        {customChilds.map((child, index) => <Tab
          icon={child.props.icon ?? <LabelImportantIcon />}
          key={`tab-${index}`}
          value={`${index}`} label={child.props.title ?? `Tab-${index + 1}`}
          onClick={() => {
            setTab(`${index}`)
          }}
        />)}
      </TabList>
    </AppBar>
  </TabContext>
}