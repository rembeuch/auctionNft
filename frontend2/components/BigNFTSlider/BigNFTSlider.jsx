import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AiFillFire, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdVerified, MdTimer } from "react-icons/md";
import { TbArrowBigLeftLines, TbArrowBigRightLine } from "react-icons/tb";

//INTERNAL IMPORT
import Style from "./BigNFTSlider.module.css";

const BigNFTSlider = () => {
    const [idNumber, setIdNumber] = useState(0);

    const sliderData = [
        {
            title: "Hello NFT",
            id: 1,
            name: "Daulat Hussain",
            collection: "GYm",
            price: "00664 ETH",
            like: 243,
            image: "https://aqua-variable-hummingbird-314.mypinata.cloud/ipfs/QmS3MohLamsBBuo87LmH6yxu6LJTcnvfxPeNkw4yijoLhH/1.png",
            nftImage: "https://aqua-variable-hummingbird-314.mypinata.cloud/ipfs/QmS3MohLamsBBuo87LmH6yxu6LJTcnvfxPeNkw4yijoLhH/1.png",
            time: {
                days: 21,
                hours: 40,
                minutes: 81,
                seconds: 15,
            },
        },
        {
            title: "Buddy NFT",
            id: 2,
            name: "Shoaib Hussain",
            collection: "Home",
            price: "0000004 ETH",
            like: 243,
            image: "https://aqua-variable-hummingbird-314.mypinata.cloud/ipfs/QmS3MohLamsBBuo87LmH6yxu6LJTcnvfxPeNkw4yijoLhH/10.png",
            nftImage: "https://aqua-variable-hummingbird-314.mypinata.cloud/ipfs/QmS3MohLamsBBuo87LmH6yxu6LJTcnvfxPeNkw4yijoLhH/10.png",
            time: {
                days: 77,
                hours: 11,
                minutes: 21,
                seconds: 45,
            },
        },
    ];

    //-------INC
    const inc = useCallback(() => {
        if (idNumber + 1 < sliderData.length) {
            setIdNumber(idNumber + 1);
        }
    }, [idNumber, sliderData.length]);

    //-------DEC
    const dec = useCallback(() => {
        if (idNumber > 0) {
            setIdNumber(idNumber - 1);
        }
    }, [idNumber]);

    return (
        <div className={Style.bigNFTSlider}>
            <div className={Style.bigNFTSlider_box}>
                <div className={Style.bigNFTSlider_box_left}>


                    <div className={Style.bigNFTSlider_box_left_bidding}>
                        <div className={Style.bigNFTSlider_box_left_bidding_box}>
                            <small>Current Bid</small>
                            <p>
                                {sliderData[idNumber].price} <span>$221,21</span>
                            </p>
                        </div>

                        <p className={Style.bigNFTSlider_box_left_bidding_box_auction}>
                            <MdTimer
                                className={Style.bigNFTSlider_box_left_bidding_box_icon}
                            />
                            <span>Auction ending in</span>
                        </p>

                        <div className={Style.bigNFTSlider_box_left_bidding_box_timer}>
                            <div
                                className={Style.bigNFTSlider_box_left_bidding_box_timer_item}
                            >
                                <p>{sliderData[idNumber].time.days}</p>
                                <span>Days</span>
                            </div>

                            <div
                                className={Style.bigNFTSlider_box_left_bidding_box_timer_item}
                            >
                                <p>{sliderData[idNumber].time.hours}</p>
                                <span>Hours</span>
                            </div>

                            <div
                                className={Style.bigNFTSlider_box_left_bidding_box_timer_item}
                            >
                                <p>{sliderData[idNumber].time.minutes}</p>
                                <span>mins</span>
                            </div>

                            <div
                                className={Style.bigNFTSlider_box_left_bidding_box_timer_item}
                            >
                                <p>{sliderData[idNumber].time.seconds}</p>
                                <span>secs</span>
                            </div>
                        </div>
                    </div>

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

                <div className={Style.bigNFTSlider_box_right}>
                    <div className={Style.bigNFTSlider_box_right_box}>
                        <h2>SHAMBLES: {sliderData[idNumber].id}</h2>

                        <Image
                            src={sliderData[idNumber].nftImage}
                            alt="NFT IMAGE"
                            className={Style.bigNFTSlider_box_right_box_img}
                            width={350}
                            height={350}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BigNFTSlider;