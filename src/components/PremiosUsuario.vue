<template>
	<Panel class="premios">
		<Toast />
		<template #header>
			<div class="flex flex-wrap items-center gap-2 flex-end w-full justify-content-between">
				<h1 class="m-0">Mis premios</h1>
				<Message severity="info" class="m-0" :closable="false">
					<div class="flex flex-wrap align-items-center gap-2">
						<p class="m-0">
							Ahora puedes canjear tus
							<strong>Bonus</strong>
							por
							<strong>Regalos</strong>
							con el botón:
						</p>
						<Button class="btn_regalo" severity="danger" icon="pi pi-gift" />
					</div>
				</Message>
			</div>
		</template>

		<DataTable :value="premios" :sortOrder="-1" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%">
			<Column field="tipo_premio" header="Tipo" />
			<Column header="Premio" field="premio" sortable>
				<template #body="slotProps">
					<div class="w-full" v-if="slotProps.data.estado != 'Sin reclamar'">
						<p class="m-0" v-if="slotProps.data.tipo_premio !== 'Objeto'">{{ slotProps.data.premio }}</p>
						<Image v-else :src="slotProps.data.premio" alt="Imagen del premio" width="250" preview />
					</div>
				</template>
			</Column>
			<Column header="Descripcion" field="descripcion" sortable>
				<template #body="props">
					{{ props.data.estado != "Sin reclamar" ? props.data.descripcion : null }}
				</template>
			</Column>
			<Column header="Fecha obtenido" field="fecha_obtenido" sortable>
				<template #body="slotProps">
					{{ slotProps.data.fecha_obtenido != null ? slotProps.data.fecha_obtenido.slice(0, 10) : "" }}
				</template>
			</Column>
			<Column field="transferencia" header="Fecha entrega" sortable>
				<template #body="props">
					{{
						props.data.transferencia.fecha_reclamado != null
							? props.data.transferencia.fecha_reclamado.slice(0, 10) + " " + props.data.transferencia.fecha_reclamado.slice(11, 16)
							: null
					}}
				</template>
			</Column>
			<Column field="estado" header="Estado" sortable>
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
					<div class="flex gap-2 flex-wrap">
						<Button
							class="btn_regalo"
							severity="danger"
							v-tooltip.top="'Canjear por regalos'"
							v-if="puedeReclamar(slotProps.data.estado, slotProps.data.fecha_obtenido) && slotProps.data.tipo_premio == 'Bonus'"
							icon="pi pi-gift"
							@click="mostrarListaRegalo(slotProps.data)"
						/>
						<Button
							v-if="puedeReclamar(slotProps.data.estado, slotProps.data.fecha_obtenido)"
							icon="pi pi-send"
							@click="
								() => {
									Reclamar(
										slotProps.data.tipo_premio,
										slotProps.data.id_concurso,
										slotProps.data.estado,
										slotProps.data.premio,
										slotProps.data.descripcion
									);
								}
							"
						/>
						<div v-if="slotProps.data.estado == 'Entregado' && slotProps.data.tipo_premio != 'SaldoApi'">
							<Image
								v-tooltip.top="'Comprobante de entrega'"
								v-if="isImg(slotProps.data.transferencia.comprobante)"
								:src="slotProps.data.transferencia.comprobante"
								alt="Imagen del premio"
								width="50"
								preview
							/>
							<video
								v-else
								width="50"
								class="cursor-pointer"
								@click="fullScreenVideo"
								v-tooltip.top="'Click para ver el vídeo de la compra'"
								:src="slotProps.data.transferencia.comprobante"
								muted
							/>
						</div>
					</div>
				</template>
			</Column>
		</DataTable>
		<Dialog
			v-model:visible="cuenta"
			:header="mensaje"
			:style="{ width: '37rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="center"
			:modal="true"
			:draggable="false"
		>
			<div class="flex flex-wrap gap-2 mb-2" v-if="dialogo === 'Efectivo' || dialogo == 'Bonus'">
				<RadioButton v-model="cuentas" inputId="1" name="nequi" value="nequi" />
				<label class="ml-2">Nequi</label>
				<RadioButton v-model="cuentas" inputId="2" name="paypal" value="paypal" />
				<label class="ml-2">Paypal</label>
				<RadioButton v-model="cuentas" inputId="3" name="binance" value="binance" />
				<label class="ml-2">Binance</label>
				<RadioButton v-model="cuentas" inputId="4" name="banco" value="banco" />
				<label class="ml-2">Banco</label>
			</div>

			<form ref="formEnviar" class="formEnviar">
				<div v-if="dialogo === 'Efectivo' || dialogo == 'Bonus'">
					<div class="flex gap-2 sm:flex-column md:flex-row" v-if="cuentas === 'banco'">
						<div class="flex flex-column gap-2 w-6 sm:w-full md:w-6">
							<label class="font-semibold">Tipo cuenta</label>
							<Dropdown v-model="transferencia.tipo_cuenta" :options="TipoCuenta" optionLabel="tipo" placeholder="Tipo de cuenta" />
						</div>
						<div class="flex flex-column gap-2 w-6 sm:w-full md:w-6" v-if="cuentas === 'banco'">
							<label class="font-semibold">Número cuenta</label>
							<InputNumber v-model="transferencia.cuenta" class="p-1" inputId="withoutgrouping" :useGrouping="false" autocomplete="off" />
						</div>
					</div>
					<div class="flex flex-column gap-2" v-if="cuentas === 'nequi'">
						<label class="font-semibold">Numero de cuenta</label>
						<InputNumber v-model="transferencia.cuenta" inputId="withoutgrouping" :useGrouping="false" />
					</div>
					<div class="flex flex-column gap-2" v-if="cuentas === 'paypal'">
						<label class="font-semibold">Correo</label>
						<InputText v-model="transferencia.cuenta" type="email" class="flex-auto" autocomplete="off" />
					</div>
					<div class="flex flex-column gap-2" v-if="cuentas === 'banco'">
						<label class="font-semibold">Nombre del Banco</label>
						<InputText v-model="transferencia.banco" class="flex-auto" autocomplete="off" />
					</div>
					<div class="flex flex-column gap-2" v-if="cuentas === 'banco'">
						<label class="font-semibold">Nombre del Titular</label>
						<InputText v-model="transferencia.titular_cuenta" class="flex-auto" autocomplete="off" />
					</div>

					<div class="flex flex-column gap-2" v-if="cuentas === 'binance'">
						<label class="font-semibold">ID Binance</label>
						<InputText v-model="transferencia.cuenta" class="flex-auto" autocomplete="off" />
					</div>
					<div class="flex flex-column gap-2" v-if="cuentas === 'banco'">
						<label class="font-semibold">Cédula</label>
						<InputNumber v-model="transferencia.cedula" inputId="withoutgrouping" :useGrouping="false" autocomplete="off" />
					</div>
				</div>
				<div v-if="dialogo === 'Envio'">
					<div class="flex gap-2 sm:flex-column md:flex-row">
						<div class="flex flex-column gap-2 w-6 sm:w-full md:w-6">
							<label class="font-semibold">País</label>
							<Dropdown
								v-model="paisSelect"
								filter
								@update:modelValue="(event) => (transferencia.pais = event.pais)"
								:options="paises"
								optionLabel="pais"
								placeholder="Pais"
							/>
						</div>
						<div class="flex flex-column gap-2">
							<label class="font-semibold">Código postal</label>
							<InputNumber v-model="transferencia.codigo_postal" inputId="withoutgrouping" :useGrouping="false" autocomplete="off" />
						</div>
					</div>
					<div class="flex gap-2 sm:flex-column md:flex-row">
						<div class="flex flex-column gap-2 w-6 sm:w-full md:w-6">
							<label class="font-semibold">Departamento</label>
							<InputText v-model="transferencia.departamento" class="flex-auto" autocomplete="off" />
						</div>
						<div class="flex flex-column gap-2 w-6 sm:w-full md:w-6">
							<label class="font-semibold">Ciudad</label>
							<InputText v-model="transferencia.ciudad" class="flex-auto" autocomplete="off" />
						</div>
					</div>
					<div class="flex flex-column gap-2">
						<label class="font-semibold">Direccion</label>
						<InputText v-model="transferencia.direccion" class="flex-auto" autocomplete="off" />
					</div>
					<div class="flex flex-column gap-2">
						<label class="font-semibold">Numero de Cédula</label>
						<InputNumber v-model="transferencia.cedula" inputId="withoutgrouping" :useGrouping="false" autocomplete="off" />
					</div>
					<div class="flex flex-column gap-2">
						<label class="font-semibold">Nombre del Titular</label>
						<InputText v-model="transferencia.titular_cuenta" class="flex-auto" autocomplete="off" />
					</div>
					<div class="flex flex-column gap-2">
						<label class="font-semibold">Teléfono</label>
						<InputNumber v-model="transferencia.telefono" inputId="withoutgrouping" :useGrouping="false" autocomplete="off" />
					</div>
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="(cuenta = false), (cuentas = 'nequi')" text severity="danger" />
				<Button label="Reclamar" @click="Enviar"></Button>
			</template>
		</Dialog>
		<CajaSorpresa
			:mostrarCaja="cajaSorpresa.mostrar"
			:tipo_premio="cajaSorpresa.tipo_premio"
			:premio="cajaSorpresa.premio"
			:descripcion="cajaSorpresa.descripcion"
			@cerrarCaja="cajaSorpresa.mostrar = false"
			@reclamandoPremio="
				() => {
					paqueteReclamando.tipo_premio != 'SaldoApi' ? (cuenta = true) : addSaldoByPremio();
				}
			"
		/>
		<ListaRegalos v-bind="dataListaRegalo" @cerrarDialog="dataListaRegalo.mostrarLista = false" @regalos="canjearPorRegalos" />
	</Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";

export default {
	data: () => ({
		API: import.meta.env.VITE_APP_API,
		token: null,
		cuenta: false,
		mensaje: null,
		dialogo: null,
		cuentas: "nequi",
		usuario: null,
		paisSelect: { pais: null },
		TipoCuenta: [{ tipo: "Ahorro" }, { tipo: "Corriente" }],
		mostrarMensajeValidacion: false,
		premios: [],
		transferencia: {},
		paises: [
			{ pais: "Afganistán" },
			{ pais: "Albania" },
			{ pais: "Alemania" },
			{ pais: "Andorra" },
			{ pais: "Angola" },
			{ pais: "Antigua y Barbuda" },
			{ pais: "Arabia Saudita" },
			{ pais: "Argelia" },
			{ pais: "Argentina" },
			{ pais: "Armenia" },
			{ pais: "Australia" },
			{ pais: "Austria" },
			{ pais: "Azerbaiyán" },
			{ pais: "Bahamas" },
			{ pais: "Bangladés" },
			{ pais: "Barbados" },
			{ pais: "Baréin" },
			{ pais: "Bélgica" },
			{ pais: "Belice" },
			{ pais: "Benín" },
			{ pais: "Bielorrusia" },
			{ pais: "Birmania" },
			{ pais: "Bolivia" },
			{ pais: "Bosnia y Herzegovina" },
			{ pais: "Botsuana" },
			{ pais: "Brasil" },
			{ pais: "Brunéi" },
			{ pais: "Bulgaria" },
			{ pais: "Burkina Faso" },
			{ pais: "Burundi" },
			{ pais: "Bután" },
			{ pais: "Cabo Verde" },
			{ pais: "Camboya" },
			{ pais: "Camerún" },
			{ pais: "Canadá" },
			{ pais: "Catar" },
			{ pais: "Chad" },
			{ pais: "Chile" },
			{ pais: "China" },
			{ pais: "Chipre" },
			{ pais: "Ciudad del Vaticano" },
			{ pais: "Colombia" },
			{ pais: "Comoras" },
			{ pais: "Corea del Norte" },
			{ pais: "Corea del Sur" },
			{ pais: "Costa de Marfil" },
			{ pais: "Costa Rica" },
			{ pais: "Croacia" },
			{ pais: "Cuba" },
			{ pais: "Dinamarca" },
			{ pais: "Dominica" },
			{ pais: "Ecuador" },
			{ pais: "Egipto" },
			{ pais: "El Salvador" },
			{ pais: "Emiratos Árabes Unidos" },
			{ pais: "Eritrea" },
			{ pais: "Eslovaquia" },
			{ pais: "Eslovenia" },
			{ pais: "España" },
			{ pais: "Estados Unidos" },
			{ pais: "Estonia" },
			{ pais: "Etiopía" },
			{ pais: "Filipinas" },
			{ pais: "Finlandia" },
			{ pais: "Fiyi" },
			{ pais: "Francia" },
			{ pais: "Gabón" },
			{ pais: "Gambia" },
			{ pais: "Georgia" },
			{ pais: "Ghana" },
			{ pais: "Granada" },
			{ pais: "Grecia" },
			{ pais: "Guatemala" },
			{ pais: "Guyana" },
			{ pais: "Guinea" },
			{ pais: "Guinea ecuatorial" },
			{ pais: "Guinea-Bisáu" },
			{ pais: "Haití" },
			{ pais: "Honduras" },
			{ pais: "Hungría" },
			{ pais: "India" },
			{ pais: "Indonesia" },
			{ pais: "Irak" },
			{ pais: "Irán" },
			{ pais: "Irlanda" },
			{ pais: "Islandia" },
			{ pais: "Islas Marshall" },
			{ pais: "Islas Salomón" },
			{ pais: "Israel" },
			{ pais: "Italia" },
			{ pais: "Jamaica" },
			{ pais: "Japón" },
			{ pais: "Jordania" },
			{ pais: "Kazajistán" },
			{ pais: "Kenia" },
			{ pais: "Kirguistán" },
			{ pais: "Kiribati" },
			{ pais: "Kuwait" },
			{ pais: "Laos" },
			{ pais: "Lesoto" },
			{ pais: "Letonia" },
			{ pais: "Líbano" },
			{ pais: "Liberia" },
			{ pais: "Libia" },
			{ pais: "Liechtenstein" },
			{ pais: "Lituania" },
			{ pais: "Luxemburgo" },
			{ pais: "Madagascar" },
			{ pais: "Malasia" },
			{ pais: "Malaui" },
			{ pais: "Maldivas" },
			{ pais: "Malí" },
			{ pais: "Malta" },
			{ pais: "Marruecos" },
			{ pais: "Mauricio" },
			{ pais: "Mauritania" },
			{ pais: "México" },
			{ pais: "Micronesia" },
			{ pais: "Moldavia" },
			{ pais: "Mónaco" },
			{ pais: "Mongolia" },
			{ pais: "Montenegro" },
			{ pais: "Mozambique" },
			{ pais: "Namibia" },
			{ pais: "Nauru" },
			{ pais: "Nepal" },
			{ pais: "Nicaragua" },
			{ pais: "Níger" },
			{ pais: "Nigeria" },
			{ pais: "Noruega" },
			{ pais: "Nueva Zelanda" },
			{ pais: "Omán" },
			{ pais: "Países Bajos" },
			{ pais: "Pakistán" },
			{ pais: "Palaos" },
			{ pais: "Palestina" },
			{ pais: "Panamá" },
			{ pais: "Papúa Nueva Guinea" },
			{ pais: "Paraguay" },
			{ pais: "Perú" },
			{ pais: "Polonia" },
			{ pais: "Portugal" },
			{ pais: "Reino Unido" },
			{ pais: "República Centroafricana" },
			{ pais: "República Checa" },
			{ pais: "República de Macedonia" },
			{ pais: "República del Congo" },
			{ pais: "República Democrática del Congo" },
			{ pais: "República Dominicana" },
			{ pais: "República Sudafricana" },
			{ pais: "Ruanda" },
			{ pais: "Rumanía" },
			{ pais: "Rusia" },
			{ pais: "Samoa" },
			{ pais: "San Cristóbal y Nieves" },
			{ pais: "San Marino" },
			{ pais: "San Vicente y las Granadinas" },
			{ pais: "Santa Lucía" },
			{ pais: "Santo Tomé y Príncipe" },
			{ pais: "Senegal" },
			{ pais: "Serbia" },
			{ pais: "Seychelles" },
			{ pais: "Sierra Leona" },
			{ pais: "Singapur" },
			{ pais: "Siria" },
			{ pais: "Somalia" },
			{ pais: "Sri Lanka" },
			{ pais: "Suazilandia" },
			{ pais: "Sudán" },
			{ pais: "Sudán del Sur" },
			{ pais: "Suecia" },
			{ pais: "Suiza" },
			{ pais: "Surinam" },
			{ pais: "Tailandia" },
			{ pais: "Tanzania" },
			{ pais: "Tayikistán" },
			{ pais: "Timor Oriental" },
			{ pais: "Togo" },
			{ pais: "Tonga" },
			{ pais: "Trinidad y Tobago" },
			{ pais: "Túnez" },
			{ pais: "Turkmenistán" },
			{ pais: "Turquía" },
			{ pais: "Tuvalu" },
			{ pais: "Ucrania" },
			{ pais: "Uganda" },
			{ pais: "Uruguay" },
			{ pais: "Uzbekistán" },
			{ pais: "Vanuatu" },
			{ pais: "Venezuela" },
			{ pais: "Vietnam" },
			{ pais: "Yemen" },
			{ pais: "Yibuti" },
			{ pais: "Zambia" },
			{ pais: "Zimbabue" },
		],
		cajaSorpresa: {
			mostrar: false,
			tipo_premio: "null",
			premio: "null",
			descripcion: "",
		},
		paqueteReclamando: {
			tipo_premio: null,
			id_concurso: null,
		},
		dataListaRegalo: {
			mostrarLista: false,
			monedasMaximasRegalo: 0,
		},
	}),
	methods: {
		mostrarListaRegalo(bono = null) {
			if (bono != null) {
				this.dataListaRegalo.monedasMaximasRegalo = parseInt(bono.premio.match(/\d+/)) * 100;
				this.transferencia.usuario = this.usuario;
				this.transferencia.posPremio = bono.id_concurso;
				this.transferencia.metodo_pago = "regalo";
				this.dataListaRegalo.mostrarLista = true;
			}
		},
		fullScreenVideo(event) {
			const elem = event.target;

			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.mozRequestFullScreen) {
				/* Firefox */
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
				/* Chrome, Safari & Opera */
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) {
				/* IE/Edge */
				elem.msRequestFullscreen();
			}
		},
		isImg(ruta = "") {
			return ruta.match(/\.(jpeg|jpg|png|gif)$/) != null;
		},
		async getPremios() {
			await axios
				.get(`${this.API}/usuario/${this.usuario}`, this.token)
				.then((response) => {
					this.premios = response.data.premios;
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
		},

		async Reclamar(tipo, posicion, estado, premio = null, descripcion = null) {
			if (estado == "Sin reclamar") {
				this.transferencia.usuario = this.usuario;
				// sin reclamar
				if (tipo == "Objeto") {
					this.mensaje = "Medio de envio";
					this.dialogo = "Envio";
					this.cuentas = "Envio";
				} else if (tipo == "Efectivo" || tipo == "Bonus") {
					this.mensaje = "Medio de Pago";
					this.dialogo = tipo;
				}
				this.transferencia.posPremio = posicion;
				//Para usar en el emit
				this.paqueteReclamando.tipo_premio = tipo;
				this.paqueteReclamando.id_concurso = posicion;
				this.cajaSorpresa.tipo_premio = tipo;
				this.cajaSorpresa.premio = tipo == "Objeto" ? premio : `${premio} ${descripcion}`;
				this.cajaSorpresa.descripcion = tipo == "Objeto" ? descripcion : "";
				this.cajaSorpresa.mostrar = true;
			}
		},
		Enviar() {
			this.transferencia.pais = this.paisSelect.pais;
			if (this.paqueteReclamando.tipo_premio == null || this.paqueteReclamando.tipo_premio != "SaldoApi") {
				this.transferencia.metodo_pago = this.cuentas;
				if (this.cuentas == "banco") {
					if (
						this.transferencia.cuenta == null ||
						!/^(?!\s*$).+/.test(this.transferencia.cuenta) ||
						this.transferencia.titular_cuenta == null ||
						!/^(?!\s*$).+/.test(this.transferencia.titular_cuenta) ||
						this.transferencia.cedula == null ||
						!/^(?!\s*$).+/.test(this.transferencia.cedula) ||
						this.transferencia.tipo_cuenta == null ||
						!/^(?!\s*$).+/.test(this.transferencia.tipo_cuenta) ||
						this.transferencia.banco == null ||
						!/^(?!\s*$).+/.test(this.transferencia.banco)
					) {
						this.$toast.add({ severity: "error", summary: "Metodo de pago", detail: "Debes llenar todos los campos", life: 1600 });
					} else {
						this.EnviarPremio();
					}
				} else if (this.cuentas == "nequi" || this.cuentas == "paypal" || this.cuentas == "binance") {
					if (this.transferencia.cuenta == null || !/^(?!\s*$).+/.test(this.transferencia.cuenta)) {
						this.$toast.add({ severity: "error", summary: "Metodo de pago", detail: "Debes llenar todos los campos", life: 1600 });
					} else {
						this.EnviarPremio();
					}
				} else {
					if (
						this.transferencia.titular_cuenta == null ||
						!/^(?!\s*$).+/.test(this.transferencia.titular_cuenta) ||
						this.transferencia.cedula == null ||
						!/^(?!\s*$).+/.test(this.transferencia.cedula) ||
						this.transferencia.direccion == null ||
						!/^(?!\s*$).+/.test(this.transferencia.direccion) ||
						this.transferencia.departamento == null ||
						!/^(?!\s*$).+/.test(this.transferencia.departamento) ||
						this.transferencia.pais == null ||
						!/^(?!\s*$).+/.test(this.transferencia.pais) ||
						this.transferencia.ciudad == null ||
						!/^(?!\s*$).+/.test(this.transferencia.ciudad) ||
						this.transferencia.telefono == null ||
						!/^(?!\s*$).+/.test(this.transferencia.telefono) ||
						this.transferencia.codigo_postal == null ||
						!/^(?!\s*$).+/.test(this.transferencia.codigo_postal)
					) {
						this.$toast.add({ severity: "error", summary: "Metodo de pago", detail: "Debes llenar todos los campos", life: 1600 });
					} else {
						this.EnviarPremio();
					}
				}
			} else {
				console.log("SOlo api");
			}
		},
		async EnviarPremio() {
			await axios
				.put(`${this.API}/usuario/reclamarPremio`, this.transferencia, {
					headers: {
						Authorization: `Bearer ${this.store.getToken()}`,
					},
				})
				.then(() => {})
				.finally(() => {
					this.cajaSorpresa.mostrar = false;
					this.cuenta = false;
					this.$toast.add({ severity: "success", summary: "Reclamo exitoso", life: 1600 });
					this.transferencia = {};
					this.getPremios();
				});
		},
		ponerEstado(estado) {
			if (estado == "Sin reclamar") {
				return "warning";
			} else if (estado == "En proceso") {
				return "info";
			} else if (estado == "Expirado") {
				return "danger";
			} else {
				return "success";
			}
		},
		async addSaldoByPremio() {
			if (this.paqueteReclamando.tipo_premio == "SaldoApi") {
				await axios
					.put(
						`${this.API}/usuario/saldoByConcurso`,
						{ id_concurso: this.paqueteReclamando.id_concurso, usuario: this.store.getId() },
						{
							headers: {
								Authorization: `Bearer ${this.store.getToken()}`,
							},
						}
					)
					.then((response) => {
						if (response.data) {
							this.getPremios();
							this.cuenta = false;
							this.cajaSorpresa.mostrar = false;
						}
						this.$toast.add({
							severity: response.data ? "success" : "error",
							summary: "Agregar saldo",
							detail: response.data ? "Saldo agregado" : "No se pudo agregar el saldo",
							life: 1500,
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
								this.$toast.add({ severity: "error", summary: `Sucedió un problema`, detail: error.response.data.message, life: 1500 });
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		puedeReclamar(estado = "Sin reclamar", fecha_obtenido = null) {
			if (estado && fecha_obtenido) {
				const fecha_premio = new Date(fecha_obtenido);
				const fecha_actual = new Date();
				if ((estado == "En proceso" && fecha_actual.getTime() < fecha_premio.getTime) || estado == "Sin reclamar") {
					return true;
				} else {
					return false;
				}
			}
		},
		async canjearPorRegalos(regalos = []) {
			this.dataListaRegalo.mostrarLista = false;
			if (regalos.length > 0) {
				await axios
					.put(
						`${this.API}/usuario/reclamarPremio`,
						{ ...this.transferencia, regalos },
						{
							headers: {
								Authorization: `Bearer ${this.store.getToken()}`,
							},
						}
					)
					.then((resp) => {
						if (!resp.data.error) {
							this.getPremios();
							this.transferencia = {};
						}
						this.$toast.add({
							severity: resp.data.error ? "error" : "success",
							summary: "Reclamar regalo",
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
									summary: "Reclamar regalo",
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
									summary: "Reclamar regalo",
									detail: "Sucedió un error, comuníquese con soporte",
									life: 1600,
								});
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
	},

	async created() {
		this.store = useStoreEvento();
		this.usuario = this.store.getId();
		this.transferencia.usuario = this.usuario;
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.token = {
			headers: {
				Authorization: `Bearer ${this.store.getToken()}`,
			},
		};
		await this.getPremios();
	},
};
</script>
<style>
.p-inputnumber-input {
	width: 100% !important;
}

.btn_regalo {
	animation: sacudir 2s ease infinite;
}
@keyframes sacudir {
	from {
		transform: rotate(0deg);
	}
	4% {
		transform: rotate(7deg);
	}
	12.5% {
		transform: rotate(-7deg);
	}
	21% {
		transform: rotate(7deg);
	}
	25% {
	}
	29% {
		transform: rotate(-7deg);
	}
	37.5% {
		transform: rotate(7deg);
	}
	46% {
		transform: rotate(-7deg);
	}
	50% {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(0deg);
	}
}
</style>