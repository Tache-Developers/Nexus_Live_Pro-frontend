<template>
    <Panel class="torneo">
        <Toast />
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Batallas</h1>
                <Button icon="pi pi-plus" :label="store.isAdmin() ? 'Nueva' : 'Pedir'" @click="modalBatalla = true" />
            </div>
        </template>
        <DataTable :value="batallas" dataKey="id" sortField="estado" :sortOrder="1" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%">
            <Column field="retador" header="Retador" sortable />
            <Column field="contrincante" header="Contrincante" sortable />
            <Column field="fecha_batalla" header="Fecha batalla" sortable style="min-width: 11rem;">
                <template #body="props">
                    {{ props.data.fecha_batalla.slice(0, 10) }} {{ props.data.fecha_batalla.slice(11, 16) }}
                </template>
            </Column>
            <Column field="objetivo" header="Objetivo" />
            <Column field="con_rondas" header="Con rondas" sortable />
            <Column field="rondas" header="Rondas" />
            <Column field="con_potenciadores" header="Con potenciadores" sortable />
            <Column field="descripcion_potenciadores" header="Descripción potenciadores" style="min-width: 21rem;" />
            <Column field="ganador" header="Ganador">
                <template #body="props">
                    {{ props.data.ganador == '' ? 'Por definir' : props.data.ganador }}
                </template>
            </Column>
            <Column header="Estado">
                <template #body="props">
                    <div class="flex flex-column gap-2 text-left" style="min-width: max-content;">
                        <Tag :severity="definirEstadoConfirmacion(props.data.confirmado_retador)" :value="`${props.data.retador} | ${props.data.confirmado_retador}`" rounded />
                        <Tag :severity="definirEstadoConfirmacion(props.data.confirmado_contrincante)" :value="`${props.data.contrincante != null ? props.data.contrincante : ''} | ${props.data.confirmado_contrincante}`" rounded />
                    </div>
                </template>
            </Column>
            <Column header="Acciones">
                <template #body="props">
                    <div v-if="!store.isAdmin()">
                        <Button v-tooltip.top="getTextoConf(props.data)" v-if="puedeAceptar(props.data)" icon="pi pi-check-circle" outlined rounded severity="info"
                            @click="modificarEstado(props.data)" />
                    </div>
                    <div v-else-if="store.isAdmin()" class="flex gap-2">
                        <Button v-tooltip.top="'Asignar contrincante'" v-if="props.data.contrincante == null" icon="pi pi-users" outlined rounded severity="success" @click="asignarContrincante(props.data.retador, props.data._id)" />
                        <Button v-tooltip.top="props.data.rondas == 0 ? 'Definir ganador' : 'Agregar puntos'" v-if="props.data.confirmado_contrincante == 'Asistencia confirmada' && props.data.confirmado_retador == 'Asistencia confirmada' && props.data.ganador == ''" icon="pi pi-plus" outlined rounded severity="info"
                            @click="agregarPuntos(props.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" autofocus="false" @click="eliminarBatalla(props.data._id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <Dialog v-model:visible="modalBatalla" header="Nueva batalla" :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="center" :modal="true" :draggable="false">
            <form ref="formBatalla">
                <div class="flex flex-row gap-1 mt-2 align-items-center justify-content-center xs:flex-wrap xs:flex-column sm:flex-wrap sm:flex-column md:flex-nowrap md:flex-row" v-if="store.isAdmin()">
                    <div class="flex flex-column gap-1 mt-2 xs:w-full sm:w-full">
                        <label for="retar" class="font-bold block">Petición de batalla</label>
                        <Dropdown v-model="paquete.retador" name="retar" id="retar" @change="escogerContrincante" editable filter :options="creadores" optionLabel="usuario" optionValue="usuario" placeholder="Selecciona creador" class="w-full" aria-describedby="retar-help" />
                        <small class="w-full retar-help">Si no lo encuentras, solo escribe su nombre de usuario y continua.</small>
                    </div>
                    <span class="font-bold">VS</span>
                    <div class="flex flex-column gap-1 mt-2 xs:w-full sm:w-full">
                        <label for="contricante" class="font-bold block">Contrincante</label>
                        <Dropdown v-model="paquete.contrincante" name="retar" id="retar" editable filter :options="creadoresAsignar" optionLabel="usuario" optionValue="usuario" placeholder="Selecciona creador" class="w-full" aria-describedby="retar-help" />
                        <small class="w-full retar-help">Si no lo encuentras, solo escribe su nombre de usuario y continua.</small>
                    </div>
                </div>

                <div class="flex flex-column gap-1 mt-2">
                    <label for="fecha_batalla" class="font-bold block">Fecha batalla</label>
                    <Calendar id="fecha_batalla" placeholder="Escoge fecha para la batalla" showTime hourFormat="24" v-model="paquete.fecha_batalla" :minDate="new Date()" :manualInput="false" dateFormat="yy-mm-dd" />
                </div>
                <div class="flex flex-column gap-1 mt-2">
                    <label for="objetivo" class="font-bold block">Objetivo Diamantes</label>
                    <InputText id="objetivo" placeholder="Ingrese objetivo de diamantes" v-model="paquete.objetivo" />
                </div>
                <div class="flex flex-column gap-1 mt-3">
                    <label for="objetivo" class="font-bold block">¿Con rondas?</label>
                    <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquete.con_rondas" inputId="sin_rondas" name="con_rondas" value="No" />
                            <label for="sin_rondas" class="ml-2 cursor-pointer">No</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquete.con_rondas" inputId="con_rondas" name="con_rondas" value="Sí" />
                            <label for="con_rondas" class="ml-2 cursor-pointer">Sí</label>
                        </div>
                    </div>
                    <div class="flex flex-column gap-2" v-if="paquete.con_rondas == 'Sí'">
                        <label for="cant_rondas" class="font-bold block">Cantidad de rondas</label>
                        <InputNumber id="cant_rondas" placeholder="Ingrese cantidad de rondas" v-model="paquete.rondas" :min="1" :max="10" :useGrouping="false" />
                    </div>
                </div>
                <div class="flex flex-column gap-1 mt-3">
                    <label for="objetivo" class="font-bold block">¿Con potenciadores?</label>
                    <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquete.con_potenciadores" inputId="sin_potenciadores" name="con_potenciadores" value="No" />
                            <label for="sin_potenciadores" class="ml-2 cursor-pointer">No</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquete.con_potenciadores" inputId="con_potenciadores" name="con_potenciadores" value="Sí" />
                            <label for="con_potenciadores" class="ml-2 cursor-pointer">Sí</label>
                        </div>
                    </div>
                    <div class="flex flex-column gap-2" v-if="paquete.con_potenciadores == 'Sí'">
                        <label for="descripcion_potenciadores">Descripción</label>
                        <Textarea v-model="paquete.descripcion_potenciadores" placeholder="Ingrese descripción de los potenciadores" name="descripcion_potenciadores" id="descripcion_potenciadores" class="w-full" rows="5" cols="30" />
                    </div>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalBatalla = false" autofocus text severity="danger" />
                <Button label="Pedir" :disabled="btnPedir" @click="pedirBatalla" />
            </template>
        </Dialog>
        <Dialog v-model:visible="modalCambioEstado" header="Cambiar estado" :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="center" :modal="true" :draggable="false">
            <form ref="formCambioEstado">
                <div class="flex flex-row gap-1 mt-2 align-items-center justify-content-center">
                    <div class="flex flex-wrap flex-column gap-3" v-if="estadoActual == 'Pendiente por aceptar'">
                        <h2>¿Aceptas la batalla?</h2>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paqueteCambioEstado.descripcion_confirmacion" inputId="batalla_rech" name="batalla" value="Batalla rechazada" />
                            <label for="batalla_rech" class="ml-2 cursor-pointer">No, rechazar</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paqueteCambioEstado.descripcion_confirmacion" inputId="batalla_acep" name="batalla" value="Batalla aceptada" />
                            <label for="batalla_acep" class="ml-2 cursor-pointer">Sí, aceptar</label>
                        </div>
                    </div>
                    <div class="flex flex-column flex-wrap gap-3" v-else-if="estadoActual == 'Batalla aceptada'">
                        <h2>¿Podrás asistir a la batalla?</h2>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paqueteCambioEstado.descripcion_confirmacion" inputId="asist_rech" name="batalla" value="Asistencia rechazada" />
                            <label for="asist_rech" class="ml-2 cursor-pointer">No</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paqueteCambioEstado.descripcion_confirmacion" inputId="asist_acep" name="batalla" value="Asistencia confirmada" />
                            <label for="asist_acep" class="ml-2 cursor-pointer">Sí</label>
                        </div>
                    </div>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalCambioEstado = false" autofocus text severity="danger" />
                <Button label="Cambiar estado" @click="cambiarEstado" />
            </template>
        </Dialog>
        <Dialog v-model:visible="modalPuntos" header="Puntos rondas" :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="center" :modal="true" :draggable="false">
            <form ref="formPuntosRondas">
                <div class="flex flex-column gap-1 justify-content-center align-items-center" v-if="paquetePuntos.detalle_rondas.length == 0">
                    <h2>¿Quién ganó?</h2>
                    <div class="flex flex-wrap align-items-center gap-2">
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquetePuntos.ganador" inputId="gana_retador" name="gana" :value="paquetePuntos.retador" />
                            <label for="gana_retador" class="ml-2 cursor-pointer">{{ paquetePuntos.retador }}</label>
                        </div>
                        <span class="font-bold block">VS</span>
                        <div class="flex align-items-center">
                            <RadioButton v-model="paquetePuntos.ganador" inputId="gana_contrincante" name="gana" :value="paquetePuntos.contrincante" />
                            <label for="gana_contrincante" class="ml-2 cursor-pointer">{{ paquetePuntos.contrincante }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-column gap-1 mt-2 align-items-center justify-content-center" v-else>
                    <div class="flex gap-2 flex-column" v-for="(detalle, index) in paquetePuntos.detalle_rondas" :key="index">
                        <h2 class="w-full my-1">Ronda {{ index + 1 }}</h2>
                        <div class="flex align-items-center gap-1">
                            <div class="flex flex-column xs:w-full sm:w-full md:w-6">
                                <label :for="`puntos-ret-${index}`" class="block">Puntos <span class="font-bold">{{ paquetePuntos.retador }}</span></label>
                                <InputNumber :id="`puntos-ret-${index}`" :disabled="detalle.puntos_retador == null ? false : true" placeholder="Ingrese cantidad de puntos" v-model="paquetePuntos.detalle_rondas[index].puntos_retador" :min="0" :useGrouping="false" />
                                <small v-if="index == 0">Ingresa la cantidad de puntos correcta, después no podrás cambiarla</small>
                            </div>
                            <span class="font-bold block">VS</span>
                            <div class="flex  flex-column xs:w-full sm:w-full md:w-6">
                                <label :for="`puntos-cont-${index}`" class="block">Puntos <span class="font-bold">{{ paquetePuntos.contrincante }}</span> </label>
                                <InputNumber :id="`puntos-cont-${index}`" :disabled="detalle.puntos_contrincante == null ? false : true" placeholder="Ingrese cantidad de puntos" v-model="paquetePuntos.detalle_rondas[index].puntos_contrincante" :min="0" :useGrouping="false" />
                                <small v-if="index == 0">Ingresa la cantidad de puntos correcta, después no podrás cambiarla</small>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalPuntos = false" autofocus text severity="danger" />
                <Button :label="paquetePuntos.detalle_rondas.length == 0 ? 'Definir ganador' : 'Actualizar puntos'" @click="updatePuntos" />
            </template>
        </Dialog>
        <Dialog v-model:visible="modalContrincante" header="Asignar contrincante" :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="center" :modal="true" :draggable="false">
            <form ref="formAddContrincante">
                <div class="flex gap-1 mt-2 align-items-center justify-content-center flex-column ">
                    <div class="flex flex-column gap-1 mt-2 xs:w-full sm:w-full">
                        <label for="contrincante" class="font-bold block">Contrincante</label>
                        <Dropdown v-model="paqueteAddCont.contrincante" name="contrincante" id="contrincante" editable filter :options="creadoresAsignar" optionLabel="usuario" optionValue="usuario" placeholder="Selecciona creador" class="w-full" aria-describedby="contrincante-help" />
                        <small class="w-full contrincante-help" id="contrincante-help">Si no lo encuentras, solo escribe su nombre de usuario y continua.</small>
                    </div>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalContrincante = false" autofocus text severity="danger" />
                <Button label="Asignar" @click="asignarContrincanteBatalla" />
            </template>
        </Dialog>
    </Panel>
</template>
<script>
import axios from 'axios';
import { useStoreEvento } from '../store'
export default {
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        store: null,
        token: {
            headers: {
                Authorization: null
            }
        },
        btnPedir: false,
        creadores: [],
        creadoresAsignar: [],
        batallas: [],
        modalBatalla: false,
        paquete: {
            retador: null,
            contrincante: null,
            fecha_batalla: null,
            con_rondas: 'No',
            rondas: 1,
            objetivo: null,
            con_potenciadores: 'No',
            descripcion_potenciadores: '',
            confirmado_retador: '',
            confirmado_contrincante: ''
        },
        modalCambioEstado: false,
        estadoActual: null,
        paqueteCambioEstado: {
            batalla: null,
            usuario_rol_batalla: null, //Contrincante o Retador,
            descripcion_confirmacion: null, //Batalla aceptada, Batalla rechazada, Asistencia confirmada o Asistencia rechazada
        },
        modalPuntos: false,
        paquetePuntos: {
            retador: null,
            contrincante: null,
            batalla: null,
            detalle_rondas: [],
            ganador: null,
        },
        modalContrincante: false,
        paqueteAddCont: {
            batalla: null,
            contrincante: null
        }
    }),
    methods: {
        async pedirBatalla() {
            if (await this.validateForm()) {
                this.btnPedir = true;
                await axios.post(`${this.API}/batalla/crear`, { ...this.paquete, rondas: this.paquete.con_rondas == 'No' ? 0 : parseInt(this.paquete.rondas) }, this.token).then(resp => {
                    if (resp.data.creado) {
                        if (this.store.isAdmin()) {
                            this.getBatallas();
                        } else {
                            this.getMisBatallas();
                        }
                        this.$refs.formBatalla.reset();
                        this.modalBatalla = false;
                        this.paquete = {
                            ...this.paquete,
                            contrincante: null,
                            fecha_batalla: null,
                            con_rondas: 'No',
                            rondas: 1,
                            objetivo: null,
                            con_potenciadores: 'No',
                            descripcion_potenciadores: ''
                        }
                    }
                    this.$toast.add({ severity: resp.data.creado ? 'success' : 'error', summary: 'Crear batalla', detail: resp.data.message, life: 1630 });
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'danger', summary: 'Crear batalla', detail: error.response.data.message, life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });
                this.btnPedir = false;
            } else {
                this.$toast.add({ severity: 'warning', summary: 'Nueva batalla', detail: 'Debes llenar todos los campos', life: 1600 });
            }

        },
        async validateForm() {
            const keysValidate = Object.keys(this.paquete);
            if (this.store.isAdmin()) {
                for (let i = 0; i < keysValidate.length; i++) {
                    if (this.paquete[keysValidate[i]] == null) {
                        return false;
                    }
                }
            } else {
                for (let i = 0; i < keysValidate.length; i++) {
                    if (this.paquete[keysValidate[i]] == null && keysValidate[i] != 'contrincante') {

                        return false;
                    }
                }
            }

            return true;

        },
        async getCreadores() {
            await axios.get(`${this.API}/usuario`, this.token).then(response => {
                this.creadores = response.data;
                this.creadoresAsignar = response.data;
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        this.$toast.add({ severity: 'danger', summary: `Obteniendo creadores`, detail: error.response.data.message, life: 1500 });
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        async getBatallas() {
            await axios.get(`${this.API}/batalla`, this.token).then(response => {
                this.batallas = response.data;
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        this.$toast.add({ severity: 'danger', summary: `Obteniendo batallas`, detail: error.response.data.message, life: 1500 });
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        async getMisBatallas() {
            await axios.get(`${this.API}/batalla/${this.store.getUsuario().usuario}/batallas`, this.token).then(response => {
                this.batallas = response.data;
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        this.$toast.add({ severity: 'danger', summary: `Obteniendo batallas`, detail: error.response.data.message, life: 1500 });
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        async cambiarEstado() {
            if (this.paqueteCambioEstado.descripcion_confirmacion != null) {
                await axios.put(`${this.API}/batalla/estado-confirmacion`, this.paqueteCambioEstado, this.token).then(resp => {
                    if (resp.data.actualizado) {
                        if (this.store.isAdmin()) {
                            this.getBatallas();
                        } else {
                            this.getMisBatallas();
                        }
                        this.$refs.formCambioEstado.reset();
                        this.modalCambioEstado = false;
                        this.paqueteCambioEstado = {
                            batalla: null,
                            usuario_rol_batalla: null, //Contrincante o Retador,
                            descripcion_confirmacion: null, //Batalla aceptada, Batalla rechazada, Asistencia confirmada o Asistencia rechazada
                        };
                    }
                    this.$toast.add({ severity: resp.data.actualizado ? 'success' : 'error', summary: 'Cambiar estado', detail: resp.data.message, life: 1630 });
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'danger', summary: 'Cambiando estado', detail: error.response.data.message, life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });
            } else {
                this.$toast.add({ severity: 'warning', summary: 'Cambiar estado', detail: 'Debes seleccionar una opción', life: 1600 });
            }
        },
        async updatePuntos() {
            if (this.paquetePuntos.detalle_rondas == 0) {
                if (this.paquetePuntos.ganador == null) {
                    this.$toast.add({ severity: 'warning', summary: 'Actualizar puntos', detail: 'Debes seleccionar un ganador', life: 1600 });
                    return;
                }
            } else {
                const todosNull = this.paquetePuntos.detalle_rondas.every(ronda => ronda.puntos_retador == null && ronda.puntos_contrincante == null);
                if (todosNull) {
                    this.$toast.add({ severity: 'warning', summary: 'Actualizar puntos', detail: 'Debes llenar los puntos de una ronda', life: 1600 });
                    return;
                }
            }
            await axios.put(`${this.API}/batalla/actualizar/rondas`, this.paquetePuntos, this.token).then(resp => {
                if (resp.data.actualizado) {
                    this.modalPuntos = false;
                    this.getBatallas();
                }
                this.$toast.add({ severity: resp.data.actualizado ? 'success' : 'error', summary: 'Actualizar puntos', detail: resp.data.message, life: 1630 });
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        this.$toast.add({ severity: 'danger', summary: 'Actualizar puntos', detail: error.response.data.message, life: 1500 });
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        async asignarContrincanteBatalla() {
            if (this.paqueteAddCont.contrincante != null && this.paqueteAddCont.batalla != null) {
                await axios.put(`${this.API}/batalla/asignar/contrincante`, this.paqueteAddCont, this.token).then(resp => {
                    if (resp.data.actualizado) {
                        this.getBatallas();
                        this.modalContrincante = false;
                    }
                    this.$toast.add({ severity: resp.data.actualizado ? 'success' : 'error', summary: 'Asignar contrincante', detail: resp.data.message, life: 1630 });
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'danger', summary: 'Asignar contrincante', detail: error.response.data.message, life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });
            } else {
                this.$toast.add({ severity: 'warning', summary: 'Asignar contrincante', detail: 'Debes seleccionar una batalla y un contrincante', life: 1600 });

            }
        },
        async eliminarBatalla(batalla = null) {
            if (batalla != null) {
                await axios.delete(`${this.API}/batalla/${batalla}`, this.token).then(resp => {
                    if (resp.data.eliminado) {
                        this.getBatallas();
                    }
                    this.$toast.add({ severity: resp.data.eliminado ? 'success' : 'error', summary: 'Eliminar batalla', detail: resp.data.message, life: 1630 });
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'danger', summary: 'Eliminar batalla', detail: error.response.data.message, life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                })
            }
        },
        definirEstadoConfirmacion(confirmacion = null) {
            if (confirmacion != null) {
                if (confirmacion == 'Batalla aceptada' || confirmacion == 'Asistencia confirmada') {
                    return 'success';
                } else if (confirmacion == 'Pendiente por aceptar' || confirmacion == 'Asistencia pendiente') {
                    return 'warning';
                } else {
                    return 'danger';
                }
            }
        },
        puedeAceptar(datos) {
            if (datos != null) {
                if (this.store.getUsuario().usuario == datos.retador && datos.confirmado_contrincante != 'Batalla rechazada' && datos.confirmado_contrincante != 'Asistencia rechazada' && datos.contrincante != null) {
                    if (datos.confirmado_retador != 'Batalla rechazada' && datos.confirmado_retador != 'Asistencia rechazada' && datos.confirmado_retador != 'Asistencia confirmada') {
                        return true;
                    }
                } else if (this.store.getUsuario().usuario == datos.contrincante && datos.confirmado_retador != 'Batalla rechazada' && datos.confirmado_retador != 'Asistencia rechazada' && datos.retador != null) {
                    if (datos.confirmado_contrincante != 'Batalla rechazada' && datos.confirmado_contrincante != 'Asistencia rechazada' && datos.confirmado_contrincante != 'Asistencia confirmada') {
                        return true;
                    }
                }
                //No se puede mostrar el boton para aceptar la batalla o confirmar la asistencia
                return false;
            }
            return false;
        },
        getTextoConf(datos = null) {
            if (datos != null) {
                let msg = '';
                if (this.store.getUsuario().usuario == datos.retador) {
                    if (datos.confirmado_retador == 'Pendiente por aceptar') {
                        msg = '¿Aceptas la batalla?';
                    } else if (datos.confirmado_retador == 'Batalla aceptada') {
                        msg = '¿Confirmas la asistencia?';
                    }
                } else if (this.store.getUsuario().usuario == datos.contrincante) {
                    if (datos.confirmado_contrincante == 'Pendiente por aceptar') {
                        msg = '¿Aceptas la batalla?';
                    } else if (datos.confirmado_contrincante == 'Batalla aceptada') {
                        msg = '¿Confirmas la asistencia?';
                    }
                }
                return msg;
            }
        },
        modificarEstado(datos) {
            if (datos != null) {
                this.paqueteCambioEstado.batalla = datos._id;
                this.paqueteCambioEstado.usuario_rol_batalla = this.store.getUsuario().usuario == datos.retador ? 'Retador' : 'Contrincante';
                this.estadoActual = this.store.getUsuario().usuario == datos.retador ? datos.confirmado_retador : datos.confirmado_contrincante;
                this.modalCambioEstado = true;
            }
        },
        agregarPuntos(batalla = null) {
            if (batalla != null) {
                this.paquetePuntos.retador = batalla.retador;
                this.paquetePuntos.contrincante = batalla.contrincante;
                this.paquetePuntos.batalla = batalla._id;
                this.paquetePuntos.detalle_rondas = batalla.detalle_rondas;
                this.modalPuntos = true;
            }
        },
        asignarContrincante(retador = null, batalla = null) {
            if (retador != null && batalla != null) {
                this.paqueteAddCont.batalla = batalla;
                this.creadoresAsignar = this.creadores.filter((creador) => creador.usuario != retador);
                this.modalContrincante = true;
            }
        },
        escogerContrincante() {
            if (this.paquete.retador != null && this.paquete.retador != '') {
                this.creadoresAsignar = this.creadores.filter(creador => creador.usuario != this.paquete.retador);
                this.paquete.contrincante = null;
            }
        }
    },
    created() {
        this.store = useStoreEvento();
        if (!this.store.isActive()) {
            this.$router.push('/login');
        }
        this.token.headers.Authorization = `Bearer ${this.store.getToken()}`;
        this.getCreadores();
        if (!this.store.isAdmin()) {
            this.paquete.retador = this.store.getUsuario().usuario;
            this.paquete.confirmado_retador = 'Batalla aceptada';
            this.paquete.confirmado_contrincante = 'Esperando contrincante';
            this.getMisBatallas();
        } else {
            this.paquete.confirmado_retador = 'Asistencia confirmada';
            this.paquete.confirmado_contrincante = 'Asistencia confirmada';
            this.getBatallas();
        }

    }
}
</script>