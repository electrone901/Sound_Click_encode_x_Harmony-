import React, { useState, useEffect } from 'react'
import {
  Container,
  Chip,
  Card,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

function CovalentApi({
  isUserLocked,
  requestFollow,
  lockedProfile,
  selectedProfile,
  visitSite,
  currentAccount,
}) {
  const [nfts, setNfts] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Covalent api takes a little bit of time to get a new nft (like 3 minutes)
  const getNFTFromCovalent = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet!')
      return
    }

    try {
      // Get NFT transactions for contract
      const chain_id = 1666700000
      const contractDetails = await fetch(
        `https://api.covalenthq.com/v1/${chain_id}/tokens/0xf8F1C045b730f918527D6257f02c4b77c57c6518/nft_transactions/1/?quote-currency=USD&format=JSON&key=ckey_ca8a590b11ff44d784ad75bd4ed`,
      )
      const contractDetailsJson = await contractDetails.json()
      console.log(
        '🚀 ~ file: CovalentApi.js ~ line 50 ~ getNFTFromCovalent ~ contractDetailsJson',
        contractDetailsJson,
      )

      
      const nfts = await fetch(
        'https://api.covalenthq.com/v1/137/address/0xf4eA652F5B7b55f1493631Ea4aFAA63Fe0acc27C/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_ca8a590b11ff44d784ad75bd4ed',
      )

      const allNFTS = await nfts.json()
      console.log('allNFTS', allNFTS)

      if (allNFTS) {
        const allData = allNFTS?.data?.items[1]
        const onlyNFTs = allData?.nft_data
        setNfts(onlyNFTs)
        setItems(allNFTS?.data?.items)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoading(true)
    getNFTFromCovalent()
  }, [])

  return (
    <div>
      {loading ? (
        <CircularProgress style={{ marginTop: '1rem' }} />
      ) : (
        <TableContainer component={Paper}>
          <br />
          <p
            style={{
              float: 'left',
              paddingLeft: '.8rem',
              color: 'gray',
              fontSize: '.9rem',
            }}
          >
            NFTs donated to this wallet address{' '}
            <strong>powered by Covalent.</strong>
          </p>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#dfd8d8' }}>
                <TableCell>Image</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {nfts &&
                nfts.map((legislator, key) => {
                  let overallRating, overallBlkRating
                  if (legislator.AverageRating) {
                    overallRating = legislator.overallRating
                  }
                  if (legislator.AverageBLKRating) {
                    overallBlkRating = legislator.overallBlkRating
                  }
                  return (
                    <TableRow key={key}>
                      <TableCell>
                        <img
                          src={legislator.external_data.image}
                          style={{ width: '100px' }}
                          alt=""
                        />
                      </TableCell>

                      <TableCell>{legislator.token_id}</TableCell>

                      <TableCell className="line-break">
                        {legislator.external_data.name}
                      </TableCell>

                      <TableCell align="center">
                        <a
                          href={`https://explorer.pops.one/address/0xf4ea652f5b7b55f1493631ea4afaa63fe0acc27c?activeTab=0`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ChevronRightIcon
                            fontSize="large"
                            style={{ color: 'blue' }}
                          />
                        </a>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default CovalentApi
