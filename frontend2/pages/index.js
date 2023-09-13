import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import { useAccount, useSigner, useProvider } from 'wagmi'
import { Text, Flex, Button, Card } from '@chakra-ui/react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { contractAddress, abi } from "../public/constants"
import Link from 'next/link';
import Style from "../components/BigNFTSlider/BigNFTSlider.module.css";

import { MdVerified, MdTimer } from "react-icons/md";
import { TbArrowBigLeftLines, TbArrowBigRightLine } from "react-icons/tb";

import Countdown from "react-countdown";
import { id } from 'ethers/lib/utils.js'

import axios from 'axios';



export default function Collection() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [nftList, setNftList] = useState([]);
  const [uri, setUri] = useState([]);

  const [idNumber, setIdNumber] = useState(0);

  const [ownerOfContract, setOwnerOfContract] = useState(false);
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const [countdownTimestamp, setCountdownTimestamp] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  async function fetchNfts() {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const nfts = await contract.getAllNFTs();
      setNftList(nfts);
    }
  }

  async function getUrl() {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const url = []
      for (let i = 0; i < nftList.length; i++) {
        let uri = await contract.tokenURI(nftList[i][3])
        url.push(uri);
      }
      console.log(url)
      setUri(url)
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('https://aqua-variable-hummingbird-314.mypinata.cloud/ipfs/QmdK6Ta2Z5UEhaZkcnbc9gMxHKsTEkZGK5ePXhKhnqDYMR?_gl=1*ga420r*_ga*MjEwMzk2NTQ3MS4xNjg5MTUzODY2*_ga_5RMPXG14TE*MTY5MzMwOTIxNi4xMC4xLjE2OTMzMTA0NjAuNjAuMC4w');
      setData(response.data);
    } catch (error) {
      setError(error);
    }
  };

  async function idStart() {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const nfts = await contract.getAllNFTs();

      setIdNumber(nfts.length - 1);
    }
  }

  async function finishAuction() {

    if (isConnected && nftList.length > 0) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const ownerAddress = await contract.owner()
      if (nftList[idNumber][6] != ownerAddress) {
        await contract.endAuction(nftList[idNumber][3]);
      }
      else {
        create()
      }
    }
  }

  async function getTimestamp() {
    if (isConnected && nftList.length > 0) {
      setCountdownTimestamp(parseInt(nftList[idNumber][5]));
    }
  }

  async function create() {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      contract.createShamble()
    }
  }


  useEffect(() => {
    fetchNfts();
    getUrl()
    getTimestamp()
    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const remaining = countdownTimestamp - currentTime;
      if (remaining >= 0) {
        setTimeRemaining(remaining);
      } else {
        setTimeRemaining(0);
        clearInterval(interval);
      }
    }, 1000);
  }, [address, nftList, uri]);

  useEffect(() => {
    idStart()
    isOwner()
    fetchData()
  }, [address, signer])

  const inc = useCallback(() => {
    if (idNumber + 1 < nftList.length) {
      setIdNumber(idNumber + 1);
    }
  }, [idNumber, nftList.length]);

  const dec = useCallback(() => {
    if (idNumber > 0) {
      setIdNumber(idNumber - 1);
    }
  }, [idNumber]);

  const rendererDays = ({ days }) => {
    // Render the countdown components
    return (
      <span>{days}</span>
    )
  }

  const rendererHours = ({ hours }) => {
    // Render the countdown components
    return (
      <span>{hours}</span>
    )
  }

  const rendererMinutes = ({ minutes }) => {
    // Render the countdown components
    return (
      <span>{minutes}</span>
    )
  }

  const rendererSecondes = ({ seconds }) => {
    // Render the countdown components
    return (
      <span>{seconds}</span>
    )
  }

  const [price, setPrice] = useState(0.01);

  const handleChange = (event) => {
    setPrice(event.target.value);
  };

  async function placeBid() {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      contract.placeBid(parseInt(idNumber + 1), { value: ethers.utils.parseEther(price.toString()) })
    }
  }

  async function isOwner() {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const ownerAddress = await contract.owner()
      if (address == ownerAddress) {
        setOwnerOfContract(true)
      }
      else {
        setOwnerOfContract(false)
      }
    }
  }




  return (
    <>
      <Head>
        <title>Shambles : Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {isConnected && nftList.length > 0 ? (
          <div className="App">
            <div className={Style.bigNFTSlider}>
              <div className={Style.bigNFTSlider_box}>
                <div className={Style.bigNFTSlider_box_left}>


                  <div className={Style.bigNFTSlider_box_left_bidding}>
                    <div className={Style.bigNFTSlider_box_left_bidding_box} >
                      <small>Current Bid</small>
                      <p>
                        {(ethers.utils.formatEther(nftList[idNumber][7].toString()))} <span>eth</span>
                      </p>
                      <small>highest Bidder</small>
                      <p>{nftList[idNumber][6].toString()}</p>
                    </div>
                    {timeRemaining > 0 && (idNumber + 1) == nftList.length ? (
                      <>
                        <input
                          style={{ border: "1px solid black" }}
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={price}
                          onChange={handleChange}
                        />

                        <Button style={{
                          backgroundColor: "green",
                          padding: 10,
                          margin: 10,
                          transition: "background-color 0.3s ease",
                          borderRadius: 5,
                          textDecoration: "none"
                        }} onClick={() => placeBid(price * 100)}>Place Bid</Button>
                      </>) :

                      (<></>)
                    }

                    <p className={Style.bigNFTSlider_box_left_bidding_box_auction}>
                      <MdTimer
                        className={Style.bigNFTSlider_box_left_bidding_box_icon}
                      />
                      <span>Auction ending at {new Date(nftList[idNumber][5] * 1000).toLocaleDateString()} {new Date(nftList[idNumber][5] * 1000).toLocaleTimeString()}</span>
                    </p>
                    {timeRemaining == 0 ? (
                      <>
                        {ownerOfContract && (idNumber + 1) == nftList.length ? (
                          <Button onClick={() => finishAuction()} >End Auction</Button>
                        ) : (<p></p>
                        )}
                      </>)

                      : (<>
                        {(idNumber + 1) == nftList.length ? (
                          <>
                            <div className={Style.bigNFTSlider_box_left_bidding_box_timer}>
                              <div
                                className={Style.bigNFTSlider_box_left_bidding_box_timer_item}
                              >
                                <p>
                                  <Countdown date={Date.now() + timeRemaining * 1000} renderer={rendererDays} />
                                </p>
                                <span>Days</span>
                              </div>

                              <div
                                className={Style.bigNFTSlider_box_left_bidding_box_timer_item}
                              >
                                <p>
                                  <Countdown date={Date.now() + timeRemaining * 1000} renderer={rendererHours} />
                                </p>
                                <span>Hours</span>
                              </div>

                              <div
                                className={Style.bigNFTSlider_box_left_bidding_box_timer_item}
                              >
                                <p>
                                  <Countdown date={Date.now() + timeRemaining * 1000} renderer={rendererMinutes} />
                                </p>
                                <span>mins</span>
                              </div>

                              <div
                                className={Style.bigNFTSlider_box_left_bidding_box_timer_item}
                              >
                                <p>
                                  <Countdown date={Date.now() + timeRemaining * 1000} renderer={rendererSecondes} />
                                </p>
                                <span>secs</span>
                              </div>
                            </div>
                          </>
                        ) : (<p></p>)
                        }
                      </>)}

                    <div className={Style.bigNFTSlider_box_left_sliderBtn}>
                      <TbArrowBigLeftLines
                        className={Style.bigNFTSlider_box_left_sliderBtn_icon}
                        onClick={() => dec()}
                      />
                      <TbArrowBigRightLine
                        className={Style.bigNFTSlider_box_left_sliderBtn_icon}
                        onClick={() => inc()}
                      />
                    </div>
                  </div>


                </div>
                <div className={Style.bigNFTSlider_box_right}>
                  <div className={Style.bigNFTSlider_box_right_box}>

                    <h2>SHAMBLES: {nftList[idNumber][3]}</h2>

                    <div style={{ display: 'flex' }}>
                      <Image
                        src={uri[idNumber]}
                        alt="NFT IMAGE"
                        className={Style.bigNFTSlider_box_right_box_img}
                        width={350}
                        height={350}
                      />
                      attributes:
                      <br></br>
                      {data[idNumber].attributes[1].value}
                      <br></br>
                      {data[idNumber].attributes[2].value}
                      <br></br>
                      {data[idNumber].attributes[3].value}
                      <br></br>
                      {data[idNumber].attributes[4].value}
                      <br></br>
                      {data[idNumber].attributes[5].value}
                      <br></br>
                      {data[idNumber].attributes[6].value}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <>
            <Image src="/gif.gif" alt="logo" width={400} height={400} style={{ margin: 10 }} display={{ base: 'none', md: 'block' }} />

            <Alert status='warning' width="50%">
              <Image src="/gif.gif" alt="logo" width={40} height={40} style={{ margin: 10 }} display={{ base: 'none', md: 'block' }} />
              <AlertIcon />
              Please, connect your Wallet!
            </Alert>
          </>

        )}
      </Layout>
    </>
  )
}
