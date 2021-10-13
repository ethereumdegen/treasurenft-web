<template>

<div>

   <div class="section  bg-gray-200  border-b-4 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
        
       />
     </div>


   </div>

  

   <div class="section  border-b-2 border-black" style="background:#1d1d1d;">
     <div class="text-white lg:flex lg:flex-row-reverse ">
       <div class=" w-full lg:w-1/2 p-8 ">
               

           <img src="@/assets/images/chest1.png" class=" py-8" style="margin:0 auto; width:40%;    " />
     


       </div>
       <div class=" w-full lg:w-1/2  text-center p-8 " v-if="canMint">


            <div>
               <div class="text-white text-xl">
                    Yarrr! The ETH nerds are plunderin' me booty
              </div>
                <div class="text-white text-xs">
                   Each treasure chest contains 16 0xBTC inside which can be redeemed by burning the NFT
              </div>

            </div>

              <div class="my-16 text-center">
                <div class="text-white text-xs">
                   Cost: 128 0xBTC
                 </div>


                <div  class="flex flex-row">
                  <div class="flex-grow"></div>
                  
                  <div class="select-none text-black bg-orange-500 hover:bg-orange-300 p-2 px-8 rounded border-gray border-2 cursor-pointer" @click="mint"> Mint a Treasure</div>
                  <div class="flex-grow"></div>
              </div>  

            </div>

            <div>

               <div class="text-white text-xs ">
                    {{ errorMessage }} 
              </div>


               <div class="text-white text-xs my-2">
                    {{ totalSupply }} minted of 420 max.
              </div>
                 

            </div>

        
          
       </div>

        <div class=" w-full lg:w-1/2  text-center p-8 " v-if="!canMint">

             <div>
               <div class="text-white text-xl">
                    This collection has been completely minted!
              </div>
               

            </div>



        </div>


       


     </div>
       


   </div>


      
 

    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js'  
 
 
import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
   
import FrontendHelper from '../js/frontend-helper.js';

const ERC20ABI = require('../contracts/ERC20ABI.json')
const ERC721ABI = require('../contracts/ERC721ABI.json')
const customNFTABI = require('../contracts/TreasureNFTABI.json')


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer },
  data() {
    return {
      web3Plug: new Web3Plug() , 
      signedInToWeb3: false,
      balances: {} ,
      totalSupply: 0,
      mintAmount: 1,
      errorMessage: null,

      encodedMetadata: "data:application/json;base64,eyJuYW1lIjogIjB4QlRDIFN0YXRzICMwIiwgImRlc2NyaXB0aW9uIjogIk1pbmVhYmxlIHRva2VuIHN0YXRpc3RpY3MuIiwgImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIQnlaWE5sY25abFFYTndaV04wVW1GMGFXODlJbmhOYVc1WlRXbHVJRzFsWlhRaUlIWnBaWGRDYjNnOUlqQWdNQ0F6TlRBZ016VXdJajQ4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTJjSGc3SUgwOEwzTjBlV3hsUGp4eVpXTjBJSGRwWkhSb1BTSXhNREFsSWlCb1pXbG5hSFE5SWpFd01DVWlJR1pwYkd3OUltSnNZV05ySWlBdlBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJeU1DSWdZMnhoYzNNOUltSmhjMlVpUGkwdExTQXdlRUpVUXlCVGRHRjBjeUF0TFMwOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJalF3SWlCamJHRnpjejBpWW1GelpTSStUV2x1WldRZ1UzVndjR3g1T2lBMU1EQXdQQzkwWlhoMFBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJMk1DSWdZMnhoYzNNOUltSmhjMlVpUGsxcGJtbHVaeUJFYVdabWFXTjFiSFI1T2lBeFBDOTBaWGgwUGp4MFpYaDBJSGc5SWpFd0lpQjVQU0k0TUNJZ1kyeGhjM005SW1KaGMyVWlQazFwYm1sdVp5QlNaWGRoY21RNklEVXdQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9",
      encodedImageSVG: null
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId 

        this.signedInToWeb3 =  (this.activeAccountAddress != null)

      

        let result = this.parseMetadata( this.encodedMetadata   ) 

        this.encodedImageSVG = result.image 

        this.getTotalSupply()

         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
   
      let result = this.parseMetadata( this.encodedMetadata   ) 

      this.encodedImageSVG = result.image 

  },
  mounted: function () {
    this.getBalances()


    this.getTotalSupply()



    
    setInterval(  this.getBalances.bind(this), 5000  )
  }, 
  methods: {
          canMint(){
            return this.totalSupply >= 420
          },
    

          async getBalances(){
/*
            const smasherAddress = '0xbf3122b2aa3102693e3194df7870e1a7ae146b50'
            
            const currencyAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' //WETH9  

            const currencyContract = this.web3Plug.getTokenContract( currencyAddress )

            let wethBalanceRaw = await currencyContract.methods.balanceOf( smasherAddress ).call()

            this.balances['WETH'] = this.web3Plug.rawAmountToFormatted(wethBalanceRaw, 18)

            console.log(' this.balances',  this.balances)

            this.$forceUpdate()
*/  
          },

         /* async fetchTokenURI(){
             let contractData = await this.web3Plug.getContractDataForActiveNetwork()
             const nftContract = this.web3Plug.getCustomContract( customNFTABI, contractData.treasurenft.address  )

            let result = await nftContract.methods.tokenURI( 0 ).call()

            console.log('fetchj', result )
            if(result){
                this.encodedMetadata  = result
            }
            
          },*/

          async getTotalSupply(){

            let contractData = await this.web3Plug.getContractDataForActiveNetwork()

            const nftContract = this.web3Plug.getCustomContract( customNFTABI, contractData.treasurenft.address  )

            this.totalSupply = await nftContract.methods.totalSupply().call()
  

            this.$forceUpdate()
 
          },


          parseMetadata( tokenURI ){
           // let tokenURI = this.encodedMetadata 

            const split = tokenURI.split('base64,')[1]
            let base64data = split ? split : tokenURI

            const output = Buffer.from(base64data, 'base64').toString('utf-8')

            console.log( output )
            
           // this.encodedImageSVG = JSON.parse(output) .image 

             //console.log( this.encodedImageSVG)


            return JSON.parse(output)
          },


          async mint( ){


            if(!this.signedInToWeb3){

              this.web3Plug.connectWeb3()
              return 

            }

            let userAddress = this.web3Plug.getActiveAccountAddress()
             let amt =  ( this.mintAmount ).toString()

             if( parseInt(amt) > 10  ){
               this.errorMessage = 'You may only mint up to 10 at once. '
               return 
             }
             this.errorMessage = null 

             let ethValue = parseInt(amt) * 2 * 10000000000000000 ; 

            let contractData = await this.web3Plug.getContractDataForActiveNetwork()

            const tokenContract = this.web3Plug.getCustomContract( ERC20ABI ,  contractData['0xbitcoin'].address )
            const nftContract = this.web3Plug.getCustomContract( customNFTABI, contractData.treasurenft.address  )

            //this.totalSupply = await nftContract.methods.claim( amt ).send({from: userAddress, value: ethValue })
  
            await tokenContract.methods.approveAndCall( contractData.treasurenft.address , 12800000000, "0x" ).send({from:userAddress})
             
          },  
        

         
 

  }
}
</script>
