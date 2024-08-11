<template>
	<Panel class="creadores">
		<Toast />
		<template #header>
			<div class="flex align-items-center gap-2 flex-end flex-wrap w-full justify-content-between">
				<h1 class="m-0">Entregar premios</h1>
				<h3 class="m-0 p-0 text-white">Total pagar: ${{ totalPagar }}</h3>
				<InputText v-model="filters['global'].value" placeholder="Buscar...  " />
			</div>
		</template>
		<DataTable
			:value="premios"
			dataKey="id"
			sortField="estado"
			:sortOrder="1"
			:customSort="customSort"
			v-model:filters="filters"
			paginator
			:rows="5"
			:rowsPerPageOptions="[5, 10, 20, 50]"
			tableStyle="min-width: 100%"
		>
			<Column field="tipo_premio" header="Tipo premio" sortable />
			<Column field="nombre" header="Usuario" sortable></Column>
			<Column field="transferencia.metodo_pago" header="Metodo" sortable></Column>
			<Column field="premio" header="Premio">
				<template #body="slotProps">
					<p class="m-0" v-if="slotProps.data.tipo_premio !== 'Objeto'">{{ slotProps.data.premio }}</p>
					<Image v-else :src="slotProps.data.premio" alt="Imagen del premio" width="250" preview />
				</template>
			</Column>
			<Column field="descripcion" header="Descripción"></Column>
			<Column field="fecha_obtenido" header="Fecha obtenido" />
			<Column field="transferencia" header="Fecha entrega">
				<template #body="props">
					{{
						props.data.transferencia.fecha_reclamado != null
							? props.data.transferencia.fecha_reclamado.slice(0, 10) + " " + props.data.transferencia.fecha_reclamado.slice(11, 16)
							: null
					}}
				</template>
			</Column>
			<Column field="estado" header="Estado">
				<template #body="slotProps">
					<Tag
						:severity="ponerEstado(slotProps.data.estado)"
						:value="`${
							slotProps.data.estado === 'Entregado'
								? 'Entregado | ' +
								  slotProps.data.transferencia.fecha_reclamado.slice(0, 10) +
								  ' ' +
								  slotProps.data.transferencia.fecha_reclamado.slice(11, 16)
								: slotProps.data.estado
						}`"
					/>
				</template>
			</Column>
			<Column header="Acciones">
				<template #body="slotProps">
					<div class="flex gap-2 flex-row">
						<Button
							v-if="slotProps.data.estado === 'En proceso'"
							icon="pi pi-send"
							v-tooltip.top="'Enviar premio'"
							@click="Preparar(slotProps.data)"
						></Button>
						<Button
							v-if="slotProps.data.estado != 'Entregado' && slotProps.data.estado != 'Expirado'"
							@click="cambiarEstadoPremio(slotProps.data.usuario, slotProps.data.id_concurso, 'Expirado', slotProps.data.fecha_unica)"
							v-tooltip.top="'Expirar premio'"
							icon="pi pi-stopwatch"
							outlined
							rounded
							severity="danger"
						/>
						<Button
							v-if="slotProps.data.estado == 'Expirado'"
							@click="cambiarEstadoPremio(slotProps.data.usuario, slotProps.data.id_concurso, 'Sin reclamar', slotProps.data.fecha_unica)"
							v-tooltip.top="'Habilitar premio'"
							icon="pi pi-replay"
							severity="info"
							outlined
							rounded
						/>
						<Button
							v-tooltip.top="'Eliminar premio'"
							v-if="slotProps.data.estado != 'Entregado'"
							icon="pi pi-trash"
							severity="danger"
							outlined
							rounded
							@click="confirmarEliminar(slotProps.data.usuario, slotProps.data.id_concurso, slotProps.data.fecha_unica)"
						/>
					</div>
					<Image
						v-tooltip.top="'Comprobante de entrega'"
						v-if="slotProps.data.estado == 'Entregado' && slotProps.data.tipo_premio != 'SaldoApi'"
						:src="slotProps.data.transferencia.comprobante"
						alt="Imagen del premio"
						width="50"
						preview
					/>
				</template>
			</Column>
		</DataTable>
		<Dialog
			v-model:visible="EnviarModal"
			:header="`Pago: ${
				datosTransferencia.transferencia.metodo_pago != null ? datosTransferencia.transferencia.metodo_pago.toUpperCase() : ''
			}`"
			:style="{ width: '40rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<div v-if="datosTransferencia.tipo_premio === 'Efectivo' || datosTransferencia.tipo_premio == 'Bonus'">
				<div class="flex gap-2 sm:flex-column md:flex-row" v-if="datosTransferencia.transferencia.metodo_pago === 'banco'">
					<div class="flex flex-column gap-2 w-6 sm:w-full md:w-6">
						<label class="font-semibold">Tipo de cuenta</label>
						<InputText disabled v-model="datosTransferencia.transferencia.tipo_cuenta.tipo" class="flex-auto" autocomplete="off" />
					</div>
					<div class="flex flex-column gap-2 w-6 sm:w-full md:w-6">
						<label class="font-semibold">Número de cuenta</label>
						<InputText disabled v-model="datosTransferencia.transferencia.cuenta" class="flex-auto" autocomplete="off" />
					</div>
				</div>
				<div class="flex flex-column gap-2" v-if="datosTransferencia.transferencia.metodo_pago === 'nequi'">
					<label class="font-semibold">Cuenta Nequi</label>
					<InlineMessage severity="info">{{ datosTransferencia.transferencia.cuenta }}</InlineMessage>
				</div>
				<div class="flex flex-column gap-2" v-if="datosTransferencia.transferencia.metodo_pago === 'paypal'">
					<label class="font-semibold">Correo PayPal</label>
					<InputText disabled v-model="datosTransferencia.transferencia.cuenta" class="flex-auto" autocomplete="off" />
				</div>

				<div class="flex flex-column gap-2" v-if="datosTransferencia.transferencia.metodo_pago === 'banco'">
					<label class="font-semibold">Banco</label>
					<InputText disabled v-model="datosTransferencia.transferencia.banco" class="flex-auto" autocomplete="off" />
				</div>
				<div class="flex flex-column gap-2" v-if="datosTransferencia.transferencia.metodo_pago === 'banco'">
					<label class="font-semibold">Titular</label>
					<InputText disabled v-model="datosTransferencia.transferencia.titular_cuenta" class="flex-auto" autocomplete="off" />
				</div>
				<div class="flex flex-column gap-2" v-if="datosTransferencia.transferencia.metodo_pago === 'banco'">
					<label class="font-semibold">Cédula</label>
					<InputText disabled v-model="datosTransferencia.transferencia.cedula" class="flex-auto" autocomplete="off" />
				</div>
				<div class="flex flex-column gap-2" v-if="datosTransferencia.transferencia.metodo_pago === 'binance'">
					<label class="font-semibold">ID Binance</label>
					<InputText disabled v-model="datosTransferencia.transferencia.cuenta" class="flex-auto" autocomplete="off" />
				</div>
			</div>
			<div v-if="datosTransferencia.transferencia.metodo_pago === 'Envio'">
				<div class="flex flex-column gap-2">
					<label class="font-semibold">Cédula</label>
					<InputText disabled v-model="datosTransferencia.transferencia.cedula" class="flex-auto" autocomplete="off" />
				</div>
				<div class="flex flex-column gap-2">
					<label class="font-semibold">Nombre receptor</label>
					<InputText disabled v-model="datosTransferencia.transferencia.titular_cuenta" class="flex-auto" autocomplete="off" />
				</div>
				<div class="flex flex-column gap-2 w-full">
					<label class="font-semibold">País</label>
					<InputText disabled v-model="datosTransferencia.transferencia.pais" class="flex-auto" autocomplete="off" />
				</div>
				<div class="flex gap-2 xs:flex-column sm:flex-column md:flex-row">
					<div class="flex flex-column gap-2 xs:w-full sm:w-full md:w-6">
						<label class="font-semibold">Departamento</label>
						<InputText disabled v-model="datosTransferencia.transferencia.departamento" class="flex-auto" autocomplete="off" />
					</div>
					<div class="flex flex-column gap-2 sm:w-full md:w-6">
						<label class="font-semibold">Ciudad</label>
						<InputText disabled v-model="datosTransferencia.transferencia.ciudad" class="flex-auto" autocomplete="off" />
					</div>
				</div>
				<div class="flex flex-column gap-2">
					<label class="font-semibold">Dirección</label>
					<InputText disabled v-model="datosTransferencia.transferencia.direccion" class="flex-auto" autocomplete="off" />
				</div>

				<div class="flex flex-column gap-2">
					<label class="font-semibold">Teléfono</label>
					<InputText disabled v-model="datosTransferencia.transferencia.telefono" class="flex-auto" autocomplete="off" />
				</div>
				<div class="flex flex-column gap-2">
					<label class="font-semibold">Código postal</label>
					<InputText disabled v-model="datosTransferencia.transferencia.codigo_postal" class="flex-auto" autocomplete="off" />
				</div>
			</div>
			<div class="flex flex-column gap-2 mt-4">
				<label class="font-semibold">Comprobante</label>
				<InputText type="file" id="comprobante" accept="image/*" @change="(event) => (paquete.comprobante = event.target.files[0])" />
			</div>
			<template #footer>
				<Button label="Cancelar" @click="EnviarModal = false" autofocus text severity="danger" />
				<Button label="Entregar premio" @click="EnviarPremio"></Button>
			</template>
		</Dialog>
		<ConfirmDialog />
	</Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import { FilterMatchMode } from "primevue/api";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		token: null,
		servicios: [],
		usuarios: null,
		EnviarModal: false,
		filters: {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		},
		Usuarios: [],
		premios: [],
		tipo: null,
		sortField: "estado",
		sortOrder: 1,
		paquete: { usuario: null, comprobante: null, id_concurso: null },
		datosTransferencia: {
			transferencia: {
				metodo_pago: null,
				tipo_premio: null,
				tipo_cuenta: null,
				cuenta: null,
				banco: null,
				titular_cuenta: null,
				cedula: null,
				pais: null,
				departamento: null,
				ciudad: null,
				direccion: null,
				telefono: null,
				codigo_postal: null,
			},
		},
	}),
	methods: {
		async getCreadores() {
			try {
				const response = await axios.get(`${this.API}/usuario`, this.token);
				if (response && response.data) {
					this.premios = response.data.reduce((acc, user) => {
						if (user.premios) {
							user.premios.forEach((premio) => {
								if (premio.fecha_obtenido) {
									let fecha;
									if (premio.estado == "Entregado") {
										fecha =
											premio.transferencia && premio.transferencia.fecha_reclamado ? premio.transferencia.fecha_reclamado.slice(0, 10) : "";
									} else {
										fecha = premio.fecha_obtenido.slice(0, 10);
									}
									acc.push({
										nombre: user.usuario,
										usuario: user._id,
										id_concurso: premio.id_concurso,
										premio: premio.premio,
										descripcion: premio.descripcion,
										fecha_obtenido: fecha,
										fecha_unica: premio.fecha_obtenido,
										tipo_premio: premio.tipo_premio,
										transferencia: premio.transferencia,
										estado: premio.estado,
									});
								}
							});
						}
						return acc;
					}, []);
				} else {
					console.error("No se recibió una respuesta válida del servidor.");
				}
			} catch (error) {
				console.error("Error al obtener los usuarios:", error);
				if (error.response && error.response.status === 401) {
					// Se le terminó la sesión
					this.store.clearUser();
					this.$router.push("/login");
				}
			}
		},
		ponerEstado(estado) {
			if (estado == "Sin reclamar") {
				return "warning";
			} else if (estado == "En proceso") {
				return "info";
			} else {
				return "success";
			}
		},
		customSort(event) {
			// Define el orden de los estados
			const order = { "En proceso": 0, Entregado: 1, "Sin reclamar": 2 };

			// Obtiene los valores de estado para los dos elementos
			const value1 = event.data1.estado.toLowerCase();
			const value2 = event.data2.estado.toLowerCase();

			// Compara los valores según el orden definido
			if (order[value1] < order[value2]) {
				return -1;
			}
			if (order[value1] > order[value2]) {
				return 1;
			}
			return 0;
		},
		async EnviarPremio() {
			if (this.paquete.comprobante != null) {
				await axios
					.putForm(`${this.API}/usuario/confirmarPremio`, this.paquete, {
						headers: {
							Authorization: `Bearer ${this.store.getToken()}`,
						},
					})
					.then((response) => {
						console.log(response.data);
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								console.log("Error: ", error);
								break;
						}
					})
					.finally(() => {
						this.EnviarModal = false;
						this.$toast.add({ severity: "success", summary: "Reclamo exitoso", life: 1600 });
						this.getCreadores();
					});
			} else {
				this.$toast.add({
					severity: "error",
					summary: "Cargar Comprobante",
					detail: "Debes subir el comprobante para su verificacion",
					life: 1600,
				});
			}
		},
		async eliminarPremio(usuario = null, id_concurso = null, fecha_obtenido = null) {
			if (usuario != null && id_concurso != null) {
				await axios
					.delete(`${this.API}/usuario/${usuario}/premio/${id_concurso}/${fecha_obtenido}`, this.token)
					.then((resp) => {
						if (!resp.data.error) {
							this.getCreadores();
						}
						this.$toast.add({
							severity: resp.data.error ? "error" : "success",
							summary: "Premio eliminado",
							detail: resp.data.message,
							life: 1600,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		async cambiarEstadoPremio(usuario = null, id_concurso = null, nuevo_estado = "Expirado", fecha_obtenido = null) {
			if (usuario && id_concurso && nuevo_estado) {
				await axios
					.put(`${this.API}/usuario/${usuario}/premio/${id_concurso}/${nuevo_estado}/${fecha_obtenido}`, {}, this.token)
					.then((resp) => {
						if (!resp.data.error) {
							this.getCreadores();
						}
						this.$toast.add({
							severity: resp.data.error ? "error" : "success",
							summary: "Actualizar premio",
							detail: resp.data.message,
							life: 1600,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		Preparar(datos) {
			this.EnviarModal = true;
			this.paquete.id_concurso = datos.id_concurso;
			this.paquete.usuario = datos.usuario;
			this.datosTransferencia = datos;
		},
		confirmarEliminar(usuario, id_concurso, fecha_obtenido) {
			this.$confirm.require({
				message: `¿Está seguro de eliminar este premio?`,
				header: "Eliminar premio",
				icon: "pi pi-exclamation-triangle",
				rejectClass: "p-button-secondary p-button-outlined",
				rejectLabel: "No, cancelar",
				acceptLabel: "Sí, eliminar",
				acceptClass: "p-button-danger",
				accept: () => {
					this.eliminarPremio(usuario, id_concurso, fecha_obtenido);
				},
				reject: () => {},
			});
		},
	},
	computed: {
		totalPagar() {
			return this.premios.reduce((acum, premio) => {
				if (["Sin reclamar", "En proceso"].includes(premio.estado)) {
					if (premio.premio == null || premio.premio == NaN) {
						premio.premio = "0";
					}
					const gano = premio.premio.toString().match(/\d+/);
					return acum + parseInt(gano != null ? gano[0] : 0);
				}
				return acum;
			}, 0);
		},
	},
	async created() {
		this.store = useStoreEvento();
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.token = {
			headers: {
				Authorization: `Bearer ${this.store.getToken()}`,
			},
		};
		await this.getCreadores();
	},
};
</script>
