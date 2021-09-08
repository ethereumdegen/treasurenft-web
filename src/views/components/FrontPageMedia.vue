<template> 
<div class="   pt-8   pb-2 mb-12 text-white" style="min-height:300px">
            
             

            <div class="  flex flex-col" >
            
                <div id="canvas" style="height:260px">



                </div>
 
                
           </div> 


 </div>
 </template>



<script>

    
    import * as THREE from 'three';

    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
     
    import { GLTFLoader } from '../../js/GLTFLoader.js';
     
    let camera, scene, renderer, pivot;

    export default {
    name: 'FrontPageMedia',
    props: [ ],
    data() {
        return {
            startTime: 0
        }
    },
    mounted(){
        this.startTime= Date.now()

        setInterval(this.update,500)

        this.createScene()
    },
    methods: {
            createScene(){
                const container = document.getElementById( 'canvas' );
				 
                camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
				camera.position.set( - 1.8, 0.6, 2.7 );

				scene = new THREE.Scene();

                  pivot = new THREE.Group();
                scene.add( pivot );
               


                const loader =  new THREE.GLTFLoader().setPath( '/models/' );
						loader.load( 'coin.glb', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

								//	roughnessMipmapper.generateMipmaps( child.material );

								}

							} );

							pivot.add( gltf.scene );

							//roughnessMipmapper.dispose();

							this.render();

						}.bind(this) );


                renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				
				renderer.outputEncoding = THREE.sRGBEncoding;
				container.appendChild( renderer.domElement );

                const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
                scene.add( directionalLight );

                const light = new THREE.AmbientLight( 0x404040 ); // soft white light
                scene.add( light );


                scene.background = new THREE.Color( 0xeeeeee );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', this.render ); // use if there is no animation loop
				controls.minDistance = 2;
				controls.maxDistance = 10;
				controls.target.set( 0, 0, - 0.2 );
				controls.update();

				//window.addEventListener( 'resize', onWindowResize );





                renderer.setAnimationLoop(() => {
                    this.update();
                    this.render();
                });
            },

            render() {
                
                
				renderer.render( scene, camera );

			},

         update() {
           
           // const delta = clock.getDelta();

             if(pivot){
                    pivot.rotation.y += 0.01;
                  console.log('update')
              }
        },

        
         getTimeElapsed(){
             return Date.now() - this.startTime
         }
    }
    }
</script>
