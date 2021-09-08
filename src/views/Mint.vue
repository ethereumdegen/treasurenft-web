<template>

<div>

   <div class="section bg-gray-200  border-b-2 border-black  lg:px-1 ">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug" 
       />
     </div>


   </div>

  

   <div class="section  bg-white border-b-2 border-black">
     <div class="py-16 w-container">
        
       <div class="  px-2 ">
          <div class="text-lg font-bold mb-4"> Mint your Coinpass  </div>

          <div class="text-sm   mb-8">  Your Mineable Token Coinpass is an NFT which changes color based on how much 0xBitcoin you have in your wallet.  It can act like a beacon for future airdrops and rewards that are developed by the community.    </div>
           
          <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />
          </div>

          <div  class=" px-4" v-if=" connectedToWeb3">
 
   
 
           <div class="mb-4 inline-block ">

           


             <div class="flex flex-row">
              <image   />


              <div v-if="eligibleForMint" class="border-2 border-green-500 p-4"> 

                You are eligible to Mint a Coinpass!

              </div>


               <div v-if="!eligibleForMint" class="border-2 border-red-500 p-4"> 

                You are not eligible to Mint a Coinpass.

              </div>
            </div>
               
           
            </div>

 
 

          </div>

           <div class="py-4" v-if=" connectedToWeb3 && eligibleForMint && !submitComplete">
              
 
                 <div class="  p-4">
                     <div @click="mintClicked" class="select-none bg-blue-700 p-2 inline-block rounded hover:bg-blue-900 border-gray-800 border-2 cursor-pointer text-white" style=" text-shadow: 1px 1px #222;"> Mint My Coinpass </div>
                </div> 

          </div>



          
       </div>
     </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>

import web3utils from 'web3-utils'

import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import Web3Plug from '../js/web3-plug.js'  
 import MathHelper from '../js/math-helper.js'  
 

import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
import GenericTable from './components/GenericTable.vue';
import GenericDropdown from './components/GenericDropdown.vue';
  

const { MerkleTree } = require('merkletreejs')


const keccak256 = require('keccak256');

//const GuildContractABI = require('../contracts/MinersGuild.json')
const AirdropTokenABI = require('../contracts/AirdropToken.json')
 

  const addressList = require('../config/airdropList.json')




var balanceInterval

export default {
  name: 'Stake',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericTable, GenericDropdown,NotConnectedToWeb3},
  data() {
    return {
      web3Plug: new Web3Plug() , 
  
      formInputs:{},

      tokenBalanceFormatted: null,
       
      connectedToWeb3: false ,
      submitComplete:false,
      eligibleForMint:false
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        
            await this.fetchBalance()

            await this.checkEligibility()
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
    
 

  },
   mounted: async function () {

    
     
    balanceInterval = setInterval(this.fetchBalance,8000)
    
  }, 
  beforeDestroy(){
    clearInterval(balanceInterval)
  },
  methods: {

    async checkEligibility(){

      console.log('check',this.activeAccountAddress)

         this.eligibleForMint = false 


      if(addressList.includes(  ( this.activeAccountAddress ).toLowerCase() )){

        this.eligibleForMint = true 

      }

     
    },

 
    async mintClicked(){
      console.log('start mint ')


      let accountAddress = this.web3Plug.getActiveAccountAddress()

      let chainId = this.web3Plug.getActiveNetId()
      let airdropTokenContractAddress = this.web3Plug.getContractDataForNetworkID(chainId)['airdroptoken'].address

      let tokenContractAddress = this.web3Plug.getContractDataForNetworkID(chainId)['0xbitcoin'].address

      let currencyDecimals  = 8 
      let currencyAmountRaw = MathHelper.formattedAmountToRaw(this.formInputs.currencyAmountFormatted,currencyDecimals) 
 
      let airdropTokenContract = this.web3Plug.getCustomContract( AirdropTokenABI, airdropTokenContractAddress );

    


      const leaves = addressList.map(x => keccak256(x))
      const tree = new MerkleTree(leaves, keccak256, {sortPairs: true})
      const root = tree.getRoot().toString('hex')

      const hexRoot = tree.getHexRoot()
      
      console.log('airdrop root is ', hexRoot)

       
      const leaf = keccak256(accountAddress)
      const proof = tree.getProof(leaf)

      const proofHex = tree.getHexProof(leaf)

      console.log(tree.verify(proof, leaf, root)) // true
      

      let response = await airdropTokenContract.methods.mintWithProof( proofHex ).send({from:  accountAddress })
    },


    async fetchBalance(){
       let chainId = this.web3Plug.getActiveNetId()
      let accountAddress = this.web3Plug.getActiveAccountAddress()

     
      let tokenContractAddress = this.web3Plug.getContractDataForNetworkID(chainId)['0xbitcoin'].address


      let tokenBalanceRaw = await  this.web3Plug.getTokenBalance(tokenContractAddress, accountAddress)

      console.log('tokenBalanceRaw', tokenBalanceRaw )

      this.tokenBalanceFormatted = parseFloat(   MathHelper.rawAmountToFormatted(tokenBalanceRaw  , 8  ) )
    }
          
  }
}
</script>
