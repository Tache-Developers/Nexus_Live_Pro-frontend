<template>
    <Panel class="evento">
        <Toast />
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Eventos</h1>
                <Button label="Evento" icon="pi pi-plus" @click="modalEvento = true" />
            </div>
        </template>
        <DataTable :value="eventos" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 90rem" sortField="finalizado" :sortOrder="1">
            <Column field="titulo" header="Título" sortable></Column>
            <Column field="descripcion" header="Descripción" sortable></Column>
            <Column field="reglas" header="Regla" sortable />
            <Column field="fecha_inicio" header="Fecha inicio" sortable></Column>
            <Column field="fecha_fin" header="Fecha fin" sortable></Column>
            <Column field="premios.top1.descripcion" header="Top 1" sortable />
            <Column field="premios.top2.descripcion" header="Top 2" sortable />
            <Column field="premios.top3.descripcion" header="Top 3" sortable />
            <Column field="finalizado" header="Estado" sortable>
                <template #body="slotProps">
                    <Tag :value="slotProps.data.finalizado ? 'Finalizado' : 'En curso'" :severity="slotProps.data.finalizado ? 'danger' : 'success'" rounded />
                </template>
            </Column>
            <Column style="max-width:5rem" header="Acción">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" outlined rounded severity="danger"
                        @click="confirmDialog(slotProps.data._id)" />
                </template>
            </Column>
        </DataTable>
        <!-- Modal agregar evento -->
        <Dialog v-model:visible="modalEvento" header="Nuevo evento" :style="{ width: '40rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
            <form ref="formEvento" class="formEvento">
                <div class="flex gap-1">
                    <div class="titulo sm:w-full md:w-6">
                        <label for="titulo" class="font-bold block">Título</label>
                        <InputText type="text" id="titulo" v-model="paquete.titulo" />
                    </div>
                    <div class="descripcion sm:w-full md:w-6">
                        <label for="descripcion" class="font-bold block">Descripción</label>
                        <Textarea id="descripcion" v-model="paquete.descripcion" rows="1" cols="25" />
                    </div>
                </div>

                <div class="flex gap-1">
                    <div class="reglas sm:w-6">
                        <label for="reglas" class="font-bold block">Reglas</label>
                        <Textarea id="reglas" v-model="paquete.reglas" rows="1" cols="20" />
                    </div>
                    <div class="disponibilidad sm:w-6">
                        <label for="fecha_inicio" class="font-bold block">Disponibilidad</label>
                        <Calendar id="fecha_inicio" selectionMode="range" :numberOfMonths="2" v-model="paquete.fecha_fin" :minDate="new Date()" :manualInput="false"
                            dateFormat="yy-mm-dd" />
                    </div>
                </div>
                <Divider class="m-1" />
                <h4 class="m-0">Premios</h4>
                <div class="flex flex-column gap-1">
                    <h5 class="m-0">Top 1</h5>
                    <div class="top1 flex gap-1">
                        <div class="flex flex-column sm:w-6">
                            <label for="descripcion_top1">Descripción</label>
                            <InputText type="text" id="descripcion_top1" v-model="paquete.premios.top1.descripcion" />
                        </div>
                        <div class="flex flex-column sm:w-6">
                            <label for="imagen_top1">Imagen</label>
                            <InputText type="file" id="imagen_top1" accept="image/*" @change="asignarImagen($event, 'top1')" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-column gap-1">
                    <h5 class="m-0">Top 2</h5>
                    <div class="top2 flex gap-1">
                        <div class="flex flex-column sm:w-6">
                            <label for="descripcion_top2">Descripción</label>
                            <InputText type="text" id="descripcion_top2" v-model="paquete.premios.top2.descripcion" />
                        </div>
                        <div class="flex flex-column sm:w-6">
                            <label for="imagen_top2">Imagen</label>
                            <InputText type="file" id="imagen_top2" accept="image/*" @change="asignarImagen($event, 'top2')" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-column gap-1">
                    <h5 class="m-0">Top 3</h5>
                    <div class="top3 flex gap-1">
                        <div class="flex flex-column sm:w-6">
                            <label for="descripcion_top3">Descripción</label>
                            <InputText type="text" id="descripcion_top3" v-model="paquete.premios.top3.descripcion" />
                        </div>
                        <div class="flex flex-column sm:w-6">
                            <label for="imagen_top3">Imagen</label>
                            <InputText type="file" id="imagen_top1" accept="image/*" @change="asignarImagen($event, 'top3')" />
                        </div>
                    </div>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalEvento = false" text severity="danger" autofocus />
                <Button label="Crear" @click="crearEvento" :disabled="btnEvento" severity="success" />
            </template>
        </Dialog>

        <!--Confirm para eliminar-->
        <ConfirmDialog group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-column items-center p-5 rounded-md" style="background-color: #171F28;">
                    <div class="rounded-full bg-info-500 dark:bg-primary-400 text-surface-0 dark:text-surface-900 inline-flex justify-content-center items-center h-[6rem] w-[6rem] -mt-[3rem]">
                        <i class="pi pi-question text-4xl"></i>
                    </div>
                    <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex justify-content-end items-center gap-2 mt-4">
                        <Button label="Sí, eliminar" severity="danger" @click="acceptCallback" class="w-[8rem]" />
                        <Button label="No, cancelar" outlined severity="success" @click="rejectCallback" class="w-[8rem]" />
                    </div>
                </div>
            </template>
        </ConfirmDialog>
    </Panel>
</template>
<script>
import axios from 'axios'
import { useStoreEvento } from '../store';
export default {
    name: 'Evento',
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        store: null,
        modalEvento: false,
        btnEvento: false,
        eventos: [],
        paquete: {
            titulo: null,
            descripcion: null,
            reglas: null,
            fecha_inicio: new Date(),
            fecha_fin: null,
            premios: {
                top1: {
                    descripcion: null,
                    imagen: ''
                },
                top2: {
                    descripcion: null,
                    imagen: ''
                },
                top3: {
                    descripcion: null,
                    imagen: ''
                }
            },
            imagen_top1: null,
            imagen_top2: null,
            imagen_top3: null
        },
        idEventoDel: null,
        fechaEvento: []
    }),
    methods: {
        asignarImagen(event, top) {
            switch (top) {
                case 'top1':
                    this.paquete.imagen_top1 = event.target.files[0]
                    break;

                case 'top2':
                    this.paquete.imagen_top2 = event.target.files[0]
                    break;

                case 'top3':
                    this.paquete.imagen_top3 = event.target.files[0]
                    break;
            }
        },
        async getEventos() {
            await axios.get(`${this.API}/evento`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`,
                }
            }).then(response => {
                this.eventos = response.data;
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                }
            });
        },
        async getEventoActivo() {
            await axios.get(`${this.API}/evento/activo`).then(response => {
                console.log(response.data);
            });
        },
        async crearEvento() {
            const validF = await this.formValid();
            if (validF) {
                this.btnEvento = true;
                this.paquete.fecha_inicio = this.paquete.fecha_fin[0];
                this.paquete.fecha_fin = this.paquete.fecha_fin[1];
                await axios.post(`${this.API}/evento/crear`, this.paquete, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${this.store.getToken()}`
                    }
                }).then(response => {
                    if (response.data.creado) {
                        this.getEventos();
                        this.modalEvento = false;
                        this.$refs.formEvento.reset();
                        this.$toast.add({ severity: 'success', summary: 'Nuevo evento', detail: 'Evento creado correctamente', life: 1500 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'No se pudo crear el evento', life: 1500 });
                    }
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'Sucedió un error, no se pudo crear el evento', life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });
                this.btnEvento = false;
            }
        },
        async formValid() {
            const key = Object.keys(this.paquete);
            let valid = false;
            for (const k of key) {
                valid = true;
                if (k == "premio") {
                    if (this.paquete[k].top1.descripcion == null || !/^(?!\s*$).+/.test(this.paquete[k].top1.descripcion) || !/^(?!\s*$).+/.test(this.paquete[k].top2.descripcion) || this.paquete[k].top2.descripcion != null || !/^(?!\s*$).+/.test(this.paquete[k].top3.descripcion) || this.paquete[k].top3.descripcion == null) {
                        valid = false;
                        break;
                    }
                } else if (this.paquete[k] == null) {
                    valid = false;
                    break;
                } else if (!/^(?!\s*$).+/.test(this.paquete[k])) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'Debes llenar todos los campos', life: 1600 });
            }
            return valid;
        },
        confirmDialog(id) {
            if (id != null) {
                this.idEventoDel = id;
                this.$confirm.require({
                    group: 'headless',
                    header: '¿Seguro de qué quiere eliminar este evento?',
                    message: 'Esta acción no se puede revertir',
                    accept: () => {
                        this.eliminarEvento();
                    },
                    reject: () => {
                    }
                });
            }
        },
        async eliminarEvento() {
            if (this.idEventoDel != null) {
                await axios.delete(`${this.API}/evento/${this.idEventoDel}`, {
                    headers: {
                        Authorization: `Bearer ${this.store.getToken()}`
                    }
                }).then(response => {
                    if (response.data) {
                        this.idEventoDel = null;
                        this.getEventos();
                        this.$toast.add({ severity: 'success', summary: 'Eliminar evento', detail: 'Evento eliminado correctamente', life: 1500 });
                    } else {
                        this.$toast.add({ severity: 'danger', summary: 'Eliminar evento', detail: 'No se pudo eliminar el evento', life: 1500 });
                    }
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'danger', summary: 'Eliminar evento', detail: 'Sucedió un error, no se pudo eliminar el evento', life: 1500 });
                            console.log('Error: ', error);
                            break;
                    }
                });
            }
        }
    },
    created() {
        this.store = useStoreEvento();
        if (!this.store.isActive()) {
            this.$router.push('/login');
        }
        this.getEventos();
    }

}
</script>
<style>
/* .formEvento>div.flex>* {
    width: 50% !important;
} */

.formEvento>div.flex>div>input,
.formEvento>div.flex>div>textarea,
.formEvento>div.flex>div>select,
.formEvento>div.flex>div>span.p-calendar {
    width: 100% !important;
}

input[type=file] {
    height: 46px !important;
}
</style>