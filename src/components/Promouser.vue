<template>
	<div class="promo">
		<Toast />
		<Panel>
			<template #header>
				<div class="flex flex-wrap items-center gap-2 flex-end w-full justify-content-between">
					<h1 class="m-0">Promoción</h1>
					<div class="botones flex flex-wrap gap-2">
						<Button icon="pi pi-bitcoin" label="Binance" severity="warning" @click="modalRecargarBinance = true" />
						<Button icon="pi pi-credit-card" label="Open Pay" severity="info" @click="modalRecargarOpenPay = true" />
						<Button icon="pi pi-plus" label="Ordenar" severity="success" @click="modalOrdenar = true" />
						<Button :label="`Creditos: ${User.saldo}`" severity="info" />
					</div>
				</div>
			</template>
			<DataTable
				:value="ordenes"
				sortField="estado"
				:sortOrder="1"
				paginator
				:rows="5"
				:rowsPerPageOptions="[5, 10, 20, 50]"
				tableStyle="min-width: 100%"
			>
				<Column field="fecha" header="Fecha" sortable style="min-width: 11rem">
					<template #body="props">{{ props.data.fecha.slice(0, 10) }} {{ props.data.fecha.slice(11, 16) }}</template>
				</Column>
				<Column field="service" header="ID Service" sortable />
				<Column field="descripcion" header="Descripcion" class="word-wrap" sortable />
				<Column field="cantidad" header="Cantidad" />
				<Column field="link" header="Publicación">
					<template #body="props">
						<a :href="props.data.link" target="_blank" rel="noopener noreferrer">Ver publicación</a>
					</template>
				</Column>
				<Column field="pagar" header="Pago" sortable />
				<Column field="order" header="Order ID" sortable />
				<Column field="status" header="Estado" sortable />
			</DataTable>
		</Panel>
		<Dialog
			v-model:visible="modalOrdenar"
			header="Ordenar servicio"
			:style="{ width: '40rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<div class="flex justify-content-center">
				<form ref="formServicio" style="width: 30rem">
					<div class="form-container">
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Servicios</label>
							<Dropdown
								v-model="servicioSelect"
								showClear
								:options="serviciosActivos"
								filter
								optionLabel="name"
								@update:modelValue="selectServicio"
								placeholder="Selecciona servicio"
							>
								<template #option="slotProps">
									<div class="flex align-items-center">
										<div>{{ slotProps.option.service }} - {{ slotProps.option.name }}</div>
									</div>
								</template>
							</Dropdown>
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Cantidad</label>
							<InputText
								type="number"
								v-model="paquetePromocion.cantidad"
								:min="min"
								:max="max"
								@update:modelValue="calcularPago"
								aria-describedby="cantidad-help"
							/>
							<small id="cantidad-help">{{ help_cantidad }}</small>
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Link</label>
							<InputText type="url" v-model="paquetePromocion.link" aria-describedby="url-help" />
							<small id="url-help">Del perfil o publicación a aumentar reacciones o seguidores</small>
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">$ Pagar</label>
							<Message :closable="false">{{ paquetePromocion.pagar }}</Message>
							<small id="saldo">Advertencia: Revise bien el saldo, se descontará de tu saldo</small>
						</div>
					</div>
				</form>
			</div>
			<template #footer>
				<Button label="Cancelar" @click="modalOrdenar = false" autofocus text severity="danger" />
				<Button label="Ordenar" :disabled="btnOrden" @click="ordenar" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalRecargarOpenPay"
			header="Recargar cuenta OpenPay"
			:style="{ width: '40rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<div class="flex justify-content-center">
				<form ref="formRecarga" style="width: 30rem">
					<div class="form-container">
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Nombre</label>
							<InputText name="nombre" v-model="crearRecargaOpenPay.customer.name" aria-describedby="url-help" />
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Apellido</label>
							<InputText name="apellido" v-model="crearRecargaOpenPay.customer.last_name" aria-describedby="url-help" />
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Teléfono</label>
							<InputText name="telefono" type="number" v-model="crearRecargaOpenPay.customer.phone_number" aria-describedby="url-help" />
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Correo Electrónico</label>
							<InputText name="correo" type="email" v-model="crearRecargaOpenPay.customer.email" aria-describedby="url-help" />
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<label class="font-bold block">Cantidad</label>
							<Dropdown
								v-model="selectRecarga"
								:options="paquetesRecargas"
								@change="changeRecarga()"
								optionLabel="nombre"
								placeholder="Selecciona servicio"
							>
								<template #option="slotProps">
									<div class="flex align-items-center">
										<div>
											{{ slotProps.option.nombre }} - {{ Math.ceil(slotProps.option.cop).toLocaleString() }} COP -
											{{ slotProps.option.creditos }} CRÉDITOS
										</div>
									</div>
								</template>
							</Dropdown>
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<Message icon="pi pi-dollar" v-if="crearRecargaOpenPay.amount" severity="success" :closable="false">
								{{ Math.ceil(crearRecargaOpenPay.amount).toLocaleString() }} COP
							</Message>
						</div>
						<div class="flex flex-column gap-1 mb-2">
							<Message icon="pi pi-bitcoin" v-if="selectRecarga.creditos" :closable="false">
								{{ selectRecarga.creditos.toLocaleString() }} CRÉDITOS
							</Message>
						</div>
					</div>
				</form>
			</div>
			<template #footer>
				<Button label="Cancelar" @click="modalRecargarOpenPay = false" autofocus text severity="danger" />
				<Button
					label="Pagar"
					icon="pi pi-check"
					:disabled="!selectRecarga.creditos && !selectRecarga.amount"
					@click="recargarCreditosOpenPay()"
				/>
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalRecargarBinance"
			header="Recargar cuenta Binance"
			:style="{ width: '40rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<div class="flex justify-content-center">
				<form ref="formRecarga" style="width: 30rem">
					<div class="form-container">
						<div class="flex flex-column gap-1 mb-2" v-if="!checkoutBinance.checkoutUrl">
							<label class="font-bold block">Cantidad</label>
							<Dropdown
								v-model="selectRecargaBinance"
								:options="paquetesRecargas"
								@change="changeRecargaBinance()"
								optionLabel="nombre"
								placeholder="Selecciona servicio"
							>
								<template #option="slotProps">
									<div class="flex align-items-center">
										<div>{{ slotProps.option.usd }} USDT - {{ slotProps.option.creditos }} CRÉDITOS</div>
									</div>
								</template>
							</Dropdown>
						</div>
						<div class="flex flex-column gap-1 mb-2" v-if="!checkoutBinance.checkoutUrl">
							<Message icon="pi pi-bitcoin" v-if="selectRecargaBinance.creditos" :closable="false">
								{{ selectRecargaBinance.creditos.toLocaleString() }} CRÉDITOS
							</Message>
						</div>
						<div class="flex justify-content-center gap-1 mb-2">
							<Image v-if="checkoutBinance.qrcodeLink" :src="checkoutBinance.qrcodeLink" alt="Image" width="250" preview />
						</div>
					</div>
				</form>
			</div>
			<template #footer>
				<Button label="Cancelar" @click="modalRecargarBinance = false" autofocus text severity="danger" />
				<Button
					label="Pagar"
					icon="pi pi-check"
					v-if="!checkoutBinance.checkoutUrl"
					:disabled="!crearRecargaBinance.creditos || btnPagarBinance"
					@click="recargarCreditosBinance()"
				/>
				<a :href="checkoutBinance.checkoutUrl" v-if="checkoutBinance.checkoutUrl">
					<Button label="Binance Pay" icon="pi pi-wallet" severity="warning" />
				</a>
			</template>
		</Dialog>
	</div>
</template>

<script>
import axios from "axios";
import { useStoreEvento } from "../store";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		User: {
			saldo: "",
			_id: null,
		},
		token: null,
		btnOrden: false,
		servicioSelect: null,
		precioRate: 0,
		ordenes: [],
		modalOrdenar: false,
		modalRecargarOpenPay: false,
		modalRecargarBinance: false,
		min: 1,
		max: 2,
		serviciosActivos: [],
		paquetesRecargas: [],
		selectRecarga: {
			creditos: null,
		},
		paquetePromocion: {
			proveedor: null,
			service: null,
			descripcion: null,
			cantidad: null,
			link: null,
			pagar: 0,
			idUsuario: null,
		},
		selectRecargaBinance: {
			creditos: null,
		},
		crearRecargaBinance: {
			amount: null,
			creditos: null,
		},
		crearRecargaOpenPay: {
			amount: null,
			currency: "COP",
			creditos: null,
			customer: {
				name: null,
				last_name: null,
				phone_number: null,
				email: null,
			},
		},
		btnPagarOpenPay: false,
		btnPagarBinance: false,
		checkoutBinance: {
			qrcodeLink: null,
			checkoutUrl: null,
		},
		help_cantidad: "Cantidad del servicio.",
	}),
	methods: {
		changeRecarga() {
			this.crearRecargaOpenPay.amount = this.selectRecarga.cop;
			this.crearRecargaOpenPay.creditos = this.selectRecarga.creditos;
		},
		changeRecargaBinance() {
			this.crearRecargaBinance.amount = this.selectRecargaBinance.usd;
			this.crearRecargaBinance.creditos = this.selectRecargaBinance.creditos;
		},
		selectServicio(event) {
			this.paquetePromocion.proveedor = event.proveedor._id;
			this.help_cantidad = `Puedes ordenar entre ${event.min} y ${event.max}`;
			this.paquetePromocion.service = event.service;
			this.paquetePromocion.descripcion = event.name;
			this.min = parseInt(event.min);
			this.max = parseInt(event.max);
			this.precioRate = parseFloat(event.rate) / 1000;
			this.calcularPago();
		},
		calcularPago() {
			this.paquetePromocion.pagar = this.paquetePromocion.cantidad * this.precioRate;
		},
		async getServiciosActive() {
			await axios
				.get(`${this.API}/promocion/servicesActive`, this.token)
				.then((response) => {
					this.serviciosActivos = response.data;
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
								summary: "Obtener servicios Activos",
								detail: "Sucedió un error, Comuniquese con soporte",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getUserInfo() {
			await axios
				.get(`${this.API}/usuario/${this.User._id}`, this.token)
				.then((response) => {
					this.User = response.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							console.log(error);
							break;
						default:
							this.$toast.add({
								severity: "error",
								summary: "Obtener usuario",
								detail: "Sucedió un error, Comuniquese con soporte",
								life: 1500,
							});
							console.log("Error: ", error);
							break;
					}
				});
		},
		async ordenar() {
			if (this.paquetePromocion.service != null) {
				this.paquetePromocion.cantidad = parseInt(this.paquetePromocion.cantidad);
				if (this.paquetePromocion.cantidad >= this.min && this.paquetePromocion.cantidad <= this.max) {
					this.paquetePromocion.pagar = parseFloat(this.paquetePromocion.pagar);
					if (parseFloat(this.User.saldo) >= this.paquetePromocion.pagar) {
						if (this.paquetePromocion.link != null) {
							this.btnOrden = true;
							await axios
								.post(`${this.API}/usuario/ordenar`, this.paquetePromocion, this.token)
								.then((response) => {
									if (response.data) {
										this.$toast.add({ severity: "success", summary: "Ordenar", detail: "Orden creada con éxito", life: 1500 });
										this.servicioSelect = null;
										this.$refs.formServicio.reset();
										this.getMisOrdenes();
										this.getUserInfo();
										this.getServiciosActive();
									} else {
										this.$toast.add({ severity: "error", summary: "Ordenar", detail: "No se pudo crear la orden", life: 1500 });
									}
								})
								.catch((error) => {
									console.log("Error orden; ", error);
									this.$toast.add({ severity: "error", summary: "Ordenar", detail: "Ocurrió un problema creando la orden", life: 1500 });
								});
							this.btnOrden = false;
						} else {
							this.$toast.add({ severity: "info", summary: "Ordenar", detail: "Ingresa el link de la publicación o perfil", life: 1500 });
						}
					} else {
						this.$toast.add({ severity: "error", summary: "Ordenar", detail: "No tienes suficiente saldo", life: 1500 });
					}
				} else {
					this.$toast.add({
						severity: "info",
						summary: "Ordenar",
						detail: `La cantidad debe estar entre ${this.min} y ${this.max}`,
						life: 1500,
					});
				}
			} else {
				this.$toast.add({ severity: "info", summary: "Ordenar", detail: "Debes escoger un servicio", life: 1500 });
			}
		},
		async recargarCreditosOpenPay() {
			const phoneRegex = /^[0-9]{10}$/; // Ajusta según el formato esperado
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			if (!phoneRegex.test(this.crearRecargaOpenPay.customer.phone_number)) {
				this.$toast.add({ severity: "danger", summary: "Recarga de créditos", detail: "Ingrese el numero completo", life: 1500 });
				return;
			}
			if (!emailRegex.test(this.crearRecargaOpenPay.customer.email)) {
				this.$toast.add({ severity: "danger", summary: "Recarga de créditos", detail: "Ingrese un correo valido ", life: 1500 });
				return;
			}
			if (!this.crearRecargaOpenPay.customer.name || !this.crearRecargaOpenPay.customer.last_name) {
				this.$toast.add({ severity: "danger", summary: "Recarga de créditos", detail: "Ingrese un nombre y apellido", life: 1500 });
				return;
			}
			this.crearRecargaOpenPay.amount = Math.ceil(this.crearRecargaOpenPay.amount);
			this.btnPagarOpenPay = true;
			await axios
				.post(`${this.API}/tienda/recarga/openpay`, this.crearRecargaOpenPay, this.token)
				.then((response) => {
					this.selectRecarga = {
						creditos: null,
					};
					this.crearRecargaOpenPay = {
						amount: null,
						currency: "COP",
						creditos: null,
						customer: {
							name: null,
							last_name: null,
							phone_number: null,
							email: null,
						},
					};
					this.modalRecargarOpenPay = false;
					console.log(response.data);
					const link = document.createElement("a");
					link.href = response.data.checkout_link;
					link.target = "_blank";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "danger", summary: "Obteniendo ordenes", detail: error.response.data.message, life: 1500 });
							console.log("Error: ", error);
							break;
					}
				});
			this.btnPagarOpenPay = false;
		},
		async recargarCreditosBinance() {
			this.btnPagarBinance = true;
			await axios
				.post(`${this.API}/tienda/recarga/binance`, this.crearRecargaBinance, this.token)
				.then((response) => {
					console.log(response.data);
					this.checkoutBinance = {
						qrcodeLink: response.data.qrcodeLink,
						checkoutUrl: response.data.checkoutUrl,
					};
					this.startCheckingStatus(response.data.idRecarga);
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "danger", summary: "Obteniendo ordenes", detail: error.response.data.message, life: 1500 });
							console.log("Error: ", error);
							break;
					}
				});

			this.btnPagarBinance = false;
		},
		async getStatusOrderBinance(idRecarga) {
			try {
				const response = await axios.get(`${this.API}/tienda/validar/recarga/${idRecarga}`, this.token);
				return response.data;
			} catch (error) {
				switch (error.response.data.statusCode) {
					case 401:
						this.store.clearUser();
						this.$router.push("/login");
						break;
					default:
						this.$toast.add({
							severity: "danger",
							summary: "Obteniendo recargas",
							detail: error.response.data.message,
							life: 1500,
						});
						console.log("Error: ", error);
						break;
				}
			}
		},
		startCheckingStatus(idRecarga) {
			const intervalId = setInterval(async () => {
				const status = await this.getStatusOrderBinance(idRecarga);
				console.log(`Estado de la recarga: ${status}`);
				if (status === "aprobado") {
					clearInterval(intervalId);
					await this.getUserInfo();
					this.checkoutBinance = {
						qrcodeLink: null,
						checkoutUrl: null,
					};
					this.modalRecargarBinance = false;
					this.selectRecargaBinance = [];
					this.crearRecargaBinance = {
						amount: null,
						creditos: null,
					};
					this.$toast.add({ severity: "success", summary: "Recargar Cuenta", detail: "Gracias por recargar en samyflw ;)", life: 5500 });
				}
			}, 4000);
		},
		async getMisOrdenes() {
			await axios
				.get(`${this.API}/usuario/${this.store.getUsuario().usuario}/ordenes`, this.token)
				.then((response) => {
					this.ordenes = response.data.ordenes;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "danger", summary: "Obteniendo ordenes", detail: error.response.data.message, life: 1500 });
							console.log("Error: ", error);
							break;
					}
				});
		},

		async getPricingRecargas() {
			await axios
				.get(`${this.API}/tienda/recarga/disponible`, this.token)
				.then((response) => {
					this.paquetesRecargas = response.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "danger", summary: "Obteniendo recargas", detail: error.response.data.message, life: 1500 });
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
		this.token = {
			headers: {
				Authorization: `Bearer ${this.store.getToken()}`,
			},
		};
		this.User._id = this.store.getId();
		this.paquetePromocion.idUsuario = this.store.getId();
		await this.getUserInfo();
		await this.getMisOrdenes();
		await this.getServiciosActive();
		await this.getPricingRecargas();
	},
};
</script>
