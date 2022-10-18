import React, { useEffect, useState } from 'react'
import CircularStatic from '../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid, Container } from '@material-ui/core'
import './BeatsList.css'
import { apiKey } from '../../APIKEYS'
import play1 from './play1.png'
import defaultIMG from './demo.jpg'
import beat1 from './beat1.mp3'

function BeatsList({ contract }) {
  const [beatsData, setBeatsData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadBeats = async () => {
      try {
        setLoading(true)
        let cids = await fetch('https://api.nft.storage', {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            limit: 100,
          },
        })
        cids = await cids.json()
        const temp = []
        for (let cid of cids.value) {
          if (cid?.cid) {
            let data = await fetch(
              `https://ipfs.io/ipfs/${cid.cid}/metadata.json`,
            )
            data = await data.json()

            const getImage = (ipfsURL) => {
              if (!ipfsURL) return
              ipfsURL = ipfsURL.split('://')
              return 'https://ipfs.io/ipfs/' + ipfsURL[1]
            }

            const checkImg = await getImage(data.image)
            if (checkImg.includes('null')) {
              data.image = ''
            } else {
              data.image = checkImg
            }

            data.cid = cid.cid
            data.created = cid.created
            temp.push(data)
          }
        }
        setBeatsData(temp)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    loadBeats()
  }, [])

  const playAudio = (e) => {
    new Audio(beat1).play()
  }
  return (
    <div
      style={{
        minHeight: '70vh',
        paddingBottom: '6rem',
        paddingTop: '7rem',
        backgroundColor: '#2b2828',
      }}
    >
      <Container>
        {loading ? (
          <CircularStatic />
        ) : (
          <div style={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              {beatsData.length ? (
                beatsData.map((pet, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <ImageListItem
                      style={{ height: '350px', listStyle: 'none' }}
                    >
                      <img
                        src={pet.image ? pet.image : defaultIMG}
                        alt={pet.name}
                      />
                      <ImageListItemBar
                        title={pet.name}
                        subtitle={<span> {pet.description}</span>}
                        actionIcon={
                          <IconButton
                            aria-label={`info about ${pet.name}`}
                            className="icon"
                          >
                            {/* <Button
                              variant="contained"
                              size="small"
                              component={Link}
                              to={`/card-details/${pet.cid}`}
                              // className="view-btn"
                              // color="primary"
                            >

                            </Button> */}

                            <img
                              src={play1}
                              alt=""
                              className="play1"
                              onClick={playAudio}
                            />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  </Grid>
                ))
              ) : (
                <h2>No Beats Records yet...</h2>
              )}
            </Grid>
          </div>
        )}
      </Container>
    </div>
  )
}

export default BeatsList
