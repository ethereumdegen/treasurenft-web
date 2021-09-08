<template>

<div>

   <div class="section  bg-gray-200  border-b-4 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
        
       />
     </div>


   </div>

  

   <div class="section  border-b-2 border-black" style="background:#eee;">
     <div class=" ">
       <div class=" ">

       </div>
       <div class="  flex lg:flex-row flex-col  ">
 
         <div class="  md:w-1/2  w-full mt-8 py-8  px-1  text-center">

            <div class="hidden text-white text-xl my-4">  </div> 

        <div>
            <router-link to="/mint"  class="select-none no-underline bg-blue-700 mb-16 p-2 inline-block rounded hover:bg-blue-900 border-gray-800 border-2 cursor-pointer text-blue-100" style=" text-shadow: 1px 1px #222;"> Claim your Coinpass  </router-link> 
        </div>

         <div class="w-1/2" style="margin: 0 auto">  
           Every account holding at least 1000 0xBTC during the snapshot on September 7 2021 is able to claim a free Coinpass NFT!
        </div>
      
           
         </div>
         <div class="   md:w-1/2  w-full  text-center ">
           
             
              <img src="@/assets/images/coinpass.png" class="pl-4 py-16" width="240px" style="margin:0 auto;" />


         </div>
       </div>
     </div>
   </div>


    <div class="section  text-white  border-b-2 border-black " style="background:#222;">
     <div class="w-container  ">

         

          

        
         


     </div>
   </div>



    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js'  

 
import FrontPageMedia from './components/FrontPageMedia.vue';
 
import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';
  
import StarflaskAPIHelper from '../js/starflask-api-helper.js';
import FrontendHelper from '../js/frontend-helper.js';


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, TabsBar, FrontPageMedia },
  data() {
    return {
      web3Plug: new Web3Plug() , 
      activePanelId: null, 
       

      
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId 
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
   
       

  },
  mounted: function () {
         
    
  }, 
  methods: {
          setActivePanel(panelId){
              if(panelId == this.activePanelId){
                this.activePanelId = null;
                return 
              }
               this.activePanelId = panelId ;
          },
          onTabSelect(tabname){
            console.log(tabname)

              this.selectedTab = tabname.toLowerCase()


          },

          getRouteTo(dest){
            return FrontendHelper.getRouteTo(dest)
          }

       
 

  }
}
</script>
