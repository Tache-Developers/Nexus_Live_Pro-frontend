<template>
	<Panel>
		<template #header>
			<div class="flex align-items-center gap-2 flex-end w-full justify-content-between flex-wrap">
				<h1 class="m-0">Proveedores</h1>
				<div class="botones flex gap-2 flex-wrap">
					<span class="p-input-icon-left">
						<i class="pi pi-search" />
						<!-- <InputText v-model="filtersCreadores['global'].value" placeholder="Buscar.." />
					 -->
					</span>
					<Button label="Proveedor" icon="pi pi-plus" @click="modalProveedor = true" />
				</div>
			</div>
		</template>
		<DataTable :value="proveedores" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%">
			<Column field="nombre" header="Nombre" sortable />
			<Column field="api_key" header="Api Key">
				<template #body="props">
					<Password v-model="props.data.api_key" disabled toggleMask :feedback="false" />
				</template>
			</Column>
			<Column field="api_url" header="API url">
				<template #body="props">
					<Password v-model="props.data.api_url" disabled toggleMask :feedback="false" />
				</template>
			</Column>
			<Column header="Acciones">
				<template #body="props">
					<div class="flex flex-wrap gap-2">
						<Button
							icon="pi pi-pencil"
							v-tooltip.top="'Editar proveedor'"
							outlined
							rounded
							severity="warning"
							@click="editarProveedorDialog(props.data)"
						/>
						<Button icon="pi pi-trash" v-tooltip.top="'Eliminar proveedor'" outlined rounded severity="danger" />
					</div>
				</template>
			</Column>
		</DataTable>
		<!-- Modal agregar evento -->
		<Dialog
			v-model:visible="modalProveedor"
			header="Nuevo proveedor"
			:style="{ width: '40rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<form ref="formProveedor">
				<div class="flex flex-column gap-1 mb-2">
					<label for="nombre" class="font-bold block">Nombre</label>
					<InputText type="text" id="nombre" v-model="paquete.nombre" required />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="clave" class="font-bold block">API KEY</label>
					<Password v-model="paquete.api_key" id="clave" required toggleMask :feedback="false" />
				</div>
				<div class="flex flex-column gap-1 mb-3">
					<label for="url" class="font-bold block">API URL</label>
					<InputText type="url" id="url" v-model="paquete.api_url" required />
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="modalProveedor = false" text severity="danger" autofocus />
				<Button
					:label="id_current_edit_proveedor == null ? 'Crear' : 'Actualizar'"
					@click="crearProveedor"
					:disabled="btnCrearProveedor"
					severity="success"
				/>
			</template>
		</Dialog>
	</Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		header: {
			headers: {
				Authorization: null,
			},
		},
		btnCrearProveedor: false,
		paquete: {
			nombre: null,
			api_url: null,
			api_key: null,
		},
		id_current_edit_proveedor: null,
		modalProveedor: false,
		proveedores: [],
	}),
	methods: {
		editarProveedorDialog(proveedor) {
			if (proveedor) {
				this.id_current_edit_proveedor = proveedor._id;
				delete proveedor._id;
				delete proveedor.__v;
				this.paquete = { ...proveedor };
				this.modalProveedor = true;
			}
		},
		async crearProveedor() {
			this.btnCrearProveedor = true;
			if (this.id_current_edit_proveedor == null) {
				if (this.paquete.nombre != null && this.paquete.api_key != null && this.paquete.api_url != null) {
					if (this.paquete.api_key.trim().length > 0) {
						await axios
							.post(`${this.API}/proveedor-promocion/crear`, this.paquete, { headers: this.header.headers })
							.then((resp) => {
								if (!resp.data.error) {
									this.paquete = {
										nombre: null,
										api_url: null,
										api_key: null,
									};
									this.getProveedores();
								}
								this.$toast.add({
									severity: resp.data.error ? "error" : "success",
									summary: "Crear proveedor",
									detail: resp.data.message,
									life: 1600,
								});
							})
							.catch((error) => {
								switch (error.response.data.statusCode) {
									case 400:
										//Bad Request
										this.$toast.add({
											severity: "error",
											summary: "Crear proveedor",
											detail: "Formato de URL principal no válida",
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
											summary: "Crear proveedor",
											detail: "Sucedió un error, comuníquese con soporte",
											life: 1600,
										});
										console.log("Error: ", error);
										break;
								}
							});
					} else {
						this.$toast.add({
							severity: "warn",
							summary: "Crear proveedor",
							detail: "La API KEY no debe estar vacía",
							life: 1600,
						});
					}
				} else {
					this.$toast.add({
						severity: "warn",
						summary: "Crear proveedor",
						detail: "Debes llenar todos los campos",
						life: 1600,
					});
				}
			} else {
				await axios
					.put(`${this.API}/proveedor-promocion/${this.id_current_edit_proveedor}`, this.paquete, { headers: this.header.headers })
					.then((resp) => {
						if (!resp.data.error) {
							this.paquete = {
								nombre: null,
								api_url: null,
								api_key: null,
							};
							this.id_current_edit_proveedor = null;
							this.modalProveedor = false;
							this.getProveedores();
						}
						this.$toast.add({
							severity: resp.data.error ? "error" : "success",
							summary: "Editar proveedor",
							detail: resp.data.message,
							life: 1600,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
                            case 400:
                                //Bad Request
                                this.$toast.add({
                                    severity: "error",
                                    summary: "Editar proveedor",
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
                                    summary: "Editar proveedor",
                                    detail: "Sucedió un error, comuníquese con soporte",
                                    life: 1600,
                                });
                                console.log("Error: ", error);
                                break;
                        }
					});
			}
			this.btnCrearProveedor = false;
		},
		async getProveedores() {
			await axios
				.get(`${this.API}/proveedor-promocion`, { headers: this.header.headers })
				.then((resp) => {
					this.proveedores = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 400:
							//Bad Request
							this.$toast.add({
								severity: "error",
								summary: "Obtener proveedores",
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
								summary: "Obtener proveedores",
								detail: "Sucedió un error, comuníquese con soporte",
								life: 1600,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.header.headers.Authorization = `Bearer ${this.store.getToken()}`;
		await this.getProveedores();
	},
};
</script>