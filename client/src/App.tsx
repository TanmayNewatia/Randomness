import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.RANDOMNET });
const provider = new Aptos(aptosConfig);
// change this to be your module account address
export const moduleAddress = "0x9c66d431344cbbe4e9231fa4b52a89b2cd43bb700a1339d4ea973e7154e531df";

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [counter, setCounter] = useState<Array<number>>([]);
  // const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  // const [reload, setReload] = useState<number>(0);

  const fetch = async () => {
    if (!account) return;
    try {
      const todoListResource = await provider.getAccountResource({
        accountAddress: account?.address,
        resourceType: `${moduleAddress}::dice::DiceRollHistory`
      }
      );
      console.log(todoListResource);
      let data = JSON.parse((todoListResource?.rolls[todoListResource?.rolls.length - 1] as any));
      setCounter(data);
      // if(reload){
      //   window.location.reload();
      // }
    }
    catch (e: any) {
      console.log(e);
    }
  }
  // useEffect(() => {
  //   fetch();
  // }, [1000]);

  const initialize = async () => {
    if (!account) return [];
    // setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::dice::roll`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.log(error);
    } finally {
      // setTransactionInProgress(false);
    }
  };

  // const incrementCounter = async () => {
  //   setTransactionInProgress(true);
  //   // build a transaction payload to be submited
  //   const payload = {
  //     type: "entry_function_payload",
  //     function: `${moduleAddress}::mycounter::increment`,
  //     type_arguments: [],
  //     arguments: [],
  //   };
  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(payload);
  //     // wait for transaction
  //     await provider.waitForTransaction(response.hash);
  //     window.location.reload();
  //   } catch (error: any) {
  //     console.log(error);
  //     // setAccountHasList(false);
  //   } finally {
  //     setTransactionInProgress(false);
  //   }
  // };

  // //Runs one Time
  // useEffect(() => {
  //   fetch();
  // }, [account?.address]);

  const timer = () => { setInterval(() => { fetch() }, 5000); }

  //Runs every 5 second
  useEffect(() => {
    timer();
  }, [account?.address]);

  return (
    <>
      <Layout>
        <Row align="middle" justify="space-between">
          <Col>
            <h1>Our Random API</h1>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
        {/* <Spin spinning={transactionInProgress}> */}
        <Row style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Col>
            <Button
              disabled={!account}
              block
              onClick={initialize}
              type="primary"
              style={{ margin: "0 auto", borderRadius: "50%", height: "200px", width: "200px", backgroundColor: "#3f67ff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
            >
              <PlusCircleFilled style={{ fontSize: "80px" }} />
              <p style={{ fontSize: "20px" }}>Click Me!</p>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <p style={{ fontSize: "80px", textAlign: "center" }}>Dice: {counter}</p>
          </Col>
        </Row>
        {/* </Spin > */}
      </div>

    </>
  );
}

export default App;
