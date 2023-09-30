<!-- src/components/Modal.svelte -->
<script>
  import { fade  } from 'svelte/transition';

  export let isOpen = false;
  export let titulo = 'titulo'

  function closeModal() {
    isOpen = false;
  }

  // Manejar cambios en la visibilidad del modal
//   $: {
//     if (isOpen) {
//       document.body.classList.add('modal-open');
//     } else {
//       document.body.classList.remove('modal-open');
//     }
//   }
</script>

{#if isOpen}
  <div class="modal-background" transition:fade="{{delay: 100, duration: 50}}">
    <div class="modal-content">
        <div class="modal-title">
            <p>{titulo}</p>
            <button on:click={closeModal}>X</button>
        </div>
        <div class="modal-content-body">
          <slot></slot>      
        </div>
    </div>
  </div>
{/if}

<style>
  .modal-content-body {
    margin-top: 50px;
  }

  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: auto;
    z-index: 1000;
  }

  .modal-title {
    background: #00b14f;
    width: 100%;
    margin: 0px;
    position:absolute;
    left: 0;
    right: 0;
    padding: 8px;
    /* margin-left:-20px; */
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;    
    align-items: center;

    max-width: 650px;
    margin: auto;
  }

  .modal-title p {
    font-size: 18px;
    color: white;
    /* font-weight: bold; */
  }

  .modal-title button {
    background: #157c2f;
    border: none;
    color: white;
    font-size: 1rem;
    /* padding: 5px; */
    cursor: pointer;
    border: 1px solid #31753b;
    border-radius: 5px;
  }

  .modal-content {
    background-color: white;
    /* padding: 20px; */
    border-radius: 5px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100vh;
    max-width: 650px;    
    /* max-height: 80%; */
    overflow: auto;
  }

</style>
