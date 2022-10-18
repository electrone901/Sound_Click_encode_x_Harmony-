import React, { useState, useEffect, createRef } from 'react'
import {
  Container,
  Card,
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
} from '@mui/material'
// import '../profile/Profile.css'
import profileBG from '../../images/profile-bg-img.jpg'
import userBGimage from '../../images/academy.png'
import download from '../../images/download.png'
import CovalentApi from '../covalent-api/CovalentApi'
import Donate from '../donate/DonateNFT'

function Profile({ account, currentAccount, selectedProfile }) {
  const [avatar, setAvatar] = useState('')
  const [userProfile, setUserProfile] = useState({})
  const [showProfile, setShowProfile] = useState(false)
  const avatarType = createRef()

  const setAvatarHelper = (e) => {
    e.preventDefault()
    setAvatar(e.target.value)
    localStorage.setItem('profileImage', e.target.value)
  }

  useEffect(() => {
    const localprofileImage = localStorage.getItem('profileImage')
    if (localprofileImage !== '') {
      setAvatar(localprofileImage)
    }
  }, [])

  const requestFollow = async () => {
    const follower = currentAccount
    const a = await setTimeout(function () {
      setShowProfile(true)
    }, 2000)
  }

  const visitSite = (site) => {
    const link = site.value
    if (link) {
      window.open(link, '_blank')
    } else {
      window.open(site, '_blank')
    }
  }

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Container
      className="root-pet-details"
      style={{ minHeight: '50vh', paddingBottom: '3rem' }}
    >
      <center>
        <Card
          style={{
            maxWidth: '500px',
            paddingBottom: '3rem',
            position: 'relative',
            borderRadius: '13px',
          }}
        >
          <img
            style={{
              width: '100%',
              height: '230px',
              position: 'relative',
              top: '0',
              left: '0',
            }}
            src={profileBG}
            alt="userBGimage"
          />
          <img
            style={{
              position: 'absolute',
              top: '126px',
              left: '30px',
              border: '3px solid white',
              borderRadius: '13px',
              width: '120px',
              height: '125px',
            }}
            src={
              avatar
                ? `https://avatars.dicebear.com/api/avataaars/${avatar}.svg?background=%230000ff`
                : userBGimage
            }
            alt="userImage"
          />

          <div
            style={{
              paddingBottom: '3rem',
              width: '100%',
              paddingTop: '.5rem',
            }}
          >
            <TextField
              style={{
                width: '120px',
                float: 'right',
                height: '80px',
                paddingRight: '1rem',
              }}
              fullWidth
              label="Change avatar"
              name="profileType"
              select
              onChange={setAvatarHelper}
              value={avatar}
              ref={avatarType}
            >
              <MenuItem value="micah">Micah</MenuItem>
              <MenuItem value="avataaars">Avataaars</MenuItem>
              <MenuItem value="human">Human</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="bottts">Bottts</MenuItem>
              <MenuItem value="identicon">Identicon</MenuItem>
              <MenuItem value="jdenticon">Jdenticon</MenuItem>
            </TextField>
          </div>
          <br />
          <p style={{ textAlign: 'start', paddingLeft: '1.5rem' }}>
            <strong>Music creator || artist</strong>
          </p>
          <p className="profile-wallet">
            {currentAccount
              ? currentAccount
              : '0x5e1b802905c9730C8474eED020F800CC38A6A42E'}
            <img style={{ width: '26px' }} src={download} alt="copy.png" />
          </p>
          <br />
          <Paper square>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Profile" />
              <Tab label="Donate" />
            </Tabs>
          </Paper>
          {value === 0 && (
            <CovalentApi
              requestFollow={requestFollow}
              selectedProfile={userProfile}
              visitSite={visitSite}
              currentAccount={currentAccount}
            />
          )}
          {value === 1 && <Donate />}
          {/* {value === 2 && <Donate />} */}
        </Card>
      </center>
    </Container>
  )
}

export default Profile
