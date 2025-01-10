<template>
    <div class="dialog">
        <Dialog v-model:visible="visibleDialog" :style="{ width: '750px' }" header="Menu de Regalos" :modal="true"
            class="p-fluid ">

           <div class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
                <div class="flex gap-4">
                    <InputText name="name" type="text" placeholder="Nombre" v-model="giftBody.name" />
                    <InputText name="id" type="number" placeholder="ID" v-model="giftBody.id" />
                </div>
                <div class="flex gap-4">
                    <InputText name="cost" type="number" placeholder="Costo" v-model="giftBody.cost" />
                    <InputText name="points" type="number" placeholder="Puntos" v-model="giftBody.points" />
                </div>
                <InputText name="image" type="text" placeholder="Imagen" v-model="giftBody.image"/>
                <Image v-show="giftBody.image":src="giftBody.image" alt="Image" width="250" preview />
                <Button v-if="buttonSelect == 'create'" label="Añadir" @click="createGift()" />
                <Button v-if="buttonSelect == 'update'" label="Actualizar" @click="updateGift()" />
                <Button v-if="buttonSelect == 'update'" severity="danger" label="Cancelar" @click="() => {
                    buttonSelect = 'create'
                    giftBody = {
                        name: '',
                        id: null,
                        cost: null,
                        points: null,
                        image: null
                    }
                }" />

            </div>
            <DataTable paginator :rows="10"  :rowsPerPageOptions="[10, 20, 50]" :value="giftList" dataKey="_id"
                filterDisplay="row" tableStyle="min-width: 40rem"  stripedRows>
                <Column field="name" header="Nombre" sortable></Column>
                <Column field="id" header="ID" sortable></Column>
                <Column field="cost" header="Costo" sortable></Column>
                <Column field="points" header="Puntos" sortable>
                    <template #body="slotProps">
                        <Badge :value="slotProps.data.points" severity="warning"></Badge>
                    </template>
                </Column>
                <Column field="image" header="Imagen" sortable>
                    <template #body="slotProps">
                        <Image :src="slotProps.data.image" alt="Image" width="100" preview />
                    </template>
                </Column>
                <Column header="Acción" sortable>
                    <template #body="slotProps" >
                        <div class="flex gap-2">
                            <Button icon="pi pi-pencil" severity="info" @click="preUpdateGift(slotProps.data)" />
                            <Button icon="pi pi-trash" severity="danger" @click="deleteGift(slotProps.data._id)" />
                        </div>
                        </template>
                </Column>
            </DataTable>
           </div>
        </Dialog>
    </div>
</template>
<script>
import axios from 'axios'
import { useSessionStore } from '../../store';
import { useToast } from "primevue/usetoast";
export default {
    name: 'GiftDialog',
    data() {
        return {
            API: "https://patosgame.fly.dev",
            buttonSelect : 'create',
            toast: null,
            store: null,
            visibleDialog: false,
            giftIdUpdate: null,
            giftBody: {
                name: '',
                id: null,
                cost: null,
                points: null,
                image: null
            },
            giftList: []
        }
    },
    methods: {
        openDialog() {
            this.visibleDialog = true
        },
        preUpdateGift(data) {
            this.giftIdUpdate = data._id;
            this.giftBody = {
                name: data.name,
                id: data.id,
                cost: data.cost,
                points: data.points,
                image: data.image
            }
            this.buttonSelect = 'update'
        },
        async getGiftList() {
            await axios.get(this.API + '/gift', this.token).then(res => {
                this.giftList = res.data
            }).catch(err => {
                this.toast.add({ severity: "error", summary: "Error obteniendo gifts", life: 3000 });
            })
        },
        async deleteGift(id) {
            await axios.delete(this.API + '/gift/' + id, this.token).then(async () => {
                await this.getGiftList()
                this.toast.add({ severity: "success", summary: "Gift eliminado", life: 3000 });
            }).catch(err => {
                this.toast.add({ severity: "error", summary: "Error eliminando gift", life: 3000 });
            })
        },
        async createGift() {
            this.giftBody.id = parseInt(this.giftBody.id);
            this.giftBody.cost = parseInt(this.giftBody.cost);
            this.giftBody.points = parseInt(this.giftBody.points);
            await axios.post(this.API + '/gift/create', this.giftBody, this.token).then(res => {
                this.toast.add({ severity: "success", summary: "Gift creado", life: 3000 });
                this.giftBody = {
                    name: '',
                    id: null,
                    cost: null,
                    points: null,
                    image: null
                }
                this.getGiftList()
            }).catch(err => {
                this.toast.add({ severity: "error", summary: "Error creando gift", life: 3000 });
            })
        },
        async updateGift(){
            this.giftBody.id = parseInt(this.giftBody.id);
            this.giftBody.cost = parseInt(this.giftBody.cost);
            this.giftBody.points = parseInt(this.giftBody.points);
            await axios.post(this.API + '/gift/update/' + this.giftIdUpdate, this.giftBody, this.token).then(res => {
                this.toast.add({ severity: "success", summary: "Gift Actualizado", life: 3000 });
                this.giftBody = {
                    name: '',
                    id: null,
                    cost: null,
                    points: null,
                    image: null
                }
                this.buttonSelect = 'create';
                this.getGiftList();
            }).catch(err => {
                this.toast.add({ severity: "error", summary: "Error creando gift", life: 3000 });
            })
        }
    },
    async created() {
        this.store = useSessionStore();
        this.toast = useToast();
        if (!this.store.isActive()) {
            this.$router.push('/duckracer/login');
        } else {
            this.token = {
                headers: { Authorization: `Bearer ${this.store.token()}` }
            };
        }
        await this.getGiftList()
    }
}
</script>