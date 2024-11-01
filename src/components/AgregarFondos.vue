<template>
	<Panel class="w-full h-screen agregar_fondos sin-panel-header border-none">
		<div class="flex flex-column gap-3 justify-content-center align-items-center">
			<div class="flex h-full flex-wrap justify-content-center align-items-center">
				<Card style="width: 35rem; overflow: hidden" class="p-3 shadow-6">
					<template #title><div class="m-0 p-0 text-center w-full text-break">Agregar fondos</div></template>
					<template #content>
						<form ref="formRecarga">
							<div class="form-container">
								<div class="flex flex-column gap-1 mb-2">
									<label class="font-bold block">Método</label>
									<Dropdown
										v-model="metodoRecarga"
										:options="metodosRecarga"
										showClear
										optionValue="metodo"
										optionLabel="metodo"
										placeholder="Selecciona método"
									/>
								</div>
								<div v-if="metodoRecarga == 'OpenPay'" class="flex flex-column gap-1 mb-2">
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
										<InputText
											name="telefono"
											type="number"
											v-model="crearRecargaOpenPay.customer.phone_number"
											aria-describedby="url-help"
										/>
									</div>
									<div class="flex flex-column gap-1 mb-2">
										<label class="font-bold block">Correo Electrónico</label>
										<InputText name="correo" type="email" v-model="crearRecargaOpenPay.customer.email" aria-describedby="url-help" />
									</div>
									<div class="flex flex-column gap-1 mb-2">
										<label class="font-bold block">Cantidad</label>
										<Dropdown
											v-model="selectCantidad"
											:options="paquetesRecargas"
											filter
											@change="changeRecarga"
											optionLabel="nombre"
											placeholder="Selecciona una opción"
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
									<div class="flex flex-column gap-1 my-2">
										<Message icon="pi pi-dollar" class="m-0" v-if="crearRecargaOpenPay.amount" severity="success" :closable="false">
											{{ Math.ceil(crearRecargaOpenPay.amount).toLocaleString() }} COP
										</Message>
									</div>
									<div class="flex flex-column gap-1 mb-1">
										<Message icon="pi pi-bitcoin" class="m-0" v-if="selectCantidad.creditos" :closable="false">
											{{ selectCantidad.creditos.toLocaleString() }} CRÉDITOS
										</Message>
									</div>
								</div>

								<div v-else-if="metodoRecarga == 'Binance'" class="flex flex-column gap-1 mb-2">
									<div class="flex flex-column gap-1 mb-2" v-if="!checkoutBinance.checkoutUrl">
										<label class="font-bold block">Cantidad</label>
										<Dropdown
											v-model="selectCantidad"
											filter
											:options="paquetesRecargas"
											@change="changeRecarga"
											optionLabel="nombre"
											placeholder="Selecciona cantidad"
										>
											<template #option="slotProps">
												<div class="flex align-items-center">
													<div>{{ slotProps.option.usd }} USDT - {{ slotProps.option.creditos }} CRÉDITOS</div>
												</div>
											</template>
										</Dropdown>
									</div>
									<div class="flex flex-column gap-1 mb-2" v-if="!checkoutBinance.checkoutUrl">
										<Message icon="pi pi-bitcoin" v-if="selectCantidad.creditos" :closable="false">
											{{ selectCantidad.creditos.toLocaleString() }} CRÉDITOS
										</Message>
									</div>
									<div class="flex justify-content-center gap-1 mb-2">
										<Image v-if="checkoutBinance.qrcodeLink" :src="checkoutBinance.qrcodeLink" alt="Image" width="250" preview />
									</div>
								</div>
							</div>
						</form>
					</template>
					<template #footer>
						<div class="flex flex-column flex-wrap gap-2 mt-1">
							<Button label="Pagar" icon="pi pi-check" v-if="!checkoutBinance.checkoutUrl" :disabled="btnPagar" @click="pagar" />
							<a :href="checkoutBinance.checkoutUrl" v-if="checkoutBinance.checkoutUrl">
								<Button label="Binance Pay" icon="pi pi-wallet" severity="warning" />
							</a>
						</div>
					</template>
				</Card>
			</div>
			<DataTable
				:value="misRecargas"
				sortField="estado"
				:sortOrder="1"
				paginator
				:rows="5"
				:rowsPerPageOptions="[5, 10, 20, 50]"
				class="my-3 shadow-6 w-full"
				tableStyle="min-width: 100%"
			>
				<Column field="pasarela" header="Método" sortable class="primera-mayus" />
				<Column field="createdAt" header="Fecha" sortable>
					<template #body="props">{{ getFechaFormat(props.data.createdAt) }}</template>
				</Column>
				<Column field="currency" header="Moneda" sortable />
				<Column field="creditos" header="Créditos" sortable />
				<Column field="total" header="Total" />
				<Column field="estado" header="Estado" class="primera-mayus" sortable />
			</DataTable>
		</div>
	</Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		store: null,
		token: {
			headers: {
				Authorization: null,
			},
		},
		User: {
			saldo: "",
			_id: null,
		},
		misRecargas: [],
		btnPagar: false,
		paquetesRecargas: [],
		metodoRecarga: null,
		metodosRecarga: [{ metodo: "OpenPay" }, { metodo: "Binance" }],
		selectCantidad: { creditos: null },
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
		checkoutBinance: {
			qrcodeLink: null,
			checkoutUrl: null,
		},
	}),
	methods: {
		getFechaFormat(fecha) {
			const d = new Date(fecha).toISOString();
			return `${d.slice(0, 10)} ${d.slice(11, 16)}`;
		},
		changeRecarga() {
			if (this.metodoRecarga == "OpenPay") {
				this.crearRecargaOpenPay.amount = this.selectCantidad.cop;
				this.crearRecargaOpenPay.creditos = this.selectCantidad.creditos;
			} else if (this.metodoRecarga == "Binance") {
				this.crearRecargaBinance.amount = this.selectCantidad.usd;
				this.crearRecargaBinance.creditos = this.selectCantidad.creditos;
			}
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
					this.store.setSaldo(this.User.saldo);
					this.$emit("actualizarSaldo");
					this.checkoutBinance = {
						qrcodeLink: null,
						checkoutUrl: null,
					};
					this.selectCantidad = { creditos: null };
					this.crearRecargaBinance = {
						amount: null,
						creditos: null,
					};
					this.$toast.add({ severity: "success", summary: "Recargar Cuenta", detail: "Gracias por recargar en samyflw ;)", life: 5500 });
				}
			}, 4000);
		},
		async pagar() {
			if (this.metodoRecarga != null) {
				if (this.metodoRecarga == "OpenPay") {
					const phoneRegex = /^[0-9]{10}$/; // Ajusta según el formato esperado
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

					if (!phoneRegex.test(this.crearRecargaOpenPay.customer.phone_number)) {
						this.$toast.add({
							severity: "danger",
							summary: "Recarga de créditos",
							detail: "Ingrese un número de teléfono válido",
							life: 1500,
						});
						return;
					}
					if (!emailRegex.test(this.crearRecargaOpenPay.customer.email)) {
						this.$toast.add({ severity: "danger", summary: "Recarga de créditos", detail: "Ingrese un correo válido ", life: 1500 });
						return;
					}
					if (!this.crearRecargaOpenPay.customer.name || !this.crearRecargaOpenPay.customer.last_name) {
						this.$toast.add({ severity: "danger", summary: "Recarga de créditos", detail: "Ingrese un nombre y apellido", life: 1500 });
						return;
					}
					this.crearRecargaOpenPay.amount = Math.ceil(this.crearRecargaOpenPay.amount);
					this.btnPagar = true;
					await axios
						.post(`${this.API}/tienda/recarga/openpay`, this.crearRecargaOpenPay, this.token)
						.then(async (response) => {
							this.selectCantidad = {
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
							await this.getUserInfo();
							this.store.setSaldo(this.User.saldo);
							this.$emit("actualizarSaldo");
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
				} else if (this.metodoRecarga == "Binance") {
					if (this.crearRecargaBinance.creditos != null) {
						this.btnPagar = true;
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
					} else {
						this.$toast.add({ severity: "info", summary: "Recarga de créditos", detail: "Debes seleccionar una cantida", life: 1500 });
					}
					return;
				}
				this.btnPagar = false;
				return;
			}
			this.$toast.add({ severity: "info", summary: "Recarga de créditos", detail: "Debes seleccionar un método", life: 1500 });
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
		async getMisRecargas() {
			await axios
				.get(`${this.API}/usuario/${this.User._id}/recargas`, this.token)
				.then((response) => {
					this.misRecargas = response.data;
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
								summary: "Obteniendo recargas",
								detail: error.response.data.message,
								life: 1500,
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
		this.token.headers.Authorization = `Bearer ${this.store.getToken()}`;
		this.User._id = this.store.getId();
		await this.getUserInfo();
		await this.getMisRecargas();
		await this.getPricingRecargas();
	},
};
</script>
<style>
.agregar_fondos > .p-toggleable-content {
	height: 100vh;
}
</style>