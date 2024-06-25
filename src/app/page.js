"use client";
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from '../firebase/config.js'
import moment from "moment/moment.js";

function Home(){
  const [halfTiffin,setHalfTiffin] = useState([]);
  const [fullTiffin,setFullTiffin] = useState([]);
  const [allTiffin,setAllTiffin] = useState([]);
  const [billAmount,serBillAmount] = useState(0);
  const [todayDate,setToDate] = useState();
  const [todayTime, setTodayTime] = useState();
  const [currentTimeStamp, setCurrentTimeStamp] = useState();
  const [currentDateTiffin, setCurrentDateTiffin] = useState([]);

  // Get All Tiffin
  function getTiffins(){

    setToDate(moment(new Date()).format("DD"));
    setTodayTime(moment(new Date()).format("HH"));
    setCurrentTimeStamp(serverTimestamp());

    getDocs(query(collection(db,"tiffin"),where("timestamp", "==",`${currentTimeStamp}`))).then((snapshort=>{
      setCurrentDateTiffin(snapshort.docs.map((doc)=>({id:doc.id,type:doc.data().type,timestamp:doc.data().timestamp})));
    }))
  
    getDocs(query(collection(db,"tiffin"),orderBy("timestamp", "desc"))).then((snapshort=>{
      setAllTiffin(snapshort.docs.map((doc)=>({id:doc.id,type:doc.data().type,timestamp:doc.data().timestamp})));
    }))
    
    const q = query(collection(db,"tiffin"),where("type","==","HALF"));
    getDocs(q).then(snapshort=>{
      setHalfTiffin(snapshort.docs.map((doc)=>({id:doc.id,type:doc.data().type,timestamp:doc.data().timestamp})));
    })

    const q1 = query(collection(db,"tiffin"),where("type","==","Full"));
    getDocs(q1).then(snapshort=>{
      setFullTiffin(snapshort.docs.map((doc)=>({id:doc.id,type:doc.data().type,timestamp:doc.data().timestamp})));
    })
  }

  // Featch The Tiffin Data From Firebase
  useEffect(() => {
    getTiffins();
  },[]);

  // Add Half Tiffin
  async function handleClickHalfTifin() {
    try {
      const docRef = await addDoc(collection(db, "tiffin"), {
        type:"HALF",
        timestamp: serverTimestamp()
      });
      console.log("Document written with ID: ", docRef.id);
      getTiffins();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Add Full Tiffin
  async function handleClickFullTiffin(){
    try {
      const docRef = await addDoc(collection(db, "tiffin"), {
        type:"Full",
        timestamp: serverTimestamp()
      });
      console.log("Document written with ID: ", docRef.id);
      getTiffins();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Delete Tiffin Record
  async function deleteTiffin(id){
    await deleteDoc(doc(db,`tiffin/${id}`));
  }

  // Remove Tiffin Record
  async function handleClickClear(){
    try {
      fullTiffin.map((doc)=>{
        deleteTiffin(doc.id)
      })
      halfTiffin.map((doc)=>{
        deleteTiffin(doc.id)
      })
      getTiffins();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }

  // Generate Bill Handler
  const handleClickBill = ()=>{
    const halfTiffinPrice = prompt("Enter HALF TIFFIN PRICE PER TIFFIN - ");
    const fullTiifinPrice = prompt("Enter FULL TIFFIN PRICE PER TIFFIN - ");
    serBillAmount((halfTiffin.length * halfTiffinPrice) + (fullTiffin.length * fullTiifinPrice));
  }


  return (
    <>
      <div className="container p-3">
        <div className="row text-center title">
          <h1>Welcome To Your <br/> <span>Tiffin Management</span></h1>
        </div>
        <div className="row inputDiv justify-content-center align-items-center text-center">
            {
              currentDateTiffin.length == "0"
              ?
              (
                  todayTime >= "12" && todayTime <= "18" ?
                (
                  <>
                      <div className="col-xl-3">
                        <span>{halfTiffin.length <= 9 ? '0'+halfTiffin.length  : halfTiffin.length}</span>
                        <button onClick={handleClickHalfTifin}>Add Half Tiffin</button>
                      </div>
                      <div className="col-xl-3">
                        <span>{fullTiffin.length <= 9 ? '0'+fullTiffin.length  : fullTiffin.length}</span>
                        <button onClick={handleClickFullTiffin}>Add Full Tiffin</button>
                      </div>
                  </>
                )
                :
                <>
                  <div className="col-xl-12">
                    <p className="text-danger font-weight-bold">Tiffin Add Option Is Disabled, Is Opened In Between - 12 AM To 6 PM Only.</p>
                  </div>
                </>
              )
              :
              <>
                <div className="col-xl-12">
                  <p className="text-danger font-weight-bold">Your Already Added Today Tiffin.</p>
                </div>
              </>
            }
            {
              todayDate <=5 || todayDate >= 30 ? (
                <>
                  <div className="col-xl-3">
                    <span>{(fullTiffin.length + halfTiffin.length) <= 9 ? '0'+(fullTiffin.length + halfTiffin.length)  : (halfTiffin.length + fullTiffin.length)}</span>
                    <button onClick={handleClickClear}>Clear</button>
                  </div>
                  <div className="col-xl-3">
                    <span>{billAmount <= 9 ? '0'+billAmount : billAmount}</span>
                    <button onClick={handleClickBill}>Generate Bill</button>
                  </div>
                </>
              ) : ""
            }
        </div>
        <div className="row tiffin_record justify-content-center">
            {
              allTiffin.map((data,index)=>{
                return (
                  <div className="col-xl-3 card_tiffin" key={index}>
                      <p>{data.type.toUpperCase()}</p>
                      <p>{moment(data.timestamp.toDate()).format("LLLL")}</p>
                  </div>
                )
              })
            }
        </div>
      </div>
    </>
  )
}
export default Home;