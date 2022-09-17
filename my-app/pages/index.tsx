import { trace } from 'console'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Core  from 'web3modal'
import Web3Modal from 'web3modal'
import {providers} from 'ethers'

const Home: NextPage = () => {


  interface thisSigner extends providers.JsonRpcSigner {
    getAddress() : Promise<string>
  }

  const [walletConnected, setWalletConnected] = useState(false) 

  const [address, setAddress] = useState<string>('')

  const [ens, setEns] = useState<string>('')

    const web3ModalRef = useRef<Core>() 
  

  const setEnsorAddress = async (address:any,web3Provider:any) => {
    var _ens = await web3Provider.lookupAddress(address)
    
    if(_ens){
      setEns(_ens)
    }else{
      setAddress(address)
    }
  }


  const getProviderOrSigner = async (needSigner:boolean = false) => {
  
    const provider  = await web3ModalRef.current?.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const {chainId} = await web3Provider.getNetwork()

    if(chainId!==4){
      window.alert('Change the network to rinkeby')
      throw new Error('Change the network to rinkeby')
    }

      const signer = web3Provider.getSigner() 

      const address = await signer.getAddress() 

      await setEnsorAddress(address,web3Provider)

    return signer as thisSigner


  }


  const connectWallet  = async ( ) => {
    try{
      await getProviderOrSigner()
      setWalletConnected(true)
    }
    catch(err){console.log(err)}
  }

  useEffect(() => {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network:'rinkeby',
        providerOptions:{},
        disableInjectedProvider:false
      })
      connectWallet()
    }
  }, [walletConnected])


  const renderButton = ( ) => {
    if(walletConnected){
      return(
      <p className='text-zinc-200 w-fit bg-green-600 px-2 py-3 rounded-lg' >Wallet Connected</p>
      )
    }else{
      return(
      <button 
        onClick={connectWallet}
        className='bg-sky-800 text-zinc-200 px-4 py-3 rounded-xl '
         >
          Connect Your Wallet
        </button>
      )
    }
  }
  
  return (
    <div 
    >
      <Head>
        <title>LearnWeb3 Punks</title>
        <meta name="description" content="Ethereum Name Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className='
        flex items-center justify-center
        min-h-screen min-w-full bg-zinc-300 text-zinc-700'>
          
       <div 
        className='
          p-10
          rounded-xl overflow-hidden
          shadow-xl flex items-center justify-center gap-4 bg-zinc-200'>
          
        <section  
        className='flex flex-col items-start justify-center gap-10 p-4'
          >
          <h1 
            className='text-xl md:text-2xl lg:text-3xl 
              overflow-ellipsis
              overflow-hidden
              max-w-[50vmin]'
             >

            Welcome to LearnWeb3 Punks 
            <br/>
            <span
               className='font-mono text-ellipsis whitespace-nowrap overflow-hidden'
               >

            -{ens? ens :address}

              </span>
          </h1>
          <h3>
            Its an NFT collections for LearnWeb3 Punks
          </h3>

            {renderButton()}
        </section>
      <section
         className='min-w-[70vmin] lg:min-w-[40mvin] '
         >
        <Image 
            className='rounded-xl '
            src={'/learnweb3punks.png'}
            width={200} height={100}
            layout='responsive'
              alt='heroimage'
            objectFit='cover'
            
            />
        </section>


        </div>
      </main>
    </div>
  )
}

export default Home
