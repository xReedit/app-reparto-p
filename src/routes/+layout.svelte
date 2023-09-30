<script>
	import "../app.css";	
    import '$root/styles/micss.css';
</script>
<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }

  .content {    
    /* display: flex; */
    /* justify-content: center; */
    /* width: 100%; */
  }

</style>
<div class="content"> 
  <slot/>
</div>

<!-- <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">      
      <div class="px-4 py-6 sm:px-0">
        <div class="h-full rounded-lg border-2 border-gray-200 bg-white">
            <slot></slot>
        </div>
      </div>      
    </div>
</main> -->
