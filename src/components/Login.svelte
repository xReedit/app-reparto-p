<!-- src/routes/Login.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from "$app/navigation";
	import { loginUser } from '../services/httpClient.services';
	import { setValueToken } from '$root/services/login.services';
	import DeliveryDriver from '$root/services/DeliveryDriver.services';
  
  // importar imagen logo
  import imgLogoIni from '$root/static/logo-ini.jpg'

  let usuario = '';
  let password = '';
  let error = '';
  let rememberMe = false;  

  async function handleLogin() {
    if (!usuario || !password) {
      error = 'Por favor ingresa un usuario y una contraseña.';
      return;
    }

    try {
      const _dataSend = {
        nomusuario: usuario,
        pass: password
      }

      const response = await loginUser(_dataSend)
      console.log('response', response);
    

      if (response.success) {        
        error = ''
        if (rememberMe) {
          // Guardar credenciales en localStorage si se selecciona "Recordar clave"
          localStorage.setItem('rememberedEmail', usuario);
          localStorage.setItem('rememberedPassword', password);
        } else {
          // Limpiar las credenciales almacenadas si no se selecciona "Recordar clave"
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        const {token} = response
        setValueToken(token) // Guardar el token en el localStorage
        
        // guardar datos en DeliveryDriver        
        const repartidorData = DeliveryDriver.getInstance()
        repartidorData.setUserData(response.usuario)
        


        goto('/permisos');
      } else {        
        error = 'Credenciales Incorrectas';
      }
    } catch (error) {
      console.error('Error al comunicarse con el servidor', error);
      error = 'Error al comunicarse con el servidor.';
    }
  }

  onMount(() => {
    // Limpiar el mensaje de error al cargar la página
    error = '';
    // Cargar credenciales recordadas desde localStorage si están disponibles
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
      usuario = rememberedEmail;
      password = rememberedPassword;
      rememberMe = true;
    }
  });
</script>

<main >
  <div class="div-content-img">
    <img src={imgLogoIni} alt="logo-ini">
  </div>


  <div class="div-content-ini mt-2">
    
    <p class="fs-18 font-bold">Iniciar Sesión</p>
    <br>
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <form on:submit|preventDefault={handleLogin}>
      <label>
        Usuario:
        <input type="text" bind:value={usuario} required />
      </label>
      <label>
        Contraseña:
        <input type="password" bind:value={password} required />
      </label>
  
      
      <div class="flex items-center mb-4">
        <input id="default-checkbox" bind:checked={rememberMe} type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
        <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Recordar</label>
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  </div>
</main>

<style>
  

  .div-content-img {
    width: 100%;
    background: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;    
  }

  .div-content-img img {
    width: 100%;
    max-width: 500px;
  }

  .div-content-ini {
    width: 100%;        
    display: flex;
    flex-direction: column;
    align-items: center;    
  }
  

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* label {
    font-weight: bold;
  } */

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  button {
    background-color: #007bff;
    color: white;
    padding: 0.5rem;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .error {
    color: red;
    margin-bottom: 1rem;
  }
</style>
