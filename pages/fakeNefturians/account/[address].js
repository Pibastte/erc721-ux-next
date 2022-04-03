import Head from 'next/head'
import {useRouter} from "next/router";
import Image from 'next/image'
import styles from '../../../styles/Home.module.scss'
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import {useState, useEffect} from 'react';
import {fakeNefturiansABI, fakeNefturiansAddress} from '../../../utils/contractNefturians'

export default function FakeNefturiansCollection() {

  const [provider, setProvider] = useState();
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();
  const [accounts, setAccounts] = useState([]);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [imageBaseURI, setImageBaseURI] = useState("");
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routeAddress, setRouteAddress] = useState(0);
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');

  const router = useRouter();
  useEffect(()=>{
      if (router.isReady && router.query.address) {
        setRouteAddress(router.query.address);
      }
  }, [router.isReady]);

  const detectProvider = () => {
    detectEthereumProvider().then(async (provider) =>  {
      if (!provider) {
        alert("No ethereum wallet found");
        return;
      }
      setProvider(provider);
      await setWeb3(new Web3(provider));
    })
  }

  async function SwitchNetwork() {
    if (!web3) {
      alert('Could not set Web3 Provider. Make sure you have a web3 enabled browser')
      return false;
    }
    const response = await (web3.currentProvider).request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }]
    }).then(() => true).catch(() => false);
    console.log({response});
    return response
  }

  useEffect(() => {
    detectProvider();
  }, []);

  useEffect(() => {
    login();
  }, [web3]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (contract && routeAddress && accounts[0]) {
        const supply = await contract.methods.totalSupply().call();

        console.log("wallet", accounts[0])
        var newTokens = [];
        for (let index = 0; index < supply; index++) {
          console.log(await contract.methods.ownerOf(index).call().then((res) => res.toLowerCase()));
          if (await contract.methods.ownerOf(index).call().then((res) => res.toLowerCase()) == accounts[0]?.toLowerCase()) {
            const _baseURI = await contract.methods.baseURI().call();
            await fetch(_baseURI + index).then(res => res.json()).then((json) => {
              const newToken = {
                'tokenId': index,
                'imageURL': json.image,
                'name': json.name,
              }
              console.log("token holder")
              console.log(tokens);
              newTokens = [...newTokens, newToken];
            }); 
          }
        }

        console.log("tokens:", newTokens);
        setTokens(newTokens);

        setLoading(false);
      }
      })();
  }, [contract, routeAddress, accounts])

  const login = async () => {
    if (!web3) {
      return false;
    }
    const res = SwitchNetwork();

    if (!res) {
      alert("You must connect to the Rinkeby chain");
      return;
    }

    if (provider === null) {
      alert('Could not set Web3 Provider. Make sure you have a web3 enabled browser')
      return;
    }

    const fakeNefturians = await new web3.eth.Contract(fakeNefturiansABI, fakeNefturiansAddress);
    setContract(fakeNefturians);

    if (!provider) return;

    const accounts = await (provider).request({
      method: "eth_requestAccounts",
    }).catch(() => [])

    setAccounts(accounts);

    if (accounts.length > 0) {
      setMetamaskConnected(true)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        { accounts && !loading && accounts.length > 0 && (
          <>
            <div className={styles.titleContainer}>
              <a href={`/fakeNefturians`}><button className='back'>Back</button></a>
              <h1>Your tokens {accounts[0].slice(0,5) + "..." + accounts[0].slice(accounts[0].length - 4, accounts[0].length)}</h1>
            </div>
            <div className={styles.gallery}>
                { tokens.map((item, index) => {
                  return (
                    <div className={styles.galleryItem}>
                      <img src={item.imageURL}></img>
                      <h3>{item.name}</h3>
                    </div>
                  )
                })}
            </div>
            <p>{tokenDescription}</p>

          </>
        )}
        { loading && (
          <>
            <div className={styles.titleContainer}>
              <h1>{tokenName}</h1>
            </div>
            <svg version="1.1" id="L5" x="0px" y="0px"
              viewBox="0 0 800 800">
              <circle fill="rgb(204, 208, 209)" stroke="none" cx="6" cy="50" r="6">
                <animateTransform 
                  attributeName="transform" 
                  dur="1s" 
                  type="translate" 
                  values="0 15 ; 0 -15; 0 15" 
                  repeatCount="indefinite" 
                  begin="0.1"/>
              </circle>
              <circle fill="rgb(204, 208, 209)" stroke="none" cx="30" cy="50" r="6">
                <animateTransform 
                  attributeName="transform" 
                  dur="1s" 
                  type="translate" 
                  values="0 10 ; 0 -10; 0 10" 
                  repeatCount="indefinite" 
                  begin="0.2"/>
              </circle>
              <circle fill="rgb(204, 208, 209)" stroke="none" cx="54" cy="50" r="6">
                <animateTransform 
                  attributeName="transform" 
                  dur="1s" 
                  type="translate" 
                  values="0 5 ; 0 -5; 0 5" 
                  repeatCount="indefinite" 
                  begin="0.3"/>
              </circle>
            </svg>
          </>
        )}
        
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
