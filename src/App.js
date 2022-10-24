import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import AddBeat from './pages/add-beat/AddBeat'
import BeatsList from './pages/beats-list/BeatsList'
import LandingPage from './pages/landing-page/LandingPage'
import PostDetails from './pages/post-details/PostDetails'
import Profile from './pages/profile/Profile'
import Settings from './pages/Settings'
import Dashboard from './pages/dashboard/Dashboard'
import { Navbar } from './images/layout/navbar/Navbar'
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login'
import Web3Modal, { local } from 'web3modal'
import { ABI } from '../src/contract-abi/ABI'
import { dataPie } from '../src/pages/dashboard/data-pie'
const { ethers } = require('ethers')

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [contract, setContract] = useState(null)
  console.log('🚀 ~ file: App.js ~ line 22 ~ App ~ contract', contract)
  const [signer, setSigner] = useState(null)
  const [provider, setProvider] = useState(null)
  const [currentPost, setCurrentPost] = useState(null)
  const [allBeats, setAllBeats] = useState(null)
  console.log('🚀 ~ file: App.js ~ line 27 ~ App ~ allBeats', allBeats)
  const [covalentAllData, setCovalentAllData] = useState(null)
  const [contractDetails, setContractDetails] = useState(null)

  const getNFTFromCovalent = async () => {
    try {
      //  Gets All Tokens by Wallet Adddress from Harmony
      const contractDetails = await fetch(
        `https://api.covalenthq.com/v1/1666700000/tokens/0xf8F1C045b730f918527D6257f02c4b77c57c6518/nft_transactions/1/?quote-currency=USD&format=JSON&key=ckey_ca8a590b11ff44d784ad75bd4ed`,
      )
      const contractDetailsJson = await contractDetails.json()
      console.log('contractDetailsJson', contractDetailsJson.data.items)
      setContractDetails(contractDetailsJson)

      //  Gets All NFTs by address
      const nfts = await fetch(
        'https://api.covalenthq.com/v1/137/address/0x11760DB13aE3Aa5Bca17fC7D62172be2A2Ea9C11/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_ca8a590b11ff44d784ad75bd4ed',
      )

      // let allNFTS = await nfts.json()
      const covalentAllData = await nfts.json()
      setCovalentAllData(covalentAllData)

      const covalentContractsItems = await covalentAllData.data.items

      const nftDataArray = covalentContractsItems.map((contract) =>
        contract.balance.slice(0, 4),
      )

      const contractNamesLabels = covalentContractsItems.map(
        (contract) => contract.contract_name,
      )

      dataPie.labels = contractNamesLabels
      dataPie.datasets[0].data = nftDataArray
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getNFTFromCovalent()
  }, [])

  const connectWallet = async () => {
    const web3Modal = new Web3Modal() //gets network chain
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    setProvider(provider)
    setSigner(signer)
    setCurrentAccount(address)
    let contract = new ethers.Contract(
      '0xf8F1C045b730f918527D6257f02c4b77c57c6518',
      ABI,
      signer,
    )
    setContract(contract)
    if (contract) {
      const getBeats = await getAllBeats(contract)
      // const getBeats = await contract.getAllBeats()
      // setAllBeats(getBeats)
    }
  }

  const getImage = (ipfsURL) => {
    if (!ipfsURL) return
    ipfsURL = ipfsURL.split('://')
    return 'https://ipfs.io/ipfs/' + ipfsURL[1]
  }

  const getAllBeats = async (contract) => {
    const temp = []
    const res = await contract.getAllBeats()
    console.log('🚀 ~ file: App.js ~ line 92 ~ getAllBeats ~ res', res)

    for (let i = 0; i < res.length; i++) {
      let obj = {}
      // data from smart contract
      const creator = res[i][4]
      const price = res[i]['price'].toString()
      const beatId = res[i].id.toString()
      const isSold = res[i].isSold.toString()

      // fetchs data from nftStorage
      const nftStorageURL = res[i][2]
      let getNFTStorageData = await fetch(nftStorageURL)
      let beatData = await getNFTStorageData.json()
      console.log(
        '🚀 ~ file: App.js ~ line 106 ~ getAllBeats ~ beatData',
        beatData,
      )

      const img = getImage(beatData.image)
      // description image name

      // gets data from nftStorage
      // const data = JSON.parse(beatData.description)
      // builds fundraiser data
      obj.beatId = beatId
      obj.creator = creator
      obj.price = price
      obj.isSold = isSold
      obj.title = beatData.name
      obj.image = img
      obj.description = beatData.description
      // obj.category = data.category
      // obj.targetAmmount = data.targetAmmount
      // obj.creationDate = data.creationDate
      temp.push(obj)
    }

    setAllBeats(temp)
  }

  const userLogOut = () => {
    localStorage.removeItem('address')
    setCurrentAccount(null)
  }

  return (
    <>
      <Navbar currentAccount={currentAccount} userLogOut={userLogOut} />
      {currentAccount ? (
        <div className="">
          <Routes>
            <Route
              path="/"
              element={<LandingPage setCurrentPost={setCurrentPost} />}
            />
            <Route
              path="/store"
              element={
                <BeatsList
                  setCurrentPost={setCurrentPost}
                  contract={contract}
                />
              }
            />
            <Route
              path="/add-beat"
              element={
                <AddBeat currentAccount={currentAccount} contract={contract} />
              }
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  dataPie={dataPie}
                  covalentAllData={covalentAllData}
                  contractDetails={contractDetails}
                />
              }
            />
            <Route
              path="/details"
              element={
                <PostDetails
                  currentPost={currentPost}
                  currentAccount={currentAccount}
                />
              }
            />
            <Route
              path="/profile"
              element={<Profile currentAccount={currentAccount} />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      ) : (
        <div className="loginPage">
          <h2> Log in to continue</h2>

          <Button
            onClick={connectWallet}
            variant="contained"
            style={{ backgroundColor: 'red' }}
            endIcon={<LoginIcon />}
          >
            Login
          </Button>
          <img
            src="https://duckduckgo.com/i/7f3d4ac9.png"
            height="200px"
            width="200px"
            className=""
            alt="Logo"
          />
        </div>
      )}
    </>
  )
}
export default App
