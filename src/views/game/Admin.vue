<template>
    <div class="admin">
        <Toast />
        <DataTable paginator :rows="10" :filters="filters" :rowsPerPageOptions="[10, 20, 50]" :value="data" dataKey="_id"
            filterDisplay="row" tableStyle="min-width: 40rem" sortField="coinTotal" :sortOrder="-1" stripedRows
            :expandedRows="[1]" :globalFilterFields="['name']">
            <template #header>
                <div class="flex justify-content-between">

                    <ToggleButton v-model="switchGame" onLabel="Usuarios" offLabel="Todos" onIcon="pi pi-lock"
                        offIcon="pi pi-lock-open" class="w-9rem" aria-label="Do you confirm" />
                    <Button label="Añadir" icon="pi pi-plus" severity="success" class="mr-2"
                        @click="newAcountDialog = true" />
                    <Button label="Jugar" icon="pi pi-play  " severity="warning" class="mr-2" @click="jugar()" />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Buscar.." />
                    </span>

                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column field="name" header="Nombre" sortable></Column>
            <Column field="coinTotal" header="Monedas" sortable>
                <template #body="slotProps">
                    <Badge :value="slotProps.data.coinTotal" severity="warning"></Badge>
                </template>
            </Column>
            <Column field=" gameTotal" header="Partidas" sortable>
                <template #body="slotProps">
                    <Badge :value="slotProps.data.gameTotal" severity="info"></Badge>
                </template>
            </Column>
            <Column field="timeTotal" header="Tiempo jugado">
                <template #body="slotProps">
                    {{ convertirMilisegundos(slotProps.data.timeTotal) }}
                </template>
            </Column>
            <Column field="jugadoresMax" header="Max. Jugadores" sortable>
                <template #body="slotProps">
                    <Badge :value="slotProps.data.jugadoresMax" severity="danger"></Badge>
                </template>
            </Column>
            <Column style="max-width:5rem">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" outlined rounded severity="danger"
                        @click="comfirmDialog(slotProps.data._id, slotProps.data.name)" />
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-3">
                    <DataTable :value="slotProps.data.history" paginator :rows="5" :filters="filters"
                        :rowsPerPageOptions="[5, 10, 20, 50]">
                        <Column field="date" header="Fecha">
                            <template #body="slotProps">
                                {{ parsearFecha(slotProps.data.date) }}
                            </template>
                        </Column>
                        <Column field="coinTotal" header="Monedas">
                            <template #body="slotProps">
                                <Badge :value="slotProps.data.coinTotal" severity="warning"></Badge>
                            </template>
                        </Column>
                        <Column field="timeTotal" header="Tiempo Jugado">
                            <template #body="slotProps">
                                {{ convertirMilisegundos(slotProps.data.timeTotal) }}
                            </template>
                        </Column>
                        <Column field="playerTotal" header="N° Jugadores">
                            <template #body="slotProps">
                                <Badge :value="slotProps.data.playerTotal" severity="danger"></Badge>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
        <Dialog v-model:visible="newAcountDialog" :style="{ width: '450px' }" header="Crear usuario" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="name">Name</label>
                <InputText id="name" v-model.trim="acount.name" required="true" autofocus />
            </div>

            <template #footer>
                <Button label="Cancelar" severity="warning" icon="pi pi-times" text @click="newAcountDialog = false" />
                <Button label="Guardar" severity="success" icon="pi pi-check" text @click="crearAcount()" />
            </template>
        </Dialog>
        <Dialog v-model:visible="deleteAcountDialog" :style="{ width: '450px' }" :header="nameAcountDelete" :modal="true"
            class="p-fluid ">

            <div class="d-flex">
                <Button label="Cancelar" severity="info" icon="pi pi-times" text @click="deleteAcountDialog = false" />
                <Button label="Eliminar" severity="danger" icon="pi pi-check" text @click="deleteAcountBd()" />
            </div>
        </Dialog>
    </div>
</template>
<script>
import { useSessionStore } from '../../store';
import { useToast } from "primevue/usetoast";
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import axios from 'axios';
export default {
    name: "Admingame",
    data: () => ({
        API: "https://patosgame.fly.dev",
        data: null,
        token: null,
        store: null,
        toast: null,
        user: null,
        newAcountDialog: false,
        idDeleteAcount: null,
        deleteAcountDialog: false,
        nameAcountDelete: '',
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
        },
        acount: {
            name: null
        },
        switchGame: null,
        letSwitch: false,
    }),
    methods: {
        convertirMilisegundos(milisegundos) {
            // Calcula los segundos, minutos, horas y días
            let segundos = Math.floor(milisegundos / 1000);
            let minutos = Math.floor(segundos / 60);
            let horas = Math.floor(minutos / 60);
            let dias = Math.floor(horas / 24);

            // Ajusta las cantidades para obtener los valores individuales
            segundos %= 60;
            minutos %= 60;
            horas %= 24;

            // Construye la cadena de resultado

            if (dias != 0) {
                return `${dias} días, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
            }
            if (horas != 0) {
                return `${horas} horas, ${minutos} minutos, ${segundos} segundos`;
            }
            if (minutos != 0) {
                return `${minutos} minutos, ${segundos} segundos`;
            }
            if (segundos != 0) {
                return `${segundos} segundos`;
            }
            else {
                return "No Disponible";
            }


        },
        parsearFecha(fechaString) {
            const fecha = new Date(fechaString);
            return fecha.toLocaleString("es-CO", { timeZone: "America/Bogota" });
        },
        async obtenerUsuarios() {
            await axios.get(`${this.API}/user/acount`, this.token).then(resp => {
                this.data = resp.data;
            });
        },
        async crearAcount() {
            this.newAcountDialog = false;
            await axios.post(`${this.API}/user/acount/${this.acount.name}`, null, this.token).then(resp => {
                this.toast.add({ severity: 'success', summary: 'Información', detail: 'Creado correctamente', life: 3000 });
                this.acount.name = null;
                this.obtenerUsuarios();
            }).catch(error => {
                this.toast.add({ severity: 'error', summary: 'Autorización', detail: "ocurrio un error!", life: 3000 });
            })
        },
        comfirmDialog(id, name) {
            this.idDeleteAcount = id;
            this.nameAcountDelete = `Desea eliminar a ${name}?`;
            this.deleteAcountDialog = true;
        },
        async deleteAcountBd() {
            this.deleteAcountDialog = false;
            axios.delete(`${this.API}/user/acount/${this.idDeleteAcount}`, this.token).then(async (resp) => {
                await this.obtenerUsuarios();
                this.toast.add({ severity: 'success', summary: 'Información', detail: 'Eliminado correctamente', life: 3000 });
                this.idDeleteAcount = null;
                this.nameAcountDelete = ``;
            }).catch(error => {
                this.toast.add({ severity: 'error', summary: 'Autorización', detail: "ocurrio un error!", life: 3000 });
            })
        },
        jugar() {
            this.$router.push('/duckracer');
        },
        async getStatusGame() {
            await axios.get(`${this.API}/user/statusGame`, this.token).then(resp => {
                this.switchGame = resp.data;
            })
        },
        async changeStatusGame() {
            if (!this.letSwitch) {
                this.letSwitch = true;
                return;
            }
            await axios.put(`${this.API}/user/statusGame`, null, this.token).then(resp => {
                this.toast.add({ severity: 'success', summary: 'Información', detail: 'La privacidad del juego cambio!', life: 3000 });
            })
        }

    },
    mounted() {
        this.store = useSessionStore();
        this.toast = useToast();
        if (!this.store.isActive()) {
            this.$router.push('/duckracer/login');
        } else {
            this.token = {
                headers: { Authorization: `Bearer ${this.store.token()}` }
            };
            this.obtenerUsuarios();
            this.getStatusGame();

        }
    },
    watch: {
        async switchGame(newName, oldName) {
            await this.changeStatusGame();
        }
    }
}
</script>