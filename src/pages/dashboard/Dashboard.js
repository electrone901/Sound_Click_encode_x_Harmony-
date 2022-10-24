import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import {} from '@material-ui/core'
import {
  Button,
  StylesProvider,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { useParams, useLocation } from 'react-router-dom'
import './Dashboard.css'
ChartJS.register(ArcElement, Tooltip, Legend)

export const myData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
}

export function Dashboard({ dataPie, covalentAllData, contractDetails }) {
  console.log('My 777contractDetails', contractDetails)
  const allData = covalentAllData
  const onlyNFTs = covalentAllData?.data?.items[2]?.nft_data
  return (
    <div
      style={{
        paddingTop: '130px',
        backgroundColor: 'black',
        color: 'white',
        minHeight: '90vh',
      }}
    >
      <Container>
        {/* First part
        contract_address
:
"0xf8f1c045b730f918527d6257f02c4b77c57c6518"
contract_decimals
:
0
contract_name
:
"BeatStore"
contract_ticker_symbol
:
"BS"
logo_url
:
"https://logos.covalenthq.com/tokens/1666700000/0xf8f1c045b730f918527d6257f02c4b77c57c6518.png"
nft_transactions
:
[]
supports_erc
:
['erc20']
type
:
"nft"
        */}
        <div className="container-flex ">
          <div>
            {allData ? (
              <>
                <h1>All Tokens by Wallet Adddress from Harmony</h1>
                <h2>
                  We keep our transactions transparent and open to the public.
                  <strong> Powered by Covalent.</strong>
                </h2>

                <p className="dashboard-description">
                  <strong>Contract name: </strong>{' '}
                  {contractDetails?.data.items[0].contract_name}
                </p>
                <p className="dashboard-description">
                  <strong>Contract Ticket Symbol: </strong>{' '}
                  {contractDetails?.data.items[0].contract_ticker_symbol}
                </p>

                <p className="dashboard-description">
                  <strong>Contract Type: </strong>{' '}
                  {contractDetails?.data.items[0].type}
                </p>
                <p className="dashboard-description">
                  <strong>Contract Address: </strong>{' '}
                  {contractDetails?.data.items[0].contract_address}
                </p>
                <p className="dashboard-description">
                  <strong>Contract Logo URL: </strong>{' '}
                  {contractDetails?.data.items[0].logo_url}
                </p>

                <p className="dashboard-description">
                  <strong>Contract decimals: </strong>{' '}
                  {contractDetails?.data.items[0].contract_decimals}
                </p>
                <p className="dashboard-description">
                  <strong>Chain id: </strong> 1666700000
                </p>
                <p className="dashboard-description">
                  <strong>Numb of items: </strong> {allData?.data.items.length}
                </p>
                <p className="dashboard-description">
                  <strong>Update date: </strong>{' '}
                  {contractDetails?.data.updated_at}
                </p>
                <p className="dashboard-description">
                  <strong>Currency: </strong> {allData?.data.quote_currency}
                </p>
              </>
            ) : (
              <h2>Loading...</h2>
            )}
          </div>
          <div>
            <h1>Most used Contracts and its Networks</h1>
            <Pie data={dataPie} />
          </div>
        </div>
        <br />
        <br />
        <br />

        {/* ADD table here */}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NFT Image</TableCell>
                <TableCell>Contract Name</TableCell>
                <TableCell>Contract symbol</TableCell>
                <TableCell>NFT Name</TableCell>
                <TableCell>NFT Description</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {onlyNFTs &&
                onlyNFTs.map((legislator, key) => {
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
                          className="img-donation"
                          alt=""
                        />
                        {/* <Avatar
                              alt="nft logo"
                              src={legislator.external_data.image}
                            /> */}
                      </TableCell>

                      <TableCell>NFTPort</TableCell>
                      <TableCell>{legislator.token_id}</TableCell>
                      <TableCell className="line-break">
                        {legislator.external_data.name}
                      </TableCell>
                      <TableCell>
                        {legislator.external_data.description}
                      </TableCell>
                      <TableCell>{legislator.owner}</TableCell>

                      <TableCell align="center">
                        {/* <a
                          href={`https://mumbai.polygonscan.com/address/${legislator.contract_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        > */}
                        <ChevronRightIcon
                          fontSize="large"
                          style={{ color: 'blue' }}
                        />
                        {/* </a> */}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  )
}

export default Dashboard
