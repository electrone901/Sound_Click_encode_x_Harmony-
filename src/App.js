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
  const [signer, setSigner] = useState(null)
  const [provider, setProvider] = useState(null)
  const [currentPost, setCurrentPost] = useState(null)
  const [allData, setAllData] = useState(null)
  const [covalentAllData, setCovalentAllData] = useState(null)

  const getNFTFromCovalent = async () => {
    try {
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
      '0x16d7be29ebc6db2e9c92E0Bf1dE5c1cfe6b1AD2a',
      ABI,
      signer,
    )
    setContract(contract)
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
