<template>
	<div class="regalos-root">
		<Panel class="regalos">
			<template #header>
				<div class="flex align-items-center gap-2 flex-end w-full justify-content-between flex-wrap">
					<h1 class="m-0">Regalos</h1>
					<div class="botones flex gap-2 flex-wrap">
						<span class="p-input-icon-left">
							<i class="pi pi-search" />
							<InputText v-model="buscarRegalo" placeholder="Descripción o Monedas" />
						</span>
						<Button label="Regalo" icon="pi pi-plus" @click="modalRegalo = true" />
					</div>
				</div>
			</template>
			<DataView :value="regalos" layout="grid" class="dataview-regalos">
				<template #grid="props">
					<div class="grid grid-nogutter justify-content-center">
						<div v-for="(regalo, index) in props.items" :key="index" class="col-auto p-1 shadow-green-900 border-round card-regalo">
							<div class="p-2 border-none surface-none border-round flex flex-column">
								<div class="flex justify-content-center border-round">
									<div class="relative mx-auto w-full h-full">
										<img class="border-round w-full h-full" :src="regalo.imagen" alt="Regalo" style="max-width: 300px" />
									</div>
								</div>
								<div class="pt-2">
									<div class="flex flex-row justify-content-between align-items-start gap-2">
										<div class="text-lg font-medium text-900 mt-1">{{ regalo.descripcion }}</div>
									</div>
									<div class="flex flex-column gap-2 mt-1 flex-wrap">
										<div class="flex justify-content-between gap-1 align-items-center flex-wrap">
											<Chip :label="`${regalo.precio_monedas}`" image="/assets/img/moneda_tiktok.png" class="w-max" />
											<Chip :label="`${regalo.precio_usd}`" icon="pi pi-dollar" class="w-max" />
										</div>

										<div class="flex gap-2 flex-wrap">
											<Button icon="pi pi-pencil" label="Editar" @click="showModalEditar(regalo)" class="flex-auto whitespace-nowrap" />
											<Button
												icon="pi pi-trash"
												severity="danger"
												@click="confirmarEliminar(regalo._id)"
												outlined
												v-tooltip.top="'Eliminar regalo'"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</DataView>
		</Panel>
		<Dialog
			v-model:visible="modalRegalo"
			header="Crear regalo"
			:style="{ width: '40rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<div class="flex justify-content-center">
				<form ref="formRegalo" style="width: 30rem">
					<div class="form-container">
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Descripción</label>
							<InputText v-model="paqueteRegalo.descripcion" required />
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label for="imagen-regalo" class="font-bold block">Regalo</label>
							<InputText
								type="file"
								id="imagen-regalo"
								accept="image/*"
								@change="asignarRegalo"
								required
								aria-describedby="imagen-regalo-help"
							/>
							<small id="imagen-regalo-help">El archivo debe pesar máximo 10MB.</small>
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Monedas</label>
							<InputText type="number" v-model="paqueteRegalo.precio_monedas" :min="1" required />
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Dólares</label>
							<InputText type="number" readonly v-model="conversionDolares" />
						</div>
					</div>
				</form>
			</div>
			<template #footer>
				<Button label="Cancelar" @click="modalRegalo = false" autofocus text severity="danger" />
				<Button :label="msg_btn_crear" :disabled="btnCrear" @click="crearRegalo" />
			</template>
		</Dialog>
		<ConfirmDialog />
	</div>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		headers: {
			headers: {
				Authorization: null,
			},
		},
		modalRegalo: false,
		id_regalo_editar: null,
		regalos: [],
		copia_regalos: [],
		buscarRegalo: null,
		paqueteRegalo: {
			descripcion: null,
			imagen: null,
			precio_monedas: 1,
		},
		btnCrear: false,
		msg_btn_crear: "Crear",
	}),
	methods: {
		showModalEditar(regalo = null) {
			if (regalo) {
				this.id_regalo_editar = regalo._id;
				this.paqueteRegalo.descripcion = regalo.descripcion;
				this.paqueteRegalo.precio_monedas = regalo.precio_monedas;
				this.msg_btn_crear = "Editar";
				this.modalRegalo = true;
			}
		},
		asignarRegalo(event) {
			const file = event.target.files[0];

			if (file) {
				if (file.type.startsWith("image/")) {
					//Cloudinary solo soporta archivos de 10MB en la subida por código en el plan free
					if (file.size <= 10000000) {
						this.paqueteRegalo.imagen = file;
					} else {
						event.target.value = null;
						this.$toast.add({ severity: "error", summary: "Regalo", detail: "El archivo debe pesar máximo 10MB", life: 3000 });
						return;
					}
				} else {
					event.target.value = null;
					this.$toast.add({ severity: "error", summary: "Regalo", detail: "Solo se permiten imágenes", life: 3000 });
					return;
				}
			}
		},
		confirmarEliminar(id_regalo) {
			this.$confirm.require({
				message: `¿Está seguro de eliminar este regalo?`,
				header: "Eliminar premio",
				icon: "pi pi-exclamation-triangle",
				rejectClass: "p-button-secondary p-button-outlined",
				rejectLabel: "No, cancelar",
				acceptLabel: "Sí, eliminar",
				acceptClass: "p-button-danger",
				defaultFocus: "reject",
				accept: () => {
					this.eliminarRegalo(id_regalo);
				},
				reject: () => {},
			});
		},
		async crearRegalo() {
			if (this.id_regalo_editar == null) {
				this.btnCrear = true;
				this.paqueteRegalo.precio_monedas = parseFloat(this.paqueteRegalo.precio_monedas);
				if (this.paqueteRegalo.descripcion != null && this.paqueteRegalo.imagen != null && this.paqueteRegalo.precio_monedas != null) {
					if (this.paqueteRegalo.imagen.type.startsWith("image/")) {
						//Cloudinary solo soporta archivos de 10MB en la subida por código en el plan free
						if (this.paqueteRegalo.imagen.size <= 10000000) {
							if (this.paqueteRegalo.precio_monedas > 0) {
								await axios
									.postForm(`${this.API}/regalo/crear`, this.paqueteRegalo, this.headers)
									.then((resp) => {
										if (resp.data.creado) {
											this.modalRegalo = false;
											this.paqueteRegalo = { descripcion: null, imagen: null, precio_monedas: 1 };
											this.getRegalos();
										}
										this.$toast.add({
											severity: resp.data.creado ? "success" : "error",
											summary: "Crear regalo",
											detail: resp.data.message,
											life: 1700,
										});
									})
									.catch((error) => {
										switch (error.response.data.statusCode) {
											case 400:
												//Bad Request
												this.$toast.add({
													severity: "error",
													summary: "Crear regalo",
													detail: "Formato de los datos incorrecto",
													life: 1600,
												});
												break;
											case 401:
												//Se le termino la sesión
												this.store.clearUser();
												this.$router.push("/login");
												break;
											default:
												this.$toast.add({
													severity: "error",
													summary: "Crear regalo",
													detail: "Sucedió un error, comuníquese con soporte",
													life: 1600,
												});
												console.log("Error: ", error);
												break;
										}
									});
							} else {
								this.$toast.add({ severity: "warn", summary: "Regalo", detail: "Las monedas deben ser un número positivo", life: 1600 });
							}
						} else {
							this.paqueteRegalo.imagen = null;
							this.$toast.add({ severity: "error", summary: "Imagen", detail: "La imagen debe pesar máximo 10MB", life: 1600 });
						}
					} else {
						this.paqueteRegalo.imagen = null;
						this.$toast.add({ severity: "error", summary: "Imagen", detail: "Solo se permiten imágenes", life: 1600 });
					}
				} else {
					this.$toast.add({ severity: "warn", summary: "Regalo", detail: "Todos los campos son obligatorios", life: 1600 });
				}
				this.btnCrear = false;
			} else {
				this.editarRegalo();
			}
		},
		async editarRegalo() {
			if (this.id_regalo_editar != null) {
				this.btnCrear = true;
				this.paqueteRegalo.precio_monedas = parseFloat(this.paqueteRegalo.precio_monedas);
				if (this.paqueteRegalo.descripcion != null && this.paqueteRegalo.precio_monedas != null) {
					if (this.paqueteRegalo.precio_monedas > 0) {
						await axios
							.putForm(`${this.API}/regalo/${this.id_regalo_editar}`, this.paqueteRegalo, this.headers)
							.then((resp) => {
								if (resp.data.actualizado) {
									this.id_regalo_editar = null;
									this.modalRegalo = false;
									this.paqueteRegalo = { descripcion: null, imagen: null, precio_monedas: 1 };
									this.getRegalos();
									this.msg_btn_crear = "Crear";
								}
								this.$toast.add({
									severity: resp.data.actualizado ? "success" : "error",
									summary: "Editar regalo",
									detail: resp.data.message,
									life: 1700,
								});
							})
							.catch((error) => {
								switch (error.response.data.statusCode) {
									case 400:
										//Bad Request
										this.$toast.add({
											severity: "error",
											summary: "Crear regalo",
											detail: "Formato de los datos incorrecto",
											life: 1640,
										});
										break;
									case 401:
										//Se le termino la sesión
										this.store.clearUser();
										this.$router.push("/login");
										break;
									default:
										this.$toast.add({
											severity: "error",
											summary: "Crear regalo",
											detail: "Sucedió un error, comuníquese con soporte",
											life: 1640,
										});
										console.log("Error: ", error);
										break;
								}
							});
					} else {
						this.$toast.add({ severity: "warn", summary: "Regalo", detail: "Las monedas deben ser un número positivo", life: 1600 });
					}
				} else {
					this.$toast.add({ severity: "warn", summary: "Regalo", detail: "Los campos descripción y monedas son obligatorios", life: 1600 });
				}
				this.btnCrear = false;
			}
		},
		async eliminarRegalo(id_regalo = null) {
			if (id_regalo != null) {
				await axios
					.delete(`${this.API}/regalo/${id_regalo}`, this.headers)
					.then((resp) => {
						if (resp.data.eliminado) {
							this.getRegalos();
						}
						this.$toast.add({
							severity: resp.data.eliminado ? "success" : "error",
							summary: "Eliminar regalo",
							detail: resp.data.message,
							life: 1700,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 400:
								//Bad Request
								this.$toast.add({
									severity: "error",
									summary: "Crear regalo",
									detail: "Formato de los datos incorrecto",
									life: 1640,
								});
								break;
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({
									severity: "error",
									summary: "Crear regalo",
									detail: "Sucedió un error, comuníquese con soporte",
									life: 1640,
								});
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		async getRegalos() {
			await axios
				.get(`${this.API}/regalo`, this.headers)
				.then((resp) => {
					this.regalos = resp.data;
					this.copia_regalos = resp.data;
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
								summary: "Regalos",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
	},
	watch: {
		buscarRegalo(newValue) {
			if (newValue != null && newValue != "") {
				this.regalos = this.copia_regalos.filter(
					(regalo) =>
						regalo.descripcion
							.normalize("NFD")
							.replace(/[\u0300-\u036f]/g, "")
							.toLowerCase()
							.includes(
								newValue
									.normalize("NFD")
									.replace(/[\u0300-\u036f]/g, "")
									.toLowerCase()
							) || regalo.precio_monedas.toString().includes(newValue)
				);
			} else {
				this.regalos = this.copia_regalos;
			}
		},
	},
	computed: {
		conversionDolares() {
			return this.paqueteRegalo.precio_monedas / 100;
		},
	},
	async created() {
		this.store = useStoreEvento();
		this.headers.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getRegalos();
	},
};
</script>

<style>
.regalos-root > .regalos > .p-toggleable-content > .p-panel-content,
.regalos-root > .regalos > .p-toggleable-content > .p-panel-content > .dataview-regalos > .p-dataview-content {
	background: transparent;
	border: 0;
}

.regalos-root > .regalos > .p-toggleable-content > .p-panel-content > .dataview-regalos > .p-dataview-content > .grid {
	row-gap: 12px;
	column-gap: 12px;
}

.card-regalo {
	background: #2e2e2e;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	max-height: 410px;
	width: 260px !important;
}

.card-regalo > *,
.card-regalo > div > div:first-child > div,
.card-regalo > div > div:first-child > div > img {
	max-height: 100% !important;
}

.card-regalo > div > div:first-child {
	max-height: 250px !important;
	height: 200px !important;
}
.card-regalo > div > div:last-child {
	max-height: 150px !important;
}

@media (max-width: 269px) {
	.card-regalo {
		width: 100% !important;
		max-height: 402px !important;
		height: 402px !important;
	}

	.card-regalo > div > div:last-child > div:last-child > div:first-child {
		flex-direction: column;
		align-items: start !important;
	}
}

@media (max-width: 235px) {
	.card-regalo {
		max-height: 455px !important;
		height: 455px !important;
	}
}
@media (max-width: 235px) {
	.card-regalo {
		max-height: 465px !important;
		height: 465px !important;
	}
}
</style>