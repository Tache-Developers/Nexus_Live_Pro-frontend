<template>
	<Panel class="creadores">
		<Toast />
		<template #header>
			<div class="flex items-center gap-2 flex-end w-full justify-content-between">
				<h1 class="m-0">Lista de deseos</h1>
				<div class="botones flex gap-2">
					<Button label="Pedir" icon="pi pi-plus" @click="modalDeseoManual = true" />
					<Button label="Aliexpress" severity="danger" @click="modalDeseoAliexpress = true" icon="pi pi-plus" />
				</div>
			</div>
		</template>

		<div class="flex gap-6 flex-wrap justify-content-center">
			<Card v-for="deseo in deseos" :key="deseo._id" style="width: 220px; padding: 10px">
				<template #content>
					<img v-tooltip="deseo.nombre" width="200px" height="200px" :src="deseo.foto" alt="deseo" class="border-round imgInsignias" />
					<a :href="deseo.link" target="_blank">
						<Button
							:href="deseo.link"
							class="btnLike absolute ml-2"
							size="small"
							rounded
							icon="pi pi-shopping-cart"
							style="left: 5px; top: 55px"
						/>
					</a>
					<Button
						class="btnLike absolute"
						size="small"
						rounded
						icon="pi pi-heart"
						severity="danger"
						@click="cambiarFavorito(deseo._id)"
						:outlined="!deseo.favoritos.includes(this.ID)"
						style="right: 5px; bottom: 55px"
					/>
					<Button
						class="btnLike"
						size="small"
						rounded
						icon="pi pi-trash"
						severity="danger"
						v-if="store.isAdmin()"
						@click="confirmarBorrarDeseoF(deseo)"
						style="right: 5px; bottom: 55px"
					/>
				</template>
				<template #footer>
					<div class="flex justify-content-between align-items-center">
						<div class="mt-0 font-semibold">{{ deseo.precio }}</div>
					</div>
					<div class="flex justify-content-start align-items-center">
						<Avatar :image="deseo.usuarioDeseo.foto" class="mr-2" size="small" shape="circle" />
						<p class="textDeseo mb-3 font-medium">{{ deseo.usuarioDeseo.nombre }}</p>
					</div>
				</template>
			</Card>
		</div>
	</Panel>
	<Dialog
		v-model:visible="modalDeseoManual"
		header="Agregar Producto"
		:style="{ width: '40rem' }"
		:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
		position="center"
		:modal="true"
		:draggable="false"
	>
		<form ref="formDeseoManual">
			<div class="flex flex-column gap-1 mt-2">
				<label for="link" class="font-bold block">Url</label>
				<InputText id="link" placeholder="Ingrese el link del producto" v-model="paqueteDeseoManual.link" required />
			</div>
			<div class="flex flex-column gap-1 mt-2">
				<label for="nombre" class="font-bold block">Nombre</label>
				<InputText id="nombre" placeholder="Ingrese el nombre del producto" v-model="paqueteDeseoManual.nombre" required />
			</div>
			<div class="flex flex-column gap-1 mt-2">
				<label for="precio" class="font-bold block">Precio</label>
				<InputText id="precio" placeholder="Ingrese el precio en COP" v-model="paqueteDeseoManual.precio" required />
			</div>
			<div class="flex flex-column gap-1 mt-2">
				<label for="foto" class="font-bold block">Foto</label>
				<InputText type="file" accept="image/*" @change="asignarFotoDeseo" required id="foto" placeholder="Ingrese la foto" />
			</div>
		</form>
		<template #footer>
			<Button label="Cancelar" @click="modalDeseoManual = false" autofocus text severity="danger" />
			<Button label="Pedir" :disabled="btnDeseoManual" @click="pedirDeseoManual()" />
		</template>
	</Dialog>
	<Dialog
		v-model:visible="modalDeseoAliexpress"
		header="Agregar Producto"
		:style="{ width: '80rem' }"
		:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
		position="center"
		:modal="true"
		:draggable="false"
	>
		<form ref="formAliexpress">
			<iframe ref="myIframe" src="https://es.aliexpress.com" @load="attachClickEventListener" width="100%" height="600px"></iframe>
		</form>
		<template #footer>
			<Button label="Cancelar" @click="modalDeseoAliexpress = false" autofocus text severity="danger" />
			<Button label="Pedir" :disabled="btnDeseoAliexpress" @click="pedirDeseoAliexpress()" />
		</template>
	</Dialog>
	<Dialog
		v-model:visible="abrirModalBorrarDeseo"
		header="Restablecer Contraseña"
		:style="{ width: '50rem' }"
		:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
		position="top"
		:modal="true"
		:draggable="false"
	>
		<h3>¿Esta seguro de borrar {{ confirmarBorrarDeseo.nombre }}?</h3>
		<template #footer>
			<Button label="No,Cancelar" @click="abrirModalBorrarDeseo = false" text severity="danger" autofocus />
			<Button label="Si, Borrar" @click="eliminarDeseo()" severity="success" />
		</template>
	</Dialog>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		ID: "",
		modalDeseoManual: false,
		modalDeseoAliexpress: false,
		abrirModalBorrarDeseo: false,
		deseos: [],
		paqueteDeseoManual: {
			id: null,
			link: null,
			nombre: null,
			precio: null,
			foto: null,
		},
		paqueteDeseoAliexpress: {
			link: null,
			id: null,
		},
		confirmarBorrarDeseo: {
			id: null,
			nombre: null,
		},
		btnDeseoManual: false,
		btnDeseoAliexpress: false,
	}),
	methods: {
		async pedirDeseoManual() {
			this.btnDeseoManual = true;
			this.paqueteDeseoManual.id = this.store.getId();
			if (this.validaPaquete(this.paqueteDeseoManual)) {
				await axios
					.post(`${this.API}/tienda/deseo`, this.paqueteDeseoManual, {
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${this.store.getToken()}`,
						},
					})
					.then((response) => {
						if (response.data) {
							this.$toast.add({
								severity: "success",
								summary: "Pedir deseo",
								detail: "Se creo correctamente",
								life: 1500,
							});
							this.obtenerDeseos();
							this.$refs.formDeseoManual.reset();
						} else {
							this.$toast.add({
								severity: "error",
								summary: "Pedir deseo",
								detail: "Comuniquese con soporte",
								life: 1500,
							});
						}
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({
									severity: "error",
									summary: "Pedir deseo",
									detail: "Sucedió un error,comuniquese con soporte",
									life: 1500,
								});
								console.log("Error: ", error);
								break;
						}
					});
			} else {
				this.$toast.add({
					severity: "error",
					summary: "Pedir deseo",
					detail: "Llene todos los campos",
					life: 1500,
				});
			}
			this.btnDeseoManual = false;
		},
		asignarFotoDeseo(event) {
			this.paqueteDeseoManual.foto = event.target.files[0];
		},
		validaPaquete(objeto) {
			for (const key in objeto) {
				if (objeto[key] === null) {
					return false;
				}
			}
			return true;
		},
		confirmarBorrarDeseoF(deseo) {
			this.confirmarBorrarDeseo.id = deseo._id;
			this.confirmarBorrarDeseo.nombre = deseo.nombre;
			this.abrirModalBorrarDeseo = true;
		},
		async cambiarFavorito(idDeseo) {
			this.deseos.forEach((deseo, i) => {
				if (deseo._id == idDeseo) {
					const indice = deseo.favoritos.findIndex((elemen) => elemen == this.ID);
					if (indice == -1) {
						this.deseos[i].favoritos.push(this.ID);
					} else {
						this.deseos[i].favoritos.splice(indice, 1);
					}
					axios
						.post(
							`${this.API}/tienda/deseos/favorito`,
							{
								id: this.ID,
								idDeseo,
							},
							{
								headers: {
									Authorization: `Bearer ${this.store.getToken()}`,
								},
							}
						)
						.then((response) => {
							if (response.data) {
								this.$toast.add({
									severity: "success",
									summary: "Agregar deseo",
									life: 1500,
								});
								this.obtenerDeseos();
								this.$refs.formDeseoManual.reset();
							} else {
								this.$toast.add({
									severity: "error",
									summary: "Agregar deseo",
									detail: "Comuniquese con soporte",
									life: 1500,
								});
							}
						})
						.catch((error) => {
							switch (error.response.data.statusCode) {
								case 401:
									//Se le termino la sesión
									this.store.clearUser();
									this.$router.push("/login");
									break;
								default:
									this.$toast.add({
										severity: "error",
										summary: "Agregar deseo",
										detail: "Sucedió un error, comuniquese con soporte",
										life: 1500,
									});
									console.log("Error: ", error);
									break;
							}
						});
				}
			});
		},
		async obtenerDeseos() {
			this.deseos = await axios
				.get(`${this.API}/tienda/deseos`, {
					headers: {
						Authorization: `Bearer ${this.store.getToken()}`,
					},
				})
				.then((resp) => {
					return resp.data;
				})

				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Pedir deseo",
								detail: "Sucedió un error, no se pudo procesar el archivo",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		attachClickEventListener() {
			const iframe = this.$refs.myIframe;
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.document.addEventListener("click", this.handleIframeClick);
			}
		},
		handleIframeClick(event) {
			const target = event.target;
			if (target.tagName === "A" && target.href) {
				event.preventDefault();
				const url = target.href;
				alert("URL capturada:", url);
			}
		},
		async pedirDeseoAliexpress() {
			if (this.paqueteDeseoAliexpress.link === null || !this.paqueteDeseoAliexpress.link.includes("aliexpress.com")) {
				this.$toast.add({
					severity: "error",
					summary: "Deseo aliexpress",
					detail: "Ingrese un link de aliexpress",
					life: 3500,
				});
				return;
			}
			this.btnDeseoAliexpress = true;
			this.paqueteDeseoAliexpress.id = this.store.getId();
			this.$toast.add({
				severity: "info",
				summary: "Pedir deseo",
				detail: "Espere un momento por favor",
				life: 7500,
			});
			await axios
				.post(`${this.API}/tienda/aliexpress`, this.paqueteDeseoAliexpress, {
					headers: {
						Authorization: `Bearer ${this.store.getToken()}`,
					},
				})
				.then(() => {
					this.obtenerDeseos();
					this.$toast.add({
						severity: "success",
						summary: "Pedir deseo",
						detail: "Se creo correctamente",
						life: 1500,
					});
					this.paqueteDeseoAliexpress.link = null;
					this.btnDeseoAliexpress = false;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Pedir deseo",
								detail: "Sucedió un error, no se pudo procesar el archivo",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async eliminarDeseo() {
			await axios
				.delete(`${this.API}/tienda/deseo/${this.confirmarBorrarDeseo.id}`, {
					headers: {
						Authorization: `Bearer ${this.store.getToken()}`,
					},
				})
				.then(() => {
					this.obtenerDeseos();
					this.$toast.add({
						severity: "success",
						summary: "Pedir deseo",
						detail: "Se elimino correctamente",
						life: 1500,
					});
					this.confirmarBorrarDeseo.id = null;
					this.abrirModalBorrarDeseo = false;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Pedir deseo",
								detail: "Sucedió un error, no se pudo eliminar el deseo",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		beforeDestroy() {
			const iframe = this.$refs.myIframe;
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.document.removeEventListener("click", this.handleIframeClick);
			}
		},
	},
	created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.ID = this.store.getId();
		this.obtenerDeseos();
	},
};
</script>
<style scope>
.btnLike {
	transform: scale(0.7);
}
.textDeseo {
	max-width: 100%; /* Asegura que el párrafo no sea más ancho que el contenedor */
	word-wrap: break-word; /* Asegura que las palabras se rompan para ajustarse al contenedor */
}
</style>
