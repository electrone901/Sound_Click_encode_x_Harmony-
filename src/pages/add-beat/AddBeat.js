import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import './AddBeat.css'
import {
  TextField,
  Container,
  StylesProvider,
  Button,
  IconButton,
  MenuItem,
} from '@material-ui/core'
import { NFTStorage, File } from 'nft.storage'
import { createRef } from 'react'
import { apiKey } from '../../APIKEYS'

function AddBeat({ currentAccount, contract }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const petTypeRef = createRef()
  const [artistName, setArtistName] = useState(null)
  const [beatName, setBeatName] = useState(null)
  const [price, setPrice] = useState(null)
  const [imageName, setImageName] = useState(null)
  const [imageType, setImageType] = useState(null)
  const [petType, setPetType] = useState(null)

  useEffect(() => {
    if (!contract) {
      alert('Please connect your wallet')
    }
  }, [contract])

  const handleImage = (event) => {
    setImage(event.target.files[0])
    setImageName(event.target.files[0].name)
    setImageType(event.target.files[0].type)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const client = new NFTStorage({ token: apiKey })
      const metadata = await client.store({
        name: artistName,
        description: `${beatName}, ${petType}, ${price}`,
        image: new File([image], imageName, { type: imageType }),
      })
      if (metadata) {
        const url = metadata?.url.substring(7)
        const beat_cid_storage = `https://cloudflare-ipfs.com/ipfs/${url}`
        const saveToContract = await contract.createBeat(
          beat_cid_storage,
          price,
        )
        const tx = await saveToContract.wait()
        console.log('tx', tx)
        navigate('/store')
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <StylesProvider injectFirst>
      <Container
        className="root-create-pet"
        style={{ minHeight: '70vh', paddingBottom: '3rem' }}
      >
        <div>
          <br />

          <h2> Post your music and show the world your talent.</h2>
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="pet"
              className="img-preview"
            />
          ) : (
            ''
          )}
          <div className="form-container">
            <form className="form" noValidate autoComplete="off">
              <input
                accept="image/*"
                className="input"
                id="icon-button-photo"
                defaultValue={image}
                onChange={handleImage}
                type="file"
                required
              />
              <label htmlFor="icon-button-photo">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Artist's name"
                variant="outlined"
                className="text-field"
                defaultValue={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required
              />
              <br />
              <TextField
                fullWidth
                id="outlined-basic"
                label="Beat's name"
                variant="outlined"
                className="text-field"
                defaultValue={beatName}
                onChange={(e) => setBeatName(e.target.value)}
                required
              />
              <br />
              <TextField
                type="number"
                fullWidth
                id="outline-basic"
                label="Price"
                variant="outlined"
                className="text-field"
                defaultValue={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <br />
              <TextField
                fullWidth
                name="petType"
                select
                label="Beat Type"
                variant="outlined"
                className="text-field"
                onChange={(e) => setPetType(e.target.value)}
                defaultValue=""
                ref={petTypeRef}
              >
                <MenuItem value="Hip Hop">Hip Hop</MenuItem>
                <MenuItem value="Classic">Classic</MenuItem>
                <MenuItem value="Pop">Pop</MenuItem>
                <MenuItem
                  value="
                Country"
                >
                  Country
                </MenuItem>
                <MenuItem value="Regge">Regge</MenuItem>
                <MenuItem value="Latin">Latin</MenuItem>
                <MenuItem value="House">House</MenuItem>
                <MenuItem value="Rap ">Rap</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <br />
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </StylesProvider>
  )
}

export default AddBeat
